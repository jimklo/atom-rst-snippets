'use babel';

require('./polyfill');
import { BaseBlockCommand } from './helpers';
import wrap from 'word-wrap';
import { Point } from 'atom';

export class TableCommand extends BaseBlockCommand {
  constructor(editor) {
    super(editor);

    this.getWidths = this.getWidths.bind(this);
    this.getResult = this.getResult.bind(this);
    this.run = this.run.bind(this);
  }

  getWidths(lines) {
    return undefined;
  }

  getResult(indent, table, widths) {
    let result = drawTable(indent, table, widths).join('\n');
    result += '\n';
    return result;
  }

  run() {
    let { blockRegion, lines, indent } = this.getBlockBounds();
    let table = parseTable(lines);
    let widths = this.getWidths(lines);
    let result = this.getResult(indent, table, widths);

    this.editor.setTextInBufferRange(blockRegion.getRange(undefined, new Point(1,0)), result);
  }

};


export class FlowtableCommand extends TableCommand {
    constructor(editor) {
      super(editor);

      this.getWidths = this.getWidths.bind(this);
    }

    getWidths(lines) {
        return getColumnWidthsFromBorderSpec(lines);
    }
}


const joinRows = (rows, sep='\n') => {
    // """Given a list of rows (a list of lists) this function returns a
    // flattened list where each the individual columns of all rows are joined
    // together using the line separator.
    //
    // """
    output = []
    for (let row of rows) {
      // # grow output array, if necessary
      if (output.length <= row.length) {
        let maxOutput = row.length - output.length;
        for (let i=0; i<=maxOutput; i++) {
          output = [...output, []];
        }
      }

      row.forEach((field, i) => {
        field_text = field.trim()
        if (field_text.length > 0) {
          output[i].push(field_text);
        }
      });
    }
    return output.map((lines) => lines.join(sep));
};

const lineIsSeparator = (line) => {
  return line.match(/^[\t +=-]+$/);
}


const hasLineSeps = (rawLines) => {
  for (let line of rawLines) {
    if (lineIsSeparator(line)) {
      return true;
    }
  }
  return false;
}


const partitionRawLines = (raw_lines) => {
  // """Partitions a list of raw input lines so that between each partition, a
  // table row separator can be placed.
  //
  // """
  if (!hasLineSeps(raw_lines)) {
    return raw_lines.map((x) => [x]);
  }

  let curr_part = []
  let parts = [curr_part]
  for (line of raw_lines) {
    if (lineIsSeparator(line)) {
      curr_part = [];
      parts.push(curr_part);
    }
    else {
      curr_part.push(line);
    }
  }

  // # remove any empty partitions (typically the first and last ones)
  return parts.filter(x => x.length > 0);
}

const unifyTable = (table) => {
    // """Given a list of rows (i.e. a table), this function returns a new table
    // in which all rows have an equal amount of columns.  If all full column is
    // empty (i.e. all rows have that field empty), the column is removed.
    //
    // """
    let max_fields = Math.max(...table.map(row => row.length));
    let empty_cols = new Array(max_fields).fill(true);
    let output = [];
    for (let row of table) {
        let curr_len = row.length;
        if (curr_len < max_fields) {
            row = row.concat(new Array((max_fields - curr_len)).fill(0));
        }
        output.push(row);

        // # register empty columns (to be removed at the end)
        for (let i=0; i<row.length; i++) {
            if (row[i].trim().length > 0) {
                empty_cols[i] = false;
            }
        }
    }
    // # remove empty columns from all rows
    table = output;
    output = [];
    for (let row of table) {
        let cols = [];
        for (let i=0; i<row.length; i++) {
            should_remove = empty_cols[i];
            if (!should_remove) {
                cols.push(row[i]);
            }
        }
        output.push(cols);
    }
    return output;
}

const splitTableRow = (row_string) => {
    if (row_string.search(/\|/) >= 0) {
        //# first, strip off the outer table drawings
        row_string = row_string.replace(/^\s*\||\|\s*$/g, '');
        return row_string.split(/\s*\|\s*/);
    }
    return row_string.trimRight().split(/\s\s+/);
}

const parseTable = (raw_lines) => {
  row_partition = partitionRawLines(raw_lines)
  lines = []
  for (row_string of row_partition) {
      lines.push(joinRows(row_string.map(cell => splitTableRow(cell))));
  }
  return unifyTable(lines);
}


const tableLine = (widths, header) => {
  let lineChar;
  if (header) {
    lineChar = '=';
  }
  else {
    lineChar = '-';
  }
  let sep = '+';
  let parts = [];
  widths.forEach((width) => {
    let cell = new Array(width).fill(lineChar).join('');
    parts.push(cell);
  });
  if (parts.length > 0) {
    parts = ['', ...parts, ''];
  }
  return parts.join(sep);
};

const getFieldWidth = (fieldText) => {
  return Math.max(...fieldText.split('\n').map((element) => element.length));
};


const splitRowIntoLines = (row) => {
  row = row.map((field) => field.split('\n'));
  let height = Math.max(...row.map((fieldLines) => fieldLines.length));
  let turnTable = [];
  for (let i=0; i<height; i++) {
    let fields = [];
    for (let fieldLines of row) {
      if (i < fieldLines.length) {
        fields.push(fieldLines[i])
      } else {
        fields.push('');
      }
    }
    turnTable.push(fields);
  }
  return turnTable;
};

const getColumnWidths = (table) => {
  let widths = [];
  let numFields;
  for (let row of table) {
    numFields = row.length;
    if (numFields > widths.length) {
      widths = widths.concat(new Array(numFields - widths.length).fill(0));
    }
    for (let i = 0; i < numFields; i++) {
      let fieldText = row[i];
      let fieldWidth = getFieldWidth(fieldText);
      widths[i] = Math.max(widths[i], fieldWidth);
    }
  }
  return widths;
};

const getColumnWidthsFromBorderSpec = (slice) => {
    let border = null;
    for (row of slice) {
        if (lineIsSeparator(row)) {
            border = row.trim();
            break;
        }
    }

    if (border === null) {
        throw Error('Cannot reflow this table. Top table border not found.');
    }

    let left, right;
    left = right = 0;
    if (border.substr(0,1) == '+') {
        left = 1;
    }
    if (border.substr(-1,1) == '+') {
        right = border.length-2;
    }

    return border.substring(left, right)
                 .split('+')
                 .map(drawing => Math.max(0, drawing.length - 2));
};

const padFields = (row, widths) => {
  let wgaps = row.map((c) => c.length);
  let modWidths = widths.map((w, i) => w - wgaps[i]);

  // Pad all fields using the calculated widths
  let newRow = [];
  row.forEach((col, i) => {
    let fmtCol = ` ${col.trim().padEnd(widths[i])} `;
    newRow.push(fmtCol)
  });
  return newRow;
}

const reflowRowContents = (row, widths) => {
  let newRow = [];
  row.forEach((field, i) => {
    let wrappedLines = wrap(field.replace('\n',''), {width: widths[i]});
    newRow = [...newRow, wrappedLines];
  });
  return newRow;
};

const drawTable = (indent, table, manualWidths = undefined) => {
  if (table.length === 0) {
    return [];
  }

  let colWidths;
  if (manualWidths === undefined) {
    colWidths = getColumnWidths(table);
  } else {
    colWidths = manualWidths;
  }

  // Reserve room for the spaces
  let sepColWidths = colWidths.map((col) => col+2);
  let headerLine = tableLine(sepColWidths, true);
  let normalLine = tableLine(sepColWidths, false);

  let output = [ indent + normalLine ];

  table.map((row, idx) => {
      if (!!manualWidths) {
        debugger;
        row = reflowRowContents(row, manualWidths);
      }

      let rowLines = splitRowIntoLines(row);
      for (rowLine of rowLines) {
        rowLine = padFields(rowLine, colWidths);
        output.push(indent + ['', ...rowLine, ''].join('|'));
      }

      // then, draw the separator
      if (idx === 0) {
        output.push(indent + headerLine);
      } else {
        output.push(indent + normalLine);
      }
  });

  return output;
};

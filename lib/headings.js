'use babel';

import { workspace, Point, Range } from 'atom';
import { BaseBlockCommand } from './helpers';

export class BasicHeader extends BaseBlockCommand {
  constructor(editor, char, topBar) {
    super(editor);

    this.char = char || '=';
    this.topBar = !!topBar;

    this.getHeaderChar = this.getHeaderChar.bind(this);
    this.hasTopBar = this.hasTopBar.bind(this);
    this.getWidths = this.getWidths.bind(this);
    this.getResult = this.getResult.bind(this);
    this.run = this.run.bind(this);
  }

  getHeaderChar() {
    return this.char;
  }

  hasTopBar() {
    return this.topBar;
  }

  getWidths(line) {
    let width = line.length;
    return width;
  }

  getResult(indent, heading, width) {
    let result = drawHeading(indent, heading, width, this.getHeaderChar(), this.hasTopBar()).join('\n');
    result += '\n';
    return result;
  }

  run() {
    let { blockRegion, line, indent } = this.getLineBounds();
    let heading = parseHeading(line);
    let widths = this.getWidths(heading);
    let result = this.getResult(indent, heading, widths);

    this.editor.setTextInBufferRange(blockRegion.getRange(), result);
  }
}

export class H1 extends BasicHeader {
  constructor(editor) {
    super(editor, '=', true);
  }
}

export class H2 extends BasicHeader {
  constructor(editor) {
    super(editor, '-', true);
  }
}

export class H3 extends BasicHeader {
  constructor(editor) {
    super(editor, '=', false);
  }
}

export class H4 extends BasicHeader {
  constructor(editor) {
    super(editor, '-', false);
  }
}

export class H5 extends BasicHeader {
  constructor(editor) {
    super(editor, '`', false);
  }
}

export class H6 extends BasicHeader {
  constructor(editor) {
    super(editor, '\'', false);
  }
}

export class H7 extends BasicHeader {
  constructor(editor) {
    super(editor, '.', false);
  }
}

export class H8 extends BasicHeader {
  constructor(editor) {
    super(editor, '~', false);
  }
}

export class H9 extends BasicHeader {
  constructor(editor) {
    super(editor, '*', false);
  }
}

export class H10 extends BasicHeader {
  constructor(editor) {
    super(editor, '+', false);
  }
}

export class H11 extends BasicHeader {
  constructor(editor) {
    super(editor, '^', false);
  }
}

export default {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  H7,
  H8,
  H9,
  H10,
  H11
};

const parseHeading = (line) => {
    let heading = line.trim();
    return heading;
};

const drawHeading = (indent, heading, width, headerChar, hasTopBar) => {
    let headLines = [];
    const barLine = new Array(width).fill(headerChar).join('');
    if (hasTopBar) {
      headLines.push(`${indent}${barLine}`);
    }
    headLines.push(`${indent}${heading}`);
    headLines.push(`${indent}${barLine}`);
    return headLines;
};

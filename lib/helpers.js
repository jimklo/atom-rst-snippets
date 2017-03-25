'use babel';

import { workspace, Point, Range } from 'atom';

export class Region {
  constructor(startPoint, endPoint) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;

    this.getRange = this.getRange.bind(this);
  }

  getRange(startOffset=undefined, endOffset=undefined) {
    let startPoint, endPoint;

    if (startOffset !== undefined) {
      startPoint = new Point(
        this.startPoint.row+startOffset.row,
        this.startPoint.column+startOffset.column);
    } else {
      startPoint = this.startPoint;
    }

    if (endOffset !== undefined) {
      endPoint = new Point(
        this.endPoint.row+endOffset.row,
        this.endPoint.column+endOffset.column);
    } else {
      endPoint = this.endPoint;
    }

    let range = new Range(startPoint, endPoint);

    return range;
  }
}

export class BaseBlockCommand {
  constructor(editor){
    this.editor = editor;

    this.getCursorPosition = this.getCursorPosition.bind(this);
    this.getRowText = this.getRowText.bind(this);
    this.getLineBounds = this.getLineBounds.bind(this);
    this.getBlockBounds = this.getBlockBounds.bind(this);
    this.getRegionText = this.getRegionText.bind(this);

  }

  getRowText(screenRow) {
    return this.editor.lineTextForBufferRow(screenRow);
  }

  getRegionText({startPoint, endPoint}) {
    let lines = [];
    for (let curRow = startPoint.row; curRow <= endPoint.row; curRow++ ) {
      lines = [...lines, this.getRowText(curRow)];
    }
    return lines;
  }
  getCursorPosition() {
    return this.editor.getCursorBufferPosition();
  }

  getLineBounds() {
    const { row, column } = this.getCursorPosition();
    let upper = row;
    let lower = row;

    const line = this.getRowText(row);

    const above = this.getRowText(row-1);
    if (above !== undefined &&
      above.trim().length === line.trim().length &&
      above.trim().match(/^(.)\1*$/)) {
      upper = row-1;
    }

    try {
      if (upper > 0 && this.getRowText(upper - 1).trim().length === 0) {
        upper -= 1;
      }
    } catch (e) {
      upper = 0;
    }

    const below = this.getRowText(row+1);
    if (below !== undefined &&
      below.trim().length === line.trim().length &&
      below.trim().match(/^(.)\1*$/)) {
      lower = row+1;
    }

    try {
      if (this.getRowText(lower+1).trim().length === 0) {
        lower += 1;
      }
    } catch (e) {

    }

    const indent = line.match(/^(\s*).*$/)[1];

    const blockRegion = new Region(new Point(upper,0), new Point(lower,0));

    return { blockRegion, line, indent };
  }

  getBlockBounds() {
    let { row, column } = this.getCursorPosition();
    let upper = lower = row;

    try {
      while (upper > 0 && this.getRowText(upper - 1).trim().length > 0) {
        upper -= 1;
      }
    } catch (e) {
      upper = 0;
    }

    try {
      while (this.getRowText(lower+1).trim().length > 0) {
        lower += 1;
      }
    } catch (e) {

    }

    let blockRegion = new Region(new Point(upper, 0), new Point(lower,0));

    lines = this.getRegionText(blockRegion);

    try {
        row_text = this.getRowText(upper - 2);
    } catch (e) {
        row_text = '';
    }
    let indent = row_text.match(/^(\s*).*$/)[1];

    return { blockRegion, lines, indent }
  }

}

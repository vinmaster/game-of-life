import { Grid } from './grid';

export class Cell {
  row: number;
  col: number;
  dead: boolean;
  nextState: 'live' | 'die' | 'nochange';

  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.dead = true;
    this.nextState = 'nochange';
  }

  get alive(): boolean {
    return !this.dead;
  }

  set alive(isAlive: boolean) {
    this.dead = !isAlive;
  }

  clone(cell: Cell = null): Cell {
    if (!cell) {
      cell = this;
    }
    const newCell = new Cell(cell.row, cell.col);
    newCell.dead = cell.dead;
    return newCell;
  }

  equals(cell: Cell): boolean {
    return this.row === cell.row && this.col === cell.col;
  }
}

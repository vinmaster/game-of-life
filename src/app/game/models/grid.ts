import { Cell } from './cell';

export class Grid {
  grid: Cell[][];

  constructor(rows, cols) {
    // this.grid = Array(rows)
    //   .fill(null)
    //   .map((x) => Array(cols).fill(new Cell()));
    this.grid = [];
    for (let row = 0; row < rows; row++) {
      this.grid.push([]);
      for (let col = 0; col < cols; col++) {
        this.grid[row].push(new Cell(row, col));
      }
    }
  }

  at(row, col): Cell {
    return this.grid[row][col];
  }

  neighborsAt(row, col): Cell[] {
    const neighbors = [];

    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if (
          r >= 0 &&
          r < this.rows &&
          c >= 0 &&
          c < this.cols &&
          !(r == row && c == col)
        ) {
          neighbors.push(this.at(r, c));
        }
      }
    }
    return neighbors;
  }

  filter(callback: (cell: Cell) => boolean): Cell[] {
    const result = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (callback(this.grid[row][col])) {
          result.push(this.grid[row][col]);
        }
      }
    }
    return result;
  }

  map(callback: (cell: Cell) => Cell) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.grid[row][col] = callback(this.grid[row][col]);
      }
    }
  }

  clone(): Grid {
    const newGrid = new Grid(this.rows, this.cols);
    newGrid.map((cell) => {
      return cell.clone(this.grid[cell.row][cell.col]);
    });
    return newGrid;
  }

  get cellsAlive(): number {
    return this.filter((cell) => cell.alive).length;
  }

  get data(): Cell[][] {
    return this.grid;
  }

  get rows(): number {
    return this.grid.length;
  }

  get cols(): number {
    return this.grid[0].length;
  }

  get size(): number {
    return this.rows * this.cols;
  }
}

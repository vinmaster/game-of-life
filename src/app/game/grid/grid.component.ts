import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { GameService } from '../services/game.service';
import { Cell } from '../models/cell';

@Component({
  selector: 'game-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent implements OnInit, AfterViewInit {
  @ViewChild('cell', { read: ElementRef, static: false })
  cellElement: ElementRef;
  currentCell: Cell;
  isMouseDown: boolean;
  cellHeight: number;

  constructor(public gameService: GameService) {
    this.currentCell = null;
    this.isMouseDown = false;
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.cellHeight = this.cellElement.nativeElement.offsetWidth;
    }, 0);
  }

  cellClicked(cell: Cell) {
    if (cell.alive) {
      this.gameService.cellDie(cell);
    } else {
      this.gameService.cellLive(cell);
    }
  }

  mousedown(cell: Cell, event) {
    event.preventDefault();
    this.isMouseDown = true;
    this.currentCell = cell;
    cell.alive = !cell.alive;
    // cell.alive
    //   ? this.gameService.cellDie(cell)
    //   : this.gameService.cellLive(cell);
  }

  mouseup(cell: Cell, event) {
    event.preventDefault();
    this.isMouseDown = false;
    this.currentCell = null;
  }

  mouseover(cell: Cell, event) {
    event.preventDefault();
    if (this.isMouseDown && !cell.equals(this.currentCell)) {
      cell.alive = !cell.alive;
      // cell.alive
      //   ? this.gameService.cellDie(cell)
      //   : this.gameService.cellLive(cell);
      this.currentCell = cell;
    }
  }
}

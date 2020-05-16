import { Component, OnInit, Input, Output, HostBinding } from '@angular/core';
import { Cell } from '../models/cell';

@Component({
  selector: 'game-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css'],
})
export class CellComponent implements OnInit {
  @Input() cell: Cell;

  constructor() {}

  @HostBinding('class') get styleClass() {
    return this.cell.alive ? 'alive' : 'dead';
  }

  ngOnInit(): void {}
}

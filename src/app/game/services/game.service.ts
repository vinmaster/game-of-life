import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  timer,
  Subscription,
  Subject,
} from 'rxjs';
import {
  map,
  distinctUntilChanged,
  takeUntil,
  repeatWhen,
} from 'rxjs/operators';
import { Grid } from '../models/grid';
import { Settings } from '../models/settings';
import { Cell } from '../models/cell';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private historySubject: BehaviorSubject<Grid[]>;
  history$: Observable<Grid[]>;
  private historyIndexSubject: BehaviorSubject<number>;
  historyIndex$: Observable<number>;

  private subscriptions: Subscription;
  start: Subject<void>;
  stop: Subject<void>;
  autoRun: boolean;
  grid$: Observable<Grid>;
  settings: Settings;

  constructor() {
    this.autoRun = false;
    this.start = new Subject<void>();
    this.stop = new Subject<void>();
    this.settings = new Settings();
    this.subscriptions = new Subscription();

    // Observables for the grid
    this.historySubject = new BehaviorSubject<Grid[]>(null);
    this.historyIndexSubject = new BehaviorSubject<number>(-1);
    this.history$ = this.historySubject.asObservable();
    this.historyIndex$ = this.historyIndexSubject.asObservable();
    this.grid$ = combineLatest(this.history$, this.historyIndex$).pipe(
      distinctUntilChanged(),
      map(([grids, index]) => {
        return grids[index];
      })
    );

    // Set up grid
    this.newGrid();

    // Set up timer
    this.subscriptions.add(
      timer(0, this.settings.autoRunDelay)
        .pipe(
          takeUntil(this.stop),
          repeatWhen(() => this.start)
        )
        .subscribe(() => {
          this.nextGeneration();
        })
    );
    this.stop.next();
  }

  ngOnDestroy() {
    console.log('Game service destroy');
    this.subscriptions.unsubscribe();
  }

  newGrid(): Grid {
    const grid = new Grid(this.settings.rows, this.settings.cols);
    this.historySubject.next([grid]);
    this.historyIndexSubject.next(0);
    return this.grid;
  }

  random() {
    this.grid.map((cell) => {
      cell.alive = Math.floor(Math.random() * 2) === 0;
      return cell;
    });
  }

  play() {
    this.start.next();
    this.autoRun = true;
  }

  pause() {
    this.stop.next();
    this.autoRun = false;
  }

  previousGeneration() {
    if (this.historyIndex > 0) {
      this.historyIndexSubject.next(this.historyIndex - 1);
    }
  }

  /*
  1. Any live cell with fewer than two live neighbors dies, as if caused by under-population.
  2. Any live cell with two or three live neighbors lives on to the next generation.
  3. Any live cell with more than three live neighbors dies, as if by over-population..
  4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
  */
  nextGeneration() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndexSubject.next(this.historyIndex + 1);
      return;
    }
    const newGrid = this.grid.clone();

    // Calculate next state
    for (let row = 0; row < this.grid.rows; row++) {
      for (let col = 0; col < this.grid.cols; col++) {
        const neighbors = this.grid.neighborsAt(row, col);
        const neighborsAlive = neighbors.filter((cell) => cell.alive);

        const cell = newGrid.at(row, col);
        if (cell.alive) {
          // Dies from under/over population
          if (neighborsAlive.length < 2 || neighborsAlive.length > 3) {
            cell.nextState = 'die';
          }
        } else {
          // Alive from reproduction
          if (neighborsAlive.length === 3) {
            cell.nextState = 'live';
          }
        }
      }
    }

    // Apply next state
    for (let row = 0; row < this.grid.rows; row++) {
      for (let col = 0; col < this.grid.cols; col++) {
        const cell = newGrid.at(row, col);
        if (cell.nextState === 'live') cell.alive = true;
        else if (cell.nextState === 'die') cell.alive = false;
      }
    }

    this.historyIndexSubject.next(this.historyIndex + 1);
    this.grid = newGrid;
  }

  cellDie(cell: Cell) {
    const newGrid = this.grid.clone();
    newGrid.at(cell.row, cell.col).alive = false;
    this.grid = newGrid;
  }

  cellLive(cell: Cell) {
    const newGrid = this.grid.clone();
    newGrid.at(cell.row, cell.col).alive = true;
    this.grid = newGrid;
  }

  get history(): Grid[] {
    return this.historySubject.value;
  }

  get historyIndex(): number {
    return this.historyIndexSubject.value;
  }

  get grid(): Grid {
    return this.history[this.historyIndex];
  }

  set grid(grid: Grid) {
    this.history.push(grid);
    this.historySubject.next(this.history);
  }
}

export class Settings {
  rows: number;
  cols: number;
  autoRunDelay: number;

  constructor() {
    this.rows = 20;
    this.cols = 20;
    this.autoRunDelay = 1000;
  }
}

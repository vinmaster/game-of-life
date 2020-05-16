import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { ControlsComponent } from './controls/controls.component';
import { IconsProviderModule } from '../icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { GridComponent } from './grid/grid.component';
import { CellComponent } from './cell/cell.component';

@NgModule({
  imports: [
    CommonModule,
    GameRoutingModule,
    NzLayoutModule,
    NzButtonModule,
    IconsProviderModule,
    NzToolTipModule,
  ],
  declarations: [
    GameComponent,
    ControlsComponent,
    GridComponent,
    CellComponent,
  ],
  exports: [GameComponent],
})
export class GameModule {}

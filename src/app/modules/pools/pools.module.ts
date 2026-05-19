import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoolsRoutingModule } from './pools-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { PoolsMapComponent } from './components/pools-map/pools-map.component';

@NgModule({
  declarations: [
    PoolsMapComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PoolsRoutingModule
  ]
})
export class PoolsModule {}

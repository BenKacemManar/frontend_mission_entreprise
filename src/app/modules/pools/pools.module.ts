import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PoolsRoutingModule } from './pools-routing.module';
import { PoolsListComponent } from './components/pools-list/pools-list.component';

@NgModule({
  declarations: [PoolsListComponent],
  imports: [SharedModule, PoolsRoutingModule],
})
export class PoolsModule {}

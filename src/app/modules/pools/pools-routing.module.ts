import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoolsMapComponent } from './components/pools-map/pools-map.component';

const routes: Routes = [
  { path: '', component: PoolsMapComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoolsRoutingModule {}

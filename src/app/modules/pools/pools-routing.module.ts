import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoolsListComponent } from './components/pools-list/pools-list.component';

const routes: Routes = [
  { path: '', component: PoolsListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoolsRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { ResultsListComponent } from './components/results-list/results-list.component';
import { MyResultsComponent } from './components/my-results/my-results.component';
import { RankingsComponent } from './components/rankings/rankings.component';

const routes: Routes = [
  { path: '', component: ResultsListComponent },
  { path: 'rankings', component: RankingsComponent },
  { path: 'my', canActivate: [AuthGuard], component: MyResultsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResultsRoutingModule {}

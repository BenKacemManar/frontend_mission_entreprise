import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { ResultsListComponent } from './components/results-list/results-list.component';
import { RankingsComponent }    from './components/rankings/rankings.component';
import { MyResultsComponent }   from './components/my-results/my-results.component';

const routes: Routes = [
  { path: '',         component: ResultsListComponent },
  { path: 'rankings', component: RankingsComponent },
  { path: 'mine',     component: MyResultsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultsRoutingModule {}

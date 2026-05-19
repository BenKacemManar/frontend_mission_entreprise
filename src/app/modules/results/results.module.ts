import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ResultsRoutingModule }   from './results-routing.module';
import { ResultsListComponent }   from './components/results-list/results-list.component';
import { RankingsComponent }      from './components/rankings/rankings.component';
import { MyResultsComponent }     from './components/my-results/my-results.component';

@NgModule({
  declarations: [
    ResultsListComponent,
    RankingsComponent,
    MyResultsComponent
  ],
  imports: [SharedModule, ResultsRoutingModule]
})
export class ResultsModule {}

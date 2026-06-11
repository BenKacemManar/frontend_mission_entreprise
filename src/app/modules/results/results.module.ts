import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ResultsRoutingModule } from './results-routing.module';
import { ResultsListComponent } from './components/results-list/results-list.component';
import { MyResultsComponent } from './components/my-results/my-results.component';
import { RankingsComponent } from './components/rankings/rankings.component';

@NgModule({
  declarations: [ResultsListComponent, MyResultsComponent, RankingsComponent],
  imports: [SharedModule, ResultsRoutingModule],
})
export class ResultsModule {}

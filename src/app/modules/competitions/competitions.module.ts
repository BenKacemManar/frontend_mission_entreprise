import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CompetitionsRoutingModule } from './competitions-routing.module';
import { CompetitionListComponent }   from './components/competition-list/competition-list.component';
import { CompetitionDetailComponent } from './components/competition-detail/competition-detail.component';

@NgModule({
  declarations: [
    CompetitionListComponent,
    CompetitionDetailComponent
  ],
  imports: [SharedModule, CompetitionsRoutingModule]
})
export class CompetitionsModule {}

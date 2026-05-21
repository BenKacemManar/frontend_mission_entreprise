import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CompetitionsRoutingModule } from './competitions-routing.module';
import { CompetitionListComponent }   from './components/competition-list/competition-list.component';
import { CompetitionDetailComponent } from './components/competition-detail/competition-detail.component';
import { CompetitionFormComponent }   from './components/competition-form/competition-form.component';
import { EventFormComponent }         from './components/event-form/event-form.component';

@NgModule({
  declarations: [
    CompetitionListComponent,
    CompetitionDetailComponent,
    CompetitionFormComponent,
    EventFormComponent,
  ],
  imports: [SharedModule, CompetitionsRoutingModule]
})
export class CompetitionsModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompetitionListComponent }   from './components/competition-list/competition-list.component';
import { CompetitionDetailComponent } from './components/competition-detail/competition-detail.component';
import { CompetitionFormComponent }   from './components/competition-form/competition-form.component';
import { EventFormComponent }         from './components/event-form/event-form.component';

const routes: Routes = [
  { path: '',                          component: CompetitionListComponent },
  { path: 'new',                       component: CompetitionFormComponent },
  { path: ':id/edit',                  component: CompetitionFormComponent },
  { path: ':id/events/new',            component: EventFormComponent },
  { path: ':id/events/:eventId/edit',  component: EventFormComponent },
  { path: ':id',                       component: CompetitionDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompetitionsRoutingModule {}

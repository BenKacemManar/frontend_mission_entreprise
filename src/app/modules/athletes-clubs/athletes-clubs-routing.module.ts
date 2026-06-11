import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AthletesListComponent } from './components/athletes-list/athletes-list.component';
import { AthleteDetailComponent } from './components/athlete-detail/athlete-detail.component';
import { ClubsListComponent } from './components/clubs-list/clubs-list.component';
import { ClubDetailComponent } from './components/club-detail/club-detail.component';

const routes: Routes = [
  { path: '', component: AthletesListComponent },
  { path: 'clubs', component: ClubsListComponent },
  { path: 'clubs/:id', component: ClubDetailComponent },
  { path: ':id', component: AthleteDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AthletesClubsRoutingModule {}

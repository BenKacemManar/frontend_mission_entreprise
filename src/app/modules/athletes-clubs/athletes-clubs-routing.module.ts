import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AthletesListComponent } from './components/athletes-list/athletes-list.component';
import { ClubsListComponent } from './components/clubs-list/clubs-list.component';

const routes: Routes = [
  { path: '', component: AthletesListComponent },
  { path: 'clubs', component: ClubsListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AthletesClubsRoutingModule {}

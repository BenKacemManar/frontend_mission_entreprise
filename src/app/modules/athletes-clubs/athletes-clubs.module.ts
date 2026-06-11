import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AthletesClubsRoutingModule } from './athletes-clubs-routing.module';
import { AthletesListComponent } from './components/athletes-list/athletes-list.component';
import { AthleteDetailComponent } from './components/athlete-detail/athlete-detail.component';
import { ClubsListComponent } from './components/clubs-list/clubs-list.component';
import { ClubDetailComponent } from './components/club-detail/club-detail.component';

@NgModule({
  declarations: [
    AthletesListComponent,
    AthleteDetailComponent,
    ClubsListComponent,
    ClubDetailComponent,
  ],
  imports: [SharedModule, AthletesClubsRoutingModule],
})
export class AthletesClubsModule {}

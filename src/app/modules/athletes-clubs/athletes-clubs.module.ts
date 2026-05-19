import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AthletesClubsRoutingModule } from './athletes-clubs-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AthletesListComponent } from './components/athletes-list/athletes-list.component';
import { ClubsListComponent } from './components/clubs-list/clubs-list.component';

@NgModule({
  declarations: [
    AthletesListComponent,
    ClubsListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AthletesClubsRoutingModule
  ]
})
export class AthletesClubsModule {}

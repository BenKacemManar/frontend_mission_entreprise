import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { EvenementsRoutingModule } from './evenements-routing.module';
import { EvenementsListComponent } from './components/evenements-list/evenements-list.component';
import { EvenementDetailComponent } from './components/evenement-detail/evenement-detail.component';

@NgModule({
  declarations: [EvenementsListComponent, EvenementDetailComponent],
  imports: [SharedModule, EvenementsRoutingModule],
})
export class EvenementsModule {}

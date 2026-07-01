import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvenementsListComponent } from './components/evenements-list/evenements-list.component';
import { EvenementDetailComponent } from './components/evenement-detail/evenement-detail.component';

const routes: Routes = [
  { path: '', component: EvenementsListComponent },
  { path: ':id', component: EvenementDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvenementsRoutingModule {}

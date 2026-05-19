import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NavbarComponent }      from './components/navbar/navbar.component';
import { FooterComponent }      from './components/footer/footer.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { PaginationComponent }  from './components/pagination/pagination.component';

const COMPONENTS = [
  NavbarComponent,
  FooterComponent,
  StatusBadgeComponent,
  PaginationComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [...COMPONENTS, CommonModule, RouterModule, FormsModule, ReactiveFormsModule]
})
export class SharedModule {}

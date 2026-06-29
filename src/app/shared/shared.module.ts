import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LucideAngularModule } from 'lucide-angular';
import { SiteNavComponent } from './components/site-nav/site-nav.component';
import { SiteFooterComponent } from './components/site-footer/site-footer.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { PageLayoutComponent } from './components/page-layout/page-layout.component';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    SiteNavComponent,
    SiteFooterComponent,
    PaginationComponent,
    StatusBadgeComponent,
    PageLayoutComponent,
    FilterBarComponent,
    ModalComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  exports: [
    SiteNavComponent,
    SiteFooterComponent,
    PaginationComponent,
    StatusBadgeComponent,
    PageLayoutComponent,
    FilterBarComponent,
    ModalComponent,
    CommonModule,
    RouterModule,
    FormsModule,
    LucideAngularModule,
  ],
})
export class SharedModule {}

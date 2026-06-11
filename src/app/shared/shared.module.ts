import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SiteNavComponent } from './components/site-nav/site-nav.component';
import { SiteFooterComponent } from './components/site-footer/site-footer.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { PageLayoutComponent } from './components/page-layout/page-layout.component';

@NgModule({
  declarations: [
    SiteNavComponent,
    SiteFooterComponent,
    PaginationComponent,
    StatusBadgeComponent,
    PageLayoutComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [
    SiteNavComponent,
    SiteFooterComponent,
    PaginationComponent,
    StatusBadgeComponent,
    PageLayoutComponent,
    CommonModule,
    RouterModule,
    FormsModule,
  ],
})
export class SharedModule {}

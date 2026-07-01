import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';

import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AthletesAdminComponent } from './components/athletes-admin/athletes-admin.component';
import { AthleteFormComponent } from './components/athlete-form/athlete-form.component';
import { ClubsAdminComponent } from './components/clubs-admin/clubs-admin.component';
import { ClubFormComponent } from './components/club-form/club-form.component';
import { PoolsAdminComponent } from './components/pools-admin/pools-admin.component';
import { PoolFormComponent } from './components/pool-form/pool-form.component';
import { NewsAdminComponent } from './components/news-admin/news-admin.component';
import { NewsFormComponent } from './components/news-form/news-form.component';
import { LicencesAdminComponent } from './components/licences-admin/licences-admin.component';
import { LicenceFormComponent } from './components/licence-form/licence-form.component';
import { ForumAdminComponent } from './components/forum-admin/forum-admin.component';
import { StaffAdminComponent } from './components/staff-admin/staff-admin.component';
import { ClubStaffAdminComponent } from './components/club-staff-admin/club-staff-admin.component';
import { ScrapingComponent } from './components/scraping/scraping.component';
import { EvenementsAdminComponent } from './components/evenements-admin/evenements-admin.component';
import { EvenementFormComponent } from './components/evenement-form/evenement-form.component';
import { InscriptionsAdminComponent } from './components/inscriptions-admin/inscriptions-admin.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardComponent,
    AthletesAdminComponent,
    AthleteFormComponent,
    ClubsAdminComponent,
    ClubFormComponent,
    PoolsAdminComponent,
    PoolFormComponent,
    NewsAdminComponent,
    NewsFormComponent,
    LicencesAdminComponent,
    LicenceFormComponent,
    ForumAdminComponent,
    StaffAdminComponent,
    ClubStaffAdminComponent,
    ScrapingComponent,
    EvenementsAdminComponent,
    EvenementFormComponent,
    InscriptionsAdminComponent,
  ],
  imports: [SharedModule, AdminRoutingModule],
})
export class AdminModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'athletes', component: AthletesAdminComponent },
  { path: 'athletes/new', component: AthleteFormComponent },
  { path: 'athletes/:id/edit', component: AthleteFormComponent },
  { path: 'clubs', component: ClubsAdminComponent },
  { path: 'clubs/new', component: ClubFormComponent },
  { path: 'clubs/:id/edit', component: ClubFormComponent },
  { path: 'pools', component: PoolsAdminComponent },
  { path: 'pools/new', component: PoolFormComponent },
  { path: 'pools/:id/edit', component: PoolFormComponent },
  { path: 'news', component: NewsAdminComponent },
  { path: 'news/new', component: NewsFormComponent },
  { path: 'news/:id/edit', component: NewsFormComponent },
  { path: 'licences', component: LicencesAdminComponent },
  { path: 'licences/new', component: LicenceFormComponent },
  { path: 'licences/:id/edit', component: LicenceFormComponent },
  { path: 'forum', component: ForumAdminComponent },
  { path: 'staff', component: StaffAdminComponent },
  { path: 'clubs/staff', component: ClubStaffAdminComponent },
  { path: 'scraping', component: ScrapingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

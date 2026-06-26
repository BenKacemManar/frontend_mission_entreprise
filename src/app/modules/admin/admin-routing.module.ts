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
import { ProgramsAdminComponent } from './components/programs-admin/programs-admin.component';
import { ClassementsAdminComponent } from './components/classements-admin/classements-admin.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'athletes', component: AthletesAdminComponent },
  { path: 'athletes/:id/edit', component: AthleteFormComponent },
  { path: 'clubs', component: ClubsAdminComponent },
  { path: 'pools', component: PoolsAdminComponent },
  { path: 'news', component: NewsAdminComponent },
  { path: 'licences', component: LicencesAdminComponent },
  { path: 'forum', component: ForumAdminComponent },
  { path: 'staff', component: StaffAdminComponent },
  { path: 'clubs/staff', component: ClubStaffAdminComponent },
  { path: 'programs', component: ProgramsAdminComponent },
  { path: 'classements', component: ClassementsAdminComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

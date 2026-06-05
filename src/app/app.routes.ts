import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'competitions',
    loadComponent: () => import('./features/competitions/competition-list/competition-list.component').then(m => m.CompetitionListComponent)
  },
  {
    path: 'competitions/new',
    loadComponent: () => import('./features/competitions/competition-form/competition-form.component').then(m => m.CompetitionFormComponent)
  },
  {
    path: 'competitions/:id',
    loadComponent: () => import('./features/competitions/competition-detail/competition-detail.component').then(m => m.CompetitionDetailComponent)
  },
  {
    path: 'competitions/:id/edit',
    loadComponent: () => import('./features/competitions/competition-form/competition-form.component').then(m => m.CompetitionFormComponent)
  },
  {
    path: 'competitions/:id/events/new',
    loadComponent: () => import('./features/competitions/event-form/event-form.component').then(m => m.EventFormComponent)
  },
  {
    path: 'competitions/:id/events/:eventId/edit',
    loadComponent: () => import('./features/competitions/event-form/event-form.component').then(m => m.EventFormComponent)
  },
  {
    path: 'results',
    loadComponent: () => import('./features/results/results-list/results-list.component').then(m => m.ResultsListComponent)
  },
  {
    path: 'results/rankings',
    loadComponent: () => import('./features/results/rankings/rankings.component').then(m => m.RankingsComponent)
  },
  {
    path: 'results/my',
    canActivate: [authGuard],
    loadComponent: () => import('./features/results/my-results/my-results.component').then(m => m.MyResultsComponent)
  },
  {
    path: 'athletes',
    loadComponent: () => import('./features/athletes/athletes-list/athletes-list.component').then(m => m.AthletesListComponent)
  },
  {
    path: 'athletes/clubs',
    loadComponent: () => import('./features/athletes/clubs-list/clubs-list.component').then(m => m.ClubsListComponent)
  },
  {
    path: 'athletes/clubs/:id',
    loadComponent: () => import('./features/athletes/club-detail/club-detail.component').then(m => m.ClubDetailComponent)
  },
  {
    path: 'athletes/:id',
    loadComponent: () => import('./features/athletes/athlete-detail/athlete-detail.component').then(m => m.AthleteDetailComponent)
  },
  {
    path: 'news',
    loadComponent: () => import('./features/news/news-list/news-list.component').then(m => m.NewsListComponent)
  },
  {
    path: 'news/:id',
    loadComponent: () => import('./features/news/news-detail/news-detail.component').then(m => m.NewsDetailComponent)
  },
  {
    path: 'pools',
    loadComponent: () => import('./features/pools/pools-list/pools-list.component').then(m => m.PoolsListComponent)
  },
  {
    path: 'forum',
    loadComponent: () => import('./features/forum/forum-home/forum-home.component').then(m => m.ForumHomeComponent)
  },
  {
    path: 'forum/:id',
    loadComponent: () => import('./features/forum/forum-thread-list/forum-thread-list.component').then(m => m.ForumThreadListComponent)
  },
  {
    path: 'forum/thread/:id',
    loadComponent: () => import('./features/forum/forum-thread-detail/forum-thread-detail.component').then(m => m.ForumThreadDetailComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'admin/athletes',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./features/admin/athletes-admin/athletes-admin.component').then(m => m.AthletesAdminComponent)
  },
  {
    path: 'admin/athletes/new',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./features/admin/athlete-form/athlete-form.component').then(m => m.AthleteFormComponent)
  },
  {
    path: 'admin/athletes/:id/edit',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./features/admin/athlete-form/athlete-form.component').then(m => m.AthleteFormComponent)
  },
  {
    path: 'admin/clubs',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./features/admin/clubs-admin/clubs-admin.component').then(m => m.ClubsAdminComponent)
  },
  {
    path: 'admin/clubs/new',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./features/admin/club-form/club-form.component').then(m => m.ClubFormComponent)
  },
  {
    path: 'admin/clubs/:id/edit',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./features/admin/club-form/club-form.component').then(m => m.ClubFormComponent)
  },
  {
    path: 'admin/pools',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./features/admin/pools-admin/pools-admin.component').then(m => m.PoolsAdminComponent)
  },
  {
    path: 'admin/pools/new',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./features/admin/pool-form/pool-form.component').then(m => m.PoolFormComponent)
  },
  {
    path: 'admin/pools/:id/edit',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./features/admin/pool-form/pool-form.component').then(m => m.PoolFormComponent)
  },
  {
    path: 'admin/news',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./features/admin/news-admin/news-admin.component').then(m => m.NewsAdminComponent)
  },
  {
    path: 'admin/news/new',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./features/admin/news-form/news-form.component').then(m => m.NewsFormComponent)
  },
  {
    path: 'admin/news/:id/edit',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./features/admin/news-form/news-form.component').then(m => m.NewsFormComponent)
  },
  {
    path: 'admin/licences',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./features/admin/licences-admin/licences-admin.component').then(m => m.LicencesAdminComponent)
  },
  {
    path: 'admin/licences/new',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./features/admin/licence-form/licence-form.component').then(m => m.LicenceFormComponent)
  },
  {
    path: 'admin/licences/:id/edit',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./features/admin/licence-form/licence-form.component').then(m => m.LicenceFormComponent)
  },
  {
    path: 'admin/forum',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./features/admin/forum-admin/forum-admin.component').then(m => m.ForumAdminComponent)
  },
  {
    path: 'admin/scraping',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./features/admin/scraping/scraping.component').then(m => m.ScrapingComponent)
  },
  { path: '**', redirectTo: '' }
];

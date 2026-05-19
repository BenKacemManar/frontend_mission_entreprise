import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'competitions',
    loadChildren: () => import('./modules/competitions/competitions.module').then(m => m.CompetitionsModule)
  },
  {
    path: 'results',
    loadChildren: () => import('./modules/results/results.module').then(m => m.ResultsModule)
  },
  {
    path: 'athletes',
    loadChildren: () => import('./modules/athletes-clubs/athletes-clubs.module').then(m => m.AthletesClubsModule)
  },
  {
    path: 'news',
    loadChildren: () => import('./modules/content/content.module').then(m => m.ContentModule)
  },
  {
    path: 'pools',
    loadChildren: () => import('./modules/pools/pools.module').then(m => m.PoolsModule)
  },
  {
    path: 'forum',
    loadChildren: () => import('./modules/forum/forum.module').then(m => m.ForumModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

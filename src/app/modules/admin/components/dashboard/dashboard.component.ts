import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';

const STAT_DEFS = [
  { key:'nbAthletes', label:'Athlètes', icon:'👤', color:'#3B82F6', link:'/admin/athletes' },
  { key:'nbCompetitions', label:'Compétitions', icon:'🏆', color:'#E10600', link:'/competitions' },
  { key:'nbClubs', label:'Clubs', icon:'🏢', color:'#8B5CF6', link:'/admin/clubs' },
  { key:'nbPiscines', label:'Piscines', icon:'💧', color:'#D4AF37', link:'/admin/pools' },
];

const QUICK_LINKS = [
  { label:'Nouvelle compétition', to:'/competitions/new', icon:'🏆' },
  { label:'Ajouter un athlète', to:'/admin/athletes/new', icon:'👤' },
  { label:'Rédiger actualité', to:'/admin/news/new', icon:'📰' },
  { label:'Nouvelle licence', to:'/admin/licences/new', icon:'🪪' },
  { label:'Nouveau club', to:'/admin/clubs/new', icon:'🏢' },
  { label:'Scraping données', to:'/admin/scraping', icon:'↻' },
];

@Component({
  selector: 'app-dashboard',
  template: `
    <app-admin-layout>
      <div>
        <div class="mb-10">
          <div class="flex items-center gap-4 mb-4">
            <span class="h-px w-10 bg-accent"></span>
            <span class="text-xs tracking-[0.3em] uppercase text-white/50">Administration</span>
          </div>
          <h1 class="font-serif text-3xl lg:text-4xl">Tableau de bord</h1>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          @for (s of statDefs; track s.key) {
            <a [routerLink]="s.link" class="block p-5 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
              <div class="flex items-start justify-between mb-4">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xl" [style.background]="s.color + '20'">{{ s.icon }}</div>
                <span class="font-serif text-3xl text-gold">{{ stats()[s.key] ?? '—' }}</span>
              </div>
              <div class="text-sm text-white/60">{{ s.label }}</div>
            </a>
          }
        </div>
        <h2 class="font-serif text-xl mb-6">Actions rapides</h2>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
          @for (l of quickLinks; track l.label) {
            <a [routerLink]="l.to"
              class="flex items-center gap-3 p-4 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/[0.02] transition-all text-sm">
              <span class="text-xl">{{ l.icon }}</span>
              <span class="text-white/70">{{ l.label }}</span>
            </a>
          }
        </div>
      </div>
    </app-admin-layout>
  `
})
export class DashboardComponent implements OnInit {
  readonly stats = signal<Record<string, number>>({});
  readonly statDefs = STAT_DEFS;
  readonly quickLinks = QUICK_LINKS;

  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.api.get<any>('/dashboard/stats').subscribe({ next: r => this.stats.set(r?.data ?? r ?? {}), error: () => {} });
  }
}

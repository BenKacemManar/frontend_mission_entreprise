import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

const RS: Record<string,string> = { EN_ATTENTE:'pending', VALIDE:'ok', DQ:'DQ', DNS:'DNS', DNF:'DNF' };

@Component({
  selector: 'app-results-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PageLayoutComponent, PaginationComponent, StatusBadgeComponent],
  template: `
    <app-page-layout>
      <section class="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <div class="flex items-center gap-4 mb-6">
              <span class="h-px w-10 bg-accent"></span>
              <span class="text-xs tracking-[0.3em] uppercase text-white/70">Résultats</span>
            </div>
            <h1 class="font-serif text-5xl lg:text-7xl leading-[0.95]">
              Résultats <br/><span class="italic text-gold">& performances.</span>
            </h1>
          </div>
          <a routerLink="/results/rankings"
            class="px-5 py-2.5 rounded-full border border-white/20 hover:border-white text-sm transition-colors">
            Classements nationaux →
          </a>
        </div>
        <div class="flex flex-wrap gap-4 mb-10 pb-8 border-b border-white/10">
          <input type="text" placeholder="Rechercher un athlète…" [(ngModel)]="search"
            (ngModelChange)="onSearch()"
            class="bg-white/5 border border-white/10 rounded-full pl-4 pr-4 py-2 text-sm placeholder:text-white/30 focus:outline-none" />
          @for (g of genders; track g.v) {
            <button (click)="setGender(g.v)"
              class="px-4 py-2 rounded-full border text-sm transition-colors"
              [style.background]="gender===g.v?'#E10600':''"
              [style.borderColor]="gender===g.v?'#E10600':'rgba(255,255,255,0.15)'"
              [style.color]="gender===g.v?'white':'rgba(255,255,255,0.6)'">{{ g.l }}</button>
          }
          <select [(ngModel)]="year" (ngModelChange)="onSearch()"
            class="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/60 focus:outline-none">
            <option value="" class="bg-[#1a0000]">Toutes années</option>
            @for (y of years; track y) { <option [value]="y" class="bg-[#1a0000]">{{ y }}</option> }
          </select>
        </div>
        @if (loading()) {
          <div class="text-white/40 text-center py-20">Chargement…</div>
        } @else if (results().length === 0) {
          <div class="text-white/40 text-center py-20">Aucun résultat.</div>
        } @else {
          <div>
            <div class="grid grid-cols-12 text-xs tracking-[0.2em] uppercase text-white/40 border-b border-white/10 pb-3 mb-2 px-2">
              <div class="col-span-1">Statut</div><div class="col-span-4">Athlète</div>
              <div class="col-span-3">Épreuve</div><div class="col-span-2">Temps</div>
              <div class="col-span-1">FINA</div><div class="col-span-1">Rang</div>
            </div>
            @for (r of results(); track r.id) {
              <div class="grid grid-cols-12 items-center py-4 border-b border-white/10 hover:bg-white/[0.02] px-2 transition-colors">
                <div class="col-span-1"><app-status-badge [status]="r.status" /></div>
                <div class="col-span-4">
                  <div class="font-medium">{{ r.athleteName || '—' }}</div>
                  <div class="text-xs text-white/40">{{ r.clubName }}</div>
                </div>
                <div class="col-span-3 text-sm text-white/60">{{ r.eventLabel || r.competitionName }}</div>
                <div class="col-span-2">
                  <span class="font-serif text-xl" [style.color]="r.isRecord ? '#D4AF37' : 'white'">
                    {{ r.tempsDisplay || fmtMs(r.tempsMs) }}
                  </span>
                </div>
                <div class="col-span-1 text-sm text-white/50">{{ r.pointsFina || '—' }}</div>
                <div class="col-span-1 text-sm font-medium" [style.color]="r.rank <= 3 ? '#D4AF37' : ''">
                  {{ r.rank ? '#' + r.rank : '—' }}
                </div>
              </div>
            }
          </div>
        }
        <app-pagination [page]="page" [total]="total" [pageSize]="pageSize" (pageChange)="onPage($event)" />
      </section>
    </app-page-layout>
  `
})
export class ResultsListComponent implements OnInit {
  readonly results = signal<any[]>([]);
  readonly loading = signal(false);
  total = 0; page = 1; pageSize = 10;
  search = ''; gender = ''; year = '';
  readonly genders = [{ v:'', l:'Tous' }, { v:'M', l:'Messieurs' }, { v:'F', l:'Dames' }];
  readonly years = [2026, 2025, 2024, 2023, 2022];

  constructor(private api: ApiService, readonly auth: AuthService) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    const p: any = { page: this.page - 1, size: this.pageSize };
    if (this.search) p.search = this.search;
    if (this.gender) p.gender = this.gender;
    if (this.year) p.year = this.year;
    this.api.get<any>('/results', p).subscribe({
      next: r => {
        this.results.set((r?.data ?? r?.content ?? []).map((x: any) => ({ ...x, status: RS[x.status] ?? x.status })));
        this.total = r?.totalCount ?? r?.totalElements ?? 0;
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearch(): void { this.page = 1; this.load(); }
  setGender(v: string): void { this.gender = v; this.page = 1; this.load(); }
  onPage(p: number): void { this.page = p; this.load(); }

  fmtMs(ms?: number): string {
    if (!ms) return '—';
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const cents = Math.floor((ms % 1000) / 10);
    return mins > 0 ? `${mins}:${String(secs).padStart(2,'0')}.${String(cents).padStart(2,'0')}` : `${secs}.${String(cents).padStart(2,'0')}`;
  }
}

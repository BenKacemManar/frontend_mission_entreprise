import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PageLayoutComponent } from '../../../../shared/components/page-layout/page-layout.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

const RS: Record<string, string> = {
  EN_ATTENTE: 'pending', VALIDE: 'ok', REJETE: 'cancelled', DQ: 'DQ', DNS: 'DNS', DNF: 'DNF'
};

@Component({
  selector: 'app-results-list',
  template: `
    <app-page-layout>
      <section class="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">

        <!-- Header -->
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
          <div class="flex items-center gap-3">
            <a routerLink="/results/rankings"
              class="px-5 py-2.5 rounded-full border border-white/20 hover:border-white text-sm transition-colors">
              Classements nationaux →
            </a>
            @if (auth.hasRole('ADMIN') || auth.hasRole('COACH')) {
              <a routerLink="/results/new"
                class="px-5 py-2.5 rounded-full bg-accent text-white hover:bg-white hover:text-black text-sm transition-colors">
                + Ajouter résultat
              </a>
            }
          </div>
        </div>

        <!-- Filtres -->
        <div class="flex flex-wrap items-center gap-3 mb-10 pb-8 border-b border-white/10">
          <input type="text" placeholder="Rechercher un athlète…" [(ngModel)]="search"
            (ngModelChange)="onSearch()"
            class="bg-white/5 border border-white/10 rounded-full pl-4 pr-4 py-2 text-sm placeholder:text-white/30 focus:outline-none w-52" />
          @for (g of genders; track g.v) {
            <button (click)="setGender(g.v)"
              class="px-4 py-2 rounded-full border text-sm transition-colors"
              [style.background]="gender===g.v?'#E10600':''"
              [style.borderColor]="gender===g.v?'#E10600':'rgba(255,255,255,0.15)'"
              [style.color]="gender===g.v?'white':'rgba(255,255,255,0.6)'">{{ g.l }}</button>
          }
          <select [(ngModel)]="year" (ngModelChange)="onSearch()"
            class="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70 focus:outline-none">
            <option value="" class="bg-[#1a0000]">Toutes années</option>
            @for (y of years; track y) { <option [value]="y" class="bg-[#1a0000]">{{ y }}</option> }
          </select>
          <select [(ngModel)]="competitionId" (ngModelChange)="onSearch()"
            class="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70 focus:outline-none max-w-xs">
            <option value="" class="bg-[#1a0000]">Toutes compétitions</option>
            @for (c of competitions(); track c.id) { <option [value]="c.id" class="bg-[#1a0000]">{{ c.nom || c.name }}</option> }
          </select>
          <select [(ngModel)]="tour" (ngModelChange)="onSearch()"
            class="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70 focus:outline-none">
            <option value="" class="bg-[#1a0000]">Tous tours</option>
            <option value="series" class="bg-[#1a0000]">Séries</option>
            <option value="demi" class="bg-[#1a0000]">Demi-finale</option>
            <option value="finale" class="bg-[#1a0000]">Finale</option>
          </select>
          @if (hasFilters()) {
            <button (click)="clearFilters()"
              class="text-xs text-white/40 hover:text-white transition-colors underline">
              Réinitialiser
            </button>
          }
        </div>

        <!-- Table -->
        @if (loading()) {
          <div class="text-white/40 text-center py-20">Chargement…</div>
        } @else if (results().length === 0) {
          <div class="text-white/40 text-center py-20">Aucun résultat trouvé.</div>
        } @else {
          <div class="border border-white/10 rounded-lg overflow-hidden">
            <div class="grid grid-cols-12 text-xs tracking-[0.2em] uppercase text-white/40 border-b border-white/10 py-3 px-4 bg-white/[0.02]">
              <div class="col-span-1">Statut</div>
              <div class="col-span-3">Athlète / Club</div>
              <div class="col-span-3">Épreuve</div>
              <div class="col-span-2">Compétition</div>
              <div class="col-span-1">Temps</div>
              <div class="col-span-1">FINA</div>
              <div class="col-span-1">Rang</div>
              @if (auth.hasRole('ADMIN')) { <div class="col-span-1 text-right">Actions</div> }
            </div>
            @for (r of results(); track r.id) {
              <div class="grid items-center py-4 border-b border-white/5 hover:bg-white/[0.02] px-4 transition-colors"
                [ngClass]="auth.hasRole('ADMIN') ? 'grid-cols-12' : 'grid-cols-11'">
                <div class="col-span-1"><app-status-badge [status]="r.status" /></div>
                <div class="col-span-3">
                  <div class="font-medium text-sm">{{ r.athleteName || '—' }}</div>
                  <div class="text-xs text-white/40">{{ r.clubName || '—' }}</div>
                </div>
                <div class="col-span-3 text-sm text-white/70">{{ r.eventLabel || '—' }}</div>
                <div class="col-span-2 text-xs text-white/50">{{ r.competitionName || '—' }}</div>
                <div class="col-span-1">
                  <div class="font-serif text-lg" [style.color]="r.isRecord ? '#D4AF37' : 'white'">
                    {{ r.tempsDisplay || fmtMs(r.tempsMs) || '—' }}
                  </div>
                  @if (r.isRecord) { <div class="text-[10px] text-gold tracking-widest">RECORD</div> }
                </div>
                <div class="col-span-1 text-sm text-white/50">{{ r.pointsFina ? (+r.pointsFina).toFixed(0) : '—' }}</div>
                <div class="col-span-1 text-sm font-medium" [style.color]="r.rank && r.rank <= 3 ? '#D4AF37' : 'rgba(255,255,255,0.6)'">
                  {{ r.rank ? (r.rank <= 3 ? medals[r.rank - 1] + ' #' + r.rank : '#' + r.rank) : '—' }}
                </div>
                @if (auth.hasRole('ADMIN')) {
                  <div class="col-span-1 flex gap-1 justify-end">
                    @if (r.status === 'pending') {
                      <button (click)="valider(r)"
                        class="px-2 py-0.5 rounded-full bg-green-600/20 text-green-400 hover:bg-green-600/40 text-xs transition-colors">
                        ✓
                      </button>
                      <button (click)="rejeter(r)"
                        class="px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 hover:bg-red-600/40 text-xs transition-colors">
                        ✕
                      </button>
                    }
                    <a [routerLink]="['/results', r.id, 'edit']"
                      class="px-2 py-0.5 rounded-full border border-white/10 text-white/50 hover:text-white text-xs transition-colors">
                      ✏
                    </a>
                  </div>
                }
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
  readonly competitions = signal<any[]>([]);
  total = 0; page = 1; pageSize = 10;
  search = ''; gender = ''; year = ''; competitionId = ''; tour = '';
  readonly medals = ['🥇', '🥈', '🥉'];
  readonly genders = [{ v: '', l: 'Tous' }, { v: 'M', l: 'Messieurs' }, { v: 'F', l: 'Dames' }];
  readonly years = [2026, 2025, 2024, 2023, 2022];

  constructor(private api: ApiService, readonly auth: AuthService) {}

  ngOnInit(): void {
    this.loadCompetitions();
    this.load();
  }

  loadCompetitions(): void {
    this.api.get<any>('/competitions', { size: 100, sort: 'startDate' }).pipe(catchError(() => of({}))).subscribe(r => {
      this.competitions.set(r?.data ?? r?.content ?? []);
    });
  }

  load(): void {
    this.loading.set(true);
    const p: any = { page: this.page - 1, size: this.pageSize };
    if (this.search)        p.search = this.search;
    if (this.gender)        p.gender = this.gender;
    if (this.year)          p.year = this.year;
    if (this.tour)          p.tour = this.tour;
    this.api.get<any>('/resultats', p).subscribe({
      next: r => {
        let items = r?.data ?? r?.content ?? [];
        // Filtre côté client par competition si sélectionné
        if (this.competitionId) {
          items = items.filter((x: any) => String(x.competitionId) === String(this.competitionId));
        }
        this.results.set(items.map((x: any) => ({
          ...x,
          status: RS[x.status] ?? x.status,
        })));
        this.total = r?.totalCount ?? r?.totalElements ?? items.length;
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  valider(r: any): void {
    this.api.put(`/resultats/${r.id}/valider`, {}).subscribe({ next: () => this.load() });
  }
  rejeter(r: any): void {
    this.api.put(`/resultats/${r.id}/rejeter`, {}).subscribe({ next: () => this.load() });
  }

  hasFilters(): boolean { return !!(this.search || this.gender || this.year || this.competitionId || this.tour); }
  clearFilters(): void { this.search = ''; this.gender = ''; this.year = ''; this.competitionId = ''; this.tour = ''; this.page = 1; this.load(); }
  onSearch(): void { this.page = 1; this.load(); }
  setGender(v: string): void { this.gender = v; this.page = 1; this.load(); }
  onPage(p: number): void { this.page = p; this.load(); }

  fmtMs(ms?: number): string {
    if (!ms) return '';
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const cents = Math.floor((ms % 1000) / 10);
    return mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}.${String(cents).padStart(2, '0')}` : `${secs}.${String(cents).padStart(2, '0')}`;
  }
}

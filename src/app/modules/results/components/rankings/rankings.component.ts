import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PageLayoutComponent } from '../../../../shared/components/page-layout/page-layout.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-rankings',
  template: `
    <app-page-layout>
      <section class="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">

        <!-- Header -->
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <div class="flex items-center gap-4 mb-6">
              <span class="h-px w-10 bg-accent"></span>
              <span class="text-xs tracking-[0.3em] uppercase text-white/70">Classements</span>
            </div>
            <h1 class="font-serif text-5xl lg:text-7xl leading-[0.95]">
              Classements <br/><span class="italic text-gold">nationaux.</span>
            </h1>
            <p class="text-white/40 text-sm mt-4">Mis à jour automatiquement après chaque validation de résultat.</p>
          </div>
          <a routerLink="/results"
            class="self-start px-5 py-2.5 rounded-full border border-white/20 hover:border-white text-sm transition-colors">
            ← Résultats
          </a>
        </div>

        <!-- Filtres -->
        <div class="flex flex-wrap gap-3 mb-10 pb-8 border-b border-white/10">
          <select [(ngModel)]="season" (ngModelChange)="onFilter()"
            class="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70 focus:outline-none">
            @for (y of [2026,2025,2024,2023]; track y) {
              <option [value]="y" class="bg-[#1a0000]">Saison {{ y }}</option>
            }
          </select>
          @for (g of genders; track g.v) {
            <button (click)="setGender(g.v)"
              class="px-4 py-2 rounded-full border text-sm transition-colors"
              [style.background]="gender===g.v?'#E10600':''"
              [style.borderColor]="gender===g.v?'#E10600':'rgba(255,255,255,0.15)'"
              [style.color]="gender===g.v?'white':'rgba(255,255,255,0.6)'">{{ g.l }}</button>
          }
          <select [(ngModel)]="swimStyle" (ngModelChange)="onFilter()"
            class="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70 focus:outline-none">
            <option value="" class="bg-[#1a0000]">Tous les styles</option>
            <option value="Nage Libre" class="bg-[#1a0000]">Nage Libre</option>
            <option value="Dos" class="bg-[#1a0000]">Dos</option>
            <option value="Brasse" class="bg-[#1a0000]">Brasse</option>
            <option value="Papillon" class="bg-[#1a0000]">Papillon</option>
            <option value="4 nages" class="bg-[#1a0000]">4 Nages</option>
          </select>
          @if (auth.hasRole('ADMIN')) {
            <button (click)="rebuild()" [disabled]="rebuilding()"
              class="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-accent text-sm text-white/60 hover:text-white transition-colors disabled:opacity-40">
              @if (rebuilding()) { <span class="animate-spin">↻</span> En cours… }
              @else { ↻ Reconstruire manuellement }
            </button>
          }
        </div>

        <!-- Podium top 3 -->
        @if (!loading() && podium().length > 0) {
          <div class="grid grid-cols-3 gap-4 mb-10">
            @for (p of podium(); track p.rank; let i = $index) {
              <div class="border rounded-xl p-5 text-center transition-colors"
                [style.borderColor]="podiumColors[i]"
                [style.background]="'rgba('+podiumBgs[i]+',0.05)'">
                <div class="text-3xl mb-2">{{ podiumMedals[i] }}</div>
                <div class="font-serif text-2xl mb-1" [style.color]="podiumColors[i]">{{ p.bestTimeDisplay || fmtMs(p.bestTimeMs) }}</div>
                <div class="font-medium text-sm mb-0.5">{{ p.athleteName }}</div>
                <div class="text-xs text-white/40">{{ p.clubName || '—' }}</div>
                <div class="text-xs text-white/30 mt-1">{{ p.pointsFina ? (+p.pointsFina).toFixed(0) + ' pts FINA' : '' }}</div>
                <div class="text-[10px] tracking-wider text-white/30 mt-2">{{ p.distance }}m {{ p.swimStyle }}</div>
              </div>
            }
          </div>
        }

        <!-- Table complète -->
        @if (loading()) {
          <div class="text-white/40 text-center py-20">Chargement…</div>
        } @else if (rankings().length === 0) {
          <div class="text-white/40 text-center py-20">
            Aucun classement disponible pour cette sélection.<br/>
            <span class="text-xs">Les classements se génèrent automatiquement après la validation de résultats.</span>
          </div>
        } @else {
          <div class="border border-white/10 rounded-lg overflow-hidden">
            <div class="grid grid-cols-12 text-xs tracking-[0.2em] uppercase text-white/40 border-b border-white/10 py-3 px-4 bg-white/[0.02]">
              <div class="col-span-1">Rang</div>
              <div class="col-span-3">Athlète</div>
              <div class="col-span-3">Épreuve</div>
              <div class="col-span-2">Meilleur temps</div>
              <div class="col-span-2">Points FINA</div>
              <div class="col-span-1">Saison</div>
            </div>
            @for (r of pageItems(); track r.id) {
              <div class="grid grid-cols-12 items-center py-4 border-b border-white/5 hover:bg-white/[0.02] px-4 transition-colors">
                <div class="col-span-1">
                  @if (r.rank <= 3) {
                    <span class="text-xl">{{ podiumMedals[r.rank - 1] }}</span>
                  } @else {
                    <span class="font-serif text-lg text-white/50">{{ r.rank }}</span>
                  }
                </div>
                <div class="col-span-3">
                  <div class="font-medium text-sm">{{ r.athleteName }}</div>
                  <div class="text-xs text-white/40">{{ r.clubName || '—' }}</div>
                </div>
                <div class="col-span-3 text-sm text-white/60">
                  {{ r.distance }}m {{ r.swimStyle }} {{ r.gender === 'M' ? 'Messieurs' : 'Dames' }}
                  @if (r.ageCategory) { <span class="text-white/30"> · {{ r.ageCategory }}</span> }
                </div>
                <div class="col-span-2 font-serif text-xl" [style.color]="r.rank <= 3 ? '#D4AF37' : 'white'">
                  {{ r.bestTimeDisplay || fmtMs(r.bestTimeMs) }}
                </div>
                <div class="col-span-2 text-sm text-white/50">
                  {{ r.pointsFina ? (+r.pointsFina).toFixed(0) + ' pts' : '—' }}
                </div>
                <div class="col-span-1 text-xs text-white/30">{{ r.season }}</div>
              </div>
            }
          </div>
        }

        <app-pagination [page]="page" [total]="total" [pageSize]="pageSize" (pageChange)="onPage($event)" />
      </section>
    </app-page-layout>
  `
})
export class RankingsComponent implements OnInit {
  readonly rankings = signal<any[]>([]);
  readonly loading = signal(false);
  readonly rebuilding = signal(false);
  total = 0; page = 1; pageSize = 20;
  season = String(new Date().getFullYear());
  gender = ''; swimStyle = '';

  readonly podiumMedals = ['🥇', '🥈', '🥉'];
  readonly podiumColors = ['#D4AF37', '#9CA3AF', '#CD7F32'];
  readonly podiumBgs = ['212,175,55', '156,163,175', '205,127,50'];
  readonly genders = [{ v: '', l: 'Tous' }, { v: 'M', l: 'Messieurs' }, { v: 'F', l: 'Dames' }];

  constructor(private api: ApiService, readonly auth: AuthService) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    const p: any = { page: 0, size: 200 };
    if (this.gender)    p.gender    = this.gender;
    if (this.season)    p.season    = this.season;
    if (this.swimStyle) p.swimStyle = this.swimStyle;
    this.api.get<any>('/classements', p).pipe(catchError(() => of({}))).subscribe({
      next: r => {
        const all = r?.data ?? r?.content ?? [];
        this.rankings.set(all);
        this.total = all.length;
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  podium(): any[] {
    return this.rankings().filter(r => r.rank <= 3).slice(0, 3);
  }

  pageItems(): any[] {
    const start = (this.page - 1) * this.pageSize;
    return this.rankings().slice(start, start + this.pageSize);
  }

  rebuild(): void {
    this.rebuilding.set(true);
    this.api.post('/classements/rebuild', { season: this.season }).pipe(catchError(() => of(null))).subscribe({
      next: () => { this.rebuilding.set(false); this.load(); },
      error: () => this.rebuilding.set(false)
    });
  }

  onFilter(): void { this.page = 1; this.load(); }
  setGender(v: string): void { this.gender = v; this.page = 1; this.load(); }
  onPage(p: number): void { this.page = p; }

  fmtMs(ms?: number): string {
    if (!ms) return '—';
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const cents = Math.floor((ms % 1000) / 10);
    return mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}.${String(cents).padStart(2, '0')}` : `${secs}.${String(cents).padStart(2, '0')}`;
  }
}

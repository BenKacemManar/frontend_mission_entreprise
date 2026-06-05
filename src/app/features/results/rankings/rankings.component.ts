import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-rankings',
  standalone: true,
  imports: [CommonModule, FormsModule, PageLayoutComponent, PaginationComponent],
  template: `
    <app-page-layout>
      <section class="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <div class="flex items-center gap-4 mb-6">
              <span class="h-px w-10 bg-accent"></span>
              <span class="text-xs tracking-[0.3em] uppercase text-white/70">Classements</span>
            </div>
            <h1 class="font-serif text-5xl lg:text-7xl leading-[0.95]">
              Classements <br/><span class="italic text-gold">nationaux.</span>
            </h1>
          </div>
          @if (auth.hasRole('ADMIN')) {
            <button (click)="rebuild()" [disabled]="rebuilding()"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 hover:border-white text-sm transition-colors disabled:opacity-50">
              ↻ Reconstruire
            </button>
          }
        </div>
        <div class="flex flex-wrap gap-4 mb-12 pb-8 border-b border-white/10">
          <select [(ngModel)]="season" (ngModelChange)="onFilter()"
            class="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70 focus:outline-none">
            @for (y of [2026,2025,2024,2023]; track y) { <option [value]="y" class="bg-[#1a0000]">{{ y }}</option> }
          </select>
          @for (g of genders; track g.v) {
            <button (click)="setGender(g.v)"
              class="px-4 py-2 rounded-full border text-sm transition-colors"
              [style.background]="gender===g.v?'#E10600':''"
              [style.borderColor]="gender===g.v?'#E10600':'rgba(255,255,255,0.15)'"
              [style.color]="gender===g.v?'white':'rgba(255,255,255,0.6)'">{{ g.l }}</button>
          }
        </div>
        @if (loading()) {
          <div class="text-white/40 text-center py-20">Chargement…</div>
        } @else if (rankings().length === 0) {
          <div class="text-white/40 text-center py-20">Aucun classement.</div>
        } @else {
          <div class="border-t border-white/10">
            <div class="grid grid-cols-12 text-xs tracking-[0.2em] uppercase text-white/40 border-b border-white/10 pb-3 mb-2 px-2">
              <div class="col-span-1">Rang</div><div class="col-span-4">Athlète</div>
              <div class="col-span-3">Épreuve</div><div class="col-span-2">Meilleur temps</div>
              <div class="col-span-1">FINA</div><div class="col-span-1">Saison</div>
            </div>
            @for (r of rankings(); track r.id) {
              <div class="grid grid-cols-12 items-center py-4 border-b border-white/10 hover:bg-white/[0.02] px-2 transition-colors">
                <div class="col-span-1">
                  <span class="font-serif text-xl" [style.color]="r.rank<=3?'#D4AF37':'rgba(255,255,255,0.5)'">{{ r.rank }}</span>
                </div>
                <div class="col-span-4">
                  <div class="font-medium">{{ r.athleteName }}</div>
                  <div class="text-xs text-white/40">{{ r.clubName }}</div>
                </div>
                <div class="col-span-3 text-sm text-white/60">{{ r.eventLabel }}</div>
                <div class="col-span-2 font-serif text-xl text-gold">{{ r.bestTimeDisplay || fmtMs(r.bestTimeMs) }}</div>
                <div class="col-span-1 text-sm text-white/50">{{ r.pointsFina || '—' }}</div>
                <div class="col-span-1 text-xs text-white/40">{{ r.season }}</div>
              </div>
            }
          </div>
        }
        <app-pagination [page]="page" [total]="total" [pageSize]="20" (pageChange)="onPage($event)" />
      </section>
    </app-page-layout>
  `
})
export class RankingsComponent implements OnInit {
  readonly rankings = signal<any[]>([]);
  readonly loading = signal(false);
  readonly rebuilding = signal(false);
  total = 0; page = 1;
  season = String(new Date().getFullYear()); gender = '';
  readonly genders = [{ v:'',l:'Tous' },{ v:'M',l:'Messieurs' },{ v:'F',l:'Dames' }];

  constructor(private api: ApiService, readonly auth: AuthService) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    const p: any = { page: this.page - 1, size: 20 };
    if (this.gender) p.gender = this.gender;
    if (this.season) p.season = this.season;
    this.api.get<any>('/rankings', p).subscribe({
      next: r => { this.rankings.set(r?.data ?? r?.content ?? []); this.total = r?.totalCount ?? r?.totalElements ?? 0; this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  rebuild(): void {
    this.rebuilding.set(true);
    this.api.post('/rankings/rebuild', { season: this.season }).subscribe({ next: () => { this.rebuilding.set(false); this.load(); }, error: () => this.rebuilding.set(false) });
  }

  onFilter(): void { this.page = 1; this.load(); }
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

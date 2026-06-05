import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

const RS: Record<string,string> = { EN_ATTENTE:'pending', VALIDE:'ok', DQ:'DQ', DNS:'DNS', DNF:'DNF' };

@Component({
  selector: 'app-my-results',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, PaginationComponent, StatusBadgeComponent],
  template: `
    <app-page-layout>
      <section class="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <div class="flex items-center gap-4 mb-8">
          <span class="h-px w-10 bg-accent"></span>
          <span class="text-xs tracking-[0.3em] uppercase text-white/70">Mes résultats</span>
        </div>
        <h1 class="font-serif text-5xl lg:text-6xl leading-[0.95] mb-12">
          Mes <span class="italic text-gold">performances.</span>
        </h1>
        @if (loading()) {
          <div class="text-white/40 text-center py-20">Chargement…</div>
        } @else if (results().length === 0) {
          <div class="text-white/40 text-center py-20">Aucun résultat.</div>
        } @else {
          <div>
            <div class="grid grid-cols-12 text-xs tracking-[0.2em] uppercase text-white/40 border-b border-white/10 pb-3 mb-2 px-2">
              <div class="col-span-1">St.</div><div class="col-span-4">Épreuve</div>
              <div class="col-span-3">Compétition</div><div class="col-span-2">Temps</div>
              <div class="col-span-1">FINA</div><div class="col-span-1">Rang</div>
            </div>
            @for (r of results(); track r.id) {
              <div class="grid grid-cols-12 items-center py-4 border-b border-white/10 hover:bg-white/[0.02] px-2 transition-colors">
                <div class="col-span-1"><app-status-badge [status]="r.status" /></div>
                <div class="col-span-4 text-sm">{{ r.eventLabel || '—' }}</div>
                <div class="col-span-3 text-sm text-white/50">{{ r.competitionName || '—' }}</div>
                <div class="col-span-2">
                  <span class="font-serif text-xl" [style.color]="r.isRecord?'#D4AF37':'white'">{{ r.tempsDisplay || fmtMs(r.tempsMs) }}</span>
                  @if (r.isRecord) { <span class="ml-2 text-xs text-gold">Record !</span> }
                </div>
                <div class="col-span-1 text-sm text-white/50">{{ r.pointsFina || '—' }}</div>
                <div class="col-span-1 text-sm font-medium" [style.color]="r.rank&&r.rank<=3?'#D4AF37':''">
                  {{ r.rank ? '#' + r.rank : '—' }}
                </div>
              </div>
            }
          </div>
        }
        <app-pagination [page]="page" [total]="total" [pageSize]="10" (pageChange)="onPage($event)" />
      </section>
    </app-page-layout>
  `
})
export class MyResultsComponent implements OnInit {
  readonly results = signal<any[]>([]);
  readonly loading = signal(false);
  total = 0; page = 1;

  constructor(private api: ApiService, private auth: AuthService) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    const uid = this.auth.currentUser?.id;
    if (!uid) return;
    this.loading.set(true);
    this.api.get<any>(`/results/athlete/${uid}`, { page: this.page - 1, size: 10 }).subscribe({
      next: r => {
        this.results.set((r?.data ?? r?.content ?? []).map((x: any) => ({ ...x, status: RS[x.status] ?? x.status })));
        this.total = r?.totalCount ?? r?.totalElements ?? 0;
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onPage(p: number): void { this.page = p; this.load(); }

  fmtMs(ms?: number): string {
    if (!ms) return '—';
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const cents = Math.floor((ms % 1000) / 10);
    return mins > 0 ? `${mins}:${String(secs).padStart(2,'0')}.${String(cents).padStart(2,'0')}` : `${secs}.${String(cents).padStart(2,'0')}`;
  }
}

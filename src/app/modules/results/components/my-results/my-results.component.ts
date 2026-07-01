import { Component, OnInit, signal } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PageLayoutComponent } from '../../../../shared/components/page-layout/page-layout.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

const RS: Record<string, string> = {
  EN_ATTENTE: 'pending', VALIDE: 'ok', REJETE: 'cancelled', DQ: 'DQ', DNS: 'DNS', DNF: 'DNF'
};

@Component({
  selector: 'app-my-results',
  template: `
    <app-page-layout>
      <section class="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <div class="flex items-center gap-4 mb-6">
          <span class="h-px w-10 bg-accent"></span>
          <span class="text-xs tracking-[0.3em] uppercase text-white/70">Espace athlète</span>
        </div>
        <h1 class="font-serif text-5xl lg:text-6xl leading-[0.95] mb-10">
          Mes <span class="italic text-gold">performances.</span>
        </h1>

        <!-- Onglets -->
        <div class="flex gap-1 mb-10 border-b border-white/10">
          @for (tab of tabs; track tab.id) {
            <button (click)="activeTab.set(tab.id)"
              class="px-5 py-3 text-sm transition-colors border-b-2 -mb-px"
              [style.borderColor]="activeTab() === tab.id ? '#E10600' : 'transparent'"
              [style.color]="activeTab() === tab.id ? 'white' : 'rgba(255,255,255,0.4)'">
              {{ tab.label }}
            </button>
          }
        </div>

        @if (loading()) {
          <div class="text-white/40 text-center py-20">Chargement…</div>
        }

        <!-- Onglet Résultats -->
        @if (!loading() && activeTab() === 'results') {
          @if (results().length === 0) {
            <div class="text-white/40 text-center py-20">Aucun résultat enregistré.</div>
          } @else {
            <div class="border border-white/10 rounded-lg overflow-hidden">
              <div class="grid grid-cols-12 text-xs tracking-[0.2em] uppercase text-white/40 border-b border-white/10 py-3 px-4 bg-white/[0.02]">
                <div class="col-span-1">St.</div>
                <div class="col-span-3">Épreuve</div>
                <div class="col-span-3">Compétition</div>
                <div class="col-span-2">Tour</div>
                <div class="col-span-2">Temps</div>
                <div class="col-span-1">FINA</div>
              </div>
              @for (r of results(); track r.id) {
                <div class="grid grid-cols-12 items-center py-4 border-b border-white/5 hover:bg-white/[0.02] px-4 transition-colors">
                  <div class="col-span-1"><app-status-badge [status]="r.status" /></div>
                  <div class="col-span-3 text-sm">
                    {{ r.eventLabel || '—' }}
                    @if (r.isRecord) { <span class="ml-1 text-[10px] text-gold tracking-widest">🏆</span> }
                  </div>
                  <div class="col-span-3 text-sm text-white/50">{{ r.competitionName || '—' }}</div>
                  <div class="col-span-2 text-xs text-white/40 capitalize">{{ r.tour || '—' }}</div>
                  <div class="col-span-2 font-serif text-lg" [style.color]="r.isRecord ? '#D4AF37' : 'white'">
                    {{ r.tempsDisplay || fmtMs(r.tempsMs) || '—' }}
                  </div>
                  <div class="col-span-1 text-sm text-white/50">{{ r.pointsFina ? (+r.pointsFina).toFixed(0) : '—' }}</div>
                </div>
              }
            </div>
            <app-pagination [page]="page" [total]="total" [pageSize]="10" (pageChange)="onPage($event)" />
          }
        }

        <!-- Onglet Stats & Records -->
        @if (!loading() && activeTab() === 'stats' && stats()) {
          <!-- Indicateurs clés -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            @for (kpi of kpis(); track kpi.label) {
              <div class="border border-white/10 rounded-xl p-5 text-center hover:border-white/20 transition-colors">
                <div class="text-3xl font-serif mb-1" [style.color]="kpi.color ?? 'white'">{{ kpi.value }}</div>
                <div class="text-[10px] tracking-[0.2em] uppercase text-white/40">{{ kpi.label }}</div>
              </div>
            }
          </div>

          <!-- Records personnels par épreuve -->
          <h2 class="font-serif text-2xl mb-6">Records personnels</h2>
          @if (stats()!.personalBests.length === 0) {
            <div class="text-white/40 py-8">Aucun résultat validé.</div>
          } @else {
            <div class="space-y-2">
              @for (pb of stats()!.personalBests; track pb.eventId) {
                <div class="grid grid-cols-12 items-center py-4 border border-white/10 rounded-lg px-4 hover:border-white/20 transition-colors">
                  <div class="col-span-4 font-medium text-sm">{{ pb.eventLabel }}</div>
                  <div class="col-span-3 font-serif text-xl" [style.color]="pb.isRecord ? '#D4AF37' : 'white'">
                    {{ pb.tempsDisplay || fmtMs(pb.tempsMs) || '—' }}
                    @if (pb.isRecord) { <span class="ml-2 text-xs text-gold">Record !</span> }
                  </div>
                  <div class="col-span-2 text-sm text-white/50">{{ pb.pointsFina ? (+pb.pointsFina).toFixed(0) + ' pts FINA' : '—' }}</div>
                  <div class="col-span-2 text-sm text-white/50">
                    {{ pb.rank ? (pb.rank <= 3 ? medals[pb.rank - 1] + ' Rang #' + pb.rank : 'Rang #' + pb.rank) : '—' }}
                  </div>
                  <div class="col-span-1 text-xs text-white/30">{{ pb.competitionName || '' }}</div>
                </div>
              }
            </div>
          }
        }
      </section>
    </app-page-layout>
  `
})
export class MyResultsComponent implements OnInit {
  readonly results = signal<any[]>([]);
  readonly stats = signal<any>(null);
  readonly loading = signal(false);
  readonly activeTab = signal<'results' | 'stats'>('results');
  readonly medals = ['🥇', '🥈', '🥉'];
  total = 0; page = 1;

  readonly tabs = [
    { id: 'results' as const, label: 'Mes résultats' },
    { id: 'stats'   as const, label: '📊 Stats & Records' },
  ];

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    const userId = this.auth.currentUser?.id;
    if (!userId) return;
    this.loading.set(true);

    // Trouve l'athlete par userId
    this.api.get<any>(`/athletes/by-user/${userId}`).pipe(
      catchError(() => of(null)),
      switchMap((r: any) => {
        const athlete = r?.data ?? r;
        if (!athlete?.id) return of(null);
        // Charge les résultats et les stats en parallèle
        this.api.get<any>(`/resultats/athlete/${athlete.id}/stats`).pipe(
          catchError(() => of(null))
        ).subscribe(s => {
          const st = s?.data ?? s;
          this.stats.set(st);
        });
        return this.api.get<any>(`/resultats/athlete/${athlete.id}`).pipe(catchError(() => of([])));
      })
    ).subscribe({
      next: (data: any) => {
        if (!data) { this.loading.set(false); return; }
        const list: any[] = Array.isArray(data) ? data : (data?.data ?? []);
        this.results.set(list.map((x: any) => ({ ...x, status: RS[x.status] ?? x.status })));
        this.total = list.length;
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  kpis() {
    const s = this.stats();
    if (!s) return [];
    return [
      { label: 'Résultats', value: s.totalResults, color: null },
      { label: 'Validés', value: s.validated, color: '#10B981' },
      { label: 'Records', value: s.records, color: '#D4AF37' },
      { label: 'Meilleur rang', value: s.bestRank ? '#' + s.bestRank : '—', color: s.bestRank && s.bestRank <= 3 ? '#D4AF37' : null },
    ];
  }

  onPage(p: number): void { this.page = p; }

  fmtMs(ms?: number): string {
    if (!ms) return '';
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const cents = Math.floor((ms % 1000) / 10);
    return mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}.${String(cents).padStart(2, '0')}` : `${secs}.${String(cents).padStart(2, '0')}`;
  }
}

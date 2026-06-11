import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PageLayoutComponent } from '../../../../shared/components/page-layout/page-layout.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

const S2F: Record<string,string> = { PLANIFIEE:'upcoming',EN_COURS:'ongoing',TERMINEE:'finished',ANNULEE:'cancelled' };
const F2B: Record<string,string> = { upcoming:'PLANIFIEE',ongoing:'EN_COURS',finished:'TERMINEE',cancelled:'ANNULEE' };

@Component({
  selector: 'app-competition-list',
  template: `
    <app-page-layout>
      <section class="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <div class="flex items-center gap-4 mb-6">
              <span class="text-xs tracking-[0.3em] uppercase text-white/40">01</span>
              <span class="h-px w-10 bg-accent"></span>
              <span class="text-xs tracking-[0.3em] uppercase text-white/70">Compétitions</span>
            </div>
            <h1 class="font-serif text-5xl lg:text-7xl leading-[0.95]">
              Calendrier <br/><span class="italic text-gold">des épreuves.</span>
            </h1>
          </div>
          @if (auth.hasRole('ADMIN') || auth.hasRole('COACH')) {
            <a routerLink="/competitions/new"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white hover:bg-white hover:text-black transition-colors text-sm">
              + Nouvelle compétition
            </a>
          }
        </div>

        <div class="flex flex-wrap gap-3 mb-10 pb-8 border-b border-white/10">
          @for (s of statusOpts; track s.value) {
            <button (click)="setStatus(s.value)"
              class="px-4 py-2 rounded-full border text-sm transition-colors"
              [style.background]="statusFilter===s.value?'#E10600':''"
              [style.borderColor]="statusFilter===s.value?'#E10600':'rgba(255,255,255,0.15)'"
              [style.color]="statusFilter===s.value?'white':'rgba(255,255,255,0.6)'">
              {{ s.label }}
            </button>
          }
          <div class="w-px bg-white/10 mx-1"></div>
          @for (t of typeOpts; track t.value) {
            <button (click)="setType(t.value)"
              class="px-4 py-2 rounded-full border text-sm transition-colors"
              [style.background]="typeFilter===t.value?'rgba(26,26,46,1)':''"
              [style.borderColor]="typeFilter===t.value?'#D4AF37':'rgba(255,255,255,0.15)'"
              [style.color]="typeFilter===t.value?'#D4AF37':'rgba(255,255,255,0.6)'">
              {{ t.label }}
            </button>
          }
        </div>

        @if (loading()) {
          <div class="text-white/40 text-center py-20">Chargement…</div>
        } @else if (competitions().length === 0) {
          <div class="text-white/40 text-center py-20">Aucune compétition trouvée.</div>
        } @else {
          <div class="border-t border-white/10">
            @for (c of competitions(); track c.id) {
              <div class="group grid grid-cols-12 items-center py-6 border-b border-white/10 hover:bg-white/[0.02] transition-colors px-2">
                <div class="col-span-2 lg:col-span-1">
                  <app-status-badge [status]="c.status" />
                </div>
                <div class="col-span-7 lg:col-span-5">
                  <a [routerLink]="['/competitions', c.id]"
                    class="font-serif text-xl lg:text-2xl hover:underline decoration-accent">
                    {{ c.name }}
                  </a>
                  <div class="text-xs text-white/40 mt-1 tracking-wide">{{ c.type?.toUpperCase() }} · {{ c.discipline }}</div>
                </div>
                <div class="hidden lg:block col-span-3 text-white/50 text-sm">
                  {{ fmtDate(c.startDate) }} — {{ fmtDate(c.endDate) }}
                </div>
                <div class="hidden lg:block col-span-2 text-white/50 text-sm">{{ c.city || c.poolName }}</div>
                <div class="col-span-3 lg:col-span-1 flex justify-end">
                  <a [routerLink]="['/competitions', c.id]"
                    class="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-accent hover:border-accent transition-colors text-lg">
                    →
                  </a>
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
export class CompetitionListComponent implements OnInit {
  readonly competitions = signal<any[]>([]);
  readonly loading = signal(false);
  total = 0; page = 1; pageSize = 10;
  statusFilter = ''; typeFilter = '';

  readonly statusOpts = [
    { value:'', label:'Tous' }, { value:'upcoming', label:'À venir' },
    { value:'ongoing', label:'En cours' }, { value:'finished', label:'Terminée' }, { value:'cancelled', label:'Annulée' }
  ];
  readonly typeOpts = [
    { value:'', label:'Tous types' }, { value:'hiver', label:'Hiver' },
    { value:'ete', label:'Été' }, { value:'open', label:'Open' }, { value:'international', label:'International' }
  ];

  constructor(private api: ApiService, readonly auth: AuthService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    const p: any = { page: this.page - 1, size: this.pageSize, sort: 'startDate' };
    if (this.statusFilter) p.status = F2B[this.statusFilter] ?? this.statusFilter;
    if (this.typeFilter) p.type = this.typeFilter;
    this.api.get<any>('/competitions', p).subscribe({
      next: r => {
        const items = (r?.data ?? r?.content ?? []).map((c: any) => ({ ...c, status: S2F[c.status] ?? c.status }));
        this.competitions.set(items);
        this.total = r?.totalCount ?? r?.totalElements ?? items.length;
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  setStatus(v: string): void { this.statusFilter = v; this.page = 1; this.load(); }
  setType(v: string): void { this.typeFilter = v; this.page = 1; this.load(); }
  onPage(p: number): void { this.page = p; this.load(); }

  fmtDate(d?: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });
  }
}

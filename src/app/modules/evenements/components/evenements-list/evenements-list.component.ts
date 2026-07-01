import { Component, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { EVENEMENT_TYPE_LABELS } from '../../../../core/models/evenement.model';

@Component({
  selector: 'app-evenements-list',
  template: `
    <app-page-layout>
      <section class="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <div class="flex items-center gap-4 mb-6">
              <span class="text-xs tracking-[0.3em] uppercase text-white/40">—</span>
              <span class="h-px w-10 bg-accent"></span>
              <span class="text-xs tracking-[0.3em] uppercase text-white/70">Évènements</span>
            </div>
            <h1 class="font-serif text-5xl lg:text-7xl leading-[0.95]">
              L'agenda <br/><span class="italic text-gold">de la section.</span>
            </h1>
          </div>
          @if (auth.hasRole('ADMIN')) {
            <a routerLink="/admin/evenements/new"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white hover:bg-white hover:text-black transition-colors text-sm">
              + Nouvel évènement
            </a>
          }
        </div>

        <div class="flex flex-wrap gap-3 mb-10 pb-8 border-b border-white/10">
          @for (t of typeOpts; track t.value) {
            <button (click)="setType(t.value)"
              class="px-4 py-2 rounded-full border text-sm transition-colors"
              [style.background]="typeFilter===t.value?'#E10600':''"
              [style.borderColor]="typeFilter===t.value?'#E10600':'rgba(255,255,255,0.15)'"
              [style.color]="typeFilter===t.value?'white':'rgba(255,255,255,0.6)'">
              {{ t.label }}
            </button>
          }
        </div>

        @if (loading()) {
          <div class="text-white/40 text-center py-20">Chargement…</div>
        } @else if (evenements().length === 0) {
          <div class="text-white/40 text-center py-20">Aucun évènement trouvé.</div>
        } @else {
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (e of evenements(); track e.id) {
              <a [routerLink]="['/evenements', e.id]"
                class="group block border border-white/10 rounded-xl p-6 hover:border-white/30 hover:bg-white/[0.02] transition-colors">
                <div class="flex items-center justify-between mb-4">
                  <span class="text-[10px] tracking-[0.25em] uppercase text-gold">{{ typeLabel(e.type) }}</span>
                  <app-status-badge [status]="e.status" />
                </div>
                <h2 class="font-serif text-2xl leading-tight mb-3 group-hover:underline decoration-accent">{{ e.titre }}</h2>
                @if (e.description) {
                  <p class="text-sm text-white/50 line-clamp-2 mb-4">{{ e.description }}</p>
                }
                <div class="flex items-center gap-2 text-sm text-white/60">
                  <span>📅 {{ fmtDate(e.dateDebut) }}</span>
                </div>
                @if (e.lieu) {
                  <div class="flex items-center gap-2 text-sm text-white/60 mt-1"><span>📍 {{ e.lieu }}</span></div>
                }
              </a>
            }
          </div>
        }

        <app-pagination [page]="page" [total]="total" [pageSize]="pageSize" (pageChange)="onPage($event)" />
      </section>
    </app-page-layout>
  `
})
export class EvenementsListComponent implements OnInit {
  readonly evenements = signal<any[]>([]);
  readonly loading = signal(false);
  total = 0; page = 1; pageSize = 9;
  typeFilter = '';

  readonly typeOpts = [
    { value: '', label: 'Tous' },
    { value: 'COMPETITION', label: 'Compétitions' },
    { value: 'CEREMONIE', label: 'Cérémonies' },
    { value: 'STAGE', label: 'Stages' },
    { value: 'AUTRE', label: 'Autres' },
  ];

  constructor(private api: ApiService, readonly auth: AuthService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    const p: any = { page: this.page - 1, size: this.pageSize, sort: 'dateDebut' };
    if (this.typeFilter) p.type = this.typeFilter;
    this.api.get<any>('/evenements', p).subscribe({
      next: r => {
        const items = r?.data ?? r?.content ?? [];
        this.evenements.set(items);
        this.total = r?.totalCount ?? r?.totalElements ?? items.length;
        this.loading.set(false);
      },
      error: () => { this.evenements.set([]); this.loading.set(false); }
    });
  }

  setType(v: string): void { this.typeFilter = v; this.page = 1; this.load(); }
  onPage(p: number): void { this.page = p; this.load(); }

  typeLabel(t: string): string { return EVENEMENT_TYPE_LABELS[t] ?? t; }

  fmtDate(d?: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}

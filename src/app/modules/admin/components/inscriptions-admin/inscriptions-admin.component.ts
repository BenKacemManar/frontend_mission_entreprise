import { Component, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-inscriptions-admin',
  template: `
    <div class="p-6 lg:p-10">
      <div class="mb-8">
        <h1 class="font-serif text-3xl mb-1">File d'attente — Inscriptions</h1>
        <p class="text-white/40 text-sm">Gérez les demandes d'inscription aux épreuves de compétition.</p>
      </div>

      <!-- Filtres -->
      <div class="flex flex-wrap gap-3 mb-8">
        @for (s of statuts; track s.val) {
          <button (click)="filterStatut = s.val; applyFilter()"
            class="px-4 py-1.5 rounded-full text-sm border transition-colors"
            [ngClass]="filterStatut === s.val
              ? 'border-accent text-accent'
              : 'border-white text-white border-opacity-20 text-opacity-50'">
            {{ s.label }} {{ counts()[s.val] != null ? '(' + counts()[s.val] + ')' : '' }}
          </button>
        }
      </div>

      @if (loading()) {
        <div class="text-white/40 py-20 text-center">Chargement…</div>
      } @else if (filtered().length === 0) {
        <div class="text-white/40 py-20 text-center">Aucune inscription.</div>
      } @else {
        <div class="border border-white/10 rounded-lg overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-white/10">
                <th class="text-left text-xs tracking-widest uppercase text-white/40 px-4 py-3 w-12">#</th>
                <th class="text-left text-xs tracking-widest uppercase text-white/40 px-4 py-3">Athlète</th>
                <th class="text-left text-xs tracking-widest uppercase text-white/40 px-4 py-3">Épreuve</th>
                <th class="text-left text-xs tracking-widest uppercase text-white/40 px-4 py-3 hidden lg:table-cell">Date inscription</th>
                <th class="text-left text-xs tracking-widest uppercase text-white/40 px-4 py-3">Statut</th>
                <th class="px-4 py-3 w-32"></th>
              </tr>
            </thead>
            <tbody>
              @for (ins of filtered(); track ins.id) {
                <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td class="px-4 py-3 font-mono text-white/40">
                    {{ ins.queuePosition ? '#' + ins.queuePosition : '—' }}
                  </td>
                  <td class="px-4 py-3">{{ ins.athletePrenom }} {{ ins.athleteNom }}</td>
                  <td class="px-4 py-3 text-white/70">{{ ins.epreuveLabel || '—' }}</td>
                  <td class="px-4 py-3 text-white/40 hidden lg:table-cell">{{ fmtDate(ins.registeredAt) }}</td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-0.5 rounded-full text-xs"
                      [ngClass]="ins.status === 'EN_ATTENTE' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                                 ins.status === 'VALIDEE' ? 'bg-green-600 bg-opacity-20 text-green-400' :
                                 ins.status === 'ANNULEE' ? 'bg-red-600 bg-opacity-20 text-red-400' : ''">
                      {{ ins.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    @if (ins.status === 'EN_ATTENTE') {
                      <div class="flex gap-2 justify-end">
                        <button (click)="validate(ins)"
                          class="px-3 py-1 rounded-full bg-green-600/20 text-green-400 hover:bg-green-600/40 text-xs transition-colors">
                          Valider
                        </button>
                        <button (click)="cancel(ins)"
                          class="px-3 py-1 rounded-full bg-red-600/20 text-red-400 hover:bg-red-600/40 text-xs transition-colors">
                          Annuler
                        </button>
                      </div>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `
})
export class InscriptionsAdminComponent implements OnInit {
  readonly loading = signal(true);
  readonly inscriptions = signal<any[]>([]);
  readonly filtered = signal<any[]>([]);
  readonly counts = signal<Record<string, number>>({});
  filterStatut = 'EN_ATTENTE';

  statuts = [
    { val: 'EN_ATTENTE', label: 'En attente' },
    { val: 'VALIDEE',    label: 'Validées' },
    { val: 'ANNULEE',    label: 'Annulées' },
    { val: 'ALL',        label: 'Toutes' },
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.api.get<any>('/registrations', { size: 200 }).subscribe({
      next: r => {
        const list: any[] = r?.data ?? [];
        this.inscriptions.set(list);
        this.counts.set({
          EN_ATTENTE: list.filter(i => i.status === 'EN_ATTENTE').length,
          VALIDEE:    list.filter(i => i.status === 'VALIDEE').length,
          ANNULEE:    list.filter(i => i.status === 'ANNULEE').length,
          ALL:        list.length,
        });
        this.applyFilter();
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  applyFilter(): void {
    const list = this.inscriptions();
    this.filtered.set(
      this.filterStatut === 'ALL' ? list : list.filter(i => i.status === this.filterStatut)
    );
  }

  validate(ins: any): void {
    this.api.put(`/registrations/${ins.id}/validate`, {}).subscribe({ next: () => this.load() });
  }

  cancel(ins: any): void {
    this.api.put(`/registrations/${ins.id}/cancel`, {}).subscribe({ next: () => this.load() });
  }

  fmtDate(d?: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
  }
}

import { Component, OnInit, signal } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { EVENEMENT_TYPE_LABELS } from '../../../../core/models/evenement.model';

@Component({
  selector: 'app-evenements-admin',
  template: `
    <app-admin-layout>
      <div>
        <div class="flex items-center justify-between mb-8">
          <h1 class="font-serif text-3xl">Évènements</h1>
          <a routerLink="/admin/evenements/new" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-sm hover:bg-white hover:text-black transition-colors">+ Nouvel évènement</a>
        </div>
        @if (loading()) { <div class="text-white/40 text-center py-16">Chargement…</div> }
        @else {
          <div class="border border-white/10 rounded-lg overflow-hidden">
            <table class="w-full">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3">Titre</th>
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3 hidden lg:table-cell">Type</th>
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3 hidden md:table-cell">Début</th>
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3">Statut</th>
                  <th class="px-4 py-3 w-28"></th>
                </tr>
              </thead>
              <tbody>
                @for (item of evenements(); track item.id) {
                  <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td class="px-4 py-3"><div class="font-medium truncate max-w-xs">{{ item.titre }}</div></td>
                    <td class="px-4 py-3 text-sm text-white/50 hidden lg:table-cell">{{ typeLabel(item.type) }}</td>
                    <td class="px-4 py-3 text-sm text-white/50 hidden md:table-cell">{{ fmtDate(item.dateDebut) }}</td>
                    <td class="px-4 py-3"><app-status-badge [status]="item.status" /></td>
                    <td class="px-4 py-3">
                      <div class="flex gap-2 justify-end">
                        <a [routerLink]="['/evenements', item.id]" class="p-1.5 hover:text-accent transition-colors" title="Voir">👁</a>
                        <a [routerLink]="['/admin/evenements', item.id, 'edit']" class="p-1.5 hover:text-accent transition-colors" title="Modifier">✏</a>
                        <button (click)="deleteId.set(item.id)" class="p-1.5 hover:text-accent transition-colors" title="Supprimer">🗑</button>
                      </div>
                    </td>
                  </tr>
                }
                @empty { <tr><td colspan="5" class="text-white/40 text-center py-10">Aucun évènement.</td></tr> }
              </tbody>
            </table>
          </div>
        }
        @if (deleteId()) {
          <div class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div class="bg-[#1a0000] border border-white/10 rounded-lg p-8 max-w-sm w-full">
              <h3 class="font-serif text-xl mb-4">Confirmer la suppression ?</h3>
              <div class="flex gap-4">
                <button (click)="doDelete()" [disabled]="deleting()" class="flex-1 py-3 rounded-full bg-accent text-white text-sm disabled:opacity-50">Supprimer</button>
                <button (click)="deleteId.set(null)" class="flex-1 py-3 rounded-full border border-white/20 text-sm">Annuler</button>
              </div>
            </div>
          </div>
        }
      </div>
    </app-admin-layout>
  `
})
export class EvenementsAdminComponent implements OnInit {
  readonly evenements = signal<any[]>([]);
  readonly loading = signal(false);
  readonly deleteId = signal<number | null>(null);
  readonly deleting = signal(false);

  constructor(private api: ApiService) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.api.get<any>('/evenements', { page: 0, size: 100, sort: 'dateDebut' }).subscribe({
      next: (res) => { this.evenements.set(res?.data ?? []); this.loading.set(false); },
      error: () => { this.evenements.set([]); this.loading.set(false); },
    });
  }

  doDelete(): void {
    this.deleting.set(true);
    this.api.delete(`/evenements/${this.deleteId()}`).subscribe({
      next: () => { this.evenements.update(n => n.filter(x => x.id !== this.deleteId())); this.deleteId.set(null); this.deleting.set(false); },
      error: () => this.deleting.set(false)
    });
  }

  typeLabel(t: string): string { return EVENEMENT_TYPE_LABELS[t] ?? t; }

  fmtDate(d?: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}

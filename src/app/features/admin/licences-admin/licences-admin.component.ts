import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-licences-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminLayoutComponent, PaginationComponent, StatusBadgeComponent],
  template: `
    <app-admin-layout>
      <div>
        <div class="flex items-center justify-between mb-8">
          <h1 class="font-serif text-3xl">Licences</h1>
          <a routerLink="/admin/licences/new" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-sm hover:bg-white hover:text-black transition-colors">+ Ajouter</a>
        </div>
        @if (loading()) { <div class="text-white/40 text-center py-16">Chargement…</div> }
        @else {
          <div class="border border-white/10 rounded-lg overflow-hidden">
            <table class="w-full">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3">Licence</th>
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3 hidden lg:table-cell">Type</th>
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3">Statut</th>
                  <th class="px-4 py-3 w-32"></th>
                </tr>
              </thead>
              <tbody>
                @for (lic of licences(); track lic.id) {
                  <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td class="px-4 py-3">
                      <div class="font-medium">{{ lic.numero || '#' + lic.id }}</div>
                      <div class="text-xs text-white/40">Athlète #{{ lic.athleteId }}</div>
                    </td>
                    <td class="px-4 py-3 text-sm text-white/50 hidden lg:table-cell">{{ lic.type?.toLowerCase() }}</td>
                    <td class="px-4 py-3"><app-status-badge [status]="lic.statut || 'EN_ATTENTE'" /></td>
                    <td class="px-4 py-3">
                      <div class="flex gap-1 justify-end">
                        @if (lic.statut === 'EN_ATTENTE') {
                          <button (click)="valider(lic.id)" [disabled]="actionId() === lic.id" class="p-1.5 hover:text-green-400 transition-colors" title="Valider">✓</button>
                          <button (click)="rejeter(lic.id)" [disabled]="actionId() === lic.id" class="p-1.5 hover:text-red-400 transition-colors" title="Rejeter">✗</button>
                        }
                        <a [routerLink]="['/admin/licences', lic.id, 'edit']" class="p-1.5 hover:text-accent transition-colors">✏</a>
                        <button (click)="deleteId.set(lic.id)" class="p-1.5 hover:text-accent transition-colors">🗑</button>
                      </div>
                    </td>
                  </tr>
                }
                @empty { <tr><td colspan="4" class="text-white/40 text-center py-10">Aucune licence.</td></tr> }
              </tbody>
            </table>
          </div>
          <app-pagination [page]="page" [total]="total" [pageSize]="20" (pageChange)="onPage($event)" />
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
export class LicencesAdminComponent implements OnInit {
  readonly licences = signal<any[]>([]);
  readonly loading = signal(false);
  readonly deleteId = signal<number | null>(null);
  readonly deleting = signal(false);
  readonly actionId = signal<number | null>(null);
  total = 0; page = 1;

  constructor(private api: ApiService) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.api.get<any>('/licences', { page: this.page - 1, size: 20 }).subscribe({
      next: r => { this.licences.set(r?.data ?? r?.content ?? []); this.total = r?.totalCount ?? r?.totalElements ?? 0; this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onPage(p: number): void { this.page = p; this.load(); }

  valider(id: number): void {
    this.actionId.set(id);
    this.api.put(`/licences/${id}/valider`, {}).subscribe({
      next: () => { this.licences.update(l => l.map(x => x.id === id ? { ...x, statut: 'VALIDEE' } : x)); this.actionId.set(null); },
      error: () => this.actionId.set(null)
    });
  }

  rejeter(id: number): void {
    this.actionId.set(id);
    this.api.put(`/licences/${id}/rejeter`, {}).subscribe({
      next: () => { this.licences.update(l => l.map(x => x.id === id ? { ...x, statut: 'REJETEE' } : x)); this.actionId.set(null); },
      error: () => this.actionId.set(null)
    });
  }

  doDelete(): void {
    this.deleting.set(true);
    this.api.delete(`/licences/${this.deleteId()}`).subscribe({
      next: () => { this.licences.update(l => l.filter(x => x.id !== this.deleteId())); this.deleteId.set(null); this.deleting.set(false); },
      error: () => this.deleting.set(false)
    });
  }
}

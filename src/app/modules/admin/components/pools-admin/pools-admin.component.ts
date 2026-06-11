import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';

@Component({
  selector: 'app-pools-admin',
  template: `
    <app-admin-layout>
      <div>
        <div class="flex items-center justify-between mb-8">
          <h1 class="font-serif text-3xl">Piscines</h1>
          <a routerLink="/admin/pools/new" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-sm hover:bg-white hover:text-black transition-colors">+ Ajouter</a>
        </div>
        @if (loading()) { <div class="text-white/40 text-center py-16">Chargement…</div> }
        @else {
          <div class="border border-white/10 rounded-lg overflow-hidden">
            <table class="w-full">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3">Piscine</th>
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3 hidden lg:table-cell">Ville</th>
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3 hidden lg:table-cell">Bassin</th>
                  <th class="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody>
                @for (p of pools(); track p.id) {
                  <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td class="px-4 py-3 font-medium">{{ p.nom }}</td>
                    <td class="px-4 py-3 text-sm text-white/50 hidden lg:table-cell">{{ p.ville || '—' }}</td>
                    <td class="px-4 py-3 text-sm text-white/50 hidden lg:table-cell">{{ p.longueur }}m · {{ p.nbCouloirs }} coul.</td>
                    <td class="px-4 py-3">
                      <div class="flex gap-2 justify-end">
                        <a [routerLink]="['/admin/pools', p.id, 'edit']" class="p-1.5 hover:text-accent transition-colors">✏</a>
                        <button (click)="deleteId.set(p.id)" class="p-1.5 hover:text-accent transition-colors">🗑</button>
                      </div>
                    </td>
                  </tr>
                }
                @empty { <tr><td colspan="4" class="text-white/40 text-center py-10">Aucune piscine.</td></tr> }
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
export class PoolsAdminComponent implements OnInit {
  readonly pools = signal<any[]>([]);
  readonly loading = signal(false);
  readonly deleteId = signal<number | null>(null);
  readonly deleting = signal(false);

  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.loading.set(true);
    this.api.get<any>('/pools').subscribe({
      next: r => { this.pools.set(r?.data ?? r?.content ?? (Array.isArray(r)?r:[])); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  doDelete(): void {
    this.deleting.set(true);
    this.api.delete(`/pools/${this.deleteId()}`).subscribe({
      next: () => { this.pools.update(p => p.filter(x => x.id !== this.deleteId())); this.deleteId.set(null); this.deleting.set(false); },
      error: () => this.deleting.set(false)
    });
  }
}

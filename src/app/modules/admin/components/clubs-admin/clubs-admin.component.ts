import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';

@Component({
  selector: 'app-clubs-admin',
  template: `
    <app-admin-layout>
      <div>
        <div class="flex items-center justify-between mb-8">
          <h1 class="font-serif text-3xl">Clubs</h1>
          <a routerLink="/admin/clubs/new" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-sm hover:bg-white hover:text-black transition-colors">+ Ajouter</a>
        </div>
        <div class="flex mb-6 gap-3">
          <input type="text" placeholder="Rechercher…" [(ngModel)]="search"
            class="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm placeholder:text-white/30 focus:outline-none"/>
          <button (click)="load()" class="px-4 py-2 rounded-full border border-white/10 hover:border-white/30 text-sm transition-colors">Filtrer</button>
        </div>
        @if (loading()) { <div class="text-white/40 text-center py-16">Chargement…</div> }
        @else {
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (c of clubs(); track c.id) {
              <div class="border border-white/10 rounded-lg p-5 hover:border-white/20 transition-colors">
                <div class="flex items-start justify-between mb-3">
                  <div class="w-10 h-10 rounded-full bg-[#1a0000] border border-white/10 flex items-center justify-center">{{ c.nom?.[0] }}</div>
                  <div class="flex gap-2">
                    <a [routerLink]="['/admin/clubs', c.id, 'edit']" class="p-1.5 hover:text-accent transition-colors">✏</a>
                    <button (click)="deleteId.set(c.id)" class="p-1.5 hover:text-accent transition-colors">🗑</button>
                  </div>
                </div>
                <h3 class="font-medium mb-1">{{ c.nom }}</h3>
                <div class="text-xs text-white/40">{{ joinArr([c.ville, c.region]) }}</div>
                <div class="mt-2 text-xs" [style.color]="c.actif ? '#10B981' : '#6B7280'">{{ c.actif ? 'Actif' : 'Inactif' }}</div>
              </div>
            }
            @empty { <div class="col-span-3 text-white/40 text-center py-10">Aucun club.</div> }
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
export class ClubsAdminComponent implements OnInit {
  readonly clubs = signal<any[]>([]);
  readonly loading = signal(false);
  readonly deleteId = signal<number | null>(null);
  readonly deleting = signal(false);
  search = '';

  joinArr(arr: (string|undefined)[]): string { return arr.filter(Boolean).join(' · '); }

  constructor(private api: ApiService) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    const p: any = { page:0, size:100 };
    if (this.search) p.search = this.search;
    this.api.get<any>('/clubs', p).subscribe({
      next: r => { this.clubs.set(r?.data ?? r?.content ?? (Array.isArray(r)?r:[])); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  doDelete(): void {
    this.deleting.set(true);
    this.api.delete(`/clubs/${this.deleteId()}`).subscribe({
      next: () => { this.clubs.update(c => c.filter(x => x.id !== this.deleteId())); this.deleteId.set(null); this.deleting.set(false); },
      error: () => this.deleting.set(false)
    });
  }
}

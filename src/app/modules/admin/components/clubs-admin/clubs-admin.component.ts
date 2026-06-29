import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { Pencil, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-clubs-admin',
  template: `
    <app-admin-layout>
      <div>
        <div class="flex items-center justify-between mb-8">
          <h1 class="font-serif text-3xl">Clubs</h1>
          <button (click)="openCreate()" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-sm hover:bg-white hover:text-black transition-colors">+ Ajouter</button>
        </div>
        <div class="flex mb-6 gap-3">
          <input type="text" placeholder="Rechercher…" [(ngModel)]="search"
            class="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm placeholder:text-white/30 focus:outline-none"/>
          <button (click)="onSearch()" class="px-4 py-2 rounded-full border border-white/10 hover:border-white/30 text-sm transition-colors">Filtrer</button>
        </div>
        @if (loading()) { <div class="text-white/40 text-center py-16">Chargement…</div> }
        @else {
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (c of clubs(); track c.id) {
              <div class="border border-white/10 rounded-lg p-5 hover:border-white/20 transition-colors">
                <div class="flex items-start justify-between mb-3">
                  <div class="w-10 h-10 rounded-full bg-[#1a0000] border border-white/10 flex items-center justify-center">{{ c.nom?.[0] }}</div>
                  <div class="flex gap-2">
                    <button (click)="openEdit(c.id)" class="p-1.5 hover:text-accent transition-colors"><lucide-icon [img]="Pencil" class="w-3.5 h-3.5"></lucide-icon></button>
                    <button (click)="deleteId.set(c.id)" class="p-1.5 hover:text-accent transition-colors"><lucide-icon [img]="Trash2" class="w-3.5 h-3.5"></lucide-icon></button>
                  </div>
                </div>
                <h3 class="font-medium mb-1">{{ c.nom }}</h3>
                <div class="text-xs text-white/40">{{ joinArr([c.ville, c.region]) }}</div>
                <div class="mt-2 text-xs" [style.color]="c.actif ? '#10B981' : '#6B7280'">{{ c.actif ? 'Actif' : 'Inactif' }}</div>
              </div>
            }
            @empty { <div class="col-span-3 text-white/40 text-center py-10">Aucun club.</div> }
          </div>
          <app-pagination [page]="page" [total]="total" [pageSize]="20" (pageChange)="onPage($event)" />
        }
      </div>
    </app-admin-layout>

    <app-modal [open]="!!deleteId()" maxWidth="max-w-sm" (closed)="deleteId.set(null)">
      <h3 class="font-serif text-xl mb-4">Confirmer la suppression ?</h3>
      <div class="flex gap-4">
        <button (click)="doDelete()" [disabled]="deleting()" class="flex-1 py-3 rounded-full bg-accent text-white text-sm disabled:opacity-50">Supprimer</button>
        <button (click)="deleteId.set(null)" class="flex-1 py-3 rounded-full border border-white/20 text-sm">Annuler</button>
      </div>
    </app-modal>

    <app-modal [open]="formOpen()" [title]="editId() ? 'Modifier le club' : 'Nouveau club'" (closed)="formOpen.set(false)">
      <app-club-form [id]="editId()" (saved)="onFormSaved()"></app-club-form>
    </app-modal>
  `
})
export class ClubsAdminComponent implements OnInit {
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly clubs = signal<any[]>([]);
  readonly loading = signal(false);
  readonly deleteId = signal<number | null>(null);
  readonly deleting = signal(false);
  readonly formOpen = signal(false);
  readonly editId = signal<string | null>(null);
  total = 0; page = 1; search = '';

  joinArr(arr: (string|undefined)[]): string { return arr.filter(Boolean).join(' · '); }

  constructor(private api: ApiService) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    const p: any = { page: this.page - 1, size: 20 };
    if (this.search) p.search = this.search;
    this.api.get<any>('/clubs', p).subscribe({
      next: r => { this.clubs.set(r?.data ?? r?.content ?? (Array.isArray(r)?r:[])); this.total = r?.totalCount ?? r?.totalElements ?? 0; this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onSearch(): void { this.page = 1; this.load(); }
  onPage(p: number): void { this.page = p; this.load(); }

  openCreate(): void { this.editId.set(null); this.formOpen.set(true); }
  openEdit(id: string): void { this.editId.set(id); this.formOpen.set(true); }
  onFormSaved(): void { this.formOpen.set(false); this.load(); }

  doDelete(): void {
    this.deleting.set(true);
    this.api.delete(`/clubs/${this.deleteId()}`).subscribe({
      next: () => { this.deleteId.set(null); this.deleting.set(false); this.load(); },
      error: () => this.deleting.set(false)
    });
  }
}

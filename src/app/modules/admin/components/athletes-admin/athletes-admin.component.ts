import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { Pencil, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-athletes-admin',
  template: `
    <app-admin-layout>
      <div>
        <div class="flex items-center justify-between mb-8">
          <h1 class="font-serif text-3xl">Athlètes</h1>
          <button (click)="openCreate()" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-sm hover:bg-white hover:text-black transition-colors">+ Ajouter</button>
        </div>
        <div class="flex mb-6 gap-3">
          <input type="text" placeholder="Rechercher…" [(ngModel)]="search" (ngModelChange)="onSearch()"
            class="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm placeholder:text-white/30 focus:outline-none" />
        </div>
        @if (loading()) { <div class="text-white/40 text-center py-16">Chargement…</div> }
        @else {
          <div class="border border-white/10 rounded-lg overflow-hidden">
            <table class="w-full">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3">Athlète</th>
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3 hidden lg:table-cell">Catégorie</th>
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3 hidden lg:table-cell">Sexe</th>
                  <th class="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody>
                @for (a of athletes(); track a.id) {
                  <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs bg-accent flex-shrink-0">{{ initials(a) }}</div>
                        <div>
                          <div class="font-medium">{{ a.prenom }} {{ a.nom }}</div>
                          <div class="text-xs text-white/40">{{ a.nationalite }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-sm text-white/60 hidden lg:table-cell">{{ a.categorie?.toLowerCase() }}</td>
                    <td class="px-4 py-3 text-sm text-white/60 hidden lg:table-cell">{{ a.sexe === 'MASCULIN' ? 'H' : 'F' }}</td>
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2 justify-end">
                        <button (click)="openEdit(a.id)" class="p-1.5 hover:text-accent transition-colors"><lucide-icon [img]="Pencil" class="w-3.5 h-3.5"></lucide-icon></button>
                        <button (click)="confirmDelete(a.id)" class="p-1.5 hover:text-accent transition-colors"><lucide-icon [img]="Trash2" class="w-3.5 h-3.5"></lucide-icon></button>
                      </div>
                    </td>
                  </tr>
                }
                @empty { <tr><td colspan="4" class="text-white/40 text-center py-10">Aucun athlète.</td></tr> }
              </tbody>
            </table>
          </div>
          <app-pagination [page]="page" [total]="total" [pageSize]="20" (pageChange)="onPage($event)" />
        }
      </div>
    </app-admin-layout>

    <app-modal [open]="!!deleteId()" maxWidth="max-w-sm" (closed)="deleteId.set(null)">
      <h3 class="font-serif text-xl mb-4">Confirmer la suppression ?</h3>
      <p class="text-white/60 mb-8">Cette action est irréversible.</p>
      <div class="flex gap-4">
        <button (click)="doDelete()" [disabled]="deleting()" class="flex-1 py-3 rounded-full bg-accent text-white text-sm disabled:opacity-50">{{ deleting() ? '…' : 'Supprimer' }}</button>
        <button (click)="deleteId.set(null)" class="flex-1 py-3 rounded-full border border-white/20 text-sm">Annuler</button>
      </div>
    </app-modal>

    <app-modal [open]="formOpen()" [title]="editId() ? 'Modifier l\\'athlète' : 'Nouvel athlète'" (closed)="formOpen.set(false)">
      <app-athlete-form [id]="editId()" (saved)="onFormSaved()"></app-athlete-form>
    </app-modal>
  `
})
export class AthletesAdminComponent implements OnInit {
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly athletes = signal<any[]>([]);
  readonly loading = signal(false);
  readonly deleteId = signal<number | null>(null);
  readonly deleting = signal(false);
  readonly formOpen = signal(false);
  readonly editId = signal<string | null>(null);
  total = 0; page = 1; search = '';

  constructor(private api: ApiService) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    const p: any = { page: this.page - 1, size: 20 };
    if (this.search) p.search = this.search;
    this.api.get<any>('/athletes', p).subscribe({
      next: r => { this.athletes.set(r?.data ?? r?.content ?? []); this.total = r?.totalCount ?? r?.totalElements ?? 0; this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onSearch(): void { this.page = 1; this.load(); }
  onPage(p: number): void { this.page = p; this.load(); }
  confirmDelete(id: number): void { this.deleteId.set(id); }

  openCreate(): void { this.editId.set(null); this.formOpen.set(true); }
  openEdit(id: string): void { this.editId.set(id); this.formOpen.set(true); }
  onFormSaved(): void { this.formOpen.set(false); this.load(); }

  doDelete(): void {
    this.deleting.set(true);
    this.api.delete(`/athletes/${this.deleteId()}`).subscribe({
      next: () => { this.deleteId.set(null); this.deleting.set(false); this.load(); },
      error: () => this.deleting.set(false)
    });
  }

  initials(a: any): string { return `${(a.prenom||'')[0]??''}${(a.nom||'')[0]??''}`.toUpperCase(); }
}

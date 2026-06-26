import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { Pencil, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-forum-admin',
  template: `
    <app-admin-layout>
      <div>
        <div class="flex items-center justify-between mb-8">
          <h1 class="font-serif text-3xl">Forum</h1>
          <button (click)="openCreate()" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-sm hover:bg-white hover:text-black transition-colors">+ Catégorie</button>
        </div>
        @if (showForm()) {
          <form (ngSubmit)="save()" class="mb-8 p-6 border border-white/10 rounded-lg max-w-lg">
            <h3 class="font-serif text-xl mb-6">{{ editingCat() ? 'Modifier' : 'Nouvelle' }} catégorie</h3>
            <div class="space-y-6">
              <div>
                <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Nom *</label>
                <input [(ngModel)]="form.nom" name="nom" required class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
              </div>
              <div>
                <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Description</label>
                <input [(ngModel)]="form.description" name="desc" class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
              </div>
              <div>
                <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Catégorie</label>
                <select [(ngModel)]="form.categorie" name="cat" class="block w-full bg-transparent border-b border-white/20 pb-3 outline-none text-white">
                  <option value="" class="bg-[#1a0000]">Non spécifié</option>
                  @for (c of CATS; track c) { <option [value]="c" class="bg-[#1a0000]">{{ c.replace('_','-').toLowerCase() }}</option> }
                </select>
              </div>
              <div class="flex gap-4">
                <button type="submit" [disabled]="saving()" class="px-6 py-2.5 rounded-full bg-white text-black hover:bg-accent hover:text-white transition-colors text-sm disabled:opacity-50">{{ saving() ? '…' : (editingCat() ? 'Mettre à jour' : 'Créer') }}</button>
                <button type="button" (click)="showForm.set(false)" class="px-6 py-2.5 rounded-full border border-white/20 text-sm">Annuler</button>
              </div>
            </div>
          </form>
        }
        @if (loading()) { <div class="text-white/40 text-center py-16">Chargement…</div> }
        @else {
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (cat of categories(); track cat.id) {
              <div class="border border-white/10 rounded-lg p-5 hover:border-white/20 transition-colors">
                <div class="flex items-start justify-between mb-3">
                  <span class="text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full text-accent" style="background:rgba(225,6,0,0.1)">{{ cat.categorie?.toLowerCase() }}</span>
                  <div class="flex gap-2">
                    <button (click)="openEdit(cat)" class="p-1.5 hover:text-accent transition-colors"><lucide-icon [img]="Pencil" class="w-3.5 h-3.5"></lucide-icon></button>
                    <button (click)="deleteId.set(cat.id)" class="p-1.5 hover:text-accent transition-colors"><lucide-icon [img]="Trash2" class="w-3.5 h-3.5"></lucide-icon></button>
                  </div>
                </div>
                <h3 class="font-medium mb-1">{{ cat.nom }}</h3>
                <p class="text-xs text-white/40 mb-2">{{ cat.description }}</p>
                <div class="text-xs text-white/30">{{ cat.nbSujets || 0 }} sujets</div>
              </div>
            }
            @empty { <div class="col-span-3 text-white/40 text-center py-10">Aucune catégorie.</div> }
          </div>
          <app-pagination [page]="page" [total]="total" [pageSize]="12" (pageChange)="onPage($event)" />
        }
      </div>
    </app-admin-layout>

    <app-modal [open]="!!deleteId()" maxWidth="max-w-sm" (closed)="deleteId.set(null)">
      <h3 class="font-serif text-xl mb-4">Supprimer la catégorie ?</h3>
      <div class="flex gap-4">
        <button (click)="doDelete()" [disabled]="deleting()" class="flex-1 py-3 rounded-full bg-accent text-white text-sm disabled:opacity-50">Supprimer</button>
        <button (click)="deleteId.set(null)" class="flex-1 py-3 rounded-full border border-white/20 text-sm">Annuler</button>
      </div>
    </app-modal>
  `
})
export class ForumAdminComponent implements OnInit {
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly categories = signal<any[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly showForm = signal(false);
  readonly editingCat = signal<any>(null);
  readonly deleteId = signal<number | null>(null);
  readonly deleting = signal(false);
  form = { nom:'', description:'', categorie:'' };
  readonly CATS = ['NATATION','EAU_LIBRE','WATER_POLO','PLONGEON','GENERAL'];
  total = 0; page = 1;

  constructor(private api: ApiService) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.api.get<any>('/forums', { page: this.page - 1, size: 12 }).subscribe({
      next: r => { this.categories.set(r?.data ?? (Array.isArray(r)?r:[])); this.total = r?.totalCount ?? r?.totalElements ?? 0; this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onPage(p: number): void { this.page = p; this.load(); }

  openCreate(): void { this.editingCat.set(null); this.form = { nom:'', description:'', categorie:'' }; this.showForm.set(true); }
  openEdit(cat: any): void { this.editingCat.set(cat); this.form = { nom:cat.nom??'', description:cat.description??'', categorie:cat.categorie??'' }; this.showForm.set(true); }

  save(): void {
    if (!this.form.nom) return;
    this.saving.set(true);
    const obs = this.editingCat() ? this.api.put(`/forums/${this.editingCat().id}`, this.form) : this.api.post('/forums', this.form);
    obs.subscribe({ next: () => { this.saving.set(false); this.showForm.set(false); this.editingCat.set(null); this.load(); }, error: () => this.saving.set(false) });
  }

  doDelete(): void {
    this.deleting.set(true);
    this.api.delete(`/forums/${this.deleteId()}`).subscribe({
      next: () => { this.categories.update(c => c.filter(x => x.id !== this.deleteId())); this.deleteId.set(null); this.deleting.set(false); },
      error: () => this.deleting.set(false)
    });
  }
}

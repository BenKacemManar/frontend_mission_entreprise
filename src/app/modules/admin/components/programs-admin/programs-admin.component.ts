import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { Pencil, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-programs-admin',
  template: `
    <app-admin-layout>
      <div>
        <div class="flex items-center justify-between mb-8">
          <h1 class="font-serif text-3xl">Programmes</h1>
          <button (click)="openCreate()" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-sm hover:bg-white hover:text-black transition-colors">+ Ajouter</button>
        </div>
        @if (loading()) { <div class="text-white/40 text-center py-16">Chargement…</div> }
        @else {
          <div class="border border-white/10 rounded-lg overflow-hidden">
            <table class="w-full">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3">Programme</th>
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3 hidden lg:table-cell">Âges</th>
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3 hidden md:table-cell">Statut</th>
                  <th class="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody>
                @for (p of programs(); track p.id) {
                  <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td class="px-4 py-3">
                      <div class="font-medium">{{ p.nom }}</div>
                      <div class="text-xs text-white/40 truncate max-w-xs">{{ p.description }}</div>
                    </td>
                    <td class="px-4 py-3 text-sm text-white/50 hidden lg:table-cell">{{ ageRange(p) }}</td>
                    <td class="px-4 py-3 hidden md:table-cell">
                      <span class="text-xs px-2 py-0.5 rounded-full"
                        [style.background]="p.actif?'rgba(16,185,129,0.15)':'rgba(107,114,128,0.15)'"
                        [style.color]="p.actif?'#10B981':'#6B7280'">
                        {{ p.actif ? 'Actif' : 'Inactif' }}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex gap-2 justify-end">
                        <button (click)="openEdit(p.id)" class="p-1.5 hover:text-accent transition-colors"><lucide-icon [img]="Pencil" class="w-3.5 h-3.5"></lucide-icon></button>
                        <button (click)="deleteId.set(p.id)" class="p-1.5 hover:text-accent transition-colors"><lucide-icon [img]="Trash2" class="w-3.5 h-3.5"></lucide-icon></button>
                      </div>
                    </td>
                  </tr>
                }
                @empty { <tr><td colspan="4" class="text-white/40 text-center py-10">Aucun programme.</td></tr> }
              </tbody>
            </table>
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

    <app-modal [open]="formOpen()" [title]="editId() ? 'Modifier le programme' : 'Nouveau programme'" (closed)="formOpen.set(false)">
      <app-program-form [id]="editId()" (saved)="onFormSaved()"></app-program-form>
    </app-modal>
  `
})
export class ProgramsAdminComponent implements OnInit {
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly programs = signal<any[]>([]);
  readonly loading = signal(false);
  readonly deleteId = signal<number | null>(null);
  readonly deleting = signal(false);
  readonly formOpen = signal(false);
  readonly editId = signal<string | null>(null);
  total = 0; page = 1;

  constructor(private api: ApiService) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.api.get<any>('/programs', { page: this.page - 1, size: 20 }).subscribe({
      next: r => { this.programs.set(r?.data ?? r?.content ?? (Array.isArray(r)?r:[])); this.total = r?.totalCount ?? r?.totalElements ?? 0; this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onPage(p: number): void { this.page = p; this.load(); }

  openCreate(): void { this.editId.set(null); this.formOpen.set(true); }
  openEdit(id: number): void { this.editId.set(String(id)); this.formOpen.set(true); }
  onFormSaved(): void { this.formOpen.set(false); this.load(); }

  doDelete(): void {
    this.deleting.set(true);
    this.api.delete(`/programs/${this.deleteId()}`).subscribe({
      next: () => { this.programs.update(p => p.filter(x => x.id !== this.deleteId())); this.deleteId.set(null); this.deleting.set(false); },
      error: () => this.deleting.set(false)
    });
  }

  ageRange(p: any): string {
    if (p.ageMin != null && p.ageMax != null) return `${p.ageMin} - ${p.ageMax} ans`;
    if (p.ageMin != null) return `${p.ageMin}+ ans`;
    if (p.ageMax != null) return `Jusqu'à ${p.ageMax} ans`;
    return '—';
  }
}

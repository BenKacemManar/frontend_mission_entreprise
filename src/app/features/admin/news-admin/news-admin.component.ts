import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';

@Component({
  selector: 'app-news-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <div>
        <div class="flex items-center justify-between mb-8">
          <h1 class="font-serif text-3xl">Actualités</h1>
          <a routerLink="/admin/news/new" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-sm hover:bg-white hover:text-black transition-colors">+ Rédiger</a>
        </div>
        @if (loading()) { <div class="text-white/40 text-center py-16">Chargement…</div> }
        @else {
          <div class="border border-white/10 rounded-lg overflow-hidden">
            <table class="w-full">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3">Titre</th>
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3 hidden lg:table-cell">Catégorie</th>
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3 hidden md:table-cell">Statut</th>
                  <th class="px-4 py-3 w-28"></th>
                </tr>
              </thead>
              <tbody>
                @for (item of news(); track item.id) {
                  <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td class="px-4 py-3">
                      <div class="font-medium truncate max-w-xs">{{ item.titre }}</div>
                    </td>
                    <td class="px-4 py-3 text-sm text-white/50 hidden lg:table-cell">{{ item.categorie?.toLowerCase() }}</td>
                    <td class="px-4 py-3 hidden md:table-cell">
                      <span class="text-xs px-2 py-0.5 rounded-full"
                        [style.background]="item.publie?'rgba(16,185,129,0.15)':'rgba(107,114,128,0.15)'"
                        [style.color]="item.publie?'#10B981':'#6B7280'">
                        {{ item.publie ? 'Publié' : 'Brouillon' }}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex gap-2 justify-end">
                        <button (click)="togglePublish(item)" [disabled]="togglingId() === item.id" class="p-1.5 hover:text-accent transition-colors" [title]="item.publie?'Archiver':'Publier'">
                          {{ item.publie ? '🙈' : '👁' }}
                        </button>
                        <a [routerLink]="['/admin/news', item.id, 'edit']" class="p-1.5 hover:text-accent transition-colors">✏</a>
                        <button (click)="deleteId.set(item.id)" class="p-1.5 hover:text-accent transition-colors">🗑</button>
                      </div>
                    </td>
                  </tr>
                }
                @empty { <tr><td colspan="4" class="text-white/40 text-center py-10">Aucune actualité.</td></tr> }
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
export class NewsAdminComponent implements OnInit {
  readonly news = signal<any[]>([]);
  readonly loading = signal(false);
  readonly deleteId = signal<number | null>(null);
  readonly deleting = signal(false);
  readonly togglingId = signal<number | null>(null);

  constructor(private api: ApiService) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    const reqs = Array.from({ length: 80 }, (_, i) =>
      this.api.get<any>(`/actualites/${i + 1}`).pipe(catchError(() => of(null)))
    );
    forkJoin(reqs).subscribe({
      next: results => {
        const items = results.filter(Boolean).sort((a: any, b: any) =>
          new Date(b?.datePublication ?? b?.createdAt ?? 0).getTime() - new Date(a?.datePublication ?? a?.createdAt ?? 0).getTime()
        );
        this.news.set(items as any[]);
        this.loading.set(false);
      }
    });
  }

  togglePublish(item: any): void {
    this.togglingId.set(item.id);
    const ep = item.publie ? `/actualites/${item.id}/archiver` : `/actualites/${item.id}/publier`;
    this.api.put(ep, {}).subscribe({
      next: () => { this.news.update(n => n.map(x => x.id === item.id ? { ...x, publie: !x.publie } : x)); this.togglingId.set(null); },
      error: () => this.togglingId.set(null)
    });
  }

  doDelete(): void {
    this.deleting.set(true);
    this.api.delete(`/actualites/${this.deleteId()}`).subscribe({
      next: () => { this.news.update(n => n.filter(x => x.id !== this.deleteId())); this.deleteId.set(null); this.deleting.set(false); },
      error: () => this.deleting.set(false)
    });
  }
}

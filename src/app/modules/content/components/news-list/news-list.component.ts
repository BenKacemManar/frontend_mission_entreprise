import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { PageLayoutComponent } from '../../../../shared/components/page-layout/page-layout.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

const CATS = [
  { v:'', l:'Tout' }, { v:'COMPETITION', l:'Compétitions' }, { v:'FORMATION', l:'Formation' },
  { v:'GOUVERNANCE', l:'Gouvernance' }, { v:'INFRASTRUCTURE', l:'Infrastructure' }, { v:'GENERAL', l:'Général' }
];

@Component({
  selector: 'app-news-list',
  template: `
    <app-page-layout>
      <section class="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <div class="mb-12">
          <div class="flex items-center gap-4 mb-6">
            <span class="h-px w-10 bg-accent"></span>
            <span class="text-xs tracking-[0.3em] uppercase text-white/70">Actualités</span>
          </div>
          <h1 class="font-serif text-5xl lg:text-7xl leading-[0.95]">
            Toutes les <br/><span class="italic text-gold">nouvelles.</span>
          </h1>
        </div>
        <div class="flex flex-wrap gap-3 mb-10 pb-8 border-b border-white/10">
          <input type="text" placeholder="Rechercher…" [(ngModel)]="search" (ngModelChange)="onSearch()"
            class="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm placeholder:text-white/30 focus:outline-none" />
          @for (c of CATS; track c.v) {
            <button (click)="setCategorie(c.v)"
              class="px-4 py-2 rounded-full border text-sm transition-colors"
              [style.background]="categorie===c.v?'#E10600':''"
              [style.borderColor]="categorie===c.v?'#E10600':'rgba(255,255,255,0.15)'"
              [style.color]="categorie===c.v?'white':'rgba(255,255,255,0.6)'">{{ c.l }}</button>
          }
        </div>
        @if (loading()) {
          <div class="text-white/40 text-center py-20">Chargement…</div>
        } @else if (news().length === 0) {
          <div class="text-white/40 text-center py-20">Aucune actualité.</div>
        } @else {
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-px" style="background:rgba(255,255,255,0.05)">
            @for (item of news(); track item.id) {
              <a [routerLink]="['/news', item.id]"
                class="group bg-ink hover:bg-[#1a0000] transition-colors p-6 flex flex-col cursor-pointer">
                @if (item.imageUrl) {
                  <div class="aspect-video overflow-hidden mb-4 -mx-6 -mt-6">
                    <img [src]="item.imageUrl" [alt]="item.titre"
                      class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                  </div>
                }
                <div class="flex items-center gap-3 mb-3">
                  <span class="text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full text-accent" style="background:rgba(225,6,0,0.1)">
                    {{ item.categorie?.toLowerCase() }}
                  </span>
                  <span class="text-xs text-white/30">{{ fmtDate(item.datePublication || item.createdAt) }}</span>
                </div>
                <h3 class="font-serif text-xl mb-3 flex-1">{{ item.titre }}</h3>
                <p class="text-sm text-white/50 line-clamp-2 mb-4">{{ item.contenu }}</p>
                <div class="flex items-center justify-between mt-auto">
                  <span class="text-xs text-white/30">{{ item.auteurNom }}</span>
                  <span class="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-colors text-sm">
                    &rarr;
                  </span>
                </div>
              </a>
            }
          </div>
        }
        <app-pagination [page]="page" [total]="total" [pageSize]="9" (pageChange)="onPage($event)" />
      </section>
    </app-page-layout>
  `
})
export class NewsListComponent implements OnInit {
  readonly news = signal<any[]>([]);
  readonly loading = signal(false);
  total = 0; page = 1; search = ''; categorie = '';
  readonly CATS = CATS;

  constructor(private api: ApiService) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    const p: any = { page: this.page - 1, size: 9 };
    if (this.search) p.search = this.search;
    if (this.categorie) p.categorie = this.categorie;
    this.api.get<any>('/actualites', p).subscribe({
      next: r => { this.news.set(r?.data ?? r?.content ?? (Array.isArray(r)?r:[])); this.total = r?.totalCount ?? r?.totalElements ?? 0; this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onSearch(): void { this.page = 1; this.load(); }
  setCategorie(v: string): void { this.categorie = v; this.page = 1; this.load(); }
  onPage(p: number): void { this.page = p; this.load(); }

  fmtDate(d?: string): string {
    if (!d) return '';
    return new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' });
  }
}

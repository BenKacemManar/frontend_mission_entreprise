import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { PageLayoutComponent } from '../../../../shared/components/page-layout/page-layout.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

const CATS = ['','POUSSIN','BENJAMIN','MINIME','CADET','JUNIOR','SENIOR'];
const GENDERS = [{ v:'',l:'Tous' },{ v:'MASCULIN',l:'Hommes' },{ v:'FEMININ',l:'Femmes' }];

@Component({
  selector: 'app-athletes-list',
  template: `
    <app-page-layout>
      <section class="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <div class="flex items-center gap-4 mb-6">
              <span class="h-px w-10 bg-accent"></span>
              <span class="text-xs tracking-[0.3em] uppercase text-white/70">Athlètes</span>
            </div>
            <h1 class="font-serif text-5xl lg:text-7xl leading-[0.95]">
              Nos <span class="italic text-gold">champions.</span>
            </h1>
          </div>
          <a routerLink="/athletes/clubs" class="px-5 py-2.5 rounded-full border border-white/20 hover:border-white text-sm transition-colors">Voir les clubs →</a>
        </div>

        <div class="flex flex-wrap gap-3 mb-10 pb-8 border-b border-white/10">
          <input type="text" placeholder="Rechercher…" [(ngModel)]="search" (ngModelChange)="applyFilter()"
            class="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm placeholder:text-white/30 focus:outline-none" />
          @for (c of CATS; track c) {
            <button (click)="setCategory(c)"
              class="px-4 py-2 rounded-full border text-sm transition-colors"
              [style.background]="category===c?'#E10600':''"
              [style.borderColor]="category===c?'#E10600':'rgba(255,255,255,0.15)'"
              [style.color]="category===c?'white':'rgba(255,255,255,0.6)'">
              {{ c || 'Toutes' }}
            </button>
          }
          @for (g of GENDERS; track g.v) {
            <button (click)="setGender(g.v)"
              class="px-4 py-2 rounded-full border text-sm transition-colors"
              [style.borderColor]="gender===g.v?'#D4AF37':'rgba(255,255,255,0.15)'"
              [style.color]="gender===g.v?'#D4AF37':'rgba(255,255,255,0.6)'">{{ g.l }}</button>
          }
        </div>

        @if (loading()) {
          <div class="text-white/40 text-center py-20">Chargement…</div>
        } @else if (page_items().length === 0) {
          <div class="text-white/40 text-center py-20">Aucun athlète.</div>
        } @else {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            @for (a of page_items(); track a.id) {
              <a [routerLink]="['/athletes', a.id]" class="group block">
                <div class="relative aspect-[3/4] overflow-hidden mb-4 bg-[#1a0000]">
                  <div class="w-full h-full flex items-center justify-center">
                    <span class="font-serif text-5xl text-white/20">{{ initials(a) }}</span>
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div class="absolute top-3 left-3 text-[10px] tracking-[0.2em] uppercase text-gold">{{ a.categorie?.toLowerCase() }}</div>
                  <div class="absolute bottom-4 left-4 right-4">
                    <div class="font-serif text-lg">{{ a.prenom }} {{ a.nom }}</div>
                    <div class="text-xs text-white/50 mt-1">{{ a.nationalite }}</div>
                  </div>
                </div>
              </a>
            }
          </div>
        }
        <app-pagination [page]="page" [total]="filtered().length" [pageSize]="12" (pageChange)="onPage($event)" />
      </section>
    </app-page-layout>
  `
})
export class AthletesListComponent implements OnInit {
  readonly all = signal<any[]>([]);
  readonly loading = signal(false);
  search = ''; category = ''; gender = ''; page = 1;
  readonly CATS = CATS; readonly GENDERS = GENDERS;

  readonly filtered = computed(() => {
    const q = this.search.toLowerCase();
    return this.all().filter(a =>
      (!q || `${a.prenom} ${a.nom}`.toLowerCase().includes(q)) &&
      (!this.category || a.categorie === this.category) &&
      (!this.gender || a.sexe === this.gender)
    );
  });

  readonly page_items = computed(() => {
    const start = (this.page - 1) * 12;
    return this.filtered().slice(start, start + 12);
  });

  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.loading.set(true);
    this.api.get<any>('/athletes', { page: 0, size: 500 }).subscribe({
      next: r => { this.all.set(r?.data ?? r?.content ?? []); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  applyFilter(): void { this.page = 1; }
  setCategory(c: string): void { this.category = c; this.page = 1; }
  setGender(g: string): void { this.gender = g; this.page = 1; }
  onPage(p: number): void { this.page = p; }
  initials(a: any): string { return `${(a.prenom||'')[0]??''}${(a.nom||'')[0]??''}`.toUpperCase(); }
}

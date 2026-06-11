import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { PageLayoutComponent } from '../../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-clubs-list',
  template: `
    <app-page-layout>
      <section class="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <div class="flex items-center gap-4 mb-6">
              <span class="h-px w-10 bg-accent"></span>
              <span class="text-xs tracking-[0.3em] uppercase text-white/70">Clubs</span>
            </div>
            <h1 class="font-serif text-5xl lg:text-7xl leading-[0.95]">
              Les clubs <br/><span class="italic text-gold">affiliés.</span>
            </h1>
          </div>
          <a routerLink="/athletes" class="px-5 py-2.5 rounded-full border border-white/20 hover:border-white text-sm transition-colors">← Athlètes</a>
        </div>
        <div class="flex mb-10 pb-8 border-b border-white/10">
          <input type="text" placeholder="Rechercher un club…" [(ngModel)]="search"
            class="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm placeholder:text-white/30 focus:outline-none" />
        </div>
        @if (loading()) {
          <div class="text-white/40 text-center py-20">Chargement…</div>
        } @else {
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (c of filtered(); track c.id) {
              <a [routerLink]="['/athletes/clubs', c.id]"
                class="group block p-6 border border-white/10 hover:border-white/30 rounded-lg hover:bg-white/[0.02] transition-all">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-14 h-14 rounded-full bg-[#1a0000] border border-white/10 flex items-center justify-center font-serif text-xl text-white/30">
                    {{ c.nom?.[0] || '?' }}
                  </div>
                  <span class="text-lg opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
                <h3 class="font-serif text-xl mb-2">{{ c.nom }}</h3>
                <div class="text-sm text-white/50">{{ joinArr([c.ville, c.region]) }}</div>
                @if (c.presidentNom) { <div class="text-xs text-white/30 mt-2">Pdt : {{ c.presidentNom }}</div> }
                <div class="mt-3 text-xs" [style.color]="c.actif ? '#10B981' : '#6B7280'">{{ c.actif ? 'Actif' : 'Inactif' }}</div>
              </a>
            }
            @empty { <div class="col-span-3 text-white/40 text-center py-10">Aucun club.</div> }
          </div>
        }
      </section>
    </app-page-layout>
  `
})
export class ClubsListComponent implements OnInit {
  readonly clubs = signal<any[]>([]);
  readonly loading = signal(false);
  search = '';

  get filtered() { return () => this.clubs().filter(c => !this.search || c.nom?.toLowerCase().includes(this.search.toLowerCase())); }

  joinArr(arr: (string|undefined)[]): string { return arr.filter(Boolean).join(' · '); }

  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.loading.set(true);
    this.api.get<any>('/clubs', { page:0, size:100 }).subscribe({
      next: r => { this.clubs.set(r?.data ?? r?.content ?? (Array.isArray(r)?r:[])); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}

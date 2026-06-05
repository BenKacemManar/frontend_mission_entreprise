import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-forum-home',
  standalone: true,
  imports: [CommonModule, RouterLink, PageLayoutComponent],
  template: `
    <app-page-layout>
      <section class="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <div class="mb-12">
          <div class="flex items-center gap-4 mb-6">
            <span class="h-px w-10 bg-accent"></span>
            <span class="text-xs tracking-[0.3em] uppercase text-white/70">Forum</span>
          </div>
          <h1 class="font-serif text-5xl lg:text-7xl leading-[0.95]">
            Discussions <br/><span class="italic text-gold">& échanges.</span>
          </h1>
        </div>
        @if (loading()) {
          <div class="text-white/40 text-center py-20">Chargement…</div>
        } @else if (categories().length === 0) {
          <div class="text-white/40 text-center py-20">Aucune catégorie de forum.</div>
        } @else {
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (cat of categories(); track cat.id) {
              <a [routerLink]="['/forum', cat.id]"
                class="group block p-6 border border-white/10 hover:border-white/30 rounded-lg hover:bg-white/[0.02] transition-all">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background:rgba(225,6,0,0.1)">
                    <span class="text-accent text-xl">💬</span>
                  </div>
                  <span class="opacity-0 group-hover:opacity-100 transition-opacity text-lg">→</span>
                </div>
                <h3 class="font-serif text-xl mb-2">{{ cat.nom }}</h3>
                <p class="text-sm text-white/50 mb-4 line-clamp-2">{{ cat.description }}</p>
                <div class="flex items-center gap-4 text-xs text-white/30">
                  <span>{{ cat.nbSujets || 0 }} sujets</span>
                  <span class="px-2 py-0.5 rounded-full border border-white/10">{{ cat.categorie?.toLowerCase() }}</span>
                </div>
              </a>
            }
          </div>
        }
      </section>
    </app-page-layout>
  `
})
export class ForumHomeComponent implements OnInit {
  readonly categories = signal<any[]>([]);
  readonly loading = signal(false);

  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.loading.set(true);
    this.api.get<any>('/forums').subscribe({
      next: r => { this.categories.set(Array.isArray(r)?r:(r?.data??[])); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}

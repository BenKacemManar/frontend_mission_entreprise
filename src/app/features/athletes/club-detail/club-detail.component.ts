import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { forkJoin, catchError, of } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-club-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, PageLayoutComponent],
  template: `
    <app-page-layout>
      <section class="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <a routerLink="/athletes/clubs" class="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-12 transition-colors">← Retour aux clubs</a>
        @if (loading()) {
          <div class="text-white/40 text-center py-20">Chargement…</div>
        } @else if (!club()) {
          <div class="text-white/40 text-center py-20">Club introuvable.</div>
        } @else {
          <div class="grid lg:grid-cols-12 gap-12 mb-16">
            <div class="lg:col-span-3">
              <div class="aspect-square bg-[#1a0000] border border-white/10 rounded-lg flex items-center justify-center">
                <span class="font-serif text-7xl text-white/20">{{ club().nom?.[0] || '?' }}</span>
              </div>
            </div>
            <div class="lg:col-span-9">
              <h1 class="font-serif text-4xl lg:text-6xl mb-6">{{ club().nom }}</h1>
              <div class="grid grid-cols-2 lg:grid-cols-3 gap-6">
                @for (info of infos(); track info.label) {
                  <div class="border-l-2 border-accent pl-4">
                    <div class="text-xs tracking-[0.2em] uppercase text-white/40 mb-1">{{ info.label }}</div>
                    <div class="text-sm">{{ info.value }}</div>
                  </div>
                }
              </div>
            </div>
          </div>
          @if (athletes().length > 0) {
            <div class="border-t border-white/10 pt-10">
              <h2 class="font-serif text-3xl mb-8">Athlètes <span class="text-gold">({{ athletes().length }})</span></h2>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                @for (a of athletes(); track a.id) {
                  <a [routerLink]="['/athletes', a.id]"
                    class="flex items-center gap-3 p-3 border border-white/10 rounded-lg hover:border-white/30 hover:bg-white/[0.02] transition-all">
                    <div class="w-10 h-10 rounded-full bg-[#1a0000] flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {{ initials(a) }}
                    </div>
                    <div class="min-w-0">
                      <div class="text-sm font-medium truncate">{{ a.prenom }} {{ a.nom }}</div>
                      <div class="text-xs text-white/40 truncate">{{ a.categorie?.toLowerCase() }}</div>
                    </div>
                  </a>
                }
              </div>
            </div>
          }
        }
      </section>
    </app-page-layout>
  `
})
export class ClubDetailComponent implements OnInit {
  readonly club = signal<any>(null);
  readonly athletes = signal<any[]>([]);
  readonly loading = signal(true);

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    forkJoin([
      this.api.get<any>(`/clubs/${id}`),
      this.api.get<any>(`/clubs/${id}/athletes`).pipe(catchError(() => of(null)))
    ]).subscribe({
      next: ([c, a]) => {
        this.club.set(c?.data ?? c);
        this.athletes.set(Array.isArray(a) ? a : (a?.data ?? []));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  infos() {
    const c = this.club();
    return [
      { label:'Ville', value: c.ville||'—' },
      { label:'Région', value: c.region||'—' },
      { label:'Président', value: c.presidentNom||'—' },
      { label:'Affiliation', value: c.dateAffiliation ? new Date(c.dateAffiliation).toLocaleDateString('fr-FR') : '—' },
      { label:'Statut', value: c.actif ? 'Actif' : 'Inactif' },
    ];
  }

  initials(a: any): string { return `${(a.prenom||'')[0]??''}${(a.nom||'')[0]??''}`.toUpperCase(); }
}

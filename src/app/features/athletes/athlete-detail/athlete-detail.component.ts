import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { catchError, of } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-athlete-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, PageLayoutComponent, StatusBadgeComponent],
  template: `
    <app-page-layout>
      <section class="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <a routerLink="/athletes" class="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-12 transition-colors">← Retour aux athlètes</a>
        @if (loading()) {
          <div class="text-white/40 text-center py-20">Chargement…</div>
        } @else if (!athlete()) {
          <div class="text-white/40 text-center py-20">Athlète introuvable.</div>
        } @else {
          <div class="grid lg:grid-cols-12 gap-12 mb-16">
            <div class="lg:col-span-3">
              <div class="aspect-square bg-[#1a0000] border border-white/10 rounded-lg flex items-center justify-center">
                <span class="font-serif text-7xl text-white/20">{{ initials() }}</span>
              </div>
            </div>
            <div class="lg:col-span-9">
              <div class="flex items-center gap-4 mb-4">
                <span class="text-xs tracking-[0.2em] uppercase px-3 py-1 rounded-full border border-accent text-accent">{{ athlete().categorie?.toLowerCase() }}</span>
                <span class="text-xs text-white/40">{{ athlete().sexe === 'MASCULIN' ? 'Homme' : 'Femme' }}</span>
              </div>
              <h1 class="font-serif text-4xl lg:text-6xl mb-4">{{ athlete().prenom }} {{ athlete().nom }}</h1>
              <div class="text-white/50 text-lg mb-8">{{ athlete().nationalite }}</div>
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                @for (info of infos(); track info.label) {
                  <div class="border-l-2 border-accent pl-4">
                    <div class="text-xs tracking-[0.2em] uppercase text-white/40 mb-1">{{ info.label }}</div>
                    <div class="text-sm">{{ info.value }}</div>
                  </div>
                }
              </div>
              @if (auth.hasRole('ADMIN')) {
                <div class="mt-8">
                  <a [routerLink]="['/admin/athletes', id, 'edit']" class="px-5 py-2.5 rounded-full border border-white/20 hover:border-white text-sm transition-colors">Modifier</a>
                </div>
              }
            </div>
          </div>
          @if (licences().length > 0) {
            <div class="border-t border-white/10 pt-10">
              <h2 class="font-serif text-3xl mb-8">Licences</h2>
              <div class="grid gap-4 max-w-2xl">
                @for (lic of licences(); track lic.id) {
                  <div class="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                    <div>
                      <div class="font-medium">{{ lic.numero || '#' + lic.id }}</div>
                      <div class="text-xs text-white/40 mt-1">{{ lic.type }} · {{ fmtDate(lic.dateDebut) }} — {{ fmtDate(lic.dateExpiration) }}</div>
                    </div>
                    <app-status-badge [status]="lic.statut || 'EN_ATTENTE'" />
                  </div>
                }
              </div>
            </div>
          }
        }
      </section>
    </app-page-layout>
  `
})
export class AthleteDetailComponent implements OnInit {
  readonly athlete = signal<any>(null);
  readonly licences = signal<any[]>([]);
  readonly loading = signal(true);
  id = '';

  constructor(private api: ApiService, private route: ActivatedRoute, readonly auth: AuthService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    forkJoin([
      this.api.get<any>(`/athletes/${this.id}`),
      this.api.get<any>(`/athletes/${this.id}/licences`).pipe(catchError(() => of(null)))
    ]).subscribe({
      next: ([a, l]) => {
        this.athlete.set(a?.data ?? a);
        this.licences.set(Array.isArray(l) ? l : (l?.data ?? []));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  initials(): string {
    const a = this.athlete();
    return `${(a?.prenom||'')[0]??''}${(a?.nom||'')[0]??''}`.toUpperCase();
  }

  infos() {
    const a = this.athlete();
    return [
      { label:'Naissance', value: this.fmtDate(a.dateNaissance) },
      { label:'Club', value: a.clubNom || '—' },
      { label:'Email', value: a.email || '—' },
      { label:'Téléphone', value: a.telephone || '—' },
    ];
  }

  fmtDate(d?: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' });
  }
}

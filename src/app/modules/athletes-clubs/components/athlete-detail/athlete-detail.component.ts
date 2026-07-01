import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, catchError, of } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';

const STATUT_COLORS: Record<string, string> = {
  VALIDE:     'color:#86efac;background:rgba(34,197,94,0.1);border-color:rgba(34,197,94,0.3)',
  EN_ATTENTE: 'color:rgba(255,255,255,0.5);background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.15)',
  REJETE:     'color:#fca5a5;background:rgba(239,68,68,0.1);border-color:rgba(239,68,68,0.3)',
  DISQUALIFIE:'color:#fca5a5;background:rgba(239,68,68,0.1);border-color:rgba(239,68,68,0.3)',
};

const STATUT_LABELS: Record<string, string> = {
  VALIDE: 'Validé',
  EN_ATTENTE: 'En attente',
  REJETE: 'Rejeté',
  DISQUALIFIE: 'Disqualifié',
};

@Component({
  selector: 'app-athlete-detail',
  template: `
    <app-page-layout>
      @if (loading()) {
        <div class="text-white/40 text-center py-40">Chargement…</div>
      } @else if (!athlete()) {
        <div class="text-white/40 text-center py-40">Athlète introuvable.</div>
      } @else {

        <!-- Hero -->
        <div class="relative border-b border-white/10 bg-[#0d0000]/60">
          <div class="mx-auto max-w-[1400px] px-6 lg:px-10 py-12">
            <a routerLink="/athletes"
              class="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">
              ← Retour aux athlètes
            </a>
            <div class="flex flex-wrap items-start gap-8 mb-8">
              <div class="w-20 h-20 rounded-full bg-[#1a0000] border border-white/10 flex items-center justify-center flex-shrink-0">
                <span class="font-serif text-2xl text-white/40">{{ initials() }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-3 mb-2">
                  @if (athlete().categorie) {
                    <span class="px-3 py-1 rounded-full text-xs border border-accent text-accent">
                      {{ athlete().categorie | lowercase }}
                    </span>
                  }
                  <span class="text-xs text-white/40">
                    {{ athlete().sexe === 'MASCULIN' ? 'Homme' : 'Femme' }}
                  </span>
                </div>
                <h1 class="font-serif text-3xl lg:text-5xl mb-2">
                  {{ athlete().prenom }} {{ athlete().nom }}
                </h1>
                @if (athlete().nationalite) {
                  <div class="text-white/50">{{ athlete().nationalite }}</div>
                }
              </div>
              @if (auth.hasRole('ADMIN')) {
                <a [routerLink]="['/admin/athletes', id, 'edit']"
                  class="px-5 py-2.5 rounded-full border border-white/20 hover:border-white text-sm transition-colors self-start">
                  Modifier
                </a>
              }
            </div>

            <!-- Stat cards -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div class="bg-white/[0.03] border border-white/10 rounded-lg p-4">
                <div class="text-2xl font-serif text-gold mb-1">{{ age() ?? '—' }}</div>
                <div class="text-xs text-white/50">Ans</div>
              </div>
              <div class="bg-white/[0.03] border border-white/10 rounded-lg p-4">
                @if (athlete().clubId) {
                  <a [routerLink]="['/athletes/clubs', athlete().clubId]"
                    class="text-sm font-medium hover:text-accent transition-colors line-clamp-1">
                    {{ athlete().clubNom || '—' }}
                  </a>
                } @else {
                  <div class="text-sm font-medium">{{ athlete().clubNom || '—' }}</div>
                }
                <div class="text-xs text-white/50 mt-1">Club</div>
              </div>
              <div class="bg-white/[0.03] border border-white/10 rounded-lg p-4">
                <div class="text-2xl font-serif text-gold mb-1">{{ results().length }}</div>
                <div class="text-xs text-white/50">Résultats</div>
              </div>
            </div>
          </div>
        </div>

        <div class="mx-auto max-w-[1400px] px-6 lg:px-10 py-10 space-y-12">

          <!-- Personal info -->
          <section>
            <h2 class="font-serif text-2xl mb-6">Informations</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              @for (info of infos(); track info.label) {
                <div class="border-l-2 border-accent pl-4">
                  <div class="text-xs tracking-[0.2em] uppercase text-white/40 mb-1">{{ info.label }}</div>
                  <div class="text-sm">{{ info.value }}</div>
                </div>
              }
            </div>
          </section>

          <!-- Licences -->
          @if (licences().length > 0) {
            <section>
              <h2 class="font-serif text-2xl mb-6">Licences</h2>
              <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                @for (lic of licences(); track lic.id) {
                  <div class="border border-white/10 rounded-xl p-5 bg-white/[0.02]">
                    <div class="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div class="font-medium">{{ lic.numero || '#' + lic.id }}</div>
                        <div class="text-xs text-white/40 mt-1">{{ lic.type }}</div>
                      </div>
                      <span class="inline-block px-2.5 py-1 rounded-full text-xs border"
                        [style]="statutStyle(lic.statut)">
                        {{ statutLabel(lic.statut) }}
                      </span>
                    </div>
                    <div class="text-xs text-white/40">
                      {{ fmtDate(lic.dateDebut) }} — {{ fmtDate(lic.dateExpiration) }}
                    </div>
                  </div>
                }
              </div>
            </section>
          }

          <!-- Results -->
          @if (results().length > 0) {
            <section>
              <h2 class="font-serif text-2xl mb-6">
                Résultats en compétition
                <span class="text-white/30 text-lg font-sans ml-2">({{ results().length }})</span>
              </h2>
              <div class="border border-white/10 rounded-lg overflow-hidden">
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-white/10 bg-white/[0.02]">
                      <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-5 py-3">Compétition</th>
                      <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-5 py-3 hidden sm:table-cell">Épreuve</th>
                      <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-5 py-3">Temps</th>
                      <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-5 py-3 hidden md:table-cell">Rang</th>
                      <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-5 py-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (r of results(); track r.id) {
                      <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td class="px-5 py-4">
                          <div class="text-sm font-medium">{{ r.competitionNom }}</div>
                        </td>
                        <td class="px-5 py-4 hidden sm:table-cell">
                          <span class="text-sm text-white/70">{{ r.epreuve || '—' }}</span>
                        </td>
                        <td class="px-5 py-4">
                          <span class="font-mono text-sm text-gold">{{ r.temps || '—' }}</span>
                        </td>
                        <td class="px-5 py-4 hidden md:table-cell">
                          @if (r.rang) {
                            <span class="font-serif text-lg">{{ r.rang }}</span>
                            <span class="text-xs text-white/40 ml-1">e</span>
                          } @else {
                            <span class="text-white/30">—</span>
                          }
                        </td>
                        <td class="px-5 py-4">
                          <span class="inline-block px-2.5 py-1 rounded-full text-xs border"
                            [style]="statutStyle(r.statut)">
                            {{ statutLabel(r.statut) }}
                          </span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>
          }

        </div>
      }
    </app-page-layout>
  `
})
export class AthleteDetailComponent implements OnInit {
  readonly athlete = signal<any>(null);
  readonly licences = signal<any[]>([]);
  readonly results = signal<any[]>([]);
  readonly loading = signal(true);
  id = '';

  readonly age = computed(() => {
    const dob = this.athlete()?.dateNaissance;
    if (!dob) return null;
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  });

  constructor(private api: ApiService, private route: ActivatedRoute, readonly auth: AuthService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    forkJoin([
      this.api.get<any>(`/athletes/${this.id}`),
      this.api.get<any>(`/athletes/${this.id}/licences`).pipe(catchError(() => of([]))),
      this.api.get<any>(`/resultats/athlete/${this.id}`).pipe(catchError(() => of([]))),
    ]).subscribe({
      next: ([a, l, r]) => {
        this.athlete.set(a?.data ?? a);
        this.licences.set(Array.isArray(l) ? l : (l?.data ?? []));
        this.results.set(Array.isArray(r) ? r : (r?.data ?? []));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  initials(): string {
    const a = this.athlete();
    return `${(a?.prenom ?? '')[0] ?? ''}${(a?.nom ?? '')[0] ?? ''}`.toUpperCase();
  }

  infos() {
    const a = this.athlete();
    return [
      { label: 'Naissance', value: this.fmtDate(a.dateNaissance) },
      { label: 'Nationalité', value: a.nationalite || '—' },
      { label: 'Email', value: a.email || '—' },
      { label: 'Téléphone', value: a.telephone || '—' },
    ];
  }

  fmtDate(d?: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  statutStyle(statut?: string): string {
    return STATUT_COLORS[statut ?? ''] ?? STATUT_COLORS['EN_ATTENTE'];
  }

  statutLabel(statut?: string): string {
    return STATUT_LABELS[statut ?? ''] ?? (statut ?? '—');
  }
}

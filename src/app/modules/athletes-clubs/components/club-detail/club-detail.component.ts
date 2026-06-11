import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, catchError, of } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';

const POSTE_LABELS: Record<string, string> = {
  ENTRAINEUR_CHEF: 'Entraîneur chef',
  ENTRAINEUR_ADJOINT: 'Entraîneur adjoint',
  ARBITRE: 'Arbitre',
  MEDECIN: 'Médecin',
  KINE: 'Kinésithérapeute',
  DIRECTEUR_TECHNIQUE: 'Directeur technique',
  CHRONOMETREUR: 'Chronométreur',
};

const TAB_ACTIVE   = 'px-5 py-3 text-sm transition-colors relative text-white';
const TAB_INACTIVE = 'px-5 py-3 text-sm transition-colors relative text-white/40';
const PILL_ACTIVE  = 'px-4 py-2 rounded-full text-sm transition-colors bg-accent text-white';
const PILL_OFF     = 'px-4 py-2 rounded-full text-sm transition-colors border border-white/20 text-white/60 hover:border-white/40 hover:text-white';

@Component({
  selector: 'app-club-detail',
  template: `
    <app-page-layout>
      @if (loading()) {
        <div class="text-white/40 text-center py-40">Chargement…</div>
      } @else if (!club()) {
        <div class="text-white/40 text-center py-40">Club introuvable.</div>
      } @else {

        <!-- Hero -->
        <div class="relative border-b border-white/10 bg-[#0d0000]/60">
          <div class="mx-auto max-w-[1400px] px-6 lg:px-10 py-12">
            <a routerLink="/athletes/clubs"
              class="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">
              ← Retour aux clubs
            </a>
            <div class="flex flex-wrap items-start gap-8 mb-8">
              <div class="w-20 h-20 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
                <span class="font-serif text-3xl text-accent">{{ club().nom?.[0] || '?' }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-3 mb-2">
                  <h1 class="font-serif text-3xl lg:text-5xl">{{ club().nom }}</h1>
                  <span class="px-3 py-1 rounded-full text-xs border"
                    [style.borderColor]="club().actif ? '#22c55e66' : '#ffffff22'"
                    [style.color]="club().actif ? '#86efac' : 'rgba(255,255,255,0.4)'">
                    {{ club().actif ? 'Actif' : 'Inactif' }}
                  </span>
                </div>
                <div class="text-white/50 text-sm">
                  {{ club().ville || '—' }}
                  @if (club().region) { · {{ club().region }} }
                  @if (club().presidentNom) { · Président : {{ club().presidentNom }} }
                </div>
              </div>
            </div>

            <!-- Stat cards -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-white/[0.03] border border-white/10 rounded-lg p-4">
                <div class="text-2xl font-serif text-gold mb-1">{{ athletes().length }}</div>
                <div class="text-xs text-white/50">Athlètes</div>
              </div>
              <div class="bg-white/[0.03] border border-white/10 rounded-lg p-4">
                <div class="text-2xl font-serif text-gold mb-1">{{ maleCount() }} / {{ femaleCount() }}</div>
                <div class="text-xs text-white/50">H / F</div>
              </div>
              <div class="bg-white/[0.03] border border-white/10 rounded-lg p-4">
                <div class="text-2xl font-serif text-gold mb-1">{{ catCounts().length }}</div>
                <div class="text-xs text-white/50">Catégories</div>
              </div>
              <div class="bg-white/[0.03] border border-white/10 rounded-lg p-4">
                <div class="text-sm font-medium mb-1">{{ fmtDate(club().dateAffiliation) }}</div>
                <div class="text-xs text-white/50">Affiliation</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs + Content -->
        <div class="mx-auto max-w-[1400px] px-6 lg:px-10 py-10">

          <!-- Tab bar -->
          <div class="flex gap-1 mb-8 border-b border-white/10">
            <button (click)="tab.set('membres')" [class]="tab() === 'membres' ? TAB_ACTIVE : TAB_INACTIVE">
              Membres <span class="text-white/30">({{ athletes().length }})</span>
              @if (tab() === 'membres') {
                <span class="absolute bottom-0 inset-x-0 h-px bg-accent"></span>
              }
            </button>
            <button (click)="tab.set('staff')" [class]="tab() === 'staff' ? TAB_ACTIVE : TAB_INACTIVE">
              Staff technique <span class="text-white/30">({{ staff().length }})</span>
              @if (tab() === 'staff') {
                <span class="absolute bottom-0 inset-x-0 h-px bg-accent"></span>
              }
            </button>
          </div>

          <!-- Membres tab -->
          @if (tab() === 'membres') {
            <div class="flex flex-wrap gap-3 mb-6">
              <input type="text" placeholder="Rechercher un athlète…"
                [value]="search()"
                (input)="search.set($any($event.target).value)"
                class="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30" />
              <button (click)="catFilter.set('')" [class]="catFilter() === '' ? PILL_ACTIVE : PILL_OFF">Tout</button>
              @for (cc of catCounts(); track cc.cat) {
                <button (click)="catFilter.set(cc.cat)" [class]="catFilter() === cc.cat ? PILL_ACTIVE : PILL_OFF">
                  {{ cc.cat | lowercase }} ({{ cc.n }})
                </button>
              }
            </div>

            @if (filteredAthletes().length === 0) {
              <div class="text-white/30 text-center py-16 text-sm">Aucun athlète correspondant.</div>
            } @else {
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                @for (a of filteredAthletes(); track a.id) {
                  <a [routerLink]="['/athletes', a.id]"
                    class="group flex flex-col items-center gap-3 p-4 border border-white/10 rounded-xl hover:border-accent/40 hover:bg-accent/[0.04] transition-all text-center">
                    <div class="w-12 h-12 rounded-full bg-[#1a0000] border border-white/10 group-hover:border-accent/30 flex items-center justify-center text-sm font-medium transition-colors">
                      {{ initials(a) }}
                    </div>
                    <div class="min-w-0 w-full">
                      <div class="text-sm font-medium truncate">{{ a.prenom }} {{ a.nom }}</div>
                      <div class="text-xs text-white/40 mt-0.5">{{ a.categorie | lowercase }}</div>
                      @if (a.nationalite) {
                        <div class="text-xs text-white/30 mt-0.5">{{ a.nationalite }}</div>
                      }
                    </div>
                  </a>
                }
              </div>
            }
          }

          <!-- Staff tab -->
          @if (tab() === 'staff') {
            @if (staff().length === 0) {
              <div class="text-white/30 text-center py-16 text-sm">Aucun membre du staff pour ce club.</div>
            } @else {
              <div class="border border-white/10 rounded-lg overflow-hidden">
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-white/10 bg-white/[0.02]">
                      <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-5 py-3">Membre</th>
                      <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-5 py-3">Poste</th>
                      <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-5 py-3 hidden md:table-cell">Compétition</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (s of staff(); track s.id) {
                      <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td class="px-5 py-4">
                          <div class="font-medium text-sm">{{ s.userNom }}</div>
                          <div class="text-xs text-white/40 mt-0.5">{{ s.userEmail }}</div>
                        </td>
                        <td class="px-5 py-4">
                          <span class="inline-block px-3 py-1 rounded-full text-xs border border-accent/30 text-accent/80 bg-accent/[0.07]">
                            {{ posteLabel(s.poste) }}
                          </span>
                        </td>
                        <td class="px-5 py-4 hidden md:table-cell">
                          <span class="text-sm text-white/60">{{ s.competitionNom }}</span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          }

        </div>
      }
    </app-page-layout>
  `
})
export class ClubDetailComponent implements OnInit {
  readonly club = signal<any>(null);
  readonly athletes = signal<any[]>([]);
  readonly staff = signal<any[]>([]);
  readonly loading = signal(true);
  readonly tab = signal<'membres' | 'staff'>('membres');
  readonly search = signal('');
  readonly catFilter = signal('');

  readonly TAB_ACTIVE   = TAB_ACTIVE;
  readonly TAB_INACTIVE = TAB_INACTIVE;
  readonly PILL_ACTIVE  = PILL_ACTIVE;
  readonly PILL_OFF     = PILL_OFF;

  readonly maleCount   = computed(() => this.athletes().filter(a => a.sexe === 'MASCULIN').length);
  readonly femaleCount = computed(() => this.athletes().filter(a => a.sexe === 'FEMININ').length);

  readonly catCounts = computed(() => {
    const counts: Record<string, number> = {};
    for (const a of this.athletes()) {
      const cat = a.categorie ?? 'AUTRE';
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
    return Object.entries(counts).map(([cat, n]) => ({ cat, n }));
  });

  readonly filteredAthletes = computed(() => {
    let list = this.athletes();
    const s = this.search().toLowerCase();
    if (s) list = list.filter(a => `${a.prenom ?? ''} ${a.nom ?? ''}`.toLowerCase().includes(s));
    const cat = this.catFilter();
    if (cat) list = list.filter(a => a.categorie === cat);
    return list;
  });

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    forkJoin([
      this.api.get<any>(`/clubs/${id}`),
      this.api.get<any>(`/clubs/${id}/athletes`).pipe(catchError(() => of([]))),
      this.api.get<any>(`/clubs/${id}/staff`).pipe(catchError(() => of([]))),
    ]).subscribe({
      next: ([c, a, s]) => {
        this.club.set(c?.data ?? c);
        this.athletes.set(Array.isArray(a) ? a : (a?.data ?? []));
        this.staff.set(Array.isArray(s) ? s : (s?.data ?? []));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  initials(a: any): string {
    return `${(a.prenom ?? '')[0] ?? ''}${(a.nom ?? '')[0] ?? ''}`.toUpperCase();
  }

  posteLabel(value: string): string {
    return POSTE_LABELS[value] ?? value;
  }

  fmtDate(d?: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  }
}

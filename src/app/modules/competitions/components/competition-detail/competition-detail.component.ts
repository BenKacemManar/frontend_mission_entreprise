import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PageLayoutComponent } from '../../../../shared/components/page-layout/page-layout.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

const STATUT_MAP: Record<string, string> = {
  A_VENIR: 'upcoming',
  EN_COURS: 'ongoing',
  TERMINE: 'finished',
  TERMINEE: 'finished',
  ANNULE: 'cancelled',
  ANNULEE: 'cancelled',
  PLANIFIEE: 'upcoming',
};

@Component({
  selector: 'app-competition-detail',
  template: `
    <app-page-layout>
      <section class="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <a routerLink="/competitions" class="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-12 transition-colors">
          ← Retour aux compétitions
        </a>
        @if (loading()) {
          <div class="text-white/40 text-center py-20">Chargement…</div>
        } @else if (!comp()) {
          <div class="text-white/40 text-center py-20">Compétition introuvable.</div>
        } @else {
          <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-12">
            <div>
              <div class="flex items-center gap-4 mb-4">
                <app-status-badge [status]="comp().status" />
                <span class="text-xs tracking-[0.2em] uppercase text-white/40">{{ comp().type }}</span>
              </div>
              <h1 class="font-serif text-4xl lg:text-6xl leading-tight">{{ comp().nom || comp().name }}</h1>
              <div class="mt-4 text-white/50">{{ fmtDate(comp().dateDebut || comp().startDate) }} — {{ fmtDate(comp().dateFin || comp().endDate) }}</div>
            </div>
            @if (auth.hasRole('ADMIN') || auth.hasRole('COACH')) {
              <a [routerLink]="['/competitions', id, 'edit']"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 hover:border-white text-sm transition-colors">
                ✏ Modifier
              </a>
            }
          </div>

          <div class="grid lg:grid-cols-3 gap-6 mb-16">
            @for (info of infos(); track info.label) {
              <div class="border-l-2 border-accent pl-4">
                <div class="text-xs tracking-[0.2em] uppercase text-white/40 mb-1">{{ info.label }}</div>
                <div class="text-lg">{{ info.value }}</div>
              </div>
            }
          </div>

          <!-- Épreuves + Inscriptions -->
          <div class="border-t border-white/10 pt-10">
            <div class="flex items-center justify-between mb-8">
              <h2 class="font-serif text-3xl">Épreuves</h2>
              @if (auth.hasRole('ADMIN') || auth.hasRole('COACH')) {
                <a [routerLink]="['/competitions', id, 'events', 'new']"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-sm hover:bg-white hover:text-black transition-colors">
                  + Ajouter
                </a>
              }
            </div>

            @if (events().length === 0) {
              <div class="text-white/40 py-10 text-center">Aucune épreuve pour cette compétition.</div>
            } @else {
              <div class="space-y-2">
                @for (ev of events(); track ev.id) {
                  <div class="border border-white/10 rounded-lg overflow-hidden">
                    <!-- Header épreuve -->
                    <div class="grid grid-cols-12 items-center py-4 px-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                      (click)="toggleEpreuve(ev.id)">
                      <div class="col-span-4 font-medium">{{ ev.distance }}m {{ ev.swimStyle }}</div>
                      <div class="col-span-2 text-sm text-white/50">{{ ev.gender === 'M' ? 'Messieurs' : 'Dames' }}</div>
                      <div class="col-span-2 text-sm text-white/50">{{ ev.ageCategory || '—' }}</div>
                      <div class="col-span-2"><app-status-badge [status]="ev.status" /></div>
                      <div class="col-span-2 flex items-center justify-end gap-3">
                        @if (auth.isLoggedIn() && !auth.hasRole('ADMIN')) {
                          @if (myInscriptions()[ev.id]) {
                            <app-status-badge [status]="myInscriptions()[ev.id].status" />
                          } @else {
                            <button (click)="$event.stopPropagation(); inscribeEpreuve(ev)"
                              [disabled]="inscribing() === ev.id"
                              class="px-3 py-1 rounded-full bg-accent/20 text-accent hover:bg-accent hover:text-white text-xs transition-colors disabled:opacity-50">
                              {{ inscribing() === ev.id ? '…' : "S'inscrire" }}
                            </button>
                          }
                        }
                        <span class="text-white/30 text-xs">{{ expandedEpreuve() === ev.id ? '▲' : '▼' }}</span>
                      </div>
                    </div>

                    <!-- Feedback inscription athlete -->
                    @if (inscriptionMsg()[ev.id]) {
                      <div class="px-4 pb-3 text-sm"
                        [class.text-green-400]="!inscriptionErr()[ev.id]"
                        [class.text-red-400]="inscriptionErr()[ev.id]">
                        {{ inscriptionMsg()[ev.id] }}
                      </div>
                    }

                    <!-- Queue (admin) ou position (athlete) -->
                    @if (expandedEpreuve() === ev.id) {
                      <div class="border-t border-white/10 bg-white/[0.02]">
                        @if (auth.hasRole('ADMIN')) {
                          @if (!epreuveInscriptions()[ev.id]) {
                            <div class="px-4 py-4 text-white/40 text-sm">Chargement…</div>
                          } @else if (epreuveInscriptions()[ev.id].length === 0) {
                            <div class="px-4 py-4 text-white/40 text-sm">Aucune inscription pour cette épreuve.</div>
                          } @else {
                            <table class="w-full text-sm">
                              <thead>
                                <tr class="border-b border-white/10">
                                  <th class="text-left text-xs text-white/40 px-4 py-2 w-12">#</th>
                                  <th class="text-left text-xs text-white/40 px-4 py-2">Athlète</th>
                                  <th class="text-left text-xs text-white/40 px-4 py-2 hidden md:table-cell">Temps</th>
                                  <th class="text-left text-xs text-white/40 px-4 py-2">Statut</th>
                                  <th class="px-4 py-2 w-28"></th>
                                </tr>
                              </thead>
                              <tbody>
                                @for (ins of epreuveInscriptions()[ev.id]; track ins.id) {
                                  <tr class="border-b border-white/5 hover:bg-white/[0.01]">
                                    <td class="px-4 py-2 text-white/40 font-mono">{{ ins.queuePosition ? '#'+ins.queuePosition : '—' }}</td>
                                    <td class="px-4 py-2">{{ ins.athletePrenom }} {{ ins.athleteNom }}</td>
                                    <td class="px-4 py-2 text-white/50 hidden md:table-cell">{{ ins.seedTime || '—' }}</td>
                                    <td class="px-4 py-2"><app-status-badge [status]="ins.status" /></td>
                                    <td class="px-4 py-2">
                                      @if (ins.status === 'EN_ATTENTE') {
                                        <div class="flex gap-1 justify-end">
                                          <button (click)="validateInscription(ins, ev.id)"
                                            class="px-2 py-0.5 rounded-full bg-green-600/20 text-green-400 hover:bg-green-600/40 text-xs transition-colors">Valider</button>
                                          <button (click)="cancelInscription(ins, ev.id)"
                                            class="px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 hover:bg-red-600/40 text-xs transition-colors">Annuler</button>
                                        </div>
                                      }
                                    </td>
                                  </tr>
                                }
                              </tbody>
                            </table>
                          }
                        } @else if (myInscriptions()[ev.id]) {
                          <div class="px-4 py-4 flex items-center gap-6">
                            <div>
                              <div class="text-xs text-white/40 mb-1">Votre statut</div>
                              <app-status-badge [status]="myInscriptions()[ev.id].status" />
                            </div>
                            @if (myInscriptions()[ev.id].status === 'EN_ATTENTE' && myInscriptions()[ev.id].queuePosition) {
                              <div>
                                <div class="text-xs text-white/40 mb-1">Position en file</div>
                                <div class="text-2xl font-serif text-gold">#{{ myInscriptions()[ev.id].queuePosition }}</div>
                              </div>
                            }
                            @if (myInscriptions()[ev.id].status === 'VALIDEE') {
                              <p class="text-sm text-green-400">Votre inscription a été validée !</p>
                            }
                            @if (myInscriptions()[ev.id].status === 'ANNULEE') {
                              <p class="text-sm text-red-400">Votre inscription a été annulée.</p>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        }
      </section>
    </app-page-layout>
  `
})
export class CompetitionDetailComponent implements OnInit {
  readonly comp = signal<any>(null);
  readonly events = signal<any[]>([]);
  readonly loading = signal(true);
  readonly expandedEpreuve = signal<number | null>(null);
  readonly epreuveInscriptions = signal<Record<number, any[]>>({});
  readonly myInscriptions = signal<Record<number, any>>({});
  readonly inscribing = signal<number | null>(null);
  readonly inscriptionMsg = signal<Record<number, string>>({});
  readonly inscriptionErr = signal<Record<number, boolean>>({});
  id = '';

  constructor(private api: ApiService, private route: ActivatedRoute, readonly auth: AuthService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    forkJoin([
      this.api.get<any>(`/competitions/${this.id}`),
      this.api.get<any>(`/epreuves/competition/${this.id}`).pipe(catchError(() => of([])))
    ]).subscribe({
      next: ([c, evts]) => {
        const raw = c?.data ?? c;
        const statut = raw.statut ?? raw.status ?? '';
        this.comp.set({ ...raw, status: STATUT_MAP[statut] ?? statut });
        const evtList: any[] = Array.isArray(evts) ? evts : (evts as any)?.data ?? [];
        this.events.set(evtList);
        this.loading.set(false);
        if (this.auth.isLoggedIn() && !this.auth.hasRole('ADMIN')) this.loadMyInscriptions();
      },
      error: () => this.loading.set(false)
    });
  }

  loadMyInscriptions(): void {
    this.api.get<any>('/auth/me').pipe(
      catchError(() => of(null)),
      switchMap(me => {
        if (!me) return of([]);
        const user = me?.data ?? me;
        return this.api.get<any>('/athletes', { size: 200 }).pipe(
          catchError(() => of(null)),
          switchMap((athletes: any) => {
            const list: any[] = Array.isArray(athletes) ? athletes : (athletes?.data ?? []);
            const athlete = list.find((a: any) => a.userId === user.id);
            if (!athlete) return of([]);
            return this.api.get<any>(`/registrations/athlete/${athlete.id}`).pipe(
              catchError(() => of([]))
            );
          })
        );
      })
    ).subscribe((list: any) => {
      const inscriptions: any[] = Array.isArray(list) ? list : (list?.data ?? []);
      const map: Record<number, any> = {};
      inscriptions
        .filter((ins: any) => String(ins.competitionId) === String(this.id))
        .forEach((ins: any) => { map[Number(ins.eventId)] = ins; });
      this.myInscriptions.set(map);
    });
  }

  toggleEpreuve(epreuveId: number): void {
    if (this.expandedEpreuve() === epreuveId) {
      this.expandedEpreuve.set(null);
      return;
    }
    this.expandedEpreuve.set(epreuveId);
    if (this.auth.hasRole('ADMIN')) {
      this.loadEpreuveInscriptions(epreuveId);
    }
  }

  loadEpreuveInscriptions(epreuveId: number): void {
    this.api.get<any>(`/registrations/event/${epreuveId}`).subscribe({
      next: r => {
        const list: any[] = Array.isArray(r) ? r : (r?.data ?? []);
        this.epreuveInscriptions.update(m => ({ ...m, [epreuveId]: list }));
      },
      error: () => this.epreuveInscriptions.update(m => ({ ...m, [epreuveId]: [] }))
    });
  }

  inscribeEpreuve(ev: any): void {
    this.inscribing.set(Number(ev.id));
    this.inscriptionMsg.update(m => ({ ...m, [ev.id]: '' }));

    this.api.get<any>('/auth/me').pipe(
      switchMap(me => {
        const user = me?.data ?? me;
        return this.api.get<any>('/athletes', { size: 200 }).pipe(
          catchError(() => of(null)),
          switchMap((athletes: any) => {
            const list: any[] = Array.isArray(athletes) ? athletes : (athletes?.data ?? []);
            const athlete = list.find((a: any) => a.userId === user.id);
            if (!athlete) throw new Error("Profil athlète introuvable. Contactez un administrateur.");
            return this.api.post('/registrations', { athleteId: athlete.id, eventId: ev.id });
          })
        );
      })
    ).subscribe({
      next: (r: any) => {
        this.inscribing.set(null);
        const ins = r?.data ?? r;
        this.myInscriptions.update(m => ({ ...m, [Number(ev.id)]: ins }));
        this.inscriptionMsg.update(m => ({ ...m, [ev.id]: `Inscrit(e) ! Position #${ins.queuePosition ?? '?'} en file.` }));
        this.inscriptionErr.update(m => ({ ...m, [ev.id]: false }));
      },
      error: (e: any) => {
        this.inscribing.set(null);
        this.inscriptionMsg.update(m => ({ ...m, [ev.id]: e?.error?.message ?? e?.message ?? "Échec de l'inscription." }));
        this.inscriptionErr.update(m => ({ ...m, [ev.id]: true }));
      }
    });
  }

  validateInscription(ins: any, epreuveId: number): void {
    this.api.put(`/registrations/${ins.id}/validate`, {}).subscribe({
      next: () => this.loadEpreuveInscriptions(epreuveId)
    });
  }

  cancelInscription(ins: any, epreuveId: number): void {
    this.api.put(`/registrations/${ins.id}/cancel`, {}).subscribe({
      next: () => this.loadEpreuveInscriptions(epreuveId)
    });
  }

  infos() {
    const c = this.comp();
    return [
      { label: 'Type', value: c.type || '—' },
      { label: 'Bassin', value: c.lane || '—' },
      { label: 'Piscine', value: c.poolNom || '—' },
      { label: 'Catégories', value: c.ageCategories || '—' },
      { label: 'Participants', value: c.nbParticipants != null ? c.nbParticipants + ' inscrits' : '—' },
      { label: 'Inscription avant', value: this.fmtDate(c.registrationDeadline) },
    ];
  }

  fmtDate(d?: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  }
}

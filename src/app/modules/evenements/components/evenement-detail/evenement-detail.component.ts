import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { EVENEMENT_TYPE_LABELS } from '../../../../core/models/evenement.model';

@Component({
  selector: 'app-evenement-detail',
  template: `
    <app-page-layout>
      <section class="mx-auto max-w-[1100px] px-6 lg:px-10 py-16">
        <a routerLink="/evenements" class="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-12 transition-colors">
          ← Retour aux évènements
        </a>
        @if (loading()) {
          <div class="text-white/40 text-center py-20">Chargement…</div>
        } @else if (!evt()) {
          <div class="text-white/40 text-center py-20">Évènement introuvable.</div>
        } @else {
          <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">
            <div>
              <div class="flex items-center gap-4 mb-4">
                <app-status-badge [status]="evt().status" />
                <span class="text-xs tracking-[0.2em] uppercase text-gold">{{ typeLabel(evt().type) }}</span>
              </div>
              <h1 class="font-serif text-4xl lg:text-6xl leading-tight">{{ evt().titre }}</h1>
            </div>
            <div class="flex items-center gap-3">
              @if (evt().type === 'COMPETITION' && evt().competitionId) {
                <a [routerLink]="['/competitions', evt().competitionId]"
                  class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white hover:bg-white hover:text-black text-sm transition-colors">
                  Voir la compétition →
                </a>
              }
              @if (auth.hasRole('ADMIN')) {
                <a [routerLink]="['/admin/evenements', id, 'edit']"
                  class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 hover:border-white text-sm transition-colors">
                  ✏ Modifier
                </a>
              }
            </div>
          </div>

          <div class="grid lg:grid-cols-3 gap-6 mb-12">
            @for (info of infos(); track info.label) {
              <div class="border-l-2 border-accent pl-4">
                <div class="text-xs tracking-[0.2em] uppercase text-white/40 mb-1">{{ info.label }}</div>
                <div class="text-lg">{{ info.value }}</div>
              </div>
            }
          </div>

          @if (evt().description) {
            <div class="mb-14 max-w-3xl">
              <p class="text-white/70 leading-relaxed whitespace-pre-line">{{ evt().description }}</p>
            </div>
          }

          <!-- Inscription / participation -->
          <div class="border-t border-white/10 pt-10">
            <h2 class="font-serif text-3xl mb-6">Participation</h2>

            @if (!auth.isLoggedIn()) {
              <p class="text-white/50">
                <a routerLink="/auth/login" class="text-gold hover:underline">Connectez-vous</a> pour vous inscrire à cet évènement.
              </p>
            } @else if (myParticipation()) {
              <!-- Déjà inscrit -->
              <div class="max-w-2xl p-5 rounded-lg border border-white/10 bg-white/[0.03]">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-sm text-white/50 mb-1">Votre statut</div>
                    <app-status-badge [status]="myParticipation().status" />
                  </div>
                  @if (myParticipation().status === 'EN_ATTENTE' && myParticipation().queuePosition) {
                    <div class="text-right">
                      <div class="text-xs text-white/40 uppercase tracking-widest mb-1">Position en file</div>
                      <div class="text-3xl font-serif text-gold">#{{ myParticipation().queuePosition }}</div>
                    </div>
                  }
                </div>
                @if (myParticipation().status === 'EN_ATTENTE') {
                  <p class="mt-3 text-sm text-white/40">Votre demande est en attente de validation par un administrateur.</p>
                }
                @if (myParticipation().status === 'ACCEPTE') {
                  <p class="mt-3 text-sm text-green-400">Félicitations ! Votre participation a été acceptée.</p>
                }
                @if (myParticipation().status === 'REFUSE') {
                  <p class="mt-3 text-sm text-red-400">Votre demande de participation a été refusée.</p>
                }
              </div>
            } @else {
              <!-- Formulaire inscription -->
              @if (msg()) {
                <div class="mb-6 px-4 py-3 rounded-lg border text-sm"
                  [style.borderColor]="msgError() ? '#E10600' : '#10B981'"
                  [style.color]="msgError() ? '#E10600' : '#10B981'"
                  [style.background]="msgError() ? 'rgba(225,6,0,0.08)' : 'rgba(16,185,129,0.08)'">
                  {{ msg() }}
                </div>
              }

              <!-- Indicateur capacité -->
              @if (evt().capaciteMax) {
                <div class="mb-6 flex items-center gap-3">
                  <div class="h-2 flex-1 bg-white/10 rounded-full overflow-hidden max-w-xs">
                    <div class="h-full bg-accent rounded-full transition-all"
                      [style.width]="capacityPct() + '%'"></div>
                  </div>
                  <span class="text-sm text-white/50">{{ acceptedCount() }} / {{ evt().capaciteMax }} places</span>
                  @if (isFull()) {
                    <span class="text-xs text-red-400 font-medium">COMPLET</span>
                  }
                </div>
              }

              @if (!isFull()) {
                <div class="max-w-2xl">
                  <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Message (optionnel)</label>
                  <textarea [(ngModel)]="message" name="message" rows="3"
                    placeholder="Une précision pour les organisateurs…"
                    class="block w-full bg-transparent border border-white/20 focus:border-white rounded-lg px-4 py-3 outline-none resize-none transition-colors"></textarea>
                  <button (click)="register()" [disabled]="registering()"
                    class="mt-4 px-8 py-3 rounded-full bg-accent text-white hover:bg-white hover:text-black transition-colors disabled:opacity-50">
                    {{ registering() ? '…' : "S'inscrire" }}
                  </button>
                </div>
              }
            }

            <!-- Liste des participations (ADMIN) -->
            @if (auth.hasRole('ADMIN')) {
              <div class="mt-12">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="font-serif text-2xl">File d'attente ({{ participations().length }})</h3>
                  <div class="flex gap-2">
                    @for (s of statuts; track s.val) {
                      <button (click)="filterStatut = s.val; applyFilter()"
                        class="px-3 py-1 rounded-full text-xs border transition-colors"
                        [ngClass]="filterStatut === s.val
                          ? 'border-accent text-accent'
                          : 'border-white text-white border-opacity-20 text-opacity-50'">
                        {{ s.label }}
                      </button>
                    }
                  </div>
                </div>

                @if (filteredParticipations().length === 0) {
                  <div class="text-white/40 py-6">Aucune inscription.</div>
                } @else {
                  <div class="border border-white/10 rounded-lg overflow-hidden">
                    <table class="w-full">
                      <thead>
                        <tr class="border-b border-white/10">
                          <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3 w-12">#</th>
                          <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3">Participant</th>
                          <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3 hidden md:table-cell">Message</th>
                          <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3 hidden md:table-cell">Date</th>
                          <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3">Statut</th>
                          <th class="px-4 py-3 w-24"></th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (p of filteredParticipations(); track p.id) {
                          <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td class="px-4 py-3 text-white/40 text-sm font-mono">
                              {{ p.queuePosition ? '#' + p.queuePosition : '—' }}
                            </td>
                            <td class="px-4 py-3 text-sm">
                              <div>{{ p.userName || p.userEmail }}</div>
                              <div class="text-white/30 text-xs">{{ p.userEmail }}</div>
                            </td>
                            <td class="px-4 py-3 text-sm text-white/50 hidden md:table-cell truncate max-w-[200px]">{{ p.message || '—' }}</td>
                            <td class="px-4 py-3 text-xs text-white/40 hidden md:table-cell">{{ fmtShortDate(p.createdAt) }}</td>
                            <td class="px-4 py-3"><app-status-badge [status]="p.status" /></td>
                            <td class="px-4 py-3">
                              @if (p.status === 'EN_ATTENTE') {
                                <div class="flex gap-2 justify-end">
                                  <button (click)="decide(p, 'accept')"
                                    class="px-3 py-1 rounded-full bg-green-600/20 text-green-400 hover:bg-green-600/40 text-xs transition-colors">
                                    Accepter
                                  </button>
                                  <button (click)="decide(p, 'refuse')"
                                    class="px-3 py-1 rounded-full bg-red-600/20 text-red-400 hover:bg-red-600/40 text-xs transition-colors">
                                    Refuser
                                  </button>
                                </div>
                              }
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
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
export class EvenementDetailComponent implements OnInit {
  readonly evt = signal<any>(null);
  readonly participations = signal<any[]>([]);
  readonly filteredParticipations = signal<any[]>([]);
  readonly myParticipation = signal<any>(null);
  readonly loading = signal(true);
  readonly registering = signal(false);
  readonly msg = signal('');
  readonly msgError = signal(false);
  readonly acceptedCount = signal(0);
  id = '';
  message = '';
  filterStatut: string = 'ALL';

  statuts = [
    { val: 'ALL', label: 'Tous' },
    { val: 'EN_ATTENTE', label: 'En attente' },
    { val: 'ACCEPTE', label: 'Acceptés' },
    { val: 'REFUSE', label: 'Refusés' },
  ];

  constructor(private api: ApiService, private route: ActivatedRoute, readonly auth: AuthService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.api.get<any>(`/evenements/${this.id}`).subscribe({
      next: r => {
        this.evt.set(r?.data ?? r);
        this.loading.set(false);
        if (this.auth.isLoggedIn()) this.loadMyParticipation();
      },
      error: () => this.loading.set(false)
    });
    if (this.auth.hasRole('ADMIN')) this.loadParticipations();
  }

  loadParticipations(): void {
    this.api.get<any>(`/evenements/${this.id}/participations`).subscribe({
      next: r => {
        const list = Array.isArray(r) ? r : (r?.data ?? []);
        this.participations.set(list);
        this.acceptedCount.set(list.filter((p: any) => p.status === 'ACCEPTE').length);
        this.applyFilter();
      },
      error: () => {}
    });
  }

  loadMyParticipation(): void {
    this.api.get<any>('/auth/me').subscribe({
      next: me => {
        const uid = (me?.data ?? me)?.id;
        if (!uid) return;
        this.api.get<any>(`/evenements/${this.id}/participations/me`, { userId: uid }).subscribe({
          next: r => this.myParticipation.set((r?.data ?? r) || null),
          error: () => {}
        });
      }
    });
  }

  applyFilter(): void {
    const list = this.participations();
    if (this.filterStatut === 'ALL') {
      this.filteredParticipations.set(list);
    } else {
      this.filteredParticipations.set(list.filter((p: any) => p.status === this.filterStatut));
    }
  }

  isFull(): boolean {
    const cap = this.evt()?.capaciteMax;
    return cap != null && this.acceptedCount() >= cap;
  }

  capacityPct(): number {
    const cap = this.evt()?.capaciteMax;
    if (!cap) return 0;
    return Math.min(100, Math.round((this.acceptedCount() / cap) * 100));
  }

  register(): void {
    this.registering.set(true);
    this.msg.set('');
    this.api.get<any>('/auth/me').pipe(
      switchMap(me => {
        const userId = (me?.data ?? me)?.id;
        return this.api.post(`/evenements/${this.id}/participations`, { userId, message: this.message });
      })
    ).subscribe({
      next: (r: any) => {
        this.registering.set(false);
        this.msgError.set(false);
        this.myParticipation.set(r?.data ?? r);
        this.message = '';
        if (this.auth.hasRole('ADMIN')) this.loadParticipations();
      },
      error: (e: any) => {
        this.registering.set(false);
        this.msgError.set(true);
        this.msg.set(e?.error?.message ?? "Échec de l'inscription.");
      }
    });
  }

  decide(p: any, action: 'accept' | 'refuse'): void {
    this.api.put(`/participations/${p.id}/${action}`, {}).subscribe({
      next: () => this.loadParticipations()
    });
  }

  infos() {
    const e = this.evt();
    return [
      { label: 'Début', value: this.fmtDate(e.dateDebut) },
      { label: 'Fin', value: this.fmtDate(e.dateFin) },
      { label: 'Lieu', value: e.lieu || '—' },
      { label: 'Capacité', value: e.capaciteMax ? e.capaciteMax + ' places' : 'Illimitée' },
      { label: 'Organisateur', value: e.createdByName || '—' },
    ];
  }

  typeLabel(t: string): string { return EVENEMENT_TYPE_LABELS[t] ?? t; }

  fmtDate(d?: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  fmtShortDate(d?: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}

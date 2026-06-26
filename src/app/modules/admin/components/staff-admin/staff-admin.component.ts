import { Component, OnInit, signal, computed } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';

const POSTES: { value: string; label: string }[] = [
  { value: 'ENTRAINEUR_CHEF',     label: 'Entraîneur chef' },
  { value: 'ENTRAINEUR_ADJOINT',  label: 'Entraîneur adjoint' },
  { value: 'ARBITRE',             label: 'Arbitre' },
  { value: 'MEDECIN',             label: 'Médecin' },
  { value: 'KINE',                label: 'Kinésithérapeute' },
  { value: 'DIRECTEUR_TECHNIQUE', label: 'Directeur technique' },
  { value: 'CHRONOMETREUR',       label: 'Chronométreur' },
];

@Component({
  selector: 'app-staff-admin',
  template: `
    <app-admin-layout>
      <div>
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <div class="flex items-center gap-4 mb-2">
              <span class="h-px w-10 bg-accent"></span>
              <span class="text-xs tracking-[0.3em] uppercase text-white/50">Administration</span>
            </div>
            <h1 class="font-serif text-3xl">Affectation du Staff</h1>
          </div>
          <button
            (click)="openModal()"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white text-sm hover:bg-white hover:text-black transition-colors">
            + Affecter un membre
          </button>
        </div>

        <!-- Competition Filter -->
        <div class="flex flex-wrap gap-3 mb-8">
          <button
            (click)="selectedCompetitionId.set(null)"
            [class]="selectedCompetitionId() === null
              ? 'px-4 py-1.5 rounded-full text-sm bg-accent text-white'
              : 'px-4 py-1.5 rounded-full text-sm border border-white/20 text-white/60 hover:border-white/40 hover:text-white transition-colors'">
            Toutes les comp&eacute;titions
          </button>
          @for (c of competitions(); track c.id) {
            <button
              (click)="selectedCompetitionId.set(c.id)"
              [class]="selectedCompetitionId() === c.id
                ? 'px-4 py-1.5 rounded-full text-sm bg-accent text-white'
                : 'px-4 py-1.5 rounded-full text-sm border border-white/20 text-white/60 hover:border-white/40 hover:text-white transition-colors'">
              {{ c.nom }}
            </button>
          }
        </div>

        <!-- Staff Table -->
        @if (loading()) {
          <div class="text-white/40 text-center py-16">Chargement...</div>
        } @else {
          <div class="border border-white/10 rounded-lg overflow-hidden bg-[#0d0000]/40">
            <table class="w-full">
              <thead>
                <tr class="border-b border-white/10 bg-white/[0.01]">
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-5 py-3">Membre</th>
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-5 py-3 hidden md:table-cell">
                    Comp&eacute;tition
                  </th>
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-5 py-3">Poste</th>
                  <th class="px-5 py-3 w-16"></th>
                </tr>
              </thead>
              <tbody>
                @for (s of filteredStaff(); track s.id) {
                  <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td class="px-5 py-4">
                      <div class="font-medium text-sm">{{ s.userNom }}</div>
                      <div class="text-xs text-white/40 mt-0.5">{{ s.userEmail }}</div>
                    </td>
                    <td class="px-5 py-4 hidden md:table-cell">
                      <span class="text-sm text-white/70">{{ s.competitionNom }}</span>
                    </td>
                    <td class="px-5 py-4">
                      <span class="inline-block px-3 py-1 rounded-full text-xs border border-white/15 text-white/70 bg-white/5">
                        {{ posteLabel(s.poste) }}
                      </span>
                    </td>
                    <td class="px-5 py-4">
                      <button (click)="confirmRemove(s)"
                        class="p-1.5 text-white/30 hover:text-accent transition-colors text-lg">
                        &times;
                      </button>
                    </td>
                  </tr>
                }
                @empty {
                  <tr>
                    <td colspan="4" class="text-white/30 text-center py-16 text-sm">
                      Aucun membre du staff affect&eacute;.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Summary row -->
          @if (filteredStaff().length > 0) {
            <div class="mt-4 text-xs text-white/30 text-right">
              {{ filteredStaff().length }} affectation{{ filteredStaff().length > 1 ? 's' : '' }}
            </div>
          }
        }

        <!-- Stats Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          @for (p of posteSummary(); track p.poste) {
            <div class="border border-white/10 rounded-lg p-4 bg-[#0d0000]/40">
              <div class="text-2xl font-serif text-gold mb-1">{{ p.count }}</div>
              <div class="text-xs text-white/50">{{ p.label }}</div>
            </div>
          }
        </div>
      </div>
    </app-admin-layout>

    <!-- Assign Modal -->
    <app-modal [open]="showModal()" title="Affecter un membre" (closed)="closeModal()">
      @if (modalError()) {
        <div class="mb-4 px-4 py-3 rounded-lg text-sm bg-accent/10 border border-accent/20 text-accent/80">
          {{ modalError() }}
        </div>
      }

      <div class="space-y-5">
        <div>
          <label class="block text-xs tracking-[0.2em] uppercase text-white/40 mb-2">
            Comp&eacute;tition
          </label>
          <select [(ngModel)]="form.competitionId"
            class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/40 text-white">
            <option value="" class="bg-[#1a0000]">-- S&eacute;lectionner --</option>
            @for (c of competitions(); track c.id) {
              <option [value]="c.id" class="bg-[#1a0000]">{{ c.nom }}</option>
            }
          </select>
        </div>

        <div>
          <label class="block text-xs tracking-[0.2em] uppercase text-white/40 mb-2">Membre</label>
          <select [(ngModel)]="form.userId"
            class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/40 text-white">
            <option value="" class="bg-[#1a0000]">-- S&eacute;lectionner --</option>
            @for (u of users(); track u.id) {
              <option [value]="u.id" class="bg-[#1a0000]">{{ u.firstName }} {{ u.lastName }} ({{ u.email }})</option>
            }
          </select>
        </div>

        <div>
          <label class="block text-xs tracking-[0.2em] uppercase text-white/40 mb-2">Poste</label>
          <select [(ngModel)]="form.poste"
            class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/40 text-white">
            <option value="" class="bg-[#1a0000]">-- S&eacute;lectionner --</option>
            @for (p of postes; track p.value) {
              <option [value]="p.value" class="bg-[#1a0000]">{{ p.label }}</option>
            }
          </select>
        </div>
      </div>

      <div class="flex gap-3 mt-8">
        <button (click)="submitForm()" [disabled]="saving()"
          class="flex-1 py-3 rounded-full bg-accent text-white text-sm hover:bg-white hover:text-black transition-colors disabled:opacity-40">
          {{ saving() ? 'Enregistrement...' : 'Affecter' }}
        </button>
        <button (click)="closeModal()"
          class="flex-1 py-3 rounded-full border border-white/20 text-sm hover:border-white/40 transition-colors">
          Annuler
        </button>
      </div>
    </app-modal>

    <!-- Remove Confirm Modal -->
    <app-modal [open]="!!removeTarget()" maxWidth="max-w-sm" (closed)="removeTarget.set(null)">
      <h3 class="font-serif text-xl mb-3">Retirer du staff ?</h3>
      <p class="text-white/50 text-sm mb-2">
        <span class="text-white">{{ removeTarget()?.userNom }}</span> sera retir&eacute; de
        <span class="text-white">{{ removeTarget()?.competitionNom }}</span>.
      </p>
      <p class="text-white/40 text-xs mb-8">
        Cette action est r&eacute;versible (r&eacute;-affectation possible).
      </p>
      <div class="flex gap-3">
        <button (click)="doRemove()" [disabled]="saving()"
          class="flex-1 py-3 rounded-full bg-accent text-white text-sm disabled:opacity-40">
          {{ saving() ? '...' : 'Retirer' }}
        </button>
        <button (click)="removeTarget.set(null)"
          class="flex-1 py-3 rounded-full border border-white/20 text-sm">
          Annuler
        </button>
      </div>
    </app-modal>
  `
})
export class StaffAdminComponent implements OnInit {
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly showModal = signal(false);
  readonly modalError = signal('');
  readonly removeTarget = signal<any>(null);
  readonly selectedCompetitionId = signal<number | null>(null);

  readonly staff = signal<any[]>([]);
  readonly competitions = signal<any[]>([]);
  readonly users = signal<any[]>([]);

  readonly postes = POSTES;

  form = { competitionId: '', userId: '', poste: '' };

  readonly filteredStaff = computed(() => {
    const id = this.selectedCompetitionId();
    if (id === null) return this.staff();
    return this.staff().filter(s => s.competitionId === id);
  });

  readonly posteSummary = computed(() => {
    const all = this.filteredStaff();
    return POSTES.map(p => ({
      poste: p.value,
      label: p.label,
      count: all.filter(s => s.poste === p.value).length
    })).filter(p => p.count > 0);
  });

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    forkJoin([
      this.api.get<any>('/staff'),
      this.api.get<any>('/competitions', { page: 0, size: 100 }),
      this.api.get<any>('/users', { page: 0, size: 200 }),
    ]).subscribe({
      next: ([staff, comps, users]) => {
        this.staff.set(Array.isArray(staff) ? staff : (staff?.data ?? []));
        this.competitions.set(comps?.data ?? comps?.content ?? []);
        this.users.set(users?.data ?? users?.content ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openModal(): void {
    this.form = { competitionId: '', userId: '', poste: '' };
    this.modalError.set('');
    this.showModal.set(true);
  }

  closeModal(): void { this.showModal.set(false); }

  submitForm(): void {
    if (!this.form.competitionId || !this.form.userId || !this.form.poste) {
      this.modalError.set('Veuillez remplir tous les champs.');
      return;
    }
    this.saving.set(true);
    this.modalError.set('');
    this.api.post<any>(`/competitions/${this.form.competitionId}/staff`, {
      userId: +this.form.userId,
      poste: this.form.poste
    }).subscribe({
      next: (res) => {
        this.staff.update(list => [...list, res]);
        this.saving.set(false);
        this.closeModal();
      },
      error: (e) => {
        this.modalError.set(e?.error?.message ?? 'Erreur lors de l\'affectation.');
        this.saving.set(false);
      }
    });
  }

  confirmRemove(s: any): void { this.removeTarget.set(s); }

  doRemove(): void {
    const t = this.removeTarget();
    if (!t) return;
    this.saving.set(true);
    this.api.delete(`/staff/${t.id}`).subscribe({
      next: () => {
        this.staff.update(list => list.filter(s => s.id !== t.id));
        this.removeTarget.set(null);
        this.saving.set(false);
      },
      error: () => this.saving.set(false)
    });
  }

  posteLabel(value: string): string {
    return POSTES.find(p => p.value === value)?.label ?? value;
  }
}

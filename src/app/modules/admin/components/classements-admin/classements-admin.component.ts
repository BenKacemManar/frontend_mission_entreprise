import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-classements-admin',
  template: `
    <app-admin-layout>
      <div>
        <div class="flex items-center justify-between mb-8">
          <h1 class="font-serif text-3xl">Classements</h1>
          <button (click)="openCreate()" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-sm hover:bg-white hover:text-black transition-colors">+ Nouveau classement</button>
        </div>
        @if (loading()) { <div class="text-white/40 text-center py-16">Chargement…</div> }
        @else {
          <div class="border border-white/10 rounded-lg overflow-hidden">
            <table class="w-full">
              <thead>
                <tr class="border-b border-white/10">
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3 w-16">Rang</th>
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3">Athlète</th>
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3 hidden lg:table-cell">Épreuve</th>
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3 hidden md:table-cell">Temps</th>
                  <th class="text-left text-xs tracking-[0.2em] uppercase text-white/40 px-4 py-3 hidden md:table-cell">Saison</th>
                </tr>
              </thead>
              <tbody>
                @for (c of classements(); track c.id) {
                  <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td class="px-4 py-3 font-serif text-gold">{{ c.rank }}</td>
                    <td class="px-4 py-3">
                      <div class="font-medium">{{ c.athleteName }}</div>
                      <div class="text-xs text-white/40">{{ c.clubName }}</div>
                    </td>
                    <td class="px-4 py-3 text-sm text-white/60 hidden lg:table-cell">{{ c.swimStyle }} {{ c.distance }}m · {{ c.gender }}</td>
                    <td class="px-4 py-3 text-sm text-white/60 hidden md:table-cell">{{ c.bestTimeDisplay }}</td>
                    <td class="px-4 py-3 text-sm text-white/60 hidden md:table-cell">{{ c.season }}</td>
                  </tr>
                }
                @empty { <tr><td colspan="5" class="text-white/40 text-center py-10">Aucun classement.</td></tr> }
              </tbody>
            </table>
          </div>
          <app-pagination [page]="page" [total]="total" [pageSize]="20" (pageChange)="onPage($event)" />
        }
      </div>
    </app-admin-layout>

    <app-modal [open]="formOpen()" title="Nouveau classement" (closed)="formOpen.set(false)">
      <p class="text-white/50 text-sm mb-6">
        Calcule le classement d'une épreuve pour une saison à partir des résultats déjà enregistrés.
      </p>
      @if (formError()) {
        <div class="mb-4 px-4 py-3 rounded-lg text-sm bg-accent/10 border border-accent/20 text-accent/80">{{ formError() }}</div>
      }
      <div class="space-y-5">
        <div>
          <label class="block text-xs tracking-[0.2em] uppercase text-white/40 mb-2">Épreuve</label>
          <select [(ngModel)]="form.eventId"
            class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/40 text-white">
            <option value="" class="bg-[#1a0000]">-- Sélectionner --</option>
            @for (e of events(); track e.id) {
              <option [value]="e.id" class="bg-[#1a0000]">#{{ e.id }} · {{ e.swimStyle }} {{ e.distance }}m · {{ e.gender }} · {{ e.scheduledDate }}</option>
            }
          </select>
        </div>
        <div>
          <label class="block text-xs tracking-[0.2em] uppercase text-white/40 mb-2">Saison</label>
          <input type="text" [(ngModel)]="form.season" placeholder="ex. 2025"
            class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/40 text-white placeholder:text-white/30" />
        </div>
      </div>
      <div class="flex gap-3 mt-8">
        <button (click)="submitForm()" [disabled]="saving()"
          class="flex-1 py-3 rounded-full bg-accent text-white text-sm hover:bg-white hover:text-black transition-colors disabled:opacity-40">
          {{ saving() ? 'Calcul…' : 'Calculer' }}
        </button>
        <button (click)="formOpen.set(false)" class="flex-1 py-3 rounded-full border border-white/20 text-sm hover:border-white/40 transition-colors">Annuler</button>
      </div>
    </app-modal>
  `
})
export class ClassementsAdminComponent implements OnInit {
  readonly classements = signal<any[]>([]);
  readonly events = signal<any[]>([]);
  readonly loading = signal(false);
  readonly formOpen = signal(false);
  readonly saving = signal(false);
  readonly formError = signal('');
  form = { eventId: '', season: '' };
  total = 0; page = 1;

  constructor(private api: ApiService) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.api.get<any>('/rankings', { page: this.page - 1, size: 20, sort: 'rank' }).subscribe({
      next: r => { this.classements.set(r?.data ?? r?.content ?? []); this.total = r?.totalCount ?? r?.totalElements ?? 0; this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onPage(p: number): void { this.page = p; this.load(); }

  openCreate(): void {
    this.form = { eventId: '', season: '' };
    this.formError.set('');
    this.formOpen.set(true);
    if (this.events().length === 0) {
      this.api.get<any>('/events', { page: 0, size: 500 }).subscribe({
        next: r => this.events.set(r?.data ?? r?.content ?? [])
      });
    }
  }

  submitForm(): void {
    if (!this.form.eventId || !this.form.season) {
      this.formError.set('Veuillez sélectionner une épreuve et indiquer une saison.');
      return;
    }
    this.saving.set(true);
    this.formError.set('');
    this.api.post<any>('/rankings/rebuild', { eventId: Number(this.form.eventId), season: this.form.season }).subscribe({
      next: () => { this.saving.set(false); this.formOpen.set(false); this.page = 1; this.load(); },
      error: (e: any) => { this.formError.set(e?.error?.message ?? 'Erreur lors du calcul.'); this.saving.set(false); }
    });
  }
}

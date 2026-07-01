import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { EVENEMENT_STATUS_LABELS } from '../../../../core/models/evenement.model';

@Component({
  selector: 'app-evenement-form',
  template: `
    <app-admin-layout>
      <div>
        <a routerLink="/admin/evenements" class="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">← Retour</a>
        <h1 class="font-serif text-3xl mb-8">{{ isEdit ? "Modifier l'évènement" : 'Nouvel évènement' }}</h1>
        @if (error()) { <div class="mb-6 px-4 py-3 rounded-lg border border-accent text-accent text-sm" style="background:rgba(225,6,0,0.08)">{{ error() }}</div> }
        <form (ngSubmit)="submit()" class="space-y-8 max-w-2xl">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Type *</label>
              <select [(ngModel)]="form.type" name="type" class="block w-full bg-transparent border-b border-white/20 pb-3 outline-none text-white">
                @for (t of TYPES; track t) { <option [value]="t" class="bg-[#1a0000]">{{ t.charAt(0)+t.slice(1).toLowerCase() }}</option> }
              </select>
            </div>
            @if (isEdit) {
              <div>
                <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Statut</label>
                <select [(ngModel)]="form.status" name="status" class="block w-full bg-transparent border-b border-white/20 pb-3 outline-none text-white">
                  @for (s of STATUSES; track s) { <option [value]="s" class="bg-[#1a0000]">{{ statusLabel(s) }}</option> }
                </select>
              </div>
            }
          </div>

          <div>
            <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Titre *</label>
            <input [(ngModel)]="form.titre" name="titre" required class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
          </div>

          <div>
            <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Description</label>
            <textarea [(ngModel)]="form.description" name="description" rows="5"
              class="block w-full bg-transparent border border-white/20 focus:border-white rounded-lg px-4 py-3 outline-none resize-none transition-colors"></textarea>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Début *</label>
              <input type="datetime-local" [(ngModel)]="form.dateDebut" name="dateDebut" required class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors [color-scheme:dark]"/>
            </div>
            <div>
              <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Fin *</label>
              <input type="datetime-local" [(ngModel)]="form.dateFin" name="dateFin" required class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors [color-scheme:dark]"/>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Lieu</label>
              <input [(ngModel)]="form.lieu" name="lieu" class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
            </div>
            <div>
              <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Capacité max.</label>
              <input type="number" [(ngModel)]="form.capaciteMax" name="capaciteMax" class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
            </div>
          </div>

          @if (form.type === 'COMPETITION') {
            <div class="border border-white/10 rounded-lg p-6 space-y-6">
              <div class="text-[10px] tracking-[0.3em] uppercase text-gold">Détails compétition</div>
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Code</label>
                  <input [(ngModel)]="form.competitionCode" name="competitionCode" class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
                </div>
                <div>
                  <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Sous-type</label>
                  <select [(ngModel)]="form.competitionType" name="competitionType" class="block w-full bg-transparent border-b border-white/20 pb-3 outline-none text-white">
                    <option value="" class="bg-[#1a0000]">—</option>
                    @for (c of COMP_TYPES; track c) { <option [value]="c" class="bg-[#1a0000]">{{ c }}</option> }
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Bassin</label>
                  <select [(ngModel)]="form.lane" name="lane" class="block w-full bg-transparent border-b border-white/20 pb-3 outline-none text-white">
                    <option value="" class="bg-[#1a0000]">—</option>
                    <option value="25m" class="bg-[#1a0000]">25m</option>
                    <option value="50m" class="bg-[#1a0000]">50m</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Catégories d'âge</label>
                  <input [(ngModel)]="form.ageCategories" name="ageCategories" class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
                </div>
                <div>
                  <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Clôture des inscriptions</label>
                  <input type="date" [(ngModel)]="form.registrationDeadline" name="registrationDeadline" class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors [color-scheme:dark]"/>
                </div>
              </div>
            </div>
          }

          <div class="flex gap-4">
            <button type="submit" [disabled]="saving()" class="px-8 py-3 rounded-full bg-white text-black hover:bg-accent hover:text-white transition-colors disabled:opacity-50">
              {{ saving() ? '…' : (isEdit ? 'Mettre à jour' : 'Créer') }}
            </button>
            <a routerLink="/admin/evenements" class="px-8 py-3 rounded-full border border-white/20 hover:border-white text-sm transition-colors">Annuler</a>
          </div>
        </form>
      </div>
    </app-admin-layout>
  `
})
export class EvenementFormComponent implements OnInit {
  isEdit = false; id = '';
  readonly saving = signal(false);
  readonly error = signal('');
  readonly TYPES = ['COMPETITION', 'CEREMONIE', 'STAGE', 'AUTRE'];
  readonly STATUSES = ['BROUILLON', 'PUBLIE', 'INSCRIPTIONS_OUVERTES', 'EN_COURS', 'TERMINE', 'ARCHIVE'];
  readonly COMP_TYPES = ['HIVER', 'ETE', 'OPEN', 'NATIONAL', 'INTERNATIONAL'];

  form: any = {
    type: 'AUTRE', titre: '', description: '', dateDebut: '', dateFin: '',
    lieu: '', capaciteMax: null, status: 'BROUILLON',
    competitionCode: '', competitionType: '', lane: '', ageCategories: '', registrationDeadline: '',
  };

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.isEdit = !!this.id;
    if (!this.isEdit) return;
    this.api.get<any>(`/evenements/${this.id}`).subscribe({
      next: r => {
        const e = r?.data ?? r;
        this.form = {
          type: e.type ?? 'AUTRE',
          titre: e.titre ?? '',
          description: e.description ?? '',
          dateDebut: this.toLocalInput(e.dateDebut),
          dateFin: this.toLocalInput(e.dateFin),
          lieu: e.lieu ?? '',
          capaciteMax: e.capaciteMax ?? null,
          status: e.status ?? 'BROUILLON',
          competitionCode: e.competitionCode ?? '',
          competitionType: e.competitionType ?? '',
          lane: e.lane ?? '',
          ageCategories: e.ageCategories ?? '',
          registrationDeadline: e.registrationDeadline ? String(e.registrationDeadline).slice(0, 10) : '',
        };
      }
    });
  }

  submit(): void {
    this.error.set(''); this.saving.set(true);
    const payload: any = {
      type: this.form.type,
      titre: this.form.titre,
      description: this.form.description || null,
      dateDebut: this.form.dateDebut || null,
      dateFin: this.form.dateFin || null,
      lieu: this.form.lieu || null,
      capaciteMax: this.form.capaciteMax != null && this.form.capaciteMax !== '' ? Number(this.form.capaciteMax) : null,
    };
    if (this.form.type === 'COMPETITION') {
      payload.competitionCode = this.form.competitionCode || null;
      payload.competitionType = this.form.competitionType || null;
      payload.lane = this.form.lane || null;
      payload.ageCategories = this.form.ageCategories || null;
      payload.registrationDeadline = this.form.registrationDeadline || null;
    }
    if (this.isEdit) payload.status = this.form.status;

    const obs = this.isEdit
      ? this.api.put(`/evenements/${this.id}`, payload)
      : this.api.post('/evenements', payload);
    obs.subscribe({
      next: () => this.router.navigate(['/admin/evenements']),
      error: (e: any) => { this.error.set(e?.error?.message ?? 'Erreur.'); this.saving.set(false); }
    });
  }

  statusLabel(s: string): string { return EVENEMENT_STATUS_LABELS[s] ?? s; }

  /** ISO LocalDateTime → valeur pour <input type="datetime-local"> (yyyy-MM-ddTHH:mm) */
  private toLocalInput(d?: string): string {
    if (!d) return '';
    return String(d).slice(0, 16);
  }
}

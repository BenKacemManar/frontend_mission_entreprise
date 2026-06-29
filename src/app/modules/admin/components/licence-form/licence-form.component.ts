import { Component, EventEmitter, Input, OnChanges, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-licence-form',
  template: `
    <div>
      @if (error()) { <div class="mb-6 px-4 py-3 rounded-lg border border-accent text-accent text-sm" style="background:rgba(225,6,0,0.08)">{{ error() }}</div> }
      <form (ngSubmit)="submit()" class="grid grid-cols-2 gap-x-10 gap-y-8 max-w-2xl">
        <div>
          <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Athlète *</label>
          <select [(ngModel)]="form.athleteId" name="ath" class="block w-full bg-transparent border-b border-white/20 pb-3 outline-none text-white">
            <option [value]="null" class="bg-[#1a0000]">Sélectionner…</option>
            @for (a of athletes(); track a.id) { <option [value]="a.id" class="bg-[#1a0000]">{{ a.prenom }} {{ a.nom }}</option> }
          </select>
        </div>
        <div>
          <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Club *</label>
          <select [(ngModel)]="form.clubId" name="club" class="block w-full bg-transparent border-b border-white/20 pb-3 outline-none text-white">
            <option [value]="null" class="bg-[#1a0000]">Sélectionner…</option>
            @for (c of clubs(); track c.id) { <option [value]="c.id" class="bg-[#1a0000]">{{ c.nom }}</option> }
          </select>
        </div>
        <div>
          <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Numéro</label>
          <input [(ngModel)]="form.numero" name="num" class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
        </div>
        <div>
          <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Type *</label>
          <select [(ngModel)]="form.type" name="type" class="block w-full bg-transparent border-b border-white/20 pb-3 outline-none text-white">
            <option value="" class="bg-[#1a0000]">Sélectionner…</option>
            @for (t of TYPES; track t) { <option [value]="t" class="bg-[#1a0000]">{{ t.charAt(0)+t.slice(1).toLowerCase() }}</option> }
          </select>
        </div>
        <div>
          <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Date de début</label>
          <input type="date" [(ngModel)]="form.dateDebut" name="dd" class="block w-full bg-transparent border-b border-white/20 pb-3 outline-none transition-colors text-white"/>
        </div>
        <div>
          <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Date d'expiration</label>
          <input type="date" [(ngModel)]="form.dateExpiration" name="de" class="block w-full bg-transparent border-b border-white/20 pb-3 outline-none transition-colors text-white"/>
        </div>
        <div class="col-span-2 flex gap-4 pt-4">
          <button type="submit" [disabled]="saving()" class="px-8 py-3 rounded-full bg-white text-black hover:bg-accent hover:text-white transition-colors disabled:opacity-50">
            {{ saving() ? '…' : (isEdit ? 'Mettre à jour' : 'Créer') }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class LicenceFormComponent implements OnInit, OnChanges {
  @Input() id: string | null = null;
  @Output() saved = new EventEmitter<void>();

  isEdit = false;
  readonly saving = signal(false);
  readonly error = signal('');
  readonly athletes = signal<any[]>([]);
  readonly clubs = signal<any[]>([]);
  form = { athleteId: null as number | null, clubId: null as number | null, numero:'', type:'', dateDebut:'', dateExpiration:'' };
  readonly TYPES = ['COMPETITION','LOISIR','ENTRAINEMENT'];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.get<any>('/athletes', { page:0, size:500 }).subscribe({ next: r => this.athletes.set(r?.data ?? r?.content ?? []) });
    this.api.get<any>('/clubs', { page:0, size:200 }).subscribe({ next: r => this.clubs.set(r?.data ?? r?.content ?? []) });
  }

  ngOnChanges(): void {
    this.isEdit = !!this.id;
    this.error.set('');
    this.saving.set(false);
    if (!this.isEdit) {
      this.form = { athleteId: null, clubId: null, numero:'', type:'', dateDebut:'', dateExpiration:'' };
      return;
    }
    this.api.get<any>(`/licences/${this.id}`).subscribe({
      next: r => {
        const l = r?.data ?? r;
        this.form = { athleteId:l.athleteId??null, clubId:l.clubId??null, numero:l.numero??'', type:l.type??'', dateDebut:l.dateDebut?.slice(0,10)??'', dateExpiration:l.dateExpiration?.slice(0,10)??'' };
      }
    });
  }

  submit(): void {
    this.error.set(''); this.saving.set(true);
    const obs = this.isEdit ? this.api.put(`/licences/${this.id}`, this.form) : this.api.post('/licences', this.form);
    obs.subscribe({
      next: () => { this.saving.set(false); this.saved.emit(); },
      error: (e: any) => { this.error.set(e?.error?.message ?? 'Erreur.'); this.saving.set(false); }
    });
  }
}

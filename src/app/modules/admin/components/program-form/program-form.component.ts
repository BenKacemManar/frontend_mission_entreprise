import { Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-program-form',
  template: `
    <div>
      @if (error()) { <div class="mb-6 px-4 py-3 rounded-lg border border-accent text-accent text-sm" style="background:rgba(225,6,0,0.08)">{{ error() }}</div> }
      <form (ngSubmit)="submit()" class="grid grid-cols-2 gap-x-10 gap-y-8 max-w-2xl">
        <div class="col-span-2">
          <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Nom *</label>
          <input [(ngModel)]="form.nom" name="nom" required class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
        </div>
        <div class="col-span-2">
          <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Description</label>
          <textarea [(ngModel)]="form.description" name="desc" rows="4"
            class="block w-full bg-transparent border border-white/20 focus:border-white rounded-lg px-4 py-3 outline-none resize-none transition-colors"></textarea>
        </div>
        <div>
          <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Âge min</label>
          <input type="number" [(ngModel)]="form.ageMin" name="ageMin" class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
        </div>
        <div>
          <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Âge max</label>
          <input type="number" [(ngModel)]="form.ageMax" name="ageMax" class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
        </div>
        <div class="col-span-2">
          <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">URL Image</label>
          <input [(ngModel)]="form.imageUrl" name="img" class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
        </div>
        <div class="flex items-center gap-3">
          <button type="button" (click)="form.actif = !form.actif"
            class="w-12 h-6 rounded-full transition-colors relative" [style.background]="form.actif?'#E10600':'rgba(255,255,255,0.1)'">
            <div class="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" [class]="form.actif?'right-0.5':'left-0.5'"></div>
          </button>
          <span class="text-sm text-white/60">Actif</span>
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
export class ProgramFormComponent implements OnChanges {
  @Input() id: string | null = null;
  @Output() saved = new EventEmitter<void>();

  isEdit = false;
  readonly saving = signal(false);
  readonly error = signal('');
  form = { nom:'', description:'', ageMin: null as number | null, ageMax: null as number | null, imageUrl:'', actif:true };

  constructor(private api: ApiService) {}

  ngOnChanges(): void {
    this.isEdit = !!this.id;
    this.error.set('');
    this.saving.set(false);
    if (!this.isEdit) {
      this.form = { nom:'', description:'', ageMin: null, ageMax: null, imageUrl:'', actif:true };
      return;
    }
    this.api.get<any>(`/programs/${this.id}`).subscribe({
      next: r => {
        const p = r?.data ?? r;
        this.form = { nom:p.nom??'', description:p.description??'', ageMin:p.ageMin??null, ageMax:p.ageMax??null, imageUrl:p.imageUrl??'', actif:p.actif??true };
      }
    });
  }

  submit(): void {
    if (!this.form.nom) { this.error.set('Le nom est obligatoire.'); return; }
    this.saving.set(true); this.error.set('');
    const obs = this.isEdit ? this.api.put(`/programs/${this.id}`, this.form) : this.api.post('/programs', this.form);
    obs.subscribe({
      next: () => { this.saving.set(false); this.saved.emit(); },
      error: (e: any) => { this.error.set(e?.error?.message ?? 'Erreur.'); this.saving.set(false); }
    });
  }
}

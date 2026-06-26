import { Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-news-form',
  template: `
    <div>
      @if (error()) { <div class="mb-6 px-4 py-3 rounded-lg border border-accent text-accent text-sm" style="background:rgba(225,6,0,0.08)">{{ error() }}</div> }
      <form (ngSubmit)="submit()" class="space-y-8 max-w-2xl">
        <div>
          <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Titre *</label>
          <input [(ngModel)]="form.titre" name="titre" required class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
        </div>
        <div>
          <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Catégorie *</label>
          <select [(ngModel)]="form.categorie" name="cat" class="block w-full bg-transparent border-b border-white/20 pb-3 outline-none text-white">
            <option value="" class="bg-[#1a0000]">Sélectionner…</option>
            @for (c of CATS; track c) { <option [value]="c" class="bg-[#1a0000]">{{ c.charAt(0)+c.slice(1).toLowerCase() }}</option> }
          </select>
        </div>
        <div>
          <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">URL Image</label>
          <input [(ngModel)]="form.imageUrl" name="img" class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
        </div>
        <div>
          <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Contenu *</label>
          <textarea [(ngModel)]="form.contenu" name="contenu" rows="10" required
            class="block w-full bg-transparent border border-white/20 focus:border-white rounded-lg px-4 py-3 outline-none resize-none transition-colors"></textarea>
        </div>
        <div class="flex gap-4">
          <button type="submit" [disabled]="saving()" class="px-8 py-3 rounded-full bg-white text-black hover:bg-accent hover:text-white transition-colors disabled:opacity-50">
            {{ saving() ? '…' : (isEdit ? 'Mettre à jour' : 'Créer') }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class NewsFormComponent implements OnChanges {
  @Input() id: string | null = null;
  @Output() saved = new EventEmitter<void>();

  isEdit = false;
  readonly saving = signal(false);
  readonly error = signal('');
  form = { titre:'', contenu:'', categorie:'', imageUrl:'' };
  readonly CATS = ['NATATION','COMPETITION','FORMATION','GOUVERNANCE','INFRASTRUCTURE','GENERAL'];

  constructor(private api: ApiService) {}

  ngOnChanges(): void {
    this.isEdit = !!this.id;
    this.error.set('');
    this.saving.set(false);
    if (!this.isEdit) {
      this.form = { titre:'', contenu:'', categorie:'', imageUrl:'' };
      return;
    }
    this.api.get<any>(`/actualites/${this.id}`).subscribe({
      next: r => { const n = r?.data ?? r; this.form = { titre:n.titre??'', contenu:n.contenu??'', categorie:n.categorie??'', imageUrl:n.imageUrl??'' }; }
    });
  }

  submit(): void {
    this.error.set(''); this.saving.set(true);
    const obs = this.isEdit ? this.api.put(`/actualites/${this.id}`, this.form) : this.api.post('/actualites', this.form);
    obs.subscribe({
      next: () => { this.saving.set(false); this.saved.emit(); },
      error: (e: any) => { this.error.set(e?.error?.message ?? 'Erreur.'); this.saving.set(false); }
    });
  }
}

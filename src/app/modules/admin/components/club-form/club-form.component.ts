import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';

@Component({
  selector: 'app-club-form',
  template: `
    <app-admin-layout>
      <div>
        <a routerLink="/admin/clubs" class="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">← Retour</a>
        <h1 class="font-serif text-3xl mb-8">{{ isEdit ? 'Modifier le club' : 'Nouveau club' }}</h1>
        @if (error()) { <div class="mb-6 px-4 py-3 rounded-lg border border-accent text-accent text-sm" style="background:rgba(225,6,0,0.08)">{{ error() }}</div> }
        <form (ngSubmit)="submit()" class="grid grid-cols-2 gap-x-10 gap-y-8 max-w-2xl">
          <div class="col-span-2">
            <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Nom du club *</label>
            <input [(ngModel)]="form.nom" name="nom" required class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
          </div>
          <div>
            <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Ville</label>
            <input [(ngModel)]="form.ville" name="ville" class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
          </div>
          <div>
            <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Région</label>
            <input [(ngModel)]="form.region" name="region" class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
          </div>
          <div>
            <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Président</label>
            <input [(ngModel)]="form.presidentNom" name="pres" class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
          </div>
          <div>
            <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Date d'affiliation</label>
            <input type="date" [(ngModel)]="form.dateAffiliation" name="da" class="block w-full bg-transparent border-b border-white/20 pb-3 outline-none transition-colors text-white"/>
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
            <a routerLink="/admin/clubs" class="px-8 py-3 rounded-full border border-white/20 hover:border-white text-sm transition-colors">Annuler</a>
          </div>
        </form>
      </div>
    </app-admin-layout>
  `
})
export class ClubFormComponent implements OnInit {
  isEdit = false; id = '';
  readonly saving = signal(false);
  readonly error = signal('');
  form = { nom:'', ville:'', region:'', presidentNom:'', dateAffiliation:'', actif:true };

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.isEdit = !!this.id;
    if (!this.isEdit) return;
    this.api.get<any>(`/clubs/${this.id}`).subscribe({
      next: r => {
        const c = r?.data ?? r;
        this.form = { nom:c.nom??'', ville:c.ville??'', region:c.region??'', presidentNom:c.presidentNom??'', dateAffiliation:c.dateAffiliation?.slice(0,10)??'', actif:c.actif??true };
      }
    });
  }

  submit(): void {
    this.error.set(''); this.saving.set(true);
    const obs = this.isEdit ? this.api.put(`/clubs/${this.id}`, this.form) : this.api.post('/clubs', this.form);
    obs.subscribe({
      next: () => this.router.navigate(['/admin/clubs']),
      error: (e: any) => { this.error.set(e?.error?.message ?? 'Erreur.'); this.saving.set(false); }
    });
  }
}

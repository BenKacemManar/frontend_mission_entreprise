import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';

@Component({
  selector: 'app-athlete-form',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <div>
        <a routerLink="/admin/athletes" class="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">← Retour</a>
        <h1 class="font-serif text-3xl mb-8">{{ isEdit ? "Modifier l'athlète" : 'Nouvel athlète' }}</h1>
        @if (loading()) { <div class="text-white/40 py-10">Chargement…</div> }
        @if (error()) { <div class="mb-6 px-4 py-3 rounded-lg border border-accent text-accent text-sm" style="background:rgba(225,6,0,0.08)">{{ error() }}</div> }
        <form (ngSubmit)="submit()" class="grid grid-cols-2 gap-x-10 gap-y-8 max-w-2xl">
          <div>
            <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Prénom *</label>
            <input [(ngModel)]="form.prenom" name="prenom" required class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
            @if (errors['prenom']) { <p class="text-xs mt-1 text-accent">{{ errors['prenom'] }}</p> }
          </div>
          <div>
            <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Nom *</label>
            <input [(ngModel)]="form.nom" name="nom" required class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
          </div>
          <div>
            <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Date de naissance *</label>
            <input type="date" [(ngModel)]="form.dateNaissance" name="dn" required class="block w-full bg-transparent border-b border-white/20 pb-3 outline-none transition-colors text-white"/>
          </div>
          <div>
            <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Nationalité *</label>
            <input [(ngModel)]="form.nationalite" name="nat" required class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
          </div>
          <div>
            <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Catégorie *</label>
            <select [(ngModel)]="form.categorie" name="cat" class="block w-full bg-transparent border-b border-white/20 pb-3 outline-none text-white">
              <option value="" class="bg-[#1a0000]">Sélectionner…</option>
              @for (c of CATS; track c) { <option [value]="c" class="bg-[#1a0000]">{{ c.charAt(0) + c.slice(1).toLowerCase() }}</option> }
            </select>
          </div>
          <div>
            <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Sexe *</label>
            <select [(ngModel)]="form.sexe" name="sexe" class="block w-full bg-transparent border-b border-white/20 pb-3 outline-none text-white">
              <option value="" class="bg-[#1a0000]">Sélectionner…</option>
              <option value="MASCULIN" class="bg-[#1a0000]">Masculin</option>
              <option value="FEMININ" class="bg-[#1a0000]">Féminin</option>
            </select>
          </div>
          <div class="col-span-2">
            <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Club</label>
            <select [(ngModel)]="form.clubId" name="club" class="block w-full bg-transparent border-b border-white/20 pb-3 outline-none text-white">
              <option [value]="null" class="bg-[#1a0000]">Sans club</option>
              @for (c of clubs(); track c.id) { <option [value]="c.id" class="bg-[#1a0000]">{{ c.nom }}</option> }
            </select>
          </div>
          <div class="col-span-2 flex gap-4 pt-4">
            <button type="submit" [disabled]="saving()" class="px-8 py-3 rounded-full bg-white text-black hover:bg-accent hover:text-white transition-colors disabled:opacity-50">
              {{ saving() ? '…' : (isEdit ? 'Mettre à jour' : 'Créer') }}
            </button>
            <a routerLink="/admin/athletes" class="px-8 py-3 rounded-full border border-white/20 hover:border-white text-sm transition-colors">Annuler</a>
          </div>
        </form>
      </div>
    </app-admin-layout>
  `
})
export class AthleteFormComponent implements OnInit {
  isEdit = false; id = '';
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly clubs = signal<any[]>([]);
  errors: Record<string, string> = {};
  form = { nom:'', prenom:'', dateNaissance:'', nationalite:'', categorie:'', sexe:'', clubId: null as number | null };
  readonly CATS = ['POUSSIN','BENJAMIN','MINIME','CADET','JUNIOR','SENIOR'];

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.api.get<any>('/clubs', { page:0, size:200 }).subscribe({ next: r => this.clubs.set(r?.data ?? r?.content ?? []) });
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.isEdit = !!this.id;
    if (!this.isEdit) return;
    this.loading.set(true);
    this.api.get<any>(`/athletes/${this.id}`).subscribe({
      next: r => {
        const a = r?.data ?? r;
        this.form = { nom:a.nom??'', prenom:a.prenom??'', dateNaissance:a.dateNaissance?.slice(0,10)??'', nationalite:a.nationalite??'', categorie:a.categorie??'', sexe:a.sexe??'', clubId:a.clubId??null };
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  submit(): void {
    this.error.set(''); this.saving.set(true);
    const obs = this.isEdit ? this.api.put(`/athletes/${this.id}`, this.form) : this.api.post('/athletes', this.form);
    obs.subscribe({
      next: () => this.router.navigate(['/admin/athletes']),
      error: (e: any) => { this.error.set(e?.error?.message ?? 'Erreur.'); this.saving.set(false); }
    });
  }
}

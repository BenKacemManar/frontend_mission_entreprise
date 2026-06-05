import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PageLayoutComponent],
  template: `
    <app-page-layout>
      <section class="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <a [routerLink]="['/competitions', compId]" class="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-12 transition-colors">← Retour à la compétition</a>
        <h1 class="font-serif text-4xl mb-12">
          {{ isEdit ? "Modifier l'épreuve" : 'Nouvelle' }} <span class="italic text-gold">épreuve.</span>
        </h1>
        @if (error()) { <div class="mb-8 px-4 py-3 rounded-lg border border-accent text-accent text-sm" style="background:rgba(225,6,0,0.08)">{{ error() }}</div> }
        <form (ngSubmit)="submit()" class="grid grid-cols-2 gap-x-12 gap-y-10 max-w-2xl">
          @for (f of fields; track f.key) {
            <div>
              <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">{{ f.label }}</label>
              <select [(ngModel)]="form[f.key]" [name]="f.key" class="block w-full bg-transparent border-b border-white/20 pb-3 outline-none text-white">
                @for (o of f.opts; track o.v) { <option [value]="o.v" class="bg-[#1a0000]">{{ o.l }}</option> }
              </select>
            </div>
          }
          <div class="col-span-2 flex gap-4 pt-4">
            <button type="submit" [disabled]="saving()"
              class="px-8 py-4 rounded-full bg-white text-black hover:bg-accent hover:text-white transition-colors disabled:opacity-50">
              {{ saving() ? '…' : (isEdit ? 'Mettre à jour' : 'Créer') }}
            </button>
            <a [routerLink]="['/competitions', compId]" class="px-8 py-4 rounded-full border border-white/20 hover:border-white text-sm transition-colors">Annuler</a>
          </div>
        </form>
      </section>
    </app-page-layout>
  `
})
export class EventFormComponent implements OnInit {
  compId = ''; eventId = ''; isEdit = false;
  readonly saving = signal(false);
  readonly error = signal('');
  form: Record<string, string> = { swimStyle:'libre', distance:'50', gender:'M', ageCategory:'SENIOR', round:'finale' };

  readonly fields = [
    { key:'swimStyle', label:'Nage', opts:[{v:'libre',l:'Libre'},{v:'dos',l:'Dos'},{v:'brasse',l:'Brasse'},{v:'papillon',l:'Papillon'},{v:'4nages',l:'4 Nages'}] },
    { key:'distance', label:'Distance (m)', opts:[{v:'50',l:'50m'},{v:'100',l:'100m'},{v:'200',l:'200m'},{v:'400',l:'400m'},{v:'800',l:'800m'},{v:'1500',l:'1500m'}] },
    { key:'gender', label:'Genre', opts:[{v:'M',l:'Messieurs'},{v:'F',l:'Dames'}] },
    { key:'ageCategory', label:'Catégorie', opts:[{v:'POUSSIN',l:'Poussin'},{v:'BENJAMIN',l:'Benjamin'},{v:'MINIME',l:'Minime'},{v:'CADET',l:'Cadet'},{v:'JUNIOR',l:'Junior'},{v:'SENIOR',l:'Senior'}] },
    { key:'round', label:'Tour', opts:[{v:'series',l:'Séries'},{v:'demi',l:'Demi-finales'},{v:'finale',l:'Finale'}] },
  ];

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.compId = this.route.snapshot.paramMap.get('id') ?? '';
    this.eventId = this.route.snapshot.paramMap.get('eventId') ?? '';
    this.isEdit = !!this.eventId;
    if (!this.isEdit) return;
    this.api.get<any>(`/events/${this.eventId}`).subscribe({
      next: r => {
        const e = r?.data ?? r;
        this.form = { swimStyle:e.swimStyle??'libre', distance:String(e.distance??50), gender:e.gender??'M', ageCategory:e.ageCategory??'SENIOR', round:e.round??'finale' };
      }
    });
  }

  submit(): void {
    this.error.set(''); this.saving.set(true);
    const dto = { ...this.form, distance: Number(this.form['distance']), competitionId: this.compId };
    const obs = this.isEdit ? this.api.put(`/events/${this.eventId}`, dto) : this.api.post('/events', dto);
    obs.subscribe({
      next: () => this.router.navigate(['/competitions', this.compId]),
      error: (e: any) => { this.error.set(e?.error?.message ?? 'Erreur.'); this.saving.set(false); }
    });
  }
}

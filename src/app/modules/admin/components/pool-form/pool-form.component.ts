import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-pool-form',
  template: `
    <app-admin-layout>
      <div>
        <a routerLink="/admin/pools" class="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">← Retour</a>
        <h1 class="font-serif text-3xl mb-8">{{ isEdit ? 'Modifier la piscine' : 'Nouvelle piscine' }}</h1>
        @if (error()) { <div class="mb-6 px-4 py-3 rounded-lg border border-accent text-accent text-sm" style="background:rgba(225,6,0,0.08)">{{ error() }}</div> }
        <form (ngSubmit)="submit()" class="grid grid-cols-2 gap-x-10 gap-y-8 max-w-2xl mb-10">
          <div class="col-span-2">
            <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Nom *</label>
            <input [(ngModel)]="form.nom" name="nom" required class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
          </div>
          <div>
            <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Ville</label>
            <input [(ngModel)]="form.ville" name="ville" class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
          </div>
          <div>
            <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Adresse</label>
            <input [(ngModel)]="form.adresse" name="adr" class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
          </div>
          <div>
            <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Longueur</label>
            <select [(ngModel)]="form.longueur" name="lon" class="block w-full bg-transparent border-b border-white/20 pb-3 outline-none text-white">
              <option [value]="25" class="bg-[#1a0000]">25m</option>
              <option [value]="50" class="bg-[#1a0000]">50m</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Couloirs</label>
            <input type="number" [(ngModel)]="form.nbCouloirs" name="coul" class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
          </div>
          <div>
            <label class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Type</label>
            <select [(ngModel)]="form.type" name="type" class="block w-full bg-transparent border-b border-white/20 pb-3 outline-none text-white">
              <option value="" class="bg-[#1a0000]">Non spécifié</option>
              @for (t of TYPES; track t) { <option [value]="t" class="bg-[#1a0000]">{{ t.charAt(0)+t.slice(1).toLowerCase() }}</option> }
            </select>
          </div>
          <div class="flex items-center gap-3">
            <button type="button" (click)="form.actif = !form.actif"
              class="w-12 h-6 rounded-full transition-colors relative" [style.background]="form.actif?'#E10600':'rgba(255,255,255,0.1)'">
              <div class="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" [class]="form.actif?'right-0.5':'left-0.5'"></div>
            </button>
            <span class="text-sm text-white/60">Active</span>
          </div>
          <div class="col-span-2 flex gap-4">
            <button type="submit" [disabled]="saving()" class="px-8 py-3 rounded-full bg-white text-black hover:bg-accent hover:text-white transition-colors disabled:opacity-50">
              {{ saving() ? '…' : (isEdit ? 'Mettre à jour' : 'Créer') }}
            </button>
            <a routerLink="/admin/pools" class="px-8 py-3 rounded-full border border-white/20 hover:border-white text-sm transition-colors">Annuler</a>
          </div>
        </form>
        @if (isEdit) {
          <div class="border-t border-white/10 pt-8 max-w-2xl">
            <h2 class="font-serif text-xl mb-6">Créneaux</h2>
            <div class="space-y-3 mb-6">
              @for (s of schedules(); track s.id) {
                <div class="flex items-center justify-between p-3 border border-white/10 rounded-lg text-sm">
                  <div>
                    <div class="font-medium">{{ s.purpose }}</div>
                    <div class="text-xs text-white/40">{{ s.startDateTime }}</div>
                  </div>
                  <div class="flex items-center gap-3">
                    <app-status-badge [status]="s.status" />
                    <button (click)="delSchedule(s.id)" class="p-1.5 hover:text-accent transition-colors">🗑</button>
                  </div>
                </div>
              }
            </div>
            <div class="grid grid-cols-3 gap-4">
              <input type="text" placeholder="Objet" [(ngModel)]="ns.purpose"
                class="bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none"/>
              <input type="datetime-local" [(ngModel)]="ns.startDateTime"
                class="bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
              <input type="datetime-local" [(ngModel)]="ns.endDateTime"
                class="bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none"/>
            </div>
            <button (click)="addSchedule()" class="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-white text-sm transition-colors">+ Créneau</button>
          </div>
        }
      </div>
    </app-admin-layout>
  `
})
export class PoolFormComponent implements OnInit {
  isEdit = false; id = '';
  readonly saving = signal(false);
  readonly error = signal('');
  readonly schedules = signal<any[]>([]);
  form = { nom:'', ville:'', adresse:'', longueur:25, nbCouloirs:8, type:'', actif:true };
  ns = { purpose:'', startDateTime:'', endDateTime:'' };
  readonly TYPES = ['INTERIEUR','EXTERIEUR','OLYMPIQUE'];

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.isEdit = !!this.id;
    if (!this.isEdit) return;
    this.api.get<any>(`/pools/${this.id}`).subscribe({
      next: r => {
        const p = r?.data ?? r;
        this.form = { nom:p.nom??'', ville:p.ville??'', adresse:p.adresse??'', longueur:p.longueur??25, nbCouloirs:p.nbCouloirs??8, type:p.type??'', actif:p.actif??true };
        this.loadSchedules();
      }
    });
  }

  loadSchedules(): void {
    this.api.get<any>(`/pools/${this.id}/schedules`).subscribe({ next: s => this.schedules.set(Array.isArray(s)?s:(s?.data??[])) });
  }

  submit(): void {
    if (!this.form.nom) { this.error.set('Le nom est obligatoire.'); return; }
    this.saving.set(true); this.error.set('');
    const obs = this.isEdit ? this.api.put(`/pools/${this.id}`, this.form) : this.api.post('/pools', this.form);
    obs.subscribe({
      next: () => this.router.navigate(['/admin/pools']),
      error: (e: any) => { this.error.set(e?.error?.message ?? 'Erreur.'); this.saving.set(false); }
    });
  }

  addSchedule(): void {
    if (!this.ns.purpose) return;
    this.api.post<any>('/pool-schedules', { poolId: Number(this.id), ...this.ns }).subscribe({
      next: s => { this.schedules.update(ss => [...ss, s?.data??s]); this.ns = { purpose:'', startDateTime:'', endDateTime:'' }; }
    });
  }

  delSchedule(sid: number): void {
    this.api.delete(`/pool-schedules/${sid}`).subscribe({ next: () => this.schedules.update(ss => ss.filter(s => s.id !== sid)) });
  }
}

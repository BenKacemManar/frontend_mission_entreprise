import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Calendar, MapPin, Pencil, Trash2, Waves } from 'lucide-angular';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PageLayoutComponent } from '../../../../shared/components/page-layout/page-layout.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

const S2F: Record<string,string> = { PLANIFIEE:'upcoming',EN_COURS:'ongoing',TERMINEE:'finished',ANNULEE:'cancelled' };

@Component({
  selector: 'app-competition-detail',
  template: `
    <app-page-layout>
      <section class="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <a routerLink="/competitions" class="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-12 transition-colors">
          ← Retour aux compétitions
        </a>
        @if (loading()) {
          <div class="text-white/40 text-center py-20">Chargement…</div>
        } @else if (!comp()) {
          <div class="text-white/40 text-center py-20">Compétition introuvable.</div>
        } @else {
          <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-12">
            <div>
              <div class="flex items-center gap-4 mb-4">
                <app-status-badge [status]="comp().status" />
                <span class="text-xs tracking-[0.2em] uppercase text-white/40">{{ comp().type?.toUpperCase() }}</span>
              </div>
              <h1 class="font-serif text-4xl lg:text-6xl leading-tight">{{ comp().name }}</h1>
              <div class="mt-4 text-white/50">{{ fmtDate(comp().startDate) }} — {{ fmtDate(comp().endDate) }}</div>
            </div>
            @if (auth.hasRole('ADMIN') || auth.hasRole('COACH')) {
              <a [routerLink]="['/competitions', id, 'edit']"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 hover:border-white text-sm transition-colors">
                <lucide-icon [img]="Pencil" class="w-4 h-4"></lucide-icon> Modifier
              </a>
            }
          </div>

          <div class="grid lg:grid-cols-3 gap-6 mb-16">
            @for (info of infos(); track info.label) {
              <div class="border-l-2 border-accent pl-4">
                <div class="text-xs tracking-[0.2em] uppercase text-white/40 mb-1">{{ info.label }}</div>
                <div class="text-lg">{{ info.value }}</div>
              </div>
            }
          </div>

          <div class="border-t border-white/10 pt-10">
            <div class="flex items-center justify-between mb-8">
              <h2 class="font-serif text-3xl">Épreuves</h2>
              @if (auth.hasRole('ADMIN') || auth.hasRole('COACH')) {
                <a [routerLink]="['/competitions', id, 'events', 'new']"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-sm hover:bg-white hover:text-black transition-colors">
                  + Ajouter
                </a>
              }
            </div>
            @if (events().length === 0) {
              <div class="text-white/40 py-10">Aucune épreuve.</div>
            } @else {
              <div class="border-t border-white/10">
                @for (ev of events(); track ev.id) {
                  <div class="grid grid-cols-12 items-center py-4 border-b border-white/10 hover:bg-white/[0.02] px-2">
                    <div class="col-span-5 font-medium">{{ ev.label || (ev.distance + 'm ' + ev.swimStyle) }}</div>
                    <div class="col-span-3 text-sm text-white/50">{{ ev.gender==='M' ? 'Messieurs' : 'Dames' }}</div>
                    <div class="col-span-2 text-sm text-white/50">{{ ev.ageCategory }}</div>
                    <div class="col-span-2"><app-status-badge [status]="S2F[ev.status] ?? ev.status" /></div>
                  </div>
                }
              </div>
            }
          </div>
        }
      </section>
    </app-page-layout>
  `
})
export class CompetitionDetailComponent implements OnInit {
  readonly Calendar = Calendar;
  readonly MapPin = MapPin;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Waves = Waves;
  readonly comp = signal<any>(null);
  readonly events = signal<any[]>([]);
  readonly loading = signal(true);
  id = '';
  readonly S2F = S2F;

  constructor(private api: ApiService, private route: ActivatedRoute, readonly auth: AuthService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    forkJoin([
      this.api.get<any>(`/competitions/${this.id}`),
      this.api.get<any[]>(`/events/competition/${this.id}`)
    ]).subscribe({
      next: ([c, evts]) => {
        const raw = c?.data ?? c;
        this.comp.set({ ...raw, status: S2F[raw.status] ?? raw.status });
        this.events.set(Array.isArray(evts) ? evts : (evts as any)?.data ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  infos() {
    const c = this.comp();
    return [
      { label:'Discipline', value: c.discipline },
      { label:'Bassin', value: c.lane || '—' },
      { label:'Ville', value: c.city || '—' },
      { label:'Piscine', value: c.poolName || '—' },
      { label:'Catégories', value: c.ageCategories || '—' },
      { label:'Inscription avant', value: this.fmtDate(c.registrationDeadline) },
    ];
  }

  fmtDate(d?: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' });
  }
}

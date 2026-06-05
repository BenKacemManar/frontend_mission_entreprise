import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-pools-list',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, StatusBadgeComponent],
  template: `
    <app-page-layout>
      <section class="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <div class="mb-12">
          <div class="flex items-center gap-4 mb-6">
            <span class="h-px w-10 bg-accent"></span>
            <span class="text-xs tracking-[0.3em] uppercase text-white/70">Piscines</span>
          </div>
          <h1 class="font-serif text-5xl lg:text-7xl leading-[0.95]">
            Nos <span class="italic text-gold">bassins.</span>
          </h1>
        </div>
        @if (loading()) {
          <div class="text-white/40 text-center py-20">Chargement…</div>
        } @else if (pools().length === 0) {
          <div class="text-white/40 text-center py-20">Aucune piscine.</div>
        } @else {
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (p of pools(); track p.id) {
              <div class="border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors">
                <div class="p-6">
                  <div class="flex items-start justify-between mb-4">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background:rgba(225,6,0,0.1)">
                      <span class="text-accent text-xl">💧</span>
                    </div>
                    @if (!p.actif) { <span class="text-xs text-white/30">Inactif</span> }
                  </div>
                  <h3 class="font-serif text-xl mb-2">{{ p.nom }}</h3>
                  <div class="text-sm text-white/50 mb-4">{{ joinArr([p.adresse, p.ville]) }}</div>
                  <div class="flex gap-4 text-sm">
                    <div class="border-l-2 border-accent pl-3">
                      <div class="text-xs text-white/30">Longueur</div>
                      <div class="font-medium">{{ p.longueur }}m</div>
                    </div>
                    <div class="border-l-2 border-gold pl-3">
                      <div class="text-xs text-white/30">Couloirs</div>
                      <div class="font-medium">{{ p.nbCouloirs }}</div>
                    </div>
                    @if (p.type) {
                      <div class="border-l-2 border-white/10 pl-3">
                        <div class="text-xs text-white/30">Type</div>
                        <div class="font-medium text-white/70">{{ p.type?.toLowerCase() }}</div>
                      </div>
                    }
                  </div>
                </div>
                @if ((schedules()[p.id] || []).length > 0) {
                  <div class="border-t border-white/10 px-6 py-4">
                    <div class="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-3">Prochains créneaux</div>
                    @for (s of (schedules()[p.id] || []).slice(0,3); track s.id) {
                      <div class="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0">
                        <span class="text-white/60">{{ s.purpose }}</span>
                        <app-status-badge [status]="s.status" />
                      </div>
                    }
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
export class PoolsListComponent implements OnInit {
  readonly pools = signal<any[]>([]);
  readonly schedules = signal<Record<number, any[]>>({});
  readonly loading = signal(false);

  joinArr(arr: (string|undefined)[]): string { return arr.filter(Boolean).join(' · '); }

  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.loading.set(true);
    this.api.get<any>('/pools').subscribe({
      next: r => {
        const ps = r?.data ?? r?.content ?? (Array.isArray(r) ? r : []);
        this.pools.set(ps);
        ps.forEach((p: any) => {
          this.api.get<any>(`/pools/${p.id}/schedules`).subscribe({
            next: s => this.schedules.update(prev => ({ ...prev, [p.id]: Array.isArray(s)?s:(s?.data??[]) }))
          });
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}

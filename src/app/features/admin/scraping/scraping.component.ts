import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';

const SC: Record<string, { color: string; bg: string }> = {
  IDLE:    { color:'#9CA3AF', bg:'rgba(156,163,175,0.1)' },
  RUNNING: { color:'#F59E0B', bg:'rgba(245,158,11,0.1)' },
  SUCCESS: { color:'#10B981', bg:'rgba(16,185,129,0.1)' },
  ERROR:   { color:'#EF4444', bg:'rgba(239,68,68,0.1)' },
};
const LC: Record<string, string> = { INFO:'#9CA3AF', WARN:'#F59E0B', ERROR:'#EF4444' };

@Component({
  selector: 'app-scraping',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
  template: `
    <app-admin-layout>
      <div>
        <h1 class="font-serif text-3xl mb-8">Scraping de données</h1>
        <div class="flex items-center gap-4 mb-8 p-5 rounded-lg border border-white/10"
          [style.background]="sc().bg">
          <div class="w-3 h-3 rounded-full" [style.background]="sc().color"></div>
          <div>
            <div class="font-medium" [style.color]="sc().color">{{ status().status }}</div>
            @if (status().lastRun) { <div class="text-xs text-white/40 mt-0.5">Dernier run : {{ fmtDate(status().lastRun) }}</div> }
          </div>
          <button (click)="refreshStatus()" class="ml-auto p-1.5 text-white/40 hover:text-white transition-colors">↻</button>
        </div>
        <div class="mb-10 p-6 border border-white/10 rounded-lg max-w-xl">
          <h2 class="font-serif text-xl mb-4">Déclencher le scraping</h2>
          <input type="url" placeholder="URL source (optionnel)" [(ngModel)]="sourceUrl"
            class="block w-full bg-transparent border border-white/20 rounded-lg px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none mb-4"/>
          <button (click)="trigger()" [disabled]="triggering() || status().status === 'RUNNING'"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white hover:bg-white hover:text-black transition-colors text-sm disabled:opacity-50">
            ↻ {{ triggering() ? 'Déclenchement…' : 'Lancer' }}
          </button>
        </div>
        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-serif text-xl">Journaux</h2>
            <button (click)="refreshLogs()" class="p-1.5 text-white/40 hover:text-white transition-colors">↻</button>
          </div>
          <div class="border border-white/10 rounded-lg overflow-hidden font-mono text-sm max-h-96 overflow-y-auto">
            @if (loading()) { <div class="text-white/40 text-center py-10">Chargement…</div> }
            @else if (logs().length === 0) { <div class="text-white/40 text-center py-10">Aucun journal.</div> }
            @else {
              @for (log of logs(); track log.id) {
                <div class="flex items-start gap-3 px-4 py-2 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <span class="text-xs text-white/30 flex-shrink-0 pt-0.5">{{ fmtDate(log.timestamp) }}</span>
                  <span class="text-xs flex-shrink-0 px-1.5 py-0.5 rounded uppercase font-medium"
                    [style.color]="LC[log.level]" [style.background]="LC[log.level] + '20'">{{ log.level }}</span>
                  <span class="text-xs text-white/70 break-all">{{ log.message }}</span>
                </div>
              }
            }
          </div>
        </div>
      </div>
    </app-admin-layout>
  `
})
export class ScrapingComponent implements OnInit {
  readonly status = signal<any>({ status:'IDLE' });
  readonly logs = signal<any[]>([]);
  readonly loading = signal(false);
  readonly triggering = signal(false);
  sourceUrl = '';
  readonly LC = LC;

  constructor(private api: ApiService) {}
  ngOnInit(): void { this.refreshStatus(); this.refreshLogs(); }

  sc() { return SC[this.status().status] ?? SC['IDLE']; }

  refreshStatus(): void { this.api.get<any>('/scraping/status').subscribe({ next: r => this.status.set(r?.data ?? r), error: () => {} }); }

  refreshLogs(): void {
    this.loading.set(true);
    this.api.get<any>('/scraping/logs').subscribe({ next: r => { this.logs.set(Array.isArray(r)?r:(r?.data??[])); this.loading.set(false); }, error: () => this.loading.set(false) });
  }

  trigger(): void {
    this.triggering.set(true);
    this.api.post('/scraping/trigger', { sourceUrl: this.sourceUrl || undefined }).subscribe({
      next: () => { this.triggering.set(false); setTimeout(() => this.refreshStatus(), 1000); },
      error: () => this.triggering.set(false)
    });
  }

  fmtDate(d?: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleString('fr-FR', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
  }
}

import { Component, signal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

const LINKS = [
  { label: 'Tableau de bord', to: '/admin',           icon: '⊞', exact: true },
  { label: 'Athlètes',        to: '/admin/athletes',  icon: '◎' },
  { label: 'Clubs',           to: '/admin/clubs',     icon: '⊡' },
  { label: 'Compétitions',    to: '/competitions',    icon: '◈' },
  { label: 'Résultats',       to: '/results',         icon: '≡' },
  { label: 'Piscines',        to: '/admin/pools',     icon: '≋' },
  { label: 'Actualités',      to: '/admin/news',      icon: '◉' },
  { label: 'Licences',        to: '/admin/licences',  icon: '▣' },
  { label: 'Forum',           to: '/admin/forum',     icon: '◯' },
  { label: 'Staff compét.',   to: '/admin/staff',         icon: '⊕' },
  { label: 'Staff clubs',    to: '/admin/clubs/staff',   icon: '⊛' },
  { label: 'Scraping',        to: '/admin/scraping',  icon: '↻' },
];

@Component({
  selector: 'app-admin-layout',
  template: `
    <div class="min-h-screen bg-ink text-white flex">
      <aside [class]="collapsed() ? 'w-16' : 'w-64'"
        class="fixed top-0 left-0 h-full flex flex-col border-r border-white/10 bg-[#0d0000] transition-all duration-300 z-40">
        <div class="h-0.5 w-full" style="background:linear-gradient(90deg,#E10600 0%,#E10600 50%,#D4AF37 50%,#D4AF37 100%)"></div>
        <div class="flex items-center justify-between px-4 py-4 border-b border-white/10">
          @if (!collapsed()) { <span class="text-xs tracking-[0.2em] uppercase text-white/60">Administration</span> }
          <button (click)="collapsed.set(!collapsed())"
            class="p-1.5 rounded-lg hover:bg-white/5 transition-colors ml-auto text-white/60 hover:text-white">
            {{ collapsed() ? '&rsaquo;' : '&lsaquo;' }}
          </button>
        </div>
        <nav class="flex-1 overflow-y-auto py-4 space-y-1 px-2">
          @for (link of links; track link.to) {
            <a [routerLink]="link.to"
              routerLinkActive="text-white bg-accent/20"
              [routerLinkActiveOptions]="{ exact: link.exact ?? false }"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm text-white/60 hover:text-white hover:bg-white/5"
              [title]="collapsed() ? link.label : ''">
              <span class="flex-shrink-0 w-4 text-center">{{ link.icon }}</span>
              @if (!collapsed()) { <span>{{ link.label }}</span> }
            </a>
          }
        </nav>
        <div class="border-t border-white/10 px-2 py-3">
          @if (!collapsed()) {
            <div class="flex items-center gap-3 px-3 py-2 mb-1">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium bg-accent flex-shrink-0">
                {{ auth.currentUser?.firstName?.[0] }}{{ auth.currentUser?.lastName?.[0] }}
              </div>
              <div class="min-w-0">
                <div class="text-sm truncate">{{ auth.currentUser?.firstName }} {{ auth.currentUser?.lastName }}</div>
              </div>
            </div>
          }
          <button (click)="auth.logout()"
            class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-white/60 hover:text-white w-full text-sm">
            <span class="w-4 text-center">&crarr;</span>
            @if (!collapsed()) { <span>Déconnexion</span> }
          </button>
        </div>
      </aside>
      <div [class]="collapsed() ? 'ml-16' : 'ml-64'" class="flex-1 transition-all duration-300 min-h-screen p-8">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {
  readonly collapsed = signal(false);
  readonly links = LINKS;
  constructor(readonly auth: AuthService) {}
}

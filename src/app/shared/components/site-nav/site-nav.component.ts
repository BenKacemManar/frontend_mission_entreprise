import { Component, HostListener, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-site-nav',
  template: `
    <header
      class="fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b transition-colors"
      [style.background]="scrolled() ? 'rgba(10,0,0,0.92)' : 'rgba(10,0,0,0)'"
      [style.borderColor]="scrolled() ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0)'">

      <div class="h-0.5 w-full"
        style="background: linear-gradient(90deg,#E10600 0%,#E10600 50%,#D4AF37 50%,#D4AF37 100%)">
      </div>

      <div class="mx-auto max-w-[1400px] px-6 lg:px-10 h-20 flex items-center justify-between gap-6">
        <a routerLink="/" class="flex items-center gap-3 flex-shrink-0">
          <img src="assets/logo.png" alt="EST" class="w-11 h-11 object-cover rounded-full ring-1 ring-white/20 flex-shrink-0 aspect-square" />
          <div class="leading-tight">
            <div class="text-[11px] tracking-[0.3em] text-white/50 uppercase">Espérance · 1919</div>
            <div class="text-sm tracking-[0.25em] uppercase">Section Natation</div>
          </div>
        </a>

        <nav class="hidden lg:flex items-center gap-1">
          @for (n of navLinks; track n.to) {
            <a [routerLink]="n.to" routerLinkActive="text-white"
              [routerLinkActiveOptions]="{ exact: n.to === '/' }"
              class="relative px-4 py-2 text-sm text-white/70 hover:text-white transition-colors group">
              {{ n.label }}
              <span class="absolute left-4 right-4 -bottom-0.5 h-px bg-accent scale-x-0 origin-left transition-transform group-hover:scale-x-100"></span>
            </a>
          }
        </nav>

        <div class="hidden lg:flex items-center gap-3">
          @if (auth.isLoggedIn()) {
            @if (auth.hasRole('ADMIN')) {
              <a routerLink="/admin"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent hover:bg-white hover:text-black transition-colors text-sm font-medium border border-accent text-white shadow-sm mr-1">
                <span>⊞</span>
                <span>Tableau de bord</span>
              </a>
            }
            <div class="relative">
              <button (click)="menuOpen.set(!menuOpen())"
                class="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition-colors text-sm">
                {{ auth.currentUser?.firstName }}
              </button>
              @if (menuOpen()) {
                <div class="absolute right-0 top-full mt-2 w-52 bg-[#1a0000] border border-white/10 rounded-lg overflow-hidden shadow-xl z-50">
                  @if (auth.hasRole('ADMIN')) {
                    <a routerLink="/admin" (click)="menuOpen.set(false)"
                      class="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors">
                      Administration
                    </a>
                  }
                  <a routerLink="/results/my" (click)="menuOpen.set(false)"
                    class="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors">
                    Mes résultats
                  </a>
                  <button (click)="logout()"
                    class="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors w-full text-left text-white/70">
                    Déconnexion
                  </button>
                </div>
              }
            </div>
          } @else {
            <a routerLink="/auth/login"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm hover:bg-accent hover:text-white transition-colors">
              Connexion
            </a>
          }
        </div>

        <button (click)="mobileOpen.set(!mobileOpen())" class="lg:hidden p-2 -mr-2">
          {{ mobileOpen() ? '✕' : '☰' }}
        </button>
      </div>

      @if (mobileOpen()) {
        <div class="lg:hidden overflow-hidden border-t border-white/10 bg-black/95">
          <div class="px-6 py-6 flex flex-col gap-1">
            @for (n of navLinks; track n.to) {
              <a [routerLink]="n.to" (click)="mobileOpen.set(false)"
                class="py-3 text-lg border-b border-white/5">{{ n.label }}</a>
            }
            @if (auth.isLoggedIn()) {
              @if (auth.hasRole('ADMIN')) {
                <a routerLink="/admin" (click)="mobileOpen.set(false)"
                  class="py-3 text-lg text-gold border-b border-white/5">⊞ Tableau de bord</a>
              }
              <button (click)="logout()" class="py-3 text-lg text-white/60 text-left">Déconnexion</button>
            } @else {
              <a routerLink="/auth/login" (click)="mobileOpen.set(false)"
                class="py-3 text-lg text-accent">Connexion</a>
            }
          </div>
        </div>
      }
    </header>
  `
})
export class SiteNavComponent {
  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);
  readonly mobileOpen = signal(false);

  readonly navLinks = [
    { label: 'Accueil', to: '/' },
    { label: 'Compétitions', to: '/competitions' },
    { label: 'Résultats', to: '/results' },
    { label: 'Actualités', to: '/news' },
    { label: 'Forum', to: '/forum' },
    { label: 'Athlètes', to: '/athletes' },
    { label: 'Clubs', to: '/athletes/clubs' },
    { label: 'Piscines', to: '/pools' },
  ];

  constructor(readonly auth: AuthService) {}

  @HostListener('window:scroll')
  onScroll(): void { this.scrolled.set(window.scrollY > 80); }

  logout(): void { this.menuOpen.set(false); this.auth.logout(); }
}

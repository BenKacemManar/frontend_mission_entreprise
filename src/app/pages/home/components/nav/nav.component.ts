import { CommonModule } from "@angular/common";
import { Component, HostListener, signal } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { LucideAngularModule, ArrowUpRight, Menu, X } from "lucide-angular";
import { AuthService } from "../../../../core/services/auth.service";

const HASH_LINKS = [
  { label: "Histoire",   href: "#histoire" },
  { label: "Programmes", href: "#programmes" },
  { label: "Champions",  href: "#champions" },
  { label: "Palmarès",   href: "#palmares" },
];

const ROUTE_LINKS = [
  { label: "Compétitions", to: "/competitions" },
  { label: "Résultats",    to: "/results" },
  { label: "Actualités",   to: "/news" },
  { label: "Forum",        to: "/forum" },
  { label: "Athlètes",     to: "/athletes" },
  { label: "Clubs",        to: "/athletes/clubs" },
  { label: "Piscines",     to: "/pools" },
  { label: "Réservations", to: "/reservations" },
];

@Component({
  selector: "app-nav",
  standalone: false,
  template: `
    <header
      class="fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b transition-colors"
      [style.background]="scrolled() ? 'rgba(10,0,0,0.92)' : 'rgba(10,0,0,0)'"
      [style.borderColor]="scrolled() ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0)'"
    >
      <div class="h-0.5 w-full bar-animated"></div>
      <div class="mx-auto max-w-[1600px] px-4 lg:px-6 h-16 flex items-center justify-between gap-2">

        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
          <img src="assets/logo.png" alt="EST" class="w-9 h-9 object-contain rounded-full ring-1 ring-white/20 flex-shrink-0" />
          <div class="leading-tight min-w-0 hidden xl:block">
            <div class="text-[9px] tracking-[0.3em] text-white/50 uppercase">Espérance · 1919</div>
            <div class="text-xs tracking-[0.2em] uppercase">Section Natation</div>
          </div>
        </a>

        <!-- Desktop nav -->
        <nav class="hidden lg:flex items-center flex-1 justify-center flex-wrap gap-0">
          @for (item of hashLinks; track item.href) {
            <a [href]="item.href"
              class="relative px-2 py-1.5 text-[11px] text-white/70 hover:text-white transition-colors group whitespace-nowrap">
              {{ item.label }}
              <span class="absolute left-2 right-2 -bottom-0.5 h-px bg-accent scale-x-0 origin-left transition-transform group-hover:scale-x-100"></span>
            </a>
          }
          <span class="w-px h-4 bg-white/10 mx-1"></span>
          @for (item of routeLinks; track item.to) {
            <a [routerLink]="item.to" routerLinkActive="text-white !opacity-100"
              class="relative px-2 py-1.5 text-[11px] text-white/70 hover:text-white transition-colors group whitespace-nowrap">
              {{ item.label }}
              <span class="absolute left-2 right-2 -bottom-0.5 h-px bg-accent scale-x-0 origin-left transition-transform group-hover:scale-x-100"></span>
            </a>
          }
        </nav>

        <!-- Auth -->
        <div class="hidden lg:flex items-center gap-2 flex-shrink-0">
          @if (auth.isLoggedIn()) {
            <div class="relative">
              <button (click)="menuOpen.set(!menuOpen())"
                class="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40 transition-colors text-xs">
                {{ auth.currentUser?.firstName }}
              </button>
              @if (menuOpen()) {
                <div class="absolute right-0 top-full mt-2 w-52 bg-[#1a0000] border border-white/10 rounded-lg overflow-hidden shadow-xl">
                  @if (auth.hasRole('ADMIN')) {
                    <a routerLink="/admin" (click)="menuOpen.set(false)"
                      class="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors">Administration</a>
                  }
                  <a routerLink="/reservations" (click)="menuOpen.set(false)"
                    class="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors">Mes réservations</a>
                  <button (click)="logout()"
                    class="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors w-full text-left text-white/70">
                    Déconnexion
                  </button>
                </div>
              }
            </div>
          } @else {
            <a href="#contact"
              class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-black text-xs hover:bg-accent hover:text-white transition-colors">
              Rejoindre
            </a>
          }
        </div>

        <!-- Mobile toggle -->
        <button (click)="open.set(!open())" class="lg:hidden p-2 -mr-2" aria-label="Menu">
          @if (open()) {
            <lucide-icon [img]="X" class="w-6 h-6"></lucide-icon>
          } @else {
            <lucide-icon [img]="Menu" class="w-6 h-6"></lucide-icon>
          }
        </button>
      </div>

      <!-- Mobile drawer -->
      @if (open()) {
        <div class="lg:hidden border-t border-white/10 bg-black/95 overflow-y-auto" style="max-height: calc(100vh - 64px)">
          <div class="px-6 py-4 flex flex-col gap-0">
            @for (item of hashLinks; track item.href) {
              <a [href]="item.href" (click)="open.set(false)"
                class="py-3 text-base border-b border-white/5 text-white/80 hover:text-white transition-colors">
                {{ item.label }}
              </a>
            }
            @for (item of routeLinks; track item.to) {
              <a [routerLink]="item.to" (click)="open.set(false)"
                class="py-3 text-base border-b border-white/5 text-white/80 hover:text-white transition-colors">
                {{ item.label }}
              </a>
            }
            @if (auth.isLoggedIn()) {
              <button (click)="logout()" class="py-3 text-base text-white/60 text-left">Déconnexion</button>
            } @else {
              <a routerLink="/auth/login" (click)="open.set(false)" class="py-3 text-base text-accent">Connexion</a>
            }
          </div>
        </div>
      }
    </header>
  `,
})
export class NavComponent {
  readonly ArrowUpRight = ArrowUpRight;
  readonly Menu = Menu;
  readonly X = X;
  readonly open = signal(false);
  readonly menuOpen = signal(false);
  readonly scrolled = signal(false);
  readonly hashLinks = HASH_LINKS;
  readonly routeLinks = ROUTE_LINKS;

  constructor(readonly auth: AuthService) {}

  @HostListener("window:scroll")
  onScroll(): void {
    this.scrolled.set(window.scrollY > 80);
  }

  logout(): void {
    this.menuOpen.set(false);
    this.auth.logout();
  }
}
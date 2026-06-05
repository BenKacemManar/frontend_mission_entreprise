import { CommonModule } from "@angular/common";
import { Component, HostListener, signal } from "@angular/core";
import { LucideAngularModule, ArrowUpRight, Menu, X } from "lucide-angular";

interface NavItem {
  label: string;
  href: string;
}

@Component({
  selector: "app-nav",
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <header
      class="fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b transition-colors"
      [style.background]="scrolled() ? 'rgba(10,0,0,0.85)' : 'rgba(10,0,0,0)'"
      [style.borderColor]="scrolled() ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0)'"
    >
      <div
        class="h-0.5 w-full"
        style="background: linear-gradient(90deg, #E10600 0%, #E10600 50%, #D4AF37 50%, #D4AF37 100%)"
      ></div>
      <div class="mx-auto max-w-[1400px] px-6 lg:px-10 h-20 flex items-center justify-between gap-6">
        <a href="#home" class="flex items-center gap-3">
          <img src="assets/logo.png" alt="EST" class="w-11 h-11 object-contain rounded-full ring-1 ring-white/20" />
          <div class="leading-tight">
            <div class="text-[11px] tracking-[0.3em] text-white/50 uppercase">Espérance · 1919</div>
            <div class="text-sm tracking-[0.25em] uppercase">Section Natation</div>
          </div>
        </a>

        <nav class="hidden lg:flex items-center gap-1">
          @for (item of navItems; track item.href) {
            <a
              [href]="item.href"
              class="relative px-4 py-2 text-sm text-white/70 hover:text-white transition-colors group"
            >
              {{ item.label }}
              <span class="absolute left-4 right-4 -bottom-0.5 h-px bg-accent scale-x-0 origin-left transition-transform group-hover:scale-x-100"></span>
            </a>
          }
        </nav>

        <a
          href="#contact"
          class="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm hover:bg-accent hover:text-white transition-colors"
        >
          Rejoindre <lucide-icon [img]="ArrowUpRight" class="w-4 h-4"></lucide-icon>
        </a>

        <button (click)="open.set(!open())" class="lg:hidden p-2 -mr-2" aria-label="Menu">
          @if (open()) {
            <lucide-icon [img]="X" class="w-6 h-6"></lucide-icon>
          } @else {
            <lucide-icon [img]="Menu" class="w-6 h-6"></lucide-icon>
          }
        </button>
      </div>

      @if (open()) {
        <div class="lg:hidden overflow-hidden border-t border-white/10 bg-black/95">
          <div class="px-6 py-6 flex flex-col gap-1">
            @for (item of navItems; track item.href) {
              <a [href]="item.href" (click)="open.set(false)" class="py-3 text-lg border-b border-white/5">
                {{ item.label }}
              </a>
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
  readonly scrolled = signal(false);

  readonly navItems: NavItem[] = [
    { label: "Accueil", href: "#home" },
    { label: "Histoire", href: "#histoire" },
    { label: "Programmes", href: "#programmes" },
    { label: "Champions", href: "#champions" },
    { label: "Palmarès", href: "#palmares" },
    { label: "Contact", href: "#contact" },
  ];

  @HostListener("window:scroll")
  onScroll(): void {
    this.scrolled.set(window.scrollY > 80);
  }
}

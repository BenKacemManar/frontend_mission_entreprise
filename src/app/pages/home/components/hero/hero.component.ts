import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LucideAngularModule, ArrowUpRight } from "lucide-angular";
import { ApiService } from "../../../../core/services/api.service";

const FOUNDING_YEAR = 1919;

@Component({
  selector: "app-hero",
  template: `
    <section id="home" class="relative h-[100svh] min-h-[720px] overflow-hidden">

      <!-- Background image + overlays -->
      <div #bg class="absolute inset-0 will-change-transform">
        <img
          src="https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=2400&q=80"
          alt=""
          class="w-full h-[120%] object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-[#1a0000]/70 via-[#0a0000]/55 to-ink"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-ink/85 via-transparent to-[#1a0000]/60"></div>
      </div>

      <!-- Pulsing blood-red orb (top-right) -->
      <div class="absolute inset-0 pointer-events-none pulse-blood"
        style="background: radial-gradient(circle at 72% 28%, rgba(225,6,0,0.28) 0%, transparent 55%)">
      </div>

      <!-- Gold haze (bottom-left) -->
      <div class="absolute inset-0 pointer-events-none"
        style="background: radial-gradient(ellipse at 10% 95%, rgba(212,175,55,0.12) 0%, transparent 45%); animation: blood-pulse 6s 1.8s ease-in-out infinite;">
      </div>

      <!-- Floating embers -->
      @for (e of embers; track $index) {
        <div class="ember"
          [style.left]="e.x"
          [style.width]="e.size"
          [style.height]="e.size"
          [style.--d]="e.d"
          [style.--dl]="e.dl"
          [style.--ex]="e.ex">
        </div>
      }

      <!-- Content -->
      <div class="relative z-10 h-full mx-auto max-w-[1400px] px-6 lg:px-10 flex flex-col">
        <div class="flex-1 grid grid-cols-12 items-end pb-16 lg:pb-24 gap-6">
          <div class="col-span-12 lg:col-span-9">

            <!-- Tagline -->
            <div class="flex items-center gap-3 mb-8 anim-up">
              <span class="h-px w-12 bg-accent pulse-blood" style="display:inline-block"></span>
              <span class="text-[11px] tracking-[0.4em] uppercase text-white/70">
                Sang &amp; Or · Depuis 1919
              </span>
            </div>

            <!-- Headline -->
            <h1 class="font-serif leading-[0.88] tracking-tight">
              <span class="line-mask" #line1>
                <span class="line-inner text-[14vw] lg:text-[9.5vw] shimmer-gold">L'eau,</span>
              </span>
              <span class="line-mask" #line2>
                <span class="line-inner text-[14vw] lg:text-[9.5vw] italic">
                  notre <span class="text-accent" style="text-shadow: 0 0 40px rgba(225,6,0,0.5)">arène.</span>
                </span>
              </span>
            </h1>

            <p class="mt-8 max-w-xl text-white/70 text-base lg:text-lg leading-relaxed anim-up-d2">
              La section natation de l'Espérance Sportive de Tunis forme depuis un siècle
              les nageurs qui repoussent les limites du sport tunisien.
            </p>

            <div class="mt-10 flex flex-wrap items-center gap-4 anim-up-d3">
              <a
                href="#programmes"
                class="group inline-flex items-center gap-3 px-7 py-4 bg-accent hover:bg-white hover:text-black transition-all duration-300 rounded-full text-sm tracking-wide"
                style="animation: btn-blood-pulse 3s ease-in-out infinite"
              >
                Découvrir les programmes
                <lucide-icon [img]="ArrowUpRight" class="w-4 h-4 transition-transform group-hover:rotate-45"></lucide-icon>
              </a>
              <a
                href="#histoire"
                class="inline-flex items-center gap-3 px-7 py-4 border border-white/20 hover:border-gold rounded-full text-sm tracking-wide transition-colors duration-300"
              >
                Notre histoire
              </a>
            </div>
          </div>

          <!-- Side stats -->
          <div class="hidden lg:flex col-span-3 flex-col items-end gap-6 text-right anim-up-d1">
            <div class="text-[11px] tracking-[0.3em] uppercase text-white/40">Saison 2025/26</div>
            <div>
              <div class="font-serif text-6xl glow-gold" style="color:#D4AF37">{{ yearsOfGlory }}</div>
              <div class="text-xs tracking-[0.2em] uppercase text-white/50 mt-2">années de gloire</div>
            </div>
            <div class="h-px w-20 bg-gradient-to-r from-accent to-gold ml-auto opacity-60"></div>
            <div>
              <div class="font-serif text-6xl text-white">{{ activeCompetitions }}</div>
              <div class="text-xs tracking-[0.2em] uppercase text-white/50 mt-2">compétitions actives</div>
            </div>
          </div>
        </div>

        <div class="pb-8 flex items-center justify-between text-[11px] tracking-[0.3em] uppercase text-white/40">
          <span>Tunis · Tunisie</span>
          <span class="hidden md:inline">↓ Défiler</span>
          <span>EST · الترجي الرياضي التونسي</span>
        </div>
      </div>
    </section>
  `,
})
export class HeroComponent implements OnInit, AfterViewInit {
  readonly ArrowUpRight = ArrowUpRight;
  readonly yearsOfGlory = new Date().getFullYear() - FOUNDING_YEAR;
  activeCompetitions = 0;
  @ViewChild("bg") bg!: ElementRef<HTMLDivElement>;
  @ViewChild("line1") line1!: ElementRef<HTMLElement>;
  @ViewChild("line2") line2!: ElementRef<HTMLElement>;

  readonly embers = [
    { x: '12%',  size: '4px', d: '3.2s', dl: '0s',    ex: '10px'  },
    { x: '22%',  size: '3px', d: '4.4s', dl: '0.9s',  ex: '-8px'  },
    { x: '35%',  size: '5px', d: '2.9s', dl: '1.6s',  ex: '14px'  },
    { x: '48%',  size: '3px', d: '3.8s', dl: '0.4s',  ex: '-6px'  },
    { x: '60%',  size: '4px', d: '4.1s', dl: '2.0s',  ex: '8px'   },
    { x: '72%',  size: '3px', d: '3.0s', dl: '1.1s',  ex: '-12px' },
    { x: '82%',  size: '5px', d: '4.6s', dl: '0.7s',  ex: '10px'  },
    { x: '90%',  size: '3px', d: '3.5s', dl: '2.4s',  ex: '-8px'  },
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.get<any>('/dashboard/stats').subscribe({
      next: r => { this.activeCompetitions = (r?.data ?? r)?.nbActiveCompetitions ?? 0; }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.line1.nativeElement.classList.add("in"), 100);
    setTimeout(() => this.line2.nativeElement.classList.add("in"), 250);

    window.addEventListener("scroll", () => {
      const y = window.scrollY * 0.4;
      this.bg.nativeElement.style.transform = `translateY(${y}px)`;
    }, { passive: true });
  }
}

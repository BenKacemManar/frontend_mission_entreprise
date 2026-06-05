import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { LucideAngularModule, ArrowUpRight } from "lucide-angular";

@Component({
  selector: "app-hero",
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <section id="home" class="relative h-[100svh] min-h-[720px] overflow-hidden">
      <div #bg class="absolute inset-0 will-change-transform">
        <img
          src="https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=2400&q=80"
          alt=""
          class="w-full h-[120%] object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-[#1a0000]/60 via-[#0a0000]/50 to-ink"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-[#1a0000]/60"></div>
        <div
          class="absolute inset-0 mix-blend-overlay opacity-40"
          style="background: radial-gradient(circle at 70% 30%, #E1060040, transparent 60%)"
        ></div>
      </div>

      <div class="relative z-10 h-full mx-auto max-w-[1400px] px-6 lg:px-10 flex flex-col">
        <div class="flex-1 grid grid-cols-12 items-end pb-16 lg:pb-24 gap-6">
          <div class="col-span-12 lg:col-span-9">
            <div class="flex items-center gap-3 mb-8">
              <span class="h-px w-12 bg-accent"></span>
              <span class="text-[11px] tracking-[0.4em] uppercase text-white/70">
                Sang & Or · Depuis 1919
              </span>
            </div>

            <h1 class="font-serif leading-[0.88] tracking-tight">
              <span class="line-mask" #line1>
                <span class="line-inner text-[14vw] lg:text-[9.5vw] text-gold">L'eau,</span>
              </span>
              <span class="line-mask" #line2>
                <span class="line-inner text-[14vw] lg:text-[9.5vw] italic">
                  notre <span class="text-accent">arène.</span>
                </span>
              </span>
            </h1>

            <p class="mt-8 max-w-xl text-white/70 text-base lg:text-lg leading-relaxed">
              La section natation de l'Espérance Sportive de Tunis forme depuis un siècle
              les nageurs qui repoussent les limites du sport tunisien.
            </p>

            <div class="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#programmes"
                class="group inline-flex items-center gap-3 px-7 py-4 bg-accent hover:bg-white hover:text-black transition-colors rounded-full text-sm tracking-wide"
              >
                Découvrir les programmes
                <lucide-icon [img]="ArrowUpRight" class="w-4 h-4 transition-transform group-hover:rotate-45"></lucide-icon>
              </a>
              <a
                href="#histoire"
                class="inline-flex items-center gap-3 px-7 py-4 border border-white/20 hover:border-white rounded-full text-sm tracking-wide transition-colors"
              >
                Notre histoire
              </a>
            </div>
          </div>

          <div class="hidden lg:flex col-span-3 flex-col items-end gap-6 text-right">
            <div class="text-[11px] tracking-[0.3em] uppercase text-white/40">Saison 2025/26</div>
            <div>
              <div class="font-serif text-6xl text-gold">107</div>
              <div class="text-xs tracking-[0.2em] uppercase text-white/50 mt-2">années de gloire</div>
            </div>
            <div class="h-px w-20 bg-white/20 ml-auto"></div>
            <div>
              <div class="font-serif text-6xl">42</div>
              <div class="text-xs tracking-[0.2em] uppercase text-white/50 mt-2">titres nationaux</div>
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
export class HeroComponent implements AfterViewInit {
  readonly ArrowUpRight = ArrowUpRight;
  @ViewChild("bg") bg!: ElementRef<HTMLDivElement>;
  @ViewChild("line1") line1!: ElementRef<HTMLElement>;
  @ViewChild("line2") line2!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    setTimeout(() => this.line1.nativeElement.classList.add("in"), 100);
    setTimeout(() => this.line2.nativeElement.classList.add("in"), 250);

    window.addEventListener("scroll", () => {
      const y = window.scrollY * 0.4;
      this.bg.nativeElement.style.transform = `translateY(${y}px)`;
    }, { passive: true });
  }
}

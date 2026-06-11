import { Component } from "@angular/core";
import { RevealDirective } from "../../../../shared/reveal.directive";

interface Champion {
  name: string;
  role: string;
  img: string;
}

@Component({
  selector: "app-champions",
  template: `
    <section id="champions" class="relative py-32 lg:py-40 border-t border-white/10">
      <div class="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div class="mb-20 max-w-3xl" appReveal>
          <div class="flex items-center gap-4">
            <span class="text-xs tracking-[0.3em] uppercase text-white/40">03</span>
            <span class="h-px w-10 bg-accent"></span>
            <span class="text-xs tracking-[0.3em] uppercase text-white/70">Champions</span>
          </div>
          <h2 class="font-serif text-5xl lg:text-7xl leading-[0.95] mt-8">
            Les visages <br />
            <span class="italic text-gold">du sang & or.</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (c of champs; track c.name; let i = $index) {
            <div appReveal [revealDelay]="i * 80" class="group">
              <div class="relative aspect-[3/4] overflow-hidden mb-5">
                <img
                  [src]="c.img"
                  [alt]="c.name"
                  class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div class="absolute top-4 left-4 text-[11px] tracking-[0.3em] uppercase text-white/70">
                  0{{ i + 1 }}
                </div>
              </div>
              <h3 class="font-serif text-2xl">{{ c.name }}</h3>
              <p class="text-sm text-white/50 mt-1">{{ c.role }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class ChampionsComponent {
  readonly champs: Champion[] = [
    {
      name: "Yassine Khelifi",
      role: "100m papillon · Champion national",
      img: "https://images.unsplash.com/photo-1560089000-7433a4ebbd64?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Sarra Mahmoud",
      role: "200m nage libre · Médaille d'or africaine",
      img: "https://images.unsplash.com/photo-1593055497705-59a84c5928b2?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Mehdi Ben Romdhane",
      role: "400m 4 nages · Record national",
      img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Ines Trabelsi",
      role: "50m dos · Espoir 2025",
      img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
    },
  ];
}

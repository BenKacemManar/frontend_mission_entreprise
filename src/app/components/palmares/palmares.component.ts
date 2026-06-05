import { Component } from "@angular/core";
import { LucideAngularModule, Trophy } from "lucide-angular";
import { RevealDirective } from "../../shared/reveal.directive";

interface Row {
  year: string;
  title: string;
  detail: string;
}

@Component({
  selector: "app-palmares",
  standalone: true,
  imports: [LucideAngularModule, RevealDirective],
  template: `
    <section id="palmares" class="relative py-32 lg:py-40 border-t border-white/10">
      <div class="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div class="mb-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div appReveal>
            <div class="flex items-center gap-4">
              <span class="text-xs tracking-[0.3em] uppercase text-white/40">04</span>
              <span class="h-px w-10 bg-accent"></span>
              <span class="text-xs tracking-[0.3em] uppercase text-white/70">Palmarès</span>
            </div>
            <h2 class="font-serif text-5xl lg:text-7xl leading-[0.95] mt-8">
              Cinq saisons. <br />
              <span class="italic">Une obsession :</span> <br />
              <span class="text-accent">gagner.</span>
            </h2>
          </div>
          <lucide-icon [img]="Trophy" class="w-16 h-16 text-white/20"></lucide-icon>
        </div>

        <div class="border-t border-white/10">
          @for (r of rows; track r.year; let i = $index) {
            <div
              appReveal
              [revealDelay]="i * 50"
              class="group grid grid-cols-12 items-center py-8 lg:py-10 border-b border-white/10 hover:bg-white/[0.02] transition-colors px-2"
            >
              <div class="col-span-3 lg:col-span-2 font-serif text-3xl lg:text-5xl text-gold">
                {{ r.year }}
              </div>
              <div class="col-span-9 lg:col-span-7 font-serif text-2xl lg:text-3xl">
                {{ r.title }}
              </div>
              <div class="hidden lg:block col-span-3 text-right text-white/50 text-sm tracking-wide">
                {{ r.detail }}
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class PalmaresComponent {
  readonly Trophy = Trophy;
  readonly rows: Row[] = [
    { year: "2025", title: "Championnat National d'Hiver", detail: "12 médailles d'or · 8 d'argent" },
    { year: "2024", title: "Coupe d'Afrique de Natation", detail: "3e nation · 8 médailles" },
    { year: "2023", title: "Open de Tunis", detail: "3 records nationaux battus" },
    { year: "2022", title: "Championnat National d'Été", detail: "Titre par équipe" },
    { year: "2021", title: "Meeting de la Méditerranée", detail: "5 médailles individuelles" },
  ];
}

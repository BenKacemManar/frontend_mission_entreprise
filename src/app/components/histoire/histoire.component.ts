import { Component } from "@angular/core";
import { RevealDirective } from "../../shared/reveal.directive";

@Component({
  selector: "app-histoire",
  standalone: true,
  imports: [RevealDirective],
  template: `
    <section id="histoire" class="relative py-32 lg:py-40">
      <div class="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-12 gap-10">
        <div class="lg:col-span-5" appReveal>
          <div class="flex items-center gap-4">
            <span class="text-xs tracking-[0.3em] uppercase text-white/40">01</span>
            <span class="h-px w-10 bg-accent"></span>
            <span class="text-xs tracking-[0.3em] uppercase text-white/70">Histoire</span>
          </div>
          <h2 class="font-serif text-5xl lg:text-7xl leading-[0.95] mt-8">
            Un siècle <br />
            <span class="italic text-gold">de bassins</span> <br />
            conquis.
          </h2>
        </div>
        <div class="lg:col-span-6 lg:col-start-7 space-y-6 text-white/70 text-lg leading-relaxed" appReveal [revealDelay]="120">
          <p>
            Fondée en 1919 à Bab Souika, l'Espérance Sportive de Tunis est l'un des plus
            anciens et prestigieux clubs sportifs d'Afrique. Sa section natation porte
            haut les couleurs sang et or dans chaque bassin du continent.
          </p>
          <p>
            De Tunis aux championnats d'Afrique, nos nageurs incarnent la rigueur, le
            travail et l'esprit de famille qui caractérisent la grande maison espérantiste.
          </p>
          <div class="pt-4 flex items-center gap-6">
            <div class="h-px flex-1 bg-white/20"></div>
            <span class="text-xs tracking-[0.3em] uppercase text-white/40">Estd. 1919</span>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HistoireComponent {}

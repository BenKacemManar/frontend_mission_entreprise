import { Component, OnInit } from "@angular/core";
import { LucideAngularModule, ArrowUpRight } from "lucide-angular";
import { RevealDirective } from "../../../../shared/reveal.directive";
import { ApiService } from "../../../../core/services/api.service";

interface Program {
  n: string;
  title: string;
  age: string;
  desc: string;
  img: string;
}

@Component({
  selector: "app-programmes",
  template: `
    <section id="programmes" class="relative py-32 lg:py-40 border-t border-white/10">
      <div class="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
          <div>
            <div class="flex items-center gap-4">
              <span class="text-xs tracking-[0.3em] uppercase text-white/40">02</span>
              <span class="h-px w-10 bg-accent"></span>
              <span class="text-xs tracking-[0.3em] uppercase text-white/70">Programmes</span>
            </div>
            <h2 class="font-serif text-5xl lg:text-7xl leading-[0.95] mt-8 max-w-2xl">
              Trois voies, <br />
              <span class="italic">une seule</span> exigence.
            </h2>
          </div>
          <p class="max-w-md text-white/60 leading-relaxed">
            Chaque parcours est encadré par des entraîneurs diplômés et conçu pour
            révéler le meilleur de chaque nageur, du débutant au compétiteur.
          </p>
        </div>

        <div class="grid lg:grid-cols-3 gap-px" style="background: linear-gradient(90deg, #E10600, #D4AF37)">
          @for (p of programs; track p.n) {
            <article
              appReveal
              class="group relative bg-ink hover:bg-[#1a0000] transition-colors p-8 lg:p-10 flex flex-col h-full overflow-hidden"
            >
              <div class="aspect-[4/5] -mx-8 lg:-mx-10 -mt-8 lg:-mt-10 mb-8 overflow-hidden">
                @if (p.img) {
                  <img
                    [src]="p.img"
                    [alt]="p.title"
                    class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                } @else {
                  <div class="w-full h-full flex items-center justify-center bg-[#1a0000]">
                    <span class="font-serif text-7xl text-white/10">{{ p.n }}</span>
                  </div>
                }
              </div>
              <div class="flex items-center justify-between mb-6">
                <span class="text-xs tracking-[0.3em] text-white/40">{{ p.n }}</span>
                <span class="text-xs tracking-[0.2em] uppercase text-gold">{{ p.age }}</span>
              </div>
              <h3 class="font-serif text-3xl lg:text-4xl mb-4">{{ p.title }}</h3>
              <p class="text-white/60 leading-relaxed mb-8">{{ p.desc }}</p>
              <div class="mt-auto flex items-center justify-between">
                <span class="text-sm tracking-wide">S'inscrire</span>
                <span
                  class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-colors"
                >
                  <lucide-icon [img]="ArrowUpRight" class="w-4 h-4"></lucide-icon>
                </span>
              </div>
            </article>
          }
          @if (programs.length === 0) {
            <div class="col-span-3 text-white/40 text-center py-16">Aucun programme disponible.</div>
          }
        </div>
      </div>
    </section>
  `,
})
export class ProgrammesComponent implements OnInit {
  readonly ArrowUpRight = ArrowUpRight;
  programs: Program[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.get<any>('/programs/actives').subscribe({
      next: r => {
        const items: any[] = r?.data ?? r ?? [];
        this.programs = items.map((p: any, i: number) => ({
          n: String(i + 1).padStart(2, '0'),
          title: p.nom,
          age: p.ageMin != null && p.ageMax != null ? `${p.ageMin} — ${p.ageMax} ans` : (p.ageMin != null ? `${p.ageMin} ans et +` : ''),
          desc: p.description ?? '',
          img: p.imageUrl ?? '',
        }));
      }
    });
  }
}

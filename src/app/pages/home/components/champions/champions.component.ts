import { Component, OnInit } from "@angular/core";
import { RevealDirective } from "../../../../shared/reveal.directive";
import { ApiService } from "../../../../core/services/api.service";

interface Champion {
  name: string;
  role: string;
  initials: string;
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
              <div class="relative aspect-[3/4] overflow-hidden mb-5 bg-[#1a0000] flex items-center justify-center">
                <span class="font-serif text-6xl text-white/20">{{ c.initials }}</span>
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div class="absolute top-4 left-4 text-[11px] tracking-[0.3em] uppercase text-white/70">
                  0{{ i + 1 }}
                </div>
              </div>
              <h3 class="font-serif text-2xl">{{ c.name }}</h3>
              <p class="text-sm text-white/50 mt-1">{{ c.role }}</p>
            </div>
          }
          @if (champs.length === 0) {
            <div class="col-span-4 text-white/40 text-center py-10">Aucun classement disponible.</div>
          }
        </div>
      </div>
    </section>
  `,
})
export class ChampionsComponent implements OnInit {
  champs: Champion[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.get<any>('/rankings', { page: 0, size: 4, sort: 'rank' }).subscribe({
      next: r => {
        const rows = r?.data ?? r?.content ?? [];
        this.champs = rows.map((row: any) => ({
          name: row.athleteName,
          role: `${row.eventLabel ?? ''} · ${row.clubName ?? ''}`,
          initials: (row.athleteName ?? '').split(' ').map((p: string) => p[0]).join('').toUpperCase().slice(0, 2),
        }));
      }
    });
  }
}

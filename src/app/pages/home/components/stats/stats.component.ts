import { Component, OnInit } from "@angular/core";
import { CounterDirective } from "../../../../shared/counter.directive";
import { ApiService } from "../../../../core/services/api.service";

interface Stat {
  value: number;
  label: string;
  suffix: string;
}

@Component({
  selector: "app-stats",
  template: `
    <section class="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 grid grid-cols-2 lg:grid-cols-4 gap-y-12">
      @for (it of items; track it.label; let i = $index) {
        <div class="border-l-2 pl-6 reveal border-blood-gold"
          [style.animationDelay]="(i * 0.6) + 's'">
          <span
            class="font-serif text-6xl lg:text-7xl tabular-nums glow-gold"
            [style.color]="i % 2 === 0 ? '#D4AF37' : '#fff'"
            [appCounter]="it.value"
            [counterSuffix]="it.suffix"
          ></span>
          <div class="mt-3 text-xs tracking-[0.2em] uppercase text-white/50">{{ it.label }}</div>
        </div>
      }
    </section>
  `,
})
export class StatsComponent implements OnInit {
  items: Stat[] = [
    { value: 0, label: "Athlètes licenciés", suffix: "+" },
    { value: 0, label: "Clubs affiliés", suffix: "" },
    { value: 0, label: "Compétitions organisées", suffix: "" },
    { value: 0, label: "Licences délivrées", suffix: "" },
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.get<any>('/dashboard/stats').subscribe({
      next: r => {
        const s = r?.data ?? r;
        this.items = [
          { value: s?.nbAthletes ?? 0, label: "Athlètes licenciés", suffix: "+" },
          { value: s?.nbClubs ?? 0, label: "Clubs affiliés", suffix: "" },
          { value: s?.nbCompetitions ?? 0, label: "Compétitions organisées", suffix: "" },
          { value: s?.nbLicences ?? 0, label: "Licences délivrées", suffix: "" },
        ];
      }
    });
  }
}

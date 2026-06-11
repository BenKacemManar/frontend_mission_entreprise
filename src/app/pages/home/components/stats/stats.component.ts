import { Component } from "@angular/core";
import { CounterDirective } from "../../../../shared/counter.directive";

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
        <div class="border-l-2 pl-6" [style.borderColor]="i % 2 === 0 ? '#E10600' : '#D4AF37'">
          <span
            class="font-serif text-6xl lg:text-7xl tabular-nums text-gold"
            [appCounter]="it.value"
            [counterSuffix]="it.suffix"
          ></span>
          <div class="mt-3 text-xs tracking-[0.2em] uppercase text-white/50">{{ it.label }}</div>
        </div>
      }
    </section>
  `,
})
export class StatsComponent {
  readonly items: Stat[] = [
    { value: 320, label: "Nageurs licenciés", suffix: "+" },
    { value: 42, label: "Titres nationaux", suffix: "" },
    { value: 18, label: "Médailles internationales", suffix: "" },
    { value: 12, label: "Entraîneurs certifiés", suffix: "" },
  ];
}

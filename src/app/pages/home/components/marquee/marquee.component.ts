import { Component } from "@angular/core";

@Component({
  selector: "app-marquee",
  template: `
    <div
      class="relative border-y overflow-hidden py-8"
      style="background: linear-gradient(90deg, #E10600, #a80000, #E10600); border-color: #D4AF37"
    >
      <div class="marquee-track gap-16">
        @for (w of loop; track $index) {
          <div class="flex items-center gap-16 shrink-0">
            <span class="font-serif text-5xl lg:text-7xl tracking-tight text-gold">{{ w }}</span>
            <span class="w-2 h-2 rounded-full bg-white"></span>
          </div>
        }
      </div>
    </div>
  `,
})
export class MarqueeComponent {
  readonly words = ["Excellence", "Discipline", "Héritage", "Victoire", "Sang & Or", "1919"];
  readonly loop = [...this.words, ...this.words, ...this.words, ...this.words];
}

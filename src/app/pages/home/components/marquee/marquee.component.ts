import { Component } from "@angular/core";

@Component({
  selector: "app-marquee",
  template: `
    <div
      class="relative border-y overflow-hidden py-8"
      style="background: linear-gradient(90deg, #1a0000 0%, #E10600 25%, #a00000 50%, #E10600 75%, #1a0000 100%); border-color: #D4AF37; border-width: 1.5px"
    >
      <!-- Gold scan line overlay -->
      <div class="gold-scan-line inset-y-0"></div>

      <div class="marquee-track gap-16">
        @for (w of loop; track $index) {
          <div class="flex items-center gap-16 shrink-0">
            <span class="font-serif text-5xl lg:text-7xl tracking-tight shimmer-gold">{{ w }}</span>
            <span class="w-2 h-2 rounded-full" style="background: radial-gradient(circle, #D4AF37, #a07820)"></span>
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

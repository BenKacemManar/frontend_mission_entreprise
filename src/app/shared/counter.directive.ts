import { Directive, ElementRef, Input, OnInit, inject } from "@angular/core";

@Directive({
  selector: "[appCounter]",
})
export class CounterDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLElement>);

  @Input({ required: true }) appCounter!: number;
  @Input() counterSuffix = "";
  @Input() counterDuration = 1600;

  ngOnInit(): void {
    const node = this.el.nativeElement;
    node.textContent = `0${this.counterSuffix}`;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.run();
          observer.disconnect();
        }
      });
    }, { rootMargin: "-50px" });
    observer.observe(node);
  }

  private run(): void {
    const node = this.el.nativeElement;
    const target = this.appCounter;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 4);
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / this.counterDuration);
      const v = Math.floor(target * ease(p));
      node.textContent = `${v}${this.counterSuffix}`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

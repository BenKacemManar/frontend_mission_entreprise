import { Directive, ElementRef, HostListener, Input, OnInit, inject } from "@angular/core";

@Directive({
  selector: "[appParallax]",
  standalone: true,
})
export class ParallaxDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLElement>);

  @Input() parallaxSpeed = 0.3;

  ngOnInit(): void {
    this.update();
  }

  @HostListener("window:scroll")
  onScroll(): void {
    this.update();
  }

  private update(): void {
    const node = this.el.nativeElement;
    const rect = node.getBoundingClientRect();
    const offset = (window.innerHeight - rect.top) * this.parallaxSpeed;
    node.style.transform = `translateY(${Math.max(0, offset * -1 + 100)}px)`;
  }
}

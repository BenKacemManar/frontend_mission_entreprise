import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from "@angular/core";

@Directive({
  selector: "[appReveal]",
})
export class RevealDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  @Input() revealDelay = 0;

  ngOnInit(): void {
    const node = this.el.nativeElement;
    node.classList.add("reveal");
    if (this.revealDelay) {
      node.style.transitionDelay = `${this.revealDelay}ms`;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add("in");
            this.observer?.disconnect();
          }
        });
      },
      { rootMargin: "-80px" }
    );
    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

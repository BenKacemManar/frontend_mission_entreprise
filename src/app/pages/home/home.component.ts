import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="min-h-screen bg-gradient-to-b from-[#1a0000] via-ink to-ink text-white antialiased selection:bg-accent selection:text-white">
      <div class="grain"></div>
      <app-nav></app-nav>
      <app-hero></app-hero>
      <app-marquee></app-marquee>
      <app-stats></app-stats>
      <app-histoire></app-histoire>
      <app-programmes></app-programmes>
      <app-champions></app-champions>
      <app-palmares></app-palmares>
      <app-contact></app-contact>
      <app-footer></app-footer>
    </div>
  `
})
export class HomeComponent {}

import { Component } from '@angular/core';

@Component({
  selector: 'app-page-layout',
  template: `
    <div class="min-h-screen bg-ink text-white antialiased">
      <app-site-nav></app-site-nav>
      <main class="pt-20">
        <ng-content></ng-content>
      </main>
      <app-site-footer></app-site-footer>
    </div>
  `
})
export class PageLayoutComponent {}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteNavComponent } from '../site-nav/site-nav.component';
import { SiteFooterComponent } from '../site-footer/site-footer.component';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [RouterOutlet, SiteNavComponent, SiteFooterComponent],
  template: `
    <div class="min-h-screen bg-ink text-white antialiased">
      <app-site-nav />
      <main class="pt-20">
        <ng-content />
      </main>
      <app-site-footer />
    </div>
  `
})
export class PageLayoutComponent {}

import { Component } from '@angular/core';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  template: `
    <footer class="relative border-t border-white/10 bg-black">
      <div class="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <div class="font-serif text-[18vw] lg:text-[14vw] leading-none tracking-tight text-white/[0.04] select-none">
          ESPÉRANCE
        </div>
        <div class="mt-12 grid lg:grid-cols-12 gap-8 items-end">
          <div class="lg:col-span-5 flex items-center gap-4">
            <img src="assets/logo.png" alt="EST" class="w-14 h-14 object-contain rounded-full ring-1 ring-white/20" />
            <div>
              <div class="text-sm tracking-[0.25em] uppercase">EST · Section Natation</div>
              <div class="text-xs text-white/40 mt-1">Sang & Or · Depuis 1919</div>
            </div>
          </div>
          <div class="lg:col-span-4 text-sm text-white/50">
            « L'eau ne ment jamais. Elle révèle ceux qui s'y donnent vraiment. »
          </div>
          <div class="lg:col-span-3 lg:text-right text-xs tracking-[0.2em] uppercase text-white/40">
            © 2026 EST Natation
          </div>
        </div>
      </div>
      <div class="h-1 w-full"
        style="background:linear-gradient(90deg,#E10600 0%,#E10600 50%,#D4AF37 50%,#D4AF37 100%)">
      </div>
    </footer>
  `
})
export class SiteFooterComponent {}

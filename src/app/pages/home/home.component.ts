import { Component } from '@angular/core';
import { NavComponent } from '../../components/nav/nav.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { MarqueeComponent } from '../../components/marquee/marquee.component';
import { StatsComponent } from '../../components/stats/stats.component';
import { HistoireComponent } from '../../components/histoire/histoire.component';
import { ProgrammesComponent } from '../../components/programmes/programmes.component';
import { ChampionsComponent } from '../../components/champions/champions.component';
import { PalmaresComponent } from '../../components/palmares/palmares.component';
import { ContactComponent } from '../../components/contact/contact.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavComponent, HeroComponent, MarqueeComponent, StatsComponent,
    HistoireComponent, ProgrammesComponent, ChampionsComponent,
    PalmaresComponent, ContactComponent, FooterComponent
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-[#1a0000] via-ink to-ink text-white antialiased selection:bg-accent selection:text-white">
      <div class="grain"></div>
      <app-nav />
      <app-hero />
      <app-marquee />
      <app-stats />
      <app-histoire />
      <app-programmes />
      <app-champions />
      <app-palmares />
      <app-contact />
      <app-footer />
    </div>
  `
})
export class HomeComponent {}

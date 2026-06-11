import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { HomeRoutingModule } from './home-routing.module';
import { RevealDirective } from '../../shared/reveal.directive';
import { CounterDirective } from '../../shared/counter.directive';
import { ParallaxDirective } from '../../shared/parallax.directive';

import { HomeComponent } from './home.component';
import { NavComponent } from './components/nav/nav.component';
import { HeroComponent } from './components/hero/hero.component';
import { MarqueeComponent } from './components/marquee/marquee.component';
import { StatsComponent } from './components/stats/stats.component';
import { HistoireComponent } from './components/histoire/histoire.component';
import { ProgrammesComponent } from './components/programmes/programmes.component';
import { ChampionsComponent } from './components/champions/champions.component';
import { PalmaresComponent } from './components/palmares/palmares.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavComponent,
    RevealDirective,
    CounterDirective,
    ParallaxDirective,
    HeroComponent,
    MarqueeComponent,
    StatsComponent,
    HistoireComponent,
    ProgrammesComponent,
    ChampionsComponent,
    PalmaresComponent,
    ContactComponent,
    FooterComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule, HomeRoutingModule],
})
export class HomeModule {}

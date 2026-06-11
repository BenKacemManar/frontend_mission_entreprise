import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

interface NavLink {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  activeRoute = '';
  menuOpen = false;
  scrolled = false;

  links: NavLink[] = [
    { label: 'Résultats',  path: '/results',      icon: '🏆' },
    { label: 'Calendrier', path: '/competitions',  icon: '📅' },
    { label: 'Athlètes',   path: '/athletes',      icon: '🏊' },
    { label: 'Actualités', path: '/news',           icon: '📰' }
  ];

  constructor(public auth: AuthService, private router: Router) {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 10;
  }

  ngOnInit(): void {
    this.auth.currentUser$.subscribe(user => this.currentUser = user);
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.activeRoute = e.urlAfterRedirects;
      this.menuOpen = false;
    });
  }

  isActive(path: string): boolean {
    return this.activeRoute.startsWith(path);
  }

  logout(): void {
    this.auth.logout();
  }
}

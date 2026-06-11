import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="min-h-screen bg-gradient-to-b from-[#1a0000] via-ink to-ink text-white flex items-center justify-center px-6">
      <div class="w-full max-w-md">
        <div class="text-center mb-12">
          <a routerLink="/" class="inline-flex flex-col items-center gap-3">
            <img src="assets/logo.png" alt="EST" class="w-16 h-16 object-contain rounded-full ring-1 ring-white/20" />
            <div class="text-[11px] tracking-[0.3em] text-white/50 uppercase">Espérance · 1919</div>
            <div class="text-sm tracking-[0.25em] uppercase">Section Natation</div>
          </a>
        </div>
        <div class="border-t border-white/10 pt-8">
          <div class="flex items-center gap-4 mb-8">
            <span class="text-xs tracking-[0.3em] uppercase text-white/40">01</span>
            <span class="h-px w-10 bg-accent"></span>
            <span class="text-xs tracking-[0.3em] uppercase text-white/70">Connexion</span>
          </div>
          <h1 class="font-serif text-4xl mb-8">
            Bon retour <br/><span class="italic text-gold">parmi nous.</span>
          </h1>
          @if (error()) {
            <div class="mb-6 px-4 py-3 rounded-lg border text-sm border-accent text-accent" style="background:rgba(225,6,0,0.08)">
              {{ error() }}
            </div>
          }
          <form (ngSubmit)="submit()" class="space-y-8">
            <div class="relative">
              <span class="absolute left-0 transition-all pointer-events-none"
                [class]="(focusEmail || email) ? 'top-0 text-[10px] tracking-[0.3em] uppercase text-white/50' : 'top-5 text-base text-white/40'">
                Email
              </span>
              <input type="email" [(ngModel)]="email" name="email" required
                (focus)="focusEmail=true" (blur)="focusEmail=false"
                class="block w-full bg-transparent border-b border-white/20 focus:border-white pt-6 pb-3 outline-none transition-colors" />
            </div>
            <div class="relative">
              <span class="absolute left-0 transition-all pointer-events-none"
                [class]="(focusPass || password) ? 'top-0 text-[10px] tracking-[0.3em] uppercase text-white/50' : 'top-5 text-base text-white/40'">
                Mot de passe
              </span>
              <input type="password" [(ngModel)]="password" name="password" required
                (focus)="focusPass=true" (blur)="focusPass=false"
                class="block w-full bg-transparent border-b border-white/20 focus:border-white pt-6 pb-3 outline-none transition-colors" />
            </div>
            <button type="submit" [disabled]="loading()"
              class="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-black hover:bg-accent hover:text-white transition-colors disabled:opacity-50">
              {{ loading() ? 'Connexion…' : 'Se connecter' }}
            </button>
          </form>
          <p class="mt-8 text-center text-sm text-white/50">
            Pas encore de compte ?
            <a routerLink="/auth/register" class="text-gold hover:underline ml-1">S'inscrire</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = ''; password = '';
  focusEmail = false; focusPass = false;
  readonly error = signal('');
  readonly loading = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    this.error.set(''); this.loading.set(true);
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (e: any) => { this.error.set(e?.error?.message ?? 'Identifiants invalides.'); this.loading.set(false); }
    });
  }
}

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="min-h-screen bg-gradient-to-b from-[#1a0000] via-ink to-ink text-white flex items-center justify-center px-6 py-16">
      <div class="w-full max-w-md">
        <div class="text-center mb-12">
          <a routerLink="/" class="inline-flex flex-col items-center gap-3">
            <img src="assets/logo.png" alt="EST" class="w-16 h-16 object-contain rounded-full ring-1 ring-white/20" />
            <div class="text-sm tracking-[0.25em] uppercase">Section Natation</div>
          </a>
        </div>
        <div class="border-t border-white/10 pt-8">
          <div class="flex items-center gap-4 mb-8">
            <span class="h-px w-10 bg-accent"></span>
            <span class="text-xs tracking-[0.3em] uppercase text-white/70">Inscription</span>
          </div>
          <h1 class="font-serif text-4xl mb-8">
            Rejoignez <br/><span class="italic text-gold">la famille.</span>
          </h1>
          @if (error()) {
            <div class="mb-6 px-4 py-3 rounded-lg border text-sm border-accent text-accent" style="background:rgba(225,6,0,0.08)">{{ error() }}</div>
          }
          <form (ngSubmit)="submit()" class="space-y-8">
            <div class="grid grid-cols-2 gap-6">
              <div class="relative">
                <span class="absolute left-0 pointer-events-none transition-all"
                  [class]="f1||form.firstName ? 'top-0 text-[10px] tracking-widest uppercase text-white/50':'top-5 text-base text-white/40'">Prénom</span>
                <input [(ngModel)]="form.firstName" name="fn" required
                  (focus)="f1=true" (blur)="f1=false"
                  class="block w-full bg-transparent border-b border-white/20 focus:border-white pt-6 pb-3 outline-none transition-colors"/>
              </div>
              <div class="relative">
                <span class="absolute left-0 pointer-events-none transition-all"
                  [class]="f2||form.lastName ? 'top-0 text-[10px] tracking-widest uppercase text-white/50':'top-5 text-base text-white/40'">Nom</span>
                <input [(ngModel)]="form.lastName" name="ln" required
                  (focus)="f2=true" (blur)="f2=false"
                  class="block w-full bg-transparent border-b border-white/20 focus:border-white pt-6 pb-3 outline-none transition-colors"/>
              </div>
            </div>
            <div class="relative">
              <span class="absolute left-0 pointer-events-none transition-all"
                [class]="f3||form.email ? 'top-0 text-[10px] tracking-widest uppercase text-white/50':'top-5 text-base text-white/40'">Email</span>
              <input type="email" [(ngModel)]="form.email" name="email" required
                (focus)="f3=true" (blur)="f3=false"
                class="block w-full bg-transparent border-b border-white/20 focus:border-white pt-6 pb-3 outline-none transition-colors"/>
            </div>
            <div class="relative">
              <span class="absolute left-0 pointer-events-none transition-all"
                [class]="f4||form.password ? 'top-0 text-[10px] tracking-widest uppercase text-white/50':'top-5 text-base text-white/40'">Mot de passe</span>
              <input type="password" [(ngModel)]="form.password" name="pw" required
                (focus)="f4=true" (blur)="f4=false"
                class="block w-full bg-transparent border-b border-white/20 focus:border-white pt-6 pb-3 outline-none transition-colors"/>
            </div>
            <div>
              <p class="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-3">Rôle</p>
              <div class="flex gap-4">
                @for (r of roles; track r.value) {
                  <button type="button" (click)="form.role = r.value"
                    class="flex-1 py-2.5 rounded-full border text-sm transition-colors"
                    [style.background]="form.role===r.value?'#E10600':''"
                    [style.borderColor]="form.role===r.value?'#E10600':'rgba(255,255,255,0.2)'"
                    [style.color]="form.role===r.value?'white':'rgba(255,255,255,0.6)'">
                    {{ r.label }}
                  </button>
                }
              </div>
            </div>
            <button type="submit" [disabled]="loading()"
              class="w-full py-4 rounded-full bg-white text-black hover:bg-accent hover:text-white transition-colors disabled:opacity-50">
              {{ loading() ? 'Inscription…' : 'Créer mon compte' }}
            </button>
          </form>
          <p class="mt-8 text-center text-sm text-white/50">
            Déjà un compte ? <a routerLink="/auth/login" class="text-gold hover:underline ml-1">Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  form = { firstName:'', lastName:'', email:'', password:'', role:'ATHLETE' };
  f1=false; f2=false; f3=false; f4=false;
  readonly error = signal('');
  readonly loading = signal(false);
  readonly roles = [{ value:'ATHLETE', label:'Athlète' }, { value:'COACH', label:'Entraîneur' }];

  constructor(private api: ApiService, private router: Router) {}

  submit(): void {
    this.error.set(''); this.loading.set(true);
    this.api.post('/auth/register', this.form).subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: (e: any) => { this.error.set(e?.error?.message ?? "Erreur d'inscription."); this.loading.set(false); }
    });
  }
}

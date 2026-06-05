import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-forum-thread-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PageLayoutComponent],
  template: `
    <app-page-layout>
      <section class="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
        <a routerLink="/forum" class="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-12 transition-colors">← Retour au forum</a>
        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <h1 class="font-serif text-4xl lg:text-5xl">{{ category()?.nom }}</h1>
            <p class="text-white/50 mt-2">{{ category()?.description }}</p>
          </div>
          @if (auth.isLoggedIn()) {
            <button (click)="showForm.set(!showForm())"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white text-sm hover:bg-white hover:text-black transition-colors">
              + Nouveau sujet
            </button>
          }
        </div>

        @if (showForm()) {
          <form (ngSubmit)="createThread()" class="mb-10 p-6 border border-white/10 rounded-lg">
            <h3 class="font-serif text-xl mb-6">Nouveau sujet</h3>
            <div class="space-y-6">
              <div class="relative">
                <span class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Titre</span>
                <input [(ngModel)]="newTitle" name="title" required
                  class="block w-full bg-transparent border-b border-white/20 focus:border-white pb-3 outline-none transition-colors"/>
              </div>
              <div>
                <span class="block text-[10px] tracking-[0.3em] uppercase text-white/50 mb-2">Contenu</span>
                <textarea [(ngModel)]="newContent" name="content" rows="5" required
                  class="block w-full bg-transparent border border-white/20 focus:border-white rounded-lg px-4 py-3 outline-none resize-none transition-colors"></textarea>
              </div>
              <div class="flex gap-4">
                <button type="submit" [disabled]="creating()"
                  class="px-6 py-3 rounded-full bg-white text-black hover:bg-accent hover:text-white transition-colors text-sm disabled:opacity-50">
                  {{ creating() ? '…' : 'Créer' }}
                </button>
                <button type="button" (click)="showForm.set(false)"
                  class="px-6 py-3 rounded-full border border-white/20 hover:border-white text-sm transition-colors">Annuler</button>
              </div>
            </div>
          </form>
        }

        @if (loading()) {
          <div class="text-white/40 text-center py-20">Chargement…</div>
        } @else if (threads().length === 0) {
          <div class="text-white/40 text-center py-20">Aucun sujet.</div>
        } @else {
          <div class="border-t border-white/10">
            @for (t of threads(); track t.id) {
              <div class="group grid grid-cols-12 items-center py-5 border-b border-white/10 hover:bg-white/[0.02] px-2 transition-colors">
                <div class="col-span-9 lg:col-span-7">
                  <a [routerLink]="['/forum/thread', t.id]"
                    class="font-serif text-lg hover:underline decoration-accent">{{ t.titre }}</a>
                  <div class="text-xs text-white/40 mt-1">{{ t.auteurPrenom }} {{ t.auteurNom }} · {{ fmtDate(t.dateCreation) }}</div>
                </div>
                <div class="hidden lg:flex col-span-3 items-center gap-4 text-sm text-white/40">
                  <span>👁 {{ t.nbVues }}</span>
                  <span>💬 {{ t.nbReponses }}</span>
                </div>
                <div class="col-span-3 lg:col-span-2 flex justify-end">
                  <a [routerLink]="['/forum/thread', t.id]"
                    class="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-colors text-sm">→</a>
                </div>
              </div>
            }
          </div>
        }
      </section>
    </app-page-layout>
  `
})
export class ForumThreadListComponent implements OnInit {
  readonly category = signal<any>(null);
  readonly threads = signal<any[]>([]);
  readonly loading = signal(true);
  readonly showForm = signal(false);
  readonly creating = signal(false);
  newTitle = ''; newContent = '';
  forumId = '';

  constructor(private api: ApiService, private route: ActivatedRoute, readonly auth: AuthService) {}

  ngOnInit(): void {
    this.forumId = this.route.snapshot.paramMap.get('id') ?? '';
    forkJoin([
      this.api.get<any>(`/forums/${this.forumId}`),
      this.api.get<any>(`/sujets/forum/${this.forumId}`)
    ]).subscribe({
      next: ([cat, thr]) => {
        this.category.set(cat?.data ?? cat);
        this.threads.set(Array.isArray(thr) ? thr : (thr?.data ?? []));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  createThread(): void {
    if (!this.newTitle || !this.newContent) return;
    this.creating.set(true);
    const uid = this.auth.currentUser?.id;
    this.api.post<any>('/sujets', {
      forumId: Number(this.forumId),
      auteurId: uid ? Number(uid) : undefined,
      titre: this.newTitle,
      contenu: this.newContent
    }).subscribe({
      next: t => {
        this.threads.update(ts => [t?.data ?? t, ...ts]);
        this.showForm.set(false);
        this.newTitle = ''; this.newContent = '';
        this.creating.set(false);
      },
      error: () => this.creating.set(false)
    });
  }

  fmtDate(d?: string): string {
    if (!d) return '';
    return new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });
  }
}

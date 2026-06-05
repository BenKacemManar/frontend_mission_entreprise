import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-forum-thread-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PageLayoutComponent],
  template: `
    <app-page-layout>
      <section class="mx-auto max-w-[900px] px-6 lg:px-10 py-16">
        <a [routerLink]="['/forum', thread()?.forumId]" class="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-12 transition-colors">← Retour</a>
        @if (loading()) {
          <div class="text-white/40 text-center py-20">Chargement…</div>
        } @else if (!thread()) {
          <div class="text-white/40 text-center py-20">Sujet introuvable.</div>
        } @else {
          <h1 class="font-serif text-3xl lg:text-5xl mb-4">{{ thread().titre }}</h1>
          <div class="flex items-center gap-4 text-xs text-white/40 mb-10 pb-8 border-b border-white/10">
            <span>{{ thread().auteurPrenom }} {{ thread().auteurNom }}</span>
            <span>·</span>
            <span>{{ fmtDate(thread().dateCreation) }}</span>
            <span>·</span>
            <span>{{ thread().nbVues }} vues · {{ thread().nbReponses }} réponses</span>
          </div>
          <div class="mb-12 p-6 border border-white/10 rounded-lg">
            <p class="text-white/80 leading-relaxed whitespace-pre-wrap">{{ thread().contenu }}</p>
          </div>

          <h2 class="font-serif text-2xl mb-6">Réponses <span class="text-gold">({{ posts().length }})</span></h2>
          <div class="space-y-4 mb-12">
            @for (post of posts(); track post.id) {
              <div class="p-5 border border-white/10 rounded-lg">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs bg-accent">
                      {{ initials(post) }}
                    </div>
                    <div>
                      <div class="text-sm font-medium">{{ post.auteurPrenom }} {{ post.auteurNom }}</div>
                      <div class="text-xs text-white/30">{{ fmtDate(post.dateCreation) }}</div>
                    </div>
                  </div>
                  <button (click)="likePost(post.id)" class="flex items-center gap-1.5 text-xs text-white/40 hover:text-accent transition-colors">
                    ♥ {{ post.nbLikes || 0 }}
                  </button>
                </div>
                <p class="text-white/70 leading-relaxed">{{ post.contenu }}</p>
              </div>
            }
          </div>

          @if (auth.isLoggedIn() && !thread().ferme) {
            <form (ngSubmit)="submitReply()" class="border-t border-white/10 pt-8">
              <h3 class="font-serif text-xl mb-4">Votre réponse</h3>
              <textarea [(ngModel)]="reply" name="reply" rows="4" required placeholder="Écrivez votre réponse…"
                class="block w-full bg-transparent border border-white/20 focus:border-white rounded-lg px-4 py-3 outline-none resize-none transition-colors placeholder:text-white/30 mb-4"></textarea>
              <button type="submit" [disabled]="posting() || !reply.trim()"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black hover:bg-accent hover:text-white transition-colors text-sm disabled:opacity-50">
                {{ posting() ? 'Envoi…' : 'Répondre' }} →
              </button>
            </form>
          } @else if (!auth.isLoggedIn()) {
            <div class="border-t border-white/10 pt-8 text-center text-white/40">
              <a routerLink="/auth/login" class="text-gold hover:underline">Connectez-vous</a> pour répondre.
            </div>
          }
        }
      </section>
    </app-page-layout>
  `
})
export class ForumThreadDetailComponent implements OnInit {
  readonly thread = signal<any>(null);
  readonly posts = signal<any[]>([]);
  readonly loading = signal(true);
  readonly posting = signal(false);
  reply = '';

  constructor(private api: ApiService, private route: ActivatedRoute, readonly auth: AuthService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    forkJoin([
      this.api.get<any>(`/sujets/${id}`),
      this.api.get<any>(`/reponses/sujet/${id}`)
    ]).subscribe({
      next: ([t, p]) => {
        this.thread.set(t?.data ?? t);
        this.posts.set(Array.isArray(p) ? p : (p?.data ?? []));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  submitReply(): void {
    if (!this.reply.trim()) return;
    this.posting.set(true);
    const id = this.route.snapshot.paramMap.get('id');
    const uid = this.auth.currentUser?.id;
    this.api.post<any>('/reponses', { sujetId: Number(id), auteurId: uid ? Number(uid) : undefined, contenu: this.reply }).subscribe({
      next: p => { this.posts.update(ps => [...ps, p?.data ?? p]); this.reply = ''; this.posting.set(false); },
      error: () => this.posting.set(false)
    });
  }

  likePost(postId: number): void {
    const uid = this.auth.currentUser?.id;
    if (!uid) return;
    this.api.post(`/posts/${postId}/react`, { userId: Number(uid), type: 'LIKE' }).subscribe({
      next: () => this.posts.update(ps => ps.map(p => p.id === postId ? { ...p, nbLikes: (p.nbLikes || 0) + 1 } : p))
    });
  }

  initials(p: any): string { return `${(p.auteurPrenom||'')[0]??''}${(p.auteurNom||'')[0]??''}`.toUpperCase(); }

  fmtDate(d?: string): string {
    if (!d) return '';
    return new Date(d).toLocaleString('fr-FR', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
  }
}

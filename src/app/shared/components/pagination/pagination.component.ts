import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (totalPages() > 1) {
      <div class="flex items-center justify-center gap-1 mt-8">
        <button (click)="onPage(page - 1)" [disabled]="page <= 1"
          class="p-2 rounded-lg border border-white/10 hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          ‹
        </button>
        @for (p of pages(); track p) {
          @if (p === '...') {
            <span class="px-3 py-1.5 text-white/40 text-sm">…</span>
          } @else {
            <button (click)="onPage(+p)"
              class="px-3 py-1.5 rounded-lg text-sm transition-colors border"
              [style.background]="p == page ? '#E10600' : ''"
              [style.borderColor]="p == page ? '#E10600' : 'rgba(255,255,255,0.1)'"
              [style.color]="p == page ? 'white' : 'rgba(255,255,255,0.7)'">
              {{ p }}
            </button>
          }
        }
        <button (click)="onPage(page + 1)" [disabled]="page >= totalPages()"
          class="p-2 rounded-lg border border-white/10 hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          ›
        </button>
      </div>
    }
  `
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() total = 0;
  @Input() pageSize = 10;
  @Output() pageChange = new EventEmitter<number>();

  onPage(p: number): void { this.pageChange.emit(p); }

  totalPages = computed(() => Math.ceil(this.total / this.pageSize));

  pages = computed((): (number | string)[] => {
    const tp = this.totalPages();
    const cur = this.page;
    const result: (number | string)[] = [];
    for (let i = 1; i <= tp; i++) {
      if (i === 1 || i === tp || (i >= cur - 2 && i <= cur + 2)) {
        result.push(i);
      } else if (result[result.length - 1] !== '...') {
        result.push('...');
      }
    }
    return result;
  });
}

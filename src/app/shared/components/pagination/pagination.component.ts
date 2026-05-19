import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
  @Input() total = 0;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Output() pageChange = new EventEmitter<number>();

  pages: (number | '...')[] = [];
  totalPages = 0;

  ngOnChanges(): void {
    this.totalPages = Math.ceil(this.total / this.pageSize);
    this.buildPages();
  }

  go(p: number): void {
    if (p < 1 || p > this.totalPages || p === this.page) return;
    this.pageChange.emit(p);
  }

  get from(): number { return Math.min((this.page - 1) * this.pageSize + 1, this.total); }
  get to():   number { return Math.min(this.page * this.pageSize, this.total); }

  private buildPages(): void {
    this.pages = [];
    const tp = this.totalPages;
    const cur = this.page;

    if (tp <= 7) {
      this.pages = Array.from({ length: tp }, (_, i) => i + 1);
      return;
    }

    this.pages.push(1);
    if (cur > 3) this.pages.push('...');
    for (let i = Math.max(2, cur - 1); i <= Math.min(tp - 1, cur + 1); i++) {
      this.pages.push(i);
    }
    if (cur < tp - 2) this.pages.push('...');
    this.pages.push(tp);
  }
}

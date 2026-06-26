import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    @if (open) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        (click)="onBackdropClick()">
        <div class="bg-[#120101] border border-white/10 rounded-xl p-8 w-full shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
          [class]="maxWidth" (click)="$event.stopPropagation()">
          <div class="absolute top-0 inset-x-0 h-0.5" style="background:linear-gradient(90deg,#E10600,#D4AF37)"></div>
          <div class="flex items-start justify-between mb-6">
            @if (title) { <h2 class="font-serif text-2xl">{{ title }}</h2> }
            <button (click)="closed.emit()" class="p-1.5 text-white/30 hover:text-white transition-colors text-lg ml-auto" aria-label="Fermer">
              &times;
            </button>
          </div>
          <ng-content></ng-content>
        </div>
      </div>
    }
  `
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() maxWidth = 'max-w-md';
  @Output() closed = new EventEmitter<void>();

  onBackdropClick(): void { this.closed.emit(); }
}

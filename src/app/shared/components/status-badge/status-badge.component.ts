import { Component, Input } from '@angular/core';

export type BadgeVariant =
  | 'finished' | 'upcoming' | 'ongoing' | 'cancelled'
  | 'ok' | 'dq' | 'dns' | 'dnf'
  | 'active' | 'inactive' | 'pending' | 'confirmed' | 'rejected';

const VARIANT_CLASSES: Record<string, string> = {
  finished:  'bg-gray-100 text-gray-500 border border-gray-200',
  upcoming:  'bg-amber-50 text-amber-700 border border-amber-200',
  ongoing:   'bg-blue-50 text-blue-700 border border-blue-200',
  cancelled: 'bg-red-50 text-red-600 border border-red-200',
  ok:        'bg-emerald-50 text-emerald-700 border border-emerald-200',
  dq:        'bg-red-50 text-red-600 border border-red-200',
  dns:       'bg-orange-50 text-orange-600 border border-orange-200',
  dnf:       'bg-orange-50 text-orange-600 border border-orange-200',
  active:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  inactive:  'bg-gray-100 text-gray-400 border border-gray-200',
  pending:   'bg-amber-50 text-amber-700 border border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  rejected:  'bg-red-50 text-red-600 border border-red-200',
};

const DOT_CLASSES: Record<string, string> = {
  ongoing:   'bg-blue-500 animate-pulse',
  active:    'bg-emerald-500 animate-pulse',
  confirmed: 'bg-emerald-500 animate-pulse',
  ok:        'bg-emerald-500',
  upcoming:  'bg-amber-500',
  pending:   'bg-amber-500',
  cancelled: 'bg-red-500',
  rejected:  'bg-red-500',
  dq:        'bg-red-500',
  dns:       'bg-orange-500',
  dnf:       'bg-orange-500',
  finished:  'bg-gray-400',
  inactive:  'bg-gray-300',
};

@Component({
  selector: 'app-status-badge',
  template: `
    <span [ngClass]="classes"
          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase whitespace-nowrap">
      <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" [ngClass]="dotClass"></span>
      {{ label }}
    </span>`,
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {
  @Input() variant: BadgeVariant | string = 'pending';
  @Input() label = '';

  get classes(): string {
    return VARIANT_CLASSES[this.variant] ?? 'bg-gray-100 text-gray-500 border border-gray-200';
  }

  get dotClass(): string {
    return DOT_CLASSES[this.variant] ?? 'bg-gray-400';
  }
}

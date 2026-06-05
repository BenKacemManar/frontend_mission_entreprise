import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  upcoming:   { label: 'À venir',    color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
  ongoing:    { label: 'En cours',   color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  finished:   { label: 'Terminée',   color: '#6B7280', bg: 'rgba(107,114,128,0.15)' },
  cancelled:  { label: 'Annulée',    color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
  ok:         { label: 'OK',         color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  DQ:         { label: 'DQ',         color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  DNS:        { label: 'DNS',        color: '#6B7280', bg: 'rgba(107,114,128,0.15)' },
  DNF:        { label: 'DNF',        color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
  EN_ATTENTE: { label: 'En attente', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  VALIDEE:    { label: 'Validée',    color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  REJETEE:    { label: 'Rejetée',    color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
  EXPIREE:    { label: 'Expirée',    color: '#6B7280', bg: 'rgba(107,114,128,0.15)' },
  SCHEDULED:  { label: 'Planifiée',  color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
  ACTIVE:     { label: 'Active',     color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  COMPLETED:  { label: 'Terminée',   color: '#6B7280', bg: 'rgba(107,114,128,0.15)' },
  CANCELLED:  { label: 'Annulée',    color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide"
      [style.color]="s().color" [style.background]="s().bg">
      {{ s().label }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input() status = '';
  s = computed(() => STATUS_MAP[this.status] ?? { label: this.status, color: '#9CA3AF', bg: 'rgba(156,163,175,0.15)' });
}

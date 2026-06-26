import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Search } from 'lucide-angular';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterGroup {
  options: FilterOption[];
  selected: string;
}

export interface FilterSelect {
  placeholder: string;
  options: FilterOption[];
  selected: string;
}

@Component({
  selector: 'app-filter-bar',
  template: `
    <div class="flex flex-wrap items-center gap-3 mb-10 pb-8 border-b border-white/10">
      @if (showSearch) {
        <div class="relative">
          <lucide-icon [img]="Search" class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"></lucide-icon>
          <input type="text" [placeholder]="searchPlaceholder" [ngModel]="searchValue"
            (ngModelChange)="onSearchChange($event)"
            class="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30" />
        </div>
      }

      @for (group of groups; track $index) {
        @if ($index > 0) { <div class="w-px h-6 bg-white/10 mx-1"></div> }
        @for (opt of group.options; track opt.value) {
          <button type="button" (click)="onGroupChange($index, opt.value)"
            class="px-4 py-2 rounded-full border text-sm transition-colors"
            [style.background]="group.selected === opt.value ? '#E10600' : ''"
            [style.borderColor]="group.selected === opt.value ? '#E10600' : 'rgba(255,255,255,0.15)'"
            [style.color]="group.selected === opt.value ? 'white' : 'rgba(255,255,255,0.6)'">
            {{ opt.label }}
          </button>
        }
      }

      @for (sel of selects; track $index) {
        <select [ngModel]="sel.selected" (ngModelChange)="onSelectChange($index, $event)"
          class="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/60 focus:outline-none">
          <option value="" class="bg-[#1a0000]">{{ sel.placeholder }}</option>
          @for (opt of sel.options; track opt.value) {
            <option [value]="opt.value" class="bg-[#1a0000]">{{ opt.label }}</option>
          }
        </select>
      }
    </div>
  `
})
export class FilterBarComponent {
  readonly Search = Search;

  @Input() showSearch = true;
  @Input() searchPlaceholder = 'Rechercher…';
  @Input() searchValue = '';
  @Output() searchValueChange = new EventEmitter<string>();

  @Input() groups: FilterGroup[] = [];
  @Output() groupChange = new EventEmitter<{ index: number; value: string }>();

  @Input() selects: FilterSelect[] = [];
  @Output() selectChange = new EventEmitter<{ index: number; value: string }>();

  onSearchChange(v: string): void { this.searchValueChange.emit(v); }
  onGroupChange(index: number, value: string): void { this.groupChange.emit({ index, value }); }
  onSelectChange(index: number, value: string): void { this.selectChange.emit({ index, value }); }
}

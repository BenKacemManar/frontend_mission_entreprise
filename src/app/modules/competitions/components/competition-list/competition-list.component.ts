import { Component, OnInit } from '@angular/core';
import { Competition, CompetitionFilter, CompetitionType, CompetitionStatus, Discipline } from '../../../../core/models/competition.model';
import { CompetitionsService } from '../../services/competitions.service';

@Component({
  selector: 'app-competition-list',
  templateUrl: './competition-list.component.html',
  styleUrls: ['./competition-list.component.scss']
})
export class CompetitionListComponent implements OnInit {
  competitions: Competition[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  loading = false;
  viewMode: 'list' | 'calendar' = 'list';

  filter: CompetitionFilter = {
    discipline: '',
    type: '',
    status: '',
    search: ''
  };

  disciplines = [
    { value: '',            label: 'Toutes disciplines' },
    { value: 'natation',    label: 'Natation' },
    { value: 'eau-libre',   label: 'Eau Libre' },
    { value: 'water-polo',  label: 'Water Polo' },
    { value: 'plongeon',    label: 'Plongeon' }
  ];

  types = [
    { value: '',              label: 'Tous types' },
    { value: 'hiver',         label: 'Championnat Hiver' },
    { value: 'ete',           label: 'Championnat Été' },
    { value: 'open',          label: 'Open' },
    { value: 'international', label: 'International' }
  ];

  statuses = [
    { value: '',          label: 'Tous statuts' },
    { value: 'upcoming',  label: 'À venir' },
    { value: 'ongoing',   label: 'En cours' },
    { value: 'finished',  label: 'Terminé' }
  ];

  constructor(private competitionsService: CompetitionsService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.competitionsService.getAll(this.filter, this.page, this.pageSize).subscribe({
      next: res => {
        this.competitions = res.data;
        this.total = res.total;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilter(): void {
    this.page = 1;
    this.load();
  }

  clearFilter(): void {
    this.filter = { discipline: '', type: '', status: '', search: '' };
    this.page = 1;
    this.load();
  }

  onPageChange(p: number): void {
    this.page = p;
    this.load();
  }

  formatDateRange(start: string, end: string): { day: string; month: string; year: string } {
    const s = new Date(start);
    const e = new Date(end);
    const months = ['JAN','FÉV','MAR','AVR','MAI','JUN','JUL','AOÛ','SEP','OCT','NOV','DÉC'];
    return {
      day:   `${s.getDate()}-${e.getDate()}`,
      month: months[s.getMonth()],
      year:  String(s.getFullYear())
    };
  }

  statusLabel(s: CompetitionStatus): string {
    return ({ upcoming: 'À venir', ongoing: 'En cours', finished: 'Terminé', cancelled: 'Annulé' })[s] ?? s;
  }

  getTypeIndex(type: CompetitionType): number {
    return this.types.findIndex(t => t.value === type) || 0;
  }

  disciplineColor(d: string): string {
    return ({
      natation:     '#0057FF',
      'eau-libre':  '#00C8F0',
      'water-polo': '#00C48C',
      plongeon:     '#7C3AED',
    })[d] ?? '#D0D9EC';
  }

  disciplineIcon(d: string): string {
    return ({ natation: '🏊', 'eau-libre': '🌊', 'water-polo': '🤽', plongeon: '🤿' })[d] ?? '🏊';
  }
}

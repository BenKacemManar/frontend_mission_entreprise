import { Component, OnInit } from '@angular/core';
import { Result, ResultFilter, ResultStatus } from '../../../../core/models/result.model';
import { ResultsService } from '../../services/results.service';

@Component({
  selector: 'app-results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.scss']
})
export class ResultsListComponent implements OnInit {
  results: Result[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  loading = false;

  filter: ResultFilter = {
    competitionType: '',
    category: '',
    year: '',
    gender: '',
    search: ''
  };

  competitionTypes = [
    { value: '',              label: 'Toutes compétitions' },
    { value: 'hiver',         label: 'Championnat Hiver' },
    { value: 'ete',           label: 'Championnat Été' },
    { value: 'open',          label: 'Open' },
    { value: 'international', label: 'International' }
  ];

  categories = [
    { value: '',        label: 'Toutes catégories' },
    { value: 'Senior',  label: 'Senior' },
    { value: 'Junior',  label: 'Junior' },
    { value: 'Cadet',   label: 'Cadet' },
    { value: 'Minime',  label: 'Minime' },
    { value: 'Benjamin',label: 'Benjamin' },
    { value: 'Poussin', label: 'Poussin' }
  ];

  years = this.buildYears();
  genders = [
    { value: '',  label: 'Tous' },
    { value: 'M', label: 'Hommes' },
    { value: 'F', label: 'Femmes' }
  ];

  filterDefs = [
    { label: 'Type',       key: 'competitionType', options: [] as any[] },
    { label: 'Catégorie',  key: 'category',        options: [] as any[] },
    { label: 'Année',      key: 'year',             options: [] as any[] },
    { label: 'Genre',      key: 'gender',           options: [] as any[] }
  ];

  getFilter(key: string): any { return (this.filter as any)[key] ?? ''; }
  setFilter(key: string, v: any): void { (this.filter as any)[key] = v; }

  constructor(private resultsService: ResultsService) {}

  ngOnInit(): void {
    this.filterDefs[0].options = this.competitionTypes;
    this.filterDefs[1].options = this.categories;
    this.filterDefs[2].options = this.years;
    this.filterDefs[3].options = this.genders;
    this.load();
  }

  load(): void {
    this.loading = true;
    this.resultsService.getResults(this.filter, this.page, this.pageSize).subscribe({
      next: res => {
        this.results = res.data;
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
    this.filter = { competitionType: '', category: '', year: '', gender: '', search: '' };
    this.page = 1;
    this.load();
  }

  onPageChange(p: number): void {
    this.page = p;
    this.load();
  }

  statusVariant(s: ResultStatus): string {
    return ({ OK: 'ok', DQ: 'dq', DNS: 'dns', DNF: 'dnf' })[s] ?? 'inactive';
  }

  hasActiveFilter(): boolean {
    return !!(this.filter.competitionType || this.filter.category ||
              this.filter.year || this.filter.gender || this.filter.search);
  }

  private buildYears(): { value: string; label: string }[] {
    const cur = new Date().getFullYear();
    const years = [{ value: '', label: 'Toutes années' }];
    for (let y = cur; y >= cur - 5; y--) {
      years.push({ value: String(y), label: String(y) });
    }
    return years;
  }
}

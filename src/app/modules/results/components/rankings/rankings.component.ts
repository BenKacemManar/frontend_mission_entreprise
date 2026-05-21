import { Component, OnInit } from '@angular/core';
import { NationalRanking, RankingFilter } from '../../../../core/models/result.model';
import { ResultsService } from '../../services/results.service';

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.scss']
})
export class RankingsComponent implements OnInit {
  rankings: NationalRanking[] = [];
  total = 0;
  page = 1;
  pageSize = 20;
  loading = false;

  // Rebuild panel
  rebuildEventId = '';
  rebuildSeason  = '';
  rebuilding     = false;
  rebuildMsg     = '';
  rebuildError   = '';

  filter: RankingFilter = { swimStyle: '', distance: '', gender: '', ageCategory: '', season: '' };

  swimStyles = [
    { value: '', label: 'Toutes nages' },
    { value: 'libre',    label: 'Nage libre' },
    { value: 'dos',      label: 'Dos' },
    { value: 'brasse',   label: 'Brasse' },
    { value: 'papillon', label: 'Papillon' },
    { value: '4nages',   label: '4 nages' }
  ];

  distances = [
    { value: '',     label: 'Toutes distances' },
    { value: '50',   label: '50m' },
    { value: '100',  label: '100m' },
    { value: '200',  label: '200m' },
    { value: '400',  label: '400m' },
    { value: '800',  label: '800m' },
    { value: '1500', label: '1500m' }
  ];

  genders = [
    { value: '',  label: 'Tous' },
    { value: 'M', label: 'Hommes' },
    { value: 'F', label: 'Femmes' }
  ];

  ageCategories = [
    { value: '',         label: 'Toutes catégories' },
    { value: 'Senior',   label: 'Senior' },
    { value: 'Junior',   label: 'Junior' },
    { value: 'Cadet',    label: 'Cadet' },
    { value: 'Minime',   label: 'Minime' },
    { value: 'Benjamin', label: 'Benjamin' }
  ];

  seasons = this.buildSeasons();

  filterGroups = [
    { label: 'Nage',      key: 'swimStyle',   options: [] as any[] },
    { label: 'Distance',  key: 'distance',    options: [] as any[] },
    { label: 'Genre',     key: 'gender',      options: [] as any[] },
    { label: 'Catégorie', key: 'ageCategory', options: [] as any[] },
    { label: 'Saison',    key: 'season',      options: [] as any[] }
  ];

  constructor(private resultsService: ResultsService) {}

  ngOnInit(): void {
    this.filterGroups[0].options = this.swimStyles;
    this.filterGroups[1].options = this.distances;
    this.filterGroups[2].options = this.genders;
    this.filterGroups[3].options = this.ageCategories;
    this.filterGroups[4].options = this.seasons;
    this.load();
  }

  load(): void {
    this.loading = true;
    this.resultsService.getRankings(this.filter, this.page, this.pageSize).subscribe({
      next: res => { this.rankings = res.data; this.total = res.total; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  applyFilter(): void { this.page = 1; this.load(); }

  clearFilter(): void {
    this.filter = { swimStyle: '', distance: '', gender: '', ageCategory: '', season: '' };
    this.page = 1;
    this.load();
  }

  onPageChange(p: number): void { this.page = p; this.load(); }

  getFilterValue(key: string): any { return (this.filter as any)[key] ?? ''; }
  setFilterValue(key: string, value: any): void { (this.filter as any)[key] = value; }

  get top3(): NationalRanking[] {
    return this.rankings.filter(r => r.rank >= 1 && r.rank <= 3).sort((a, b) => a.rank - b.rank);
  }

  rebuildRankings(): void {
    if (!this.rebuildEventId || !this.rebuildSeason) {
      this.rebuildError = 'ID épreuve et saison sont obligatoires.';
      return;
    }
    this.rebuilding   = true;
    this.rebuildMsg   = '';
    this.rebuildError = '';
    this.resultsService.rebuildRankings(this.rebuildEventId, this.rebuildSeason).subscribe({
      next: () => {
        this.rebuilding = false;
        this.rebuildMsg = `Classement recalculé pour l'épreuve #${this.rebuildEventId} — saison ${this.rebuildSeason}.`;
        this.load();
      },
      error: () => { this.rebuilding = false; this.rebuildError = 'Erreur lors du recalcul.'; }
    });
  }

  private buildSeasons(): { value: string; label: string }[] {
    const cur = new Date().getFullYear();
    const s = [{ value: '', label: 'Saison actuelle' }];
    for (let y = cur; y >= cur - 4; y--) {
      s.push({ value: `${y}-${y + 1}`, label: `${y}-${y + 1}` });
      s.push({ value: `${y}`,          label: `${y}` });
    }
    return s;
  }
}

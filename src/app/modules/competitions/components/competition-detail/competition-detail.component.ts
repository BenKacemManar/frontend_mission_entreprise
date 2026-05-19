import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Competition, CompetitionEvent } from '../../../../core/models/competition.model';
import { CompetitionsService } from '../../services/competitions.service';

@Component({
  selector: 'app-competition-detail',
  templateUrl: './competition-detail.component.html',
  styleUrls: ['./competition-detail.component.scss']
})
export class CompetitionDetailComponent implements OnInit {
  competition: Competition | null = null;
  events: CompetitionEvent[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private competitionsService: CompetitionsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.competitionsService.getById(id).subscribe({
      next: c => {
        this.competition = c;
        this.loadEvents(id);
      },
      error: () => { this.loading = false; }
    });
  }

  get infoItems(): { label: string; value: string }[] {
    if (!this.competition) return [];
    return [
      { label: 'Type',       value: this.competition.type },
      { label: 'Discipline', value: this.competition.discipline },
      { label: 'Catégories', value: this.competition.ageCategories || '—' },
      { label: 'Clôture inscriptions', value: this.competition.registrationDeadline
          ? new Date(this.competition.registrationDeadline).toLocaleDateString('fr-FR') : '—' }
    ];
  }

  private loadEvents(id: string): void {
    this.competitionsService.getEvents(id).subscribe({
      next: events => { this.events = events; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  groupByStyle(): Record<string, CompetitionEvent[]> {
    return this.events.reduce((acc, e) => {
      const key = e.swimStyle;
      if (!acc[key]) acc[key] = [];
      acc[key].push(e);
      return acc;
    }, {} as Record<string, CompetitionEvent[]>);
  }

  get groupKeys(): string[] {
    return Object.keys(this.groupByStyle());
  }
}

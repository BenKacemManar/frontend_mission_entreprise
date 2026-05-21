import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Competition, CompetitionEvent } from '../../../../core/models/competition.model';
import { CompetitionsService } from '../../services/competitions.service';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-competition-detail',
  templateUrl: './competition-detail.component.html',
  styleUrls: ['./competition-detail.component.scss']
})
export class CompetitionDetailComponent implements OnInit {
  competition: Competition | null = null;
  events: CompetitionEvent[] = [];
  loading = true;
  deleteConfirm = false;
  deletingEvent: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private competitionsService: CompetitionsService,
    private eventsService: EventsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.competitionsService.getById(id).subscribe({
      next: c => { this.competition = c; this.loadEvents(id); },
      error: () => { this.loading = false; }
    });
  }

  private loadEvents(id: string): void {
    this.competitionsService.getEvents(id).subscribe({
      next: events => { this.events = events; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get infoItems(): { label: string; value: string }[] {
    if (!this.competition) return [];
    return [
      { label: 'Type',        value: this.competition.type },
      { label: 'Bassin',      value: this.competition.lane || '—' },
      { label: 'Catégories',  value: this.competition.ageCategories || '—' },
      { label: 'Clôture inscriptions', value: this.competition.registrationDeadline
          ? new Date(this.competition.registrationDeadline).toLocaleDateString('fr-FR') : '—' }
    ];
  }

  editCompetition(): void {
    this.router.navigate(['/competitions', this.competition!.id, 'edit']);
  }

  confirmDelete(): void {
    this.deleteConfirm = true;
  }

  deleteCompetition(): void {
    this.competitionsService.delete(String(this.competition!.id)).subscribe({
      next: () => this.router.navigate(['/competitions']),
      error: () => { this.deleteConfirm = false; }
    });
  }

  addEvent(): void {
    this.router.navigate(['/competitions', this.competition!.id, 'events', 'new']);
  }

  editEvent(ev: CompetitionEvent): void {
    this.router.navigate(['/competitions', this.competition!.id, 'events', ev.id, 'edit']);
  }

  confirmDeleteEvent(id: string): void {
    this.deletingEvent = id;
  }

  deleteEvent(id: string): void {
    this.eventsService.delete(id).subscribe({
      next: () => {
        this.events = this.events.filter(e => String(e.id) !== id);
        this.deletingEvent = null;
      },
      error: () => { this.deletingEvent = null; }
    });
  }
}

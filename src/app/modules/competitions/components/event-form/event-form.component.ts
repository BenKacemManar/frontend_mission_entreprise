import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetitionEvent } from '../../../../core/models/competition.model';
import { EventsService } from '../../services/events.service';
import { CompetitionsService } from '../../services/competitions.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
  competitionId = '';
  competitionName = '';
  isEdit = false;
  saving = false;
  loading = false;
  error = '';

  form: Partial<CompetitionEvent> = {
    swimStyle:     'libre',
    distance:      100,
    gender:        'M',
    round:         'finale',
    ageCategory:   '',
    scheduledDate: '',
  };

  swimStyles = [
    { value: 'libre',    label: 'Libre' },
    { value: 'dos',      label: 'Dos' },
    { value: 'brasse',   label: 'Brasse' },
    { value: 'papillon', label: 'Papillon' },
    { value: '4nages',   label: '4 Nages' },
  ];

  distances = [50, 100, 200, 400, 800, 1500];

  rounds = [
    { value: 'series', label: 'Séries' },
    { value: 'demi',   label: 'Demi-finale' },
    { value: 'finale', label: 'Finale' },
  ];

  ageCategories = ['Poussin', 'Benjamin', 'Minime', 'Cadet', 'Junior', 'Senior'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
    private competitionsService: CompetitionsService
  ) {}

  ngOnInit(): void {
    this.competitionId = this.route.snapshot.paramMap.get('id')!;
    const eventId      = this.route.snapshot.paramMap.get('eventId');

    this.competitionsService.getById(this.competitionId).subscribe({
      next: c => { this.competitionName = c.name; },
      error: () => {}
    });

    if (eventId) {
      this.isEdit = true;
      this.loading = true;
      this.eventsService.getById(eventId).subscribe({
        next: e => {
          this.form = { ...e };
          if (e.scheduledDate) this.form.scheduledDate = e.scheduledDate.substring(0, 10);
          this.loading = false;
        },
        error: () => { this.error = 'Impossible de charger l\'épreuve.'; this.loading = false; }
      });
    }
  }

  save(): void {
    if (!this.form.swimStyle || !this.form.distance || !this.form.gender || !this.form.scheduledDate) {
      this.error = 'Nage, distance, genre et date sont obligatoires.';
      return;
    }
    this.saving = true;
    this.error = '';

    const eventId = this.route.snapshot.paramMap.get('eventId');
    const payload = { ...this.form, competitionId: this.competitionId };

    const req$ = eventId
      ? this.eventsService.update(eventId, payload)
      : this.eventsService.create(payload);

    req$.subscribe({
      next: () => { this.saving = false; this.router.navigate(['/competitions', this.competitionId]); },
      error: () => { this.error = 'Une erreur est survenue.'; this.saving = false; }
    });
  }

  cancel(): void {
    this.router.navigate(['/competitions', this.competitionId]);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Result } from '../../../../core/models/result.model';
import { ResultsService } from '../../services/results.service';

@Component({
  selector: 'app-result-form',
  templateUrl: './result-form.component.html',
  styleUrls: ['./result-form.component.scss']
})
export class ResultFormComponent implements OnInit {
  isEdit = false;
  loading = false;
  saving  = false;
  error   = '';

  form: Partial<Result> & { athleteId: string; eventId: string } = {
    athleteId:    '',
    eventId:      '',
    rank:         1,
    tempsDisplay: '',
    tempsMs:      undefined,
    pointsFina:   undefined,
    tour:         'finale',
    lane:         undefined,
    isRecord:     false,
    status:       'OK',
  };

  tours    = ['series', 'demi', 'finale'];
  statuses = [
    { value: 'EN_ATTENTE', label: 'En attente' },
    { value: 'VALIDE',     label: 'Validé' },
    { value: 'DQ',         label: 'Disqualifié (DQ)' },
    { value: 'DNS',        label: 'Non partant (DNS)' },
    { value: 'DNF',        label: 'Non arrivé (DNF)' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ResultsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // Pre-fill eventId from query param if coming from competition detail
    const eventId = this.route.snapshot.queryParamMap.get('eventId');
    if (eventId) this.form.eventId = eventId;

    if (id) {
      this.isEdit = true;
    }
  }

  save(): void {
    if (!this.form.athleteId || !this.form.eventId || this.form.rank == null) {
      this.error = 'Athlète ID, Épreuve ID et Rang sont obligatoires.';
      return;
    }
    this.saving = true;
    this.error  = '';

    const payload: any = {
      athleteId:    Number(this.form.athleteId),
      eventId:      Number(this.form.eventId),
      rank:         this.form.rank,
      tempsDisplay: this.form.tempsDisplay || null,
      tempsMs:      this.form.tempsMs      || null,
      pointsFina:   this.form.pointsFina   || null,
      tour:         this.form.tour         || null,
      lane:         this.form.lane         || null,
      isRecord:     this.form.isRecord     || false,
    };

    const id = this.route.snapshot.paramMap.get('id');
    const req$ = id
      ? this.service.updateResult(id, payload)
      : this.service.createResult(payload);

    req$.subscribe({
      next: () => { this.saving = false; this.router.navigate(['/results']); },
      error: (err) => {
        this.saving = false;
        this.error = err.status === 409
          ? 'Un résultat existe déjà pour cet athlète et cette épreuve (HTTP 409).'
          : 'Une erreur est survenue. Vérifiez les données.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/results']);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Competition } from '../../../../core/models/competition.model';
import { CompetitionsService } from '../../services/competitions.service';

@Component({
  selector: 'app-competition-form',
  templateUrl: './competition-form.component.html',
  styleUrls: ['./competition-form.component.scss']
})
export class CompetitionFormComponent implements OnInit {
  isEdit = false;
  loading = false;
  saving  = false;
  error   = '';

  form: Partial<Competition> = {
    name: '',
    type: 'hiver',
    startDate: '',
    endDate: '',
    lane: '25m',
    ageCategories: '',
    code: '',
    registrationDeadline: '',
    status: 'upcoming',
  };

  types = [
    { value: 'hiver',         label: 'Championnat Hiver' },
    { value: 'ete',           label: 'Championnat Été' },
    { value: 'open',          label: 'Open' },
    { value: 'international', label: 'International' },
  ];

  lanes = [
    { value: '25m', label: '25 mètres (bassin court)' },
    { value: '50m', label: '50 mètres (bassin olympique)' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CompetitionsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loading = true;
      this.service.getById(id).subscribe({
        next: c => {
          this.form = { ...c };
          // Format dates for <input type="date">
          if (c.startDate) this.form.startDate = c.startDate.substring(0, 10);
          if (c.endDate)   this.form.endDate   = c.endDate.substring(0, 10);
          if (c.registrationDeadline)
            this.form.registrationDeadline = c.registrationDeadline.substring(0, 10);
          this.loading = false;
        },
        error: () => { this.error = 'Impossible de charger la compétition.'; this.loading = false; }
      });
    }
  }

  save(): void {
    if (!this.form.name || !this.form.startDate || !this.form.endDate) {
      this.error = 'Les champs Nom, Date début et Date fin sont obligatoires.';
      return;
    }
    this.saving = true;
    this.error  = '';
    const id = this.route.snapshot.paramMap.get('id');
    const req$ = id
      ? this.service.update(id, this.form)
      : this.service.create(this.form);

    req$.subscribe({
      next: c  => { this.saving = false; this.router.navigate(['/competitions', c.id]); },
      error: () => { this.error = 'Une erreur est survenue. Vérifiez les données.'; this.saving = false; }
    });
  }

  cancel(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.router.navigate(id ? ['/competitions', id] : ['/competitions']);
  }
}

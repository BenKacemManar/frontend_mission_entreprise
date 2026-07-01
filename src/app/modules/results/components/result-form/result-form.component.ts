import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { PageLayoutComponent } from '../../../../shared/components/page-layout/page-layout.component';

// FINA world records (ms) for live preview — mirrors backend FinaPointsService
const FINA_REFS: Record<string, number> = {
  '50_Nage Libre_M': 20910, '100_Nage Libre_M': 46860, '200_Nage Libre_M': 102580,
  '400_Nage Libre_M': 220070, '800_Nage Libre_M': 454000, '1500_Nage Libre_M': 870830,
  '50_Nage Libre_F': 23670, '100_Nage Libre_F': 51710, '200_Nage Libre_F': 112930,
  '400_Nage Libre_F': 236500, '800_Nage Libre_F': 487630, '1500_Nage Libre_F': 931020,
  '50_Dos_M': 24000, '100_Dos_M': 51850, '200_Dos_M': 111920,
  '50_Dos_F': 27060, '100_Dos_F': 57450, '200_Dos_F': 203910,
  '50_Brasse_M': 25950, '100_Brasse_M': 56880, '200_Brasse_M': 205480,
  '50_Brasse_F': 29300, '100_Brasse_F': 64130, '200_Brasse_F': 219640,
  '50_Papillon_M': 22270, '100_Papillon_M': 49450, '200_Papillon_M': 110730,
  '50_Papillon_F': 24430, '100_Papillon_F': 55480, '200_Papillon_F': 200100,
  '200_4 nages_M': 114000, '400_4 nages_M': 236050,
  '200_4 nages_F': 126120, '400_4 nages_F': 272810,
};

function calcFina(tempsMs: number, distance: number, swimStyle: string, gender: string): number | null {
  const key = `${distance}_${swimStyle}_${gender === 'F' ? 'F' : 'M'}`;
  const ref = FINA_REFS[key];
  if (!ref || tempsMs <= 0) return null;
  return Math.round(1000 * Math.pow(ref / tempsMs, 2));
}

export function parseTimeInput(s: string): number | null {
  if (!s?.trim()) return null;
  const full = s.match(/^(\d+):(\d{2})\.(\d{2,3})$/);
  if (full) {
    const cents = full[3].length === 2 ? +full[3] * 10 : +full[3];
    return (+full[1]) * 60000 + (+full[2]) * 1000 + cents;
  }
  const short = s.match(/^(\d+)\.(\d{2,3})$/);
  if (short) {
    const cents = short[2].length === 2 ? +short[2] * 10 : +short[2];
    return (+short[1]) * 1000 + cents;
  }
  return null;
}

@Component({
  selector: 'app-result-form',
  templateUrl: './result-form.component.html',
  styleUrls: ['./result-form.component.scss']
})
export class ResultFormComponent implements OnInit {
  isEdit = false;
  editId?: number;

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly competitions = signal<any[]>([]);
  readonly epreuves = signal<any[]>([]);
  readonly athletes = signal<any[]>([]);
  readonly finaPreview = signal<number | null>(null);

  selectedEpreuve: any = null;
  timeInput = '';
  timeError = false;

  form = {
    competitionId: '' as any,
    eventId: '' as any,
    athleteId: '' as any,
    lane: null as any,
    rank: null as any,
    tour: '',
  };

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.editId = this.route.snapshot.params['id'] ? Number(this.route.snapshot.params['id']) : undefined;
    this.isEdit = !!this.editId;

    const eventId = this.route.snapshot.queryParamMap.get('eventId');
    if (eventId) this.form.eventId = eventId;

    this.loading.set(true);
    forkJoin({
      comps: this.api.get<any>('/competitions', { size: 200 }).pipe(catchError(() => of({}))),
      athletes: this.api.get<any>('/athletes', { size: 500 }).pipe(catchError(() => of({}))),
    }).subscribe(({ comps, athletes }) => {
      this.competitions.set(comps?.data ?? comps?.content ?? []);
      this.athletes.set(athletes?.data ?? athletes?.content ?? []);
      if (this.isEdit && this.editId) this.loadExisting();
      else this.loading.set(false);
    });
  }

  loadExisting(): void {
    this.api.get<any>(`/resultats/${this.editId}`).pipe(catchError(() => of(null))).subscribe(r => {
      const d = r?.data ?? r;
      if (!d) { this.loading.set(false); return; }
      this.form.competitionId = d.competitionId ?? '';
      this.form.eventId = d.eventId ?? '';
      this.form.athleteId = d.athleteId ?? '';
      this.form.lane = d.lane ?? null;
      this.form.rank = d.rank ?? null;
      this.form.tour = d.tour ?? '';
      if (d.tempsMs) this.timeInput = this.msToDisplay(d.tempsMs);

      if (d.competitionId) {
        this.api.get<any>(`/epreuves/competition/${d.competitionId}`).pipe(catchError(() => of([]))).subscribe(ev => {
          const list = Array.isArray(ev) ? ev : (ev?.data ?? []);
          this.epreuves.set(list);
          this.selectedEpreuve = list.find((e: any) => String(e.id) === String(d.eventId)) ?? null;
          this.recalcFina();
          this.loading.set(false);
        });
      } else {
        this.loading.set(false);
      }
    });
  }

  onCompetitionChange(): void {
    this.form.eventId = '';
    this.epreuves.set([]);
    this.selectedEpreuve = null;
    this.finaPreview.set(null);
    if (!this.form.competitionId) return;
    this.api.get<any>(`/epreuves/competition/${this.form.competitionId}`).pipe(catchError(() => of([]))).subscribe(r => {
      this.epreuves.set(Array.isArray(r) ? r : (r?.data ?? []));
    });
  }

  onEpreuveChange(): void {
    this.selectedEpreuve = this.epreuves().find(e => String(e.id) === String(this.form.eventId)) ?? null;
    this.recalcFina();
  }

  onTimeChange(): void {
    const ms = parseTimeInput(this.timeInput);
    this.timeError = !!this.timeInput && ms === null;
    this.recalcFina();
  }

  recalcFina(): void {
    const ms = parseTimeInput(this.timeInput);
    const ep = this.selectedEpreuve;
    if (!ms || !ep) { this.finaPreview.set(null); return; }
    this.finaPreview.set(calcFina(ms, ep.distance, ep.swimStyle, ep.gender));
  }

  isValid(): boolean {
    return !!(this.form.eventId && this.form.athleteId && this.form.rank) && !this.timeError;
  }

  submit(): void {
    if (!this.isValid()) return;
    this.saving.set(true);
    this.error.set(null);
    const ms = parseTimeInput(this.timeInput);
    const payload: any = {
      athleteId: Number(this.form.athleteId),
      eventId: Number(this.form.eventId),
      rank: Number(this.form.rank),
    };
    if (this.form.lane) payload.lane = Number(this.form.lane);
    if (this.form.tour) payload.tour = this.form.tour;
    if (ms) { payload.tempsMs = ms; payload.tempsDisplay = this.timeInput; }

    const req$ = this.isEdit
      ? this.api.put(`/resultats/${this.editId}`, payload)
      : this.api.post('/resultats', payload);

    req$.pipe(catchError(e => {
      const msg = e?.error?.message ?? e?.error?.error ?? 'Erreur lors de l\'enregistrement.';
      this.error.set(msg);
      this.saving.set(false);
      return of(null);
    })).subscribe(r => {
      this.saving.set(false);
      if (r !== null) this.router.navigate(['/results']);
    });
  }

  back(): void { this.router.navigate(['/results']); }

  msToDisplay(ms: number): string {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const cents = Math.floor((ms % 1000) / 10);
    return mins > 0
      ? `${mins}:${String(secs).padStart(2, '0')}.${String(cents).padStart(2, '0')}`
      : `${secs}.${String(cents).padStart(2, '0')}`;
  }
}

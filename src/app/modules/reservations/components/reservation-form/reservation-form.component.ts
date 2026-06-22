import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { ReservationService } from '../../services/reservation.service';
import { CreateReservationDto, TypeReservation } from '../../../../core/models/reservation.model';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss']
})
export class ReservationFormComponent implements OnInit {
  pools: any[] = [];
  loading = false;
  success = false;
  error = '';
  today = new Date().toISOString().split('T')[0];

  reservationType: TypeReservation = 'ATHLETE';
  athleteLane: number | null = null;
  clubLanes: Set<number> = new Set();

  form: any = {
    pool_id: 0,
    date: '',
    heure_debut: '',
    heure_fin: '',
    reservee_par: 'admin@ftn.tn',
    nom_club: '',
    notes: ''
  };

  constructor(
    private reservationService: ReservationService,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.api.get<any>('/pools/actives').subscribe({
      next: (res) => this.pools = res,
      error: () => this.error = 'Impossible de charger les piscines.'
    });
  }

  get selectedPool(): any {
    return this.pools.find(p => p.id === Number(this.form.pool_id));
  }

  get laneNumbers(): number[] {
    const pool = this.selectedPool;
    const count = pool?.nb_couloirs ?? pool?.nbCouloirs ?? 0;
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  setType(type: TypeReservation): void {
    this.reservationType = type;
    this.athleteLane = null;
    this.clubLanes.clear();
    if (type === 'ATHLETE') {
      this.form.nom_club = '';
    }
  }

  onPoolChange(): void {
    this.athleteLane = null;
    this.clubLanes.clear();
  }

  selectAthleteLane(lane: number | null): void {
    this.athleteLane = lane;
  }

  toggleClubLane(lane: number): void {
    if (this.clubLanes.has(lane)) {
      this.clubLanes.delete(lane);
    } else {
      this.clubLanes.add(lane);
    }
  }

  selectClubWholePool(): void {
    this.clubLanes.clear();
  }

  get clubLanesSorted(): number[] {
    return Array.from(this.clubLanes).sort((a, b) => a - b);
  }

  submit(): void {
    if (!this.form.pool_id || !this.form.date || !this.form.heure_debut || !this.form.heure_fin) {
      this.error = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }
    if (this.form.heure_fin <= this.form.heure_debut) {
      this.error = "L heure de fin doit etre apres l heure de debut.";
      return;
    }
    if (this.reservationType === 'CLUB' && !this.form.nom_club?.trim()) {
      this.error = 'Le nom du club est obligatoire pour une reservation club.';
      return;
    }

    this.loading = true;
    this.error = '';

    const dto: CreateReservationDto = {
      pool_id: Number(this.form.pool_id),
      date: this.form.date,
      heure_debut: this.form.heure_debut,
      heure_fin: this.form.heure_fin,
      type_reservation: this.reservationType,
      reservee_par: this.form.reservee_par,
      nom_club: this.form.nom_club,
      notes: this.form.notes
    };

    if (this.reservationType === 'ATHLETE') {
      dto.numero_couloir = this.athleteLane;
    } else {
      dto.numeros_couloirs = this.clubLanesSorted.length > 0 ? this.clubLanesSorted : null;
    }

    this.reservationService.create(dto).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => this.router.navigate(['/reservations']), 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Une erreur est survenue.';
        this.loading = false;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../../../core/models/reservation.model';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss']
})
export class ReservationListComponent implements OnInit {
  reservations: Reservation[] = [];
  loading = true;
  error = '';

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.reservationService.getByUser('admin@ftn.tn').subscribe({
      next: (res) => { this.reservations = res; this.loading = false; },
      error: () => { this.error = 'Erreur lors du chargement.'; this.loading = false; }
    });
  }

  cancel(id: number): void {
    if (!confirm('Annuler cette reservation ?')) return;
    this.reservationService.cancel(id).subscribe({
      next: () => this.reservations = this.reservations.filter(r => r.id !== id),
      error: () => alert('Erreur lors de l annulation.')
    });
  }

  getLaneLabel(r: Reservation): string {
    if (r.numeros_couloirs?.length) return 'Couloirs ' + r.numeros_couloirs.join(', ');
    if (r.numero_couloir) return 'Couloir ' + r.numero_couloir;
    return 'Piscine entiere';
  }

  getStatusLabel(status: Reservation['statut']): string {
    const labels: Record<Reservation['statut'], string> = {
      EN_ATTENTE: 'En attente',
      CONFIRMEE: 'Confirmee',
      ANNULEE: 'Annulee'
    };
    return labels[status] || status;
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Reservation, CreateReservationDto } from '../../../core/models/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {

  constructor(private api: ApiService) {}

  getByPool(poolId: number): Observable<Reservation[]> {
    return this.api.get<Reservation[]>(`/reservations/pool/${poolId}`);
  }

  getByUser(email: string): Observable<Reservation[]> {
    return this.api.get<Reservation[]>(`/reservations/user/${email}`);
  }

  create(dto: CreateReservationDto): Observable<{ data: Reservation }> {
    return this.api.post<{ data: Reservation }>('/reservations', dto);
  }

  cancel(id: number): Observable<void> {
    return this.api.delete<void>(`/reservations/${id}`);
  }
}
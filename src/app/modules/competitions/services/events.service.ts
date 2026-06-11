import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompetitionEvent } from '../../../core/models/competition.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class EventsService {
  constructor(private api: ApiService) {}

  create(data: Partial<CompetitionEvent>): Observable<CompetitionEvent> {
    return this.api.post<CompetitionEvent>('/events', data);
  }

  update(id: string, data: Partial<CompetitionEvent>): Observable<CompetitionEvent> {
    return this.api.put<CompetitionEvent>(`/events/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/events/${id}`);
  }

  getById(id: string): Observable<CompetitionEvent> {
    return this.api.get<CompetitionEvent>(`/events/${id}`);
  }
}

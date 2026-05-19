import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Competition, CompetitionEvent, CompetitionFilter, Registration } from '../../../core/models/competition.model';
import { PagedResult } from '../../../core/models/result.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class CompetitionsService {
  constructor(private api: ApiService) {}

  getAll(filter: CompetitionFilter = {}, page = 1, pageSize = 10): Observable<PagedResult<Competition>> {
    return this.api.get<PagedResult<Competition>>('/competitions', { ...filter, page, pageSize });
  }

  getById(id: string): Observable<Competition> {
    return this.api.get<Competition>(`/competitions/${id}`);
  }

  getEvents(competitionId: string): Observable<CompetitionEvent[]> {
    return this.api.get<CompetitionEvent[]>(`/competitions/${competitionId}/events`);
  }

  register(athleteId: string, eventId: string, seedTime?: string): Observable<Registration> {
    return this.api.post<Registration>('/registrations', { athleteId, eventId, seedTime });
  }

  cancelRegistration(registrationId: string): Observable<void> {
    return this.api.delete<void>(`/registrations/${registrationId}`);
  }

  create(competition: Partial<Competition>): Observable<Competition> {
    return this.api.post<Competition>('/competitions', competition);
  }

  update(id: string, competition: Partial<Competition>): Observable<Competition> {
    return this.api.put<Competition>(`/competitions/${id}`, competition);
  }
}

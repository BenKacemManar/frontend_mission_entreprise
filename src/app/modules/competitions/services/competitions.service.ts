import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Competition, CompetitionEvent, CompetitionFilter } from '../../../core/models/competition.model';
import { PagedResult } from '../../../core/models/result.model';
import { ApiService } from '../../../core/services/api.service';

const STATUS_TO_FRONT: Record<string, string> = {
  PLANIFIEE: 'upcoming', EN_COURS: 'ongoing', TERMINEE: 'finished', ANNULEE: 'cancelled',
};
const STATUS_TO_BACK: Record<string, string> = {
  upcoming: 'PLANIFIEE', ongoing: 'EN_COURS', finished: 'TERMINEE', cancelled: 'ANNULEE',
};
const EVENT_STATUS_TO_FRONT: Record<string, string> = {
  PLANIFIEE: 'upcoming', EN_COURS: 'ongoing', TERMINEE: 'finished', ANNULEE: 'cancelled',
};

@Injectable({ providedIn: 'root' })
export class CompetitionsService {
  constructor(private api: ApiService) {}

  private springPage<T>(p: any, mapper: (x: any) => T): PagedResult<T> {
    return {
      data:     (p.content ?? []).map(mapper),
      total:    p.totalElements ?? 0,
      page:    (p.number ?? 0) + 1,
      pageSize: p.size ?? 10,
    };
  }

  private mapComp(c: any): Competition {
    return { ...c, status: (STATUS_TO_FRONT[c.status] ?? c.status) as any };
  }

  private mapEvent(e: any): CompetitionEvent {
    return { ...e, status: EVENT_STATUS_TO_FRONT[e.status] ?? e.status };
  }

  getAll(filter: CompetitionFilter = {}, page = 1, pageSize = 10): Observable<PagedResult<Competition>> {
    const params: any = { page: page - 1, size: pageSize, sort: 'startDate' };
    if (filter.status) params.status = STATUS_TO_BACK[filter.status] ?? filter.status;
    if (filter.type)   params.type   = filter.type;
    return this.api.get<any>('/competitions', params).pipe(
      map(p => this.springPage(p, c => this.mapComp(c)))
    );
  }

  getById(id: string): Observable<Competition> {
    return this.api.get<any>(`/competitions/${id}`).pipe(map(c => this.mapComp(c)));
  }

  getEvents(competitionId: string): Observable<CompetitionEvent[]> {
    return this.api.get<any[]>(`/events/competition/${competitionId}`).pipe(
      map(arr => arr.map(e => this.mapEvent(e)))
    );
  }

  create(data: Partial<Competition>): Observable<Competition> {
    return this.api.post<any>('/competitions', data).pipe(map(c => this.mapComp(c)));
  }

  update(id: string, data: Partial<Competition>): Observable<Competition> {
    return this.api.put<any>(`/competitions/${id}`, data).pipe(map(c => this.mapComp(c)));
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/competitions/${id}`);
  }
}

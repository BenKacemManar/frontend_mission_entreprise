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

@Injectable({ providedIn: 'root' })
export class CompetitionsService {
  constructor(private api: ApiService) {}

  // Backend returns { total_count, data } → after interceptor: { totalCount, data }
  private pageFrom<T>(p: any, page: number, pageSize: number, mapper: (x: any) => T): PagedResult<T> {
    return {
      data:     (p.data ?? []).map(mapper),
      total:    p.totalCount ?? 0,
      page,
      pageSize,
    };
  }

  private mapComp(c: any): Competition {
    return { ...c, status: (STATUS_TO_FRONT[c.status] ?? c.status) as any };
  }

  private mapEvent(e: any): CompetitionEvent {
    return { ...e, distance: Number(e.distance), status: (STATUS_TO_FRONT[e.status] ?? e.status) as any };
  }

  getAll(filter: CompetitionFilter = {}, page = 1, pageSize = 10): Observable<PagedResult<Competition>> {
    const params: any = { page: page - 1, size: pageSize };
    if (filter.status) params.status = STATUS_TO_BACK[filter.status] ?? filter.status;
    if (filter.type)   params.type   = filter.type;
    return this.api.get<any>('/competitions', params).pipe(
      map(p => this.pageFrom(p, page, pageSize, c => this.mapComp(c)))
    );
  }

  // Single item: backend returns { data: {...} }
  getById(id: string): Observable<Competition> {
    return this.api.get<any>(`/competitions/${id}`).pipe(
      map(r => this.mapComp(r.data ?? r))
    );
  }

  // Events list: backend returns plain array []
  getEvents(competitionId: string): Observable<CompetitionEvent[]> {
    return this.api.get<any[]>(`/events/competition/${competitionId}`).pipe(
      map(arr => (arr ?? []).map(e => this.mapEvent(e)))
    );
  }

  create(data: Partial<Competition>): Observable<Competition> {
    return this.api.post<any>('/competitions', data).pipe(map(r => this.mapComp(r.data ?? r)));
  }

  update(id: string, data: Partial<Competition>): Observable<Competition> {
    return this.api.put<any>(`/competitions/${id}`, data).pipe(map(r => this.mapComp(r.data ?? r)));
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/competitions/${id}`);
  }
}

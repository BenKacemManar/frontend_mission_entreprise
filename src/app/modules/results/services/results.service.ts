import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Result, NationalRanking, ResultFilter, RankingFilter, PagedResult } from '../../../core/models/result.model';
import { ApiService } from '../../../core/services/api.service';

const RESULT_STATUS_MAP: Record<string, string> = {
  EN_ATTENTE: 'pending', VALIDE: 'ok', DQ: 'DQ', DNS: 'DNS', DNF: 'DNF',
};

@Injectable({ providedIn: 'root' })
export class ResultsService {
  constructor(private api: ApiService) {}

  private springPage<T>(p: any, mapper: (x: any) => T): PagedResult<T> {
    return {
      data:     (p.content ?? []).map(mapper),
      total:    p.totalElements ?? 0,
      page:    (p.number ?? 0) + 1,
      pageSize: p.size ?? 10,
    };
  }

  private mapResult(r: any): Result {
    return { ...r, status: (RESULT_STATUS_MAP[r.status] ?? r.status) as any };
  }

  getResults(filter: ResultFilter = {}, page = 1, pageSize = 10): Observable<PagedResult<Result>> {
    const params: any = { page: page - 1, size: pageSize };
    if (filter.search)         params.search         = filter.search;
    if (filter.gender)         params.gender         = filter.gender;
    if (filter.year)           params.year           = filter.year;
    if (filter.competitionType) params.competitionType = filter.competitionType;
    if (filter.discipline)     params.discipline     = filter.discipline;
    return this.api.get<any>('/results', params).pipe(
      map(p => this.springPage(p, r => this.mapResult(r)))
    );
  }

  getAthleteResults(athleteId: string, page = 1, pageSize = 10): Observable<PagedResult<Result>> {
    return this.api.get<any>(`/results/athlete/${athleteId}`, { page: page - 1, size: pageSize }).pipe(
      map(p => this.springPage(p, r => this.mapResult(r)))
    );
  }

  getEventResults(eventId: string): Observable<Result[]> {
    return this.api.get<any[]>(`/results/event/${eventId}`).pipe(
      map(arr => arr.map(r => this.mapResult(r)))
    );
  }

  getRankings(filter: RankingFilter = {}, page = 1, pageSize = 10): Observable<PagedResult<NationalRanking>> {
    const params: any = { page: page - 1, size: pageSize };
    if (filter.season)      params.season      = filter.season;
    if (filter.gender)      params.gender      = filter.gender;
    if (filter.ageCategory) params.ageCategory = filter.ageCategory;
    if (filter.swimStyle)   params.swimStyle   = filter.swimStyle;
    if (filter.distance)    params.distance    = filter.distance;
    return this.api.get<any>('/rankings', params).pipe(
      map(p => this.springPage(p, r => r as NationalRanking))
    );
  }

  getNationalRanking(eventId: string, season: string, page = 1, pageSize = 20): Observable<PagedResult<NationalRanking>> {
    return this.api.get<any>('/rankings/national', { eventId, season, page: page - 1, size: pageSize }).pipe(
      map(p => this.springPage(p, r => r as NationalRanking))
    );
  }

  rebuildRankings(eventId: string, season: string): Observable<any> {
    return this.api.post<any>('/rankings/rebuild', { eventId: Number(eventId), season });
  }

  createResult(data: Partial<Result>): Observable<Result> {
    return this.api.post<any>('/results', data).pipe(map(r => this.mapResult(r)));
  }

  updateResult(id: string, data: Partial<Result>): Observable<Result> {
    return this.api.put<any>(`/results/${id}`, data).pipe(map(r => this.mapResult(r)));
  }

  deleteResult(id: string): Observable<void> {
    return this.api.delete<void>(`/results/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Result, NationalRanking, ResultFilter, RankingFilter } from '../../../core/models/result.model';
import { PagedResult } from '../../../core/models/result.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class ResultsService {
  constructor(private api: ApiService) {}

  getResults(filter: ResultFilter = {}, page = 1, pageSize = 10): Observable<PagedResult<Result>> {
    return this.api.get<PagedResult<Result>>('/results', { ...filter, page, pageSize });
  }

  getAthleteResults(athleteId: string, page = 1, pageSize = 10): Observable<PagedResult<Result>> {
    return this.api.get<PagedResult<Result>>(`/athletes/${athleteId}/results`, { page, pageSize });
  }

  getRankings(filter: RankingFilter = {}, page = 1, pageSize = 10): Observable<PagedResult<NationalRanking>> {
    return this.api.get<PagedResult<NationalRanking>>('/rankings', { ...filter, page, pageSize });
  }

  publishResult(result: Partial<Result>): Observable<Result> {
    return this.api.post<Result>('/results', result);
  }
}

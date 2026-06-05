export type ResultStatus = 'OK' | 'DQ' | 'DNS' | 'DNF' | 'ok' | 'pending';

export interface Result {
  id: string;
  athleteId: string;
  athleteName?: string;
  clubName?: string;
  eventId: string;
  eventLabel?: string;
  competitionName?: string;
  tempsMs: number;
  tempsDisplay?: string;
  pointsFina?: number;
  tour?: string;
  status: ResultStatus;
  rank?: number;
  isRecord?: boolean;
}

export interface NationalRanking {
  id: string;
  rank: number;
  athleteId: string;
  athleteName?: string;
  clubName?: string;
  eventLabel?: string;
  bestTimeMs: number;
  bestTimeDisplay?: string;
  pointsFina?: number;
  season: string;
}

export interface PagedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

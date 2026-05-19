export type ResultStatus = 'OK' | 'DQ' | 'DNS' | 'DNF';

export interface Result {
  id: string;
  athleteId: string;
  athleteName?: string;
  athleteNationality?: string;
  clubId?: string;
  clubName?: string;
  eventId: string;
  eventLabel?: string;
  competitionId?: string;
  competitionName?: string;
  lane?: number;
  tempsMs: number;
  tempsDisplay: string;
  pointsFina?: number;
  tour: string;
  status: ResultStatus;
  rank?: number;
  isRecord: boolean;
  date?: string;
  validatedBy?: string;
}

export interface NationalRanking {
  id: string;
  rank: number;
  athleteId: string;
  athleteName?: string;
  nationality?: string;
  clubName?: string;
  eventId: string;
  eventLabel?: string;
  swimStyle?: string;
  distance?: number;
  gender?: 'M' | 'F';
  ageCategory?: string;
  bestTimeMs: number;
  bestTimeDisplay: string;
  pointsFina?: number;
  season: string;
}

export interface Record {
  id: string;
  type: 'national' | 'africain' | 'monde' | 'personnel';
  eventId: string;
  eventLabel?: string;
  athleteId: string;
  athleteName?: string;
  tempsMs: number;
  tempsDisplay: string;
  date: string;
  competitionId: string;
  competitionName?: string;
}

export interface ResultFilter {
  competitionType?: string;
  category?: string;
  year?: string;
  gender?: 'M' | 'F' | '';
  discipline?: string;
  search?: string;
}

export interface RankingFilter {
  swimStyle?: string;
  distance?: string;
  gender?: 'M' | 'F' | '';
  ageCategory?: string;
  season?: string;
}

export interface PagedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type CompetitionType = 'hiver' | 'ete' | 'open' | 'international';
export type CompetitionStatus = 'upcoming' | 'ongoing' | 'finished' | 'cancelled';
export type Discipline = 'natation' | 'eau-libre' | 'water-polo' | 'plongeon' | 'synchro';
export type SwimStyle = 'libre' | 'dos' | 'brasse' | 'papillon' | '4nages';
export type RoundType = 'series' | 'demi' | 'finale';

export interface Competition {
  id: string;
  code: string;
  name: string;
  type: CompetitionType;
  discipline: Discipline;
  startDate: string;
  endDate: string;
  poolId: string;
  poolName?: string;
  city?: string;
  lane?: '25m' | '50m';
  ageCategories?: string;
  registrationDeadline?: string;
  sourceUrl?: string;
  status: CompetitionStatus;
  createdBy?: string;
  events?: CompetitionEvent[];
}

export interface CompetitionEvent {
  id: string;
  competitionId: string;
  swimStyle: SwimStyle;
  distance: number;
  gender: 'M' | 'F';
  ageCategory: string;
  round: RoundType;
  scheduledDate?: string;
  status: string;
  label?: string;
}

export interface Registration {
  id: string;
  athleteId: string;
  athleteName?: string;
  eventId: string;
  seedTime?: string;
  status: 'pending' | 'confirmed' | 'rejected';
  registeredAt: string;
}

export interface CompetitionFilter {
  type?: CompetitionType | '';
  discipline?: Discipline | '';
  region?: string;
  ageCategory?: string;
  status?: CompetitionStatus | '';
  year?: string;
  search?: string;
}

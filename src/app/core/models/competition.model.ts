export type CompetitionType = 'hiver' | 'ete' | 'open' | 'international';
export type CompetitionStatus = 'upcoming' | 'ongoing' | 'finished' | 'cancelled';
export type Discipline = 'natation' | 'eau-libre' | 'water-polo' | 'plongeon' | 'synchro';
export type SwimStyle = 'libre' | 'dos' | 'brasse' | 'papillon' | '4nages';

export interface Competition {
  id: string;
  code?: string;
  name: string;
  type: CompetitionType;
  discipline: Discipline;
  startDate: string;
  endDate: string;
  poolId?: string;
  poolName?: string;
  city?: string;
  lane?: '25m' | '50m';
  ageCategories?: string;
  registrationDeadline?: string;
  status: CompetitionStatus;
}

export interface CompetitionEvent {
  id: string;
  competitionId: string;
  swimStyle: SwimStyle;
  distance: number;
  gender: 'M' | 'F';
  ageCategory: string;
  round: string;
  scheduledDate?: string;
  status: string;
  label?: string;
}

export interface Pool {
  id: number;
  nom: string;
  ville?: string;
  adresse?: string;
  longueur?: number;
  nbCouloirs?: number;
  type?: string;
  actif?: boolean;
}

export interface PoolSchedule {
  id: number;
  poolId: number;
  purpose: string;
  startDateTime: string;
  endDateTime: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

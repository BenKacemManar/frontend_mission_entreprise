export type ReservationStatut = 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE';
export type TypeReservation = 'ATHLETE' | 'CLUB';

export interface Reservation {
  id: number;
  poolId: number;
  poolNom: string;
  poolVille: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  typeReservation: TypeReservation;
  nbCouloirs?: number | null;
  numeroCouloir?: number | null;
  numerosCouloirs?: number[] | null;
  reserveePar: string;
  nomClub?: string;
  statut: ReservationStatut;
  notes?: string;
  createdAt?: string;
}

export interface CreateReservationDto {
  poolId: number;
  date: string;
  heureDebut: string;
  heureFin: string;
  typeReservation: TypeReservation;
  nbCouloirs?: number | null;
  numeroCouloir?: number | null;
  numerosCouloirs?: number[] | null;
  reserveePar: string;
  nomClub?: string;
  notes?: string;
}

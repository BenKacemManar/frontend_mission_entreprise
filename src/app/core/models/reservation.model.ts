export type ReservationStatut = 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE';
export type TypeReservation = 'ATHLETE' | 'CLUB';

export interface Reservation {
  id: number;
  pool_id: number;
  pool_nom: string;
  pool_ville: string;
  date: string;
  heure_debut: string;
  heure_fin: string;
  type_reservation: TypeReservation;
  numero_couloir?: number | null;
  numeros_couloirs?: number[] | null;
  reservee_par: string;
  nom_club?: string;
  statut: ReservationStatut;
  notes?: string;
  created_at?: string;
}

export interface CreateReservationDto {
  pool_id: number;
  date: string;
  heure_debut: string;
  heure_fin: string;
  type_reservation: TypeReservation;
  numero_couloir?: number | null;
  numeros_couloirs?: number[] | null;
  reservee_par: string;
  nom_club?: string;
  notes?: string;
}

export interface Club {
  id: number;
  nom: string;
  ville?: string;
  region?: string;
  logo?: string;
  dateAffiliation?: string;
  actif?: boolean;
  presidentNom?: string;
  createdAt?: string;
}

export interface Licence {
  id: number;
  athleteId: number;
  clubId?: number;
  numero?: string;
  type: string;
  dateDebut?: string;
  dateExpiration?: string;
  statut?: string;
  createdAt?: string;
}

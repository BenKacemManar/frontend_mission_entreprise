export type EvenementType = 'COMPETITION' | 'CEREMONIE' | 'STAGE' | 'AUTRE';
export type EvenementStatus =
  | 'BROUILLON'
  | 'PUBLIE'
  | 'INSCRIPTIONS_OUVERTES'
  | 'EN_COURS'
  | 'TERMINE'
  | 'ARCHIVE';
export type ParticipationStatus = 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE';

export interface Evenement {
  id: number;
  type: EvenementType;
  titre: string;
  description?: string;
  dateDebut?: string;
  dateFin?: string;
  lieu?: string;
  capaciteMax?: number;
  status: EvenementStatus;
  createdById?: number;
  createdByName?: string;
  createdAt?: string;
  competitionId?: number;
}

export interface Participation {
  id: number;
  evenementId: number;
  evenementTitre?: string;
  userId: number;
  userEmail?: string;
  message?: string;
  status: ParticipationStatus;
  createdAt?: string;
}

export const EVENEMENT_TYPE_LABELS: Record<string, string> = {
  COMPETITION: 'Compétition',
  CEREMONIE: 'Cérémonie',
  STAGE: 'Stage',
  AUTRE: 'Autre',
};

export const EVENEMENT_STATUS_LABELS: Record<string, string> = {
  BROUILLON: 'Brouillon',
  PUBLIE: 'Publié',
  INSCRIPTIONS_OUVERTES: 'Inscriptions ouvertes',
  EN_COURS: 'En cours',
  TERMINE: 'Terminé',
  ARCHIVE: 'Archivé',
};

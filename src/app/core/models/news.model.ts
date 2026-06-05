export interface Actualite {
  id: number;
  titre: string;
  contenu: string;
  imageUrl?: string;
  categorie: string;
  auteurId?: number;
  auteurNom?: string;
  datePublication?: string;
  publie?: boolean;
  createdAt?: string;
}

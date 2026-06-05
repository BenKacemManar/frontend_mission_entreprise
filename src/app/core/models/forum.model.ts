export interface ForumCategory {
  id: number;
  nom: string;
  description: string;
  categorie: string;
  nbSujets: number;
}

export interface ForumThread {
  id: number;
  forumId: number;
  forumNom?: string;
  auteurNom?: string;
  auteurPrenom?: string;
  titre: string;
  contenu: string;
  dateCreation: string;
  epingle: boolean;
  ferme: boolean;
  nbVues: number;
  nbReponses: number;
}

export interface ForumPost {
  id: number;
  sujetId: number;
  auteurNom?: string;
  auteurPrenom?: string;
  contenu: string;
  dateCreation: string;
  nbLikes: number;
}

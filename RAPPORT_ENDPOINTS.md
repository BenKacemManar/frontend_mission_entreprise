# Rapport Final — Endpoints Modules Compétitions, Événements, Résultats & Classements

**Projet :** FTN Backend — Fédération Tunisienne de Natation  
**Date :** 19 mai 2026  
**Base URL :** `http://localhost:8082/api/v1`  
**Format JSON :** snake_case (stratégie Jackson globale)  
**Authentification :** JWT Bearer (optionnel en mode dev — `permitAll()` actif)

---

## 1. Module Compétitions — `/api/v1/competitions`

### Entité `competitions` (DB)

| Colonne              | Type          | Nullable | Nouveauté         |
|----------------------|---------------|----------|-------------------|
| id                   | BIGINT (PK)   | NON      |                   |
| code                 | VARCHAR(50)   | OUI      | ✅ AJOUT scraping  |
| name                 | VARCHAR(255)  | NON      |                   |
| type                 | VARCHAR(50)   | NON      |                   |
| start_date           | DATE          | OUI      |                   |
| end_date             | DATE          | OUI      |                   |
| registration_deadline| TIMESTAMP     | OUI      |                   |
| pool_id              | BIGINT        | OUI      |                   |
| lane                 | VARCHAR(10)   | OUI      | ✅ AJOUT scraping  |
| age_categories       | VARCHAR(200)  | OUI      | ✅ AJOUT scraping  |
| source_url           | TEXT          | OUI      | ✅ AJOUT scraping  |
| created_by           | BIGINT (FK)   | OUI      |                   |
| status               | VARCHAR(50)   | NON      | défaut: PLANIFIEE |
| created_at           | TIMESTAMP     | NON      |                   |
| modified_at          | TIMESTAMP     | OUI      |                   |
| deleted_at           | TIMESTAMP     | OUI      | soft delete       |

### Endpoints

| Méthode | URL                           | Description                        | Auth |
|---------|-------------------------------|-------------------------------------|------|
| GET     | `/api/v1/competitions`        | Liste paginée avec filtres          | —    |
| GET     | `/api/v1/competitions/{id}`   | Détail d'une compétition            | —    |
| POST    | `/api/v1/competitions`        | Créer une compétition               | —    |
| PUT     | `/api/v1/competitions/{id}`   | Modifier une compétition            | —    |
| DELETE  | `/api/v1/competitions/{id}`   | Supprimer (soft delete)             | —    |

### Paramètres de pagination/filtre (GET liste)

| Paramètre | Exemple          | Description               |
|-----------|------------------|---------------------------|
| page      | `page=0`         | Page (base 0)             |
| size      | `size=10`        | Éléments par page         |
| sort      | `sort=startDate` | Champ de tri              |
| status    | `status=PLANIFIEE` | Filtre sur le statut    |

### Champs du corps de requête

| Champ                  | Type     | Obligatoire | Description                       |
|------------------------|----------|-------------|-----------------------------------|
| name                   | String   | OUI         | Nom de la compétition             |
| type                   | String   | OUI         | hiver / ete / open / international|
| start_date             | Date     | OUI         | Format `yyyy-MM-dd`               |
| end_date               | Date     | OUI         | Format `yyyy-MM-dd`               |
| code                   | String   | NON         | Code interne (ex: "26005")        |
| lane                   | String   | NON         | Bassin : "25m" ou "50m"           |
| age_categories         | String   | NON         | Ex: "Benjamins, Minimes, Cadets"  |
| source_url             | String   | NON         | URL du fichier source scraping    |
| registration_deadline  | DateTime | NON         | Format ISO-8601                   |
| pool_id                | Long     | NON         | ID de la piscine                  |
| created_by_id          | Long     | NON         | ID de l'admin créateur            |

---

## 2. Module Événements — `/api/v1/events`

### Entité `epreuves` (DB)

| Colonne       | Type         | Nullable | Nouveauté         |
|---------------|--------------|----------|-------------------|
| id            | BIGINT (PK)  | NON      |                   |
| competition_id| BIGINT (FK)  | NON      |                   |
| swim_style    | VARCHAR(50)  | NON      |                   |
| distance      | VARCHAR(100) | NON      |                   |
| gender        | VARCHAR(10)  | NON      |                   |
| age_category  | VARCHAR(50)  | OUI      | ✅ AJOUT scraping  |
| round         | VARCHAR(50)  | OUI      |                   |
| scheduled_date| DATE         | NON      |                   |
| status        | VARCHAR(50)  | NON      | défaut: PLANIFIEE |
| created_at    | TIMESTAMP    | NON      |                   |
| modified_at   | TIMESTAMP    | OUI      |                   |
| deleted_at    | TIMESTAMP    | OUI      | soft delete       |

### Endpoints

| Méthode | URL                                        | Description                          | Auth |
|---------|--------------------------------------------|---------------------------------------|------|
| GET     | `/api/v1/events`                           | Liste paginée avec filtres            | —    |
| GET     | `/api/v1/events/{id}`                      | Détail d'un événement                 | —    |
| GET     | `/api/v1/events/competition/{competitionId}` | Tous les événements d'une compétition | —    |
| POST    | `/api/v1/events`                           | Créer un événement                    | —    |
| PUT     | `/api/v1/events/{id}`                      | Modifier un événement                 | —    |
| DELETE  | `/api/v1/events/{id}`                      | Supprimer (soft delete)               | —    |

### Champs du corps de requête

| Champ          | Type   | Obligatoire | Description                                              |
|----------------|--------|-------------|----------------------------------------------------------|
| competition_id | Long   | OUI         | ID de la compétition parente                            |
| swim_style     | String | OUI         | libre / dos / brasse / papillon / 4nages                |
| distance       | String | OUI         | "50" / "100" / "200" / "400" / "800" / "1500"          |
| gender         | String | OUI         | "M" ou "F"                                              |
| scheduled_date | Date   | OUI         | Format `yyyy-MM-dd`                                     |
| age_category   | String | NON         | Poussin / Benjamin / Minime / Cadet / Junior / Senior   |
| round          | String | NON         | series / demi / finale                                  |

---

## 3. Module Résultats — `/api/v1/results`

### Entité `resultats` (DB)

| Colonne      | Type           | Nullable | Nouveauté                        |
|--------------|----------------|----------|----------------------------------|
| id           | BIGINT (PK)    | NON      |                                  |
| athlete_id   | BIGINT (FK)    | NON      |                                  |
| epreuve_id   | BIGINT (FK)    | NON      |                                  |
| lane         | INT            | OUI      |                                  |
| temps_ms     | INT            | OUI      | ✅ renommé (ex `final_time`)     |
| temps_display| VARCHAR(20)    | OUI      | ✅ AJOUT scraping (ex: "58.34") |
| points_fina  | DECIMAL(8,2)   | OUI      | ✅ AJOUT scraping               |
| tour         | VARCHAR(50)    | OUI      | ✅ AJOUT (series/demi/finale)   |
| status       | VARCHAR(50)    | NON      | EN_ATTENTE / VALIDE / DQ / DNS  |
| rank         | INT            | NON      |                                  |
| is_record    | BOOLEAN        | NON      | défaut: false                    |
| validated_by | BIGINT (FK)    | OUI      |                                  |
| created_at   | TIMESTAMP      | NON      |                                  |
| deleted_at   | TIMESTAMP      | OUI      | soft delete                      |

### Endpoints

| Méthode | URL                             | Description                        | Auth |
|---------|---------------------------------|------------------------------------|------|
| GET     | `/api/v1/results`               | Liste paginée avec filtres         | —    |
| GET     | `/api/v1/results/{id}`          | Détail d'un résultat               | —    |
| GET     | `/api/v1/results/athlete/{id}`  | Tous les résultats d'un athlète    | —    |
| GET     | `/api/v1/results/event/{id}`    | Tous les résultats d'un événement  | —    |
| POST    | `/api/v1/results`               | Enregistrer un résultat            | —    |
| PUT     | `/api/v1/results/{id}`          | Modifier un résultat               | —    |
| DELETE  | `/api/v1/results/{id}`          | Supprimer (soft delete)            | —    |

### Champs du corps de requête

| Champ           | Type    | Obligatoire | Description                              |
|-----------------|---------|-------------|------------------------------------------|
| athlete_id      | Long    | OUI         | ID de l'athlète                         |
| event_id        | Long    | OUI         | ID de l'épreuve                         |
| rank            | Integer | OUI         | Classement dans l'épreuve               |
| lane            | Integer | NON         | Numéro de couloir                        |
| temps_ms        | Integer | NON         | Temps en millisecondes (ex: 58340)      |
| temps_display   | String  | NON         | Temps formaté (ex: "58.34" ou "1:02.34")|
| points_fina     | Decimal | NON         | Points FINA calculés                    |
| tour            | String  | NON         | series / demi / finale                  |
| is_record       | Boolean | NON         | Indique un record                        |
| validated_by_id | Long    | NON         | ID de l'admin validateur                |

> **Contrainte :** un seul résultat par couple (athlete_id, event_id). Une deuxième tentative retourne HTTP 409.

---

## 4. Module Classements Nationaux — `/api/v1/rankings`

### Entité `classements` (DB)

| Colonne          | Type          | Nullable | Nouveauté                               |
|------------------|---------------|----------|-----------------------------------------|
| id               | BIGINT (PK)   | NON      |                                         |
| athlete_id       | BIGINT (FK)   | NON      |                                         |
| epreuve_id       | BIGINT (FK)   | NON      | ✅ MODIFIÉ : remplace swim_style+distance |
| best_time_ms     | INT           | OUI      | ✅ renommé (ex `best_time`)             |
| best_time_display| VARCHAR(20)   | OUI      | ✅ AJOUT scraping                       |
| points_fina      | DECIMAL(8,2)  | OUI      | ✅ AJOUT scraping                       |
| rank             | INT           | NON      |                                         |
| season           | VARCHAR(20)   | NON      | ex: "2024-2025" ou "2026"              |
| created_at       | TIMESTAMP     | NON      |                                         |
| deleted_at       | TIMESTAMP     | OUI      | soft delete                             |

> **Contrainte unique :** `(athlete_id, epreuve_id, season)`

### Endpoints

| Méthode | URL                              | Description                                    | Auth |
|---------|----------------------------------|------------------------------------------------|------|
| GET     | `/api/v1/rankings`               | Liste paginée avec filtres                     | —    |
| GET     | `/api/v1/rankings/athlete/{id}`  | Classements d'un athlète (toutes épreuves)    | —    |
| GET     | `/api/v1/rankings/national`      | Classement national d'une épreuve/saison       | —    |
| POST    | `/api/v1/rankings/rebuild`       | Recalculer le classement d'une épreuve/saison  | —    |

### Paramètres GET `/rankings/national`

| Paramètre | Obligatoire | Exemple  | Description                   |
|-----------|-------------|----------|-------------------------------|
| eventId   | OUI         | `1`      | ID de l'épreuve               |
| season    | OUI         | `"2026"` | Saison (année ou "2024-2025") |

### Corps POST `/rankings/rebuild`

| Champ    | Type   | Obligatoire | Description                         |
|----------|--------|-------------|-------------------------------------|
| event_id | Long   | OUI         | ID de l'épreuve à recalculer        |
| season   | String | OUI         | Saison cible                        |

> **Logique rebuild :** lit tous les résultats de l'épreuve pour la saison, retient le meilleur temps par athlète, soft-delete l'ancien classement, insère le nouveau trié par temps croissant. Les champs `best_time_display` et `points_fina` sont repris du résultat source.

### Réponse classement (format enrichi)

Le DTO de classement retourne en plus les champs dénormalisés de l'épreuve liée :

| Champ           | Source   | Description                      |
|-----------------|----------|----------------------------------|
| event_id        | epreuve  | ID de l'épreuve                  |
| swim_style      | epreuve  | Style de nage                    |
| distance        | epreuve  | Distance                         |
| gender          | epreuve  | Genre (M/F)                      |
| age_category    | epreuve  | Catégorie d'âge                  |
| best_time_ms    | classement | Meilleur temps en ms           |
| best_time_display | classement | Temps formaté                |
| points_fina     | classement | Score FINA                     |
| rank            | classement | Rang national                  |
| season          | classement | Saison                         |

---

## 5. Codes de statut HTTP utilisés

| Code | Signification                                      |
|------|----------------------------------------------------|
| 200  | Succès (GET, PUT)                                  |
| 204  | Suppression réussie (DELETE)                       |
| 400  | Données invalides (champ obligatoire manquant)     |
| 404  | Ressource introuvable                              |
| 409  | Conflit (résultat déjà enregistré pour cet athlète/épreuve) |
| 500  | Erreur serveur interne                             |

---

## 6. Changements majeurs par rapport à l'ancienne version

| Module       | Ancien                                | Nouveau                                   |
|--------------|---------------------------------------|-------------------------------------------|
| Competition  | Pas de code/lane/ageCategories        | +`code`, `lane`, `age_categories`, `source_url` |
| Event        | Pas de catégorie d'âge               | +`age_category`                           |
| Résultat     | `final_time` (ms)                     | `temps_ms` + `temps_display` + `points_fina` + `tour` |
| Classement   | `swim_style` + `distance` séparés    | `epreuve_id` (FK) + `best_time_ms` + `best_time_display` + `points_fina` |
| Rankings GET | `?swimStyle=&distance=&season=`       | `?eventId=&season=`                       |
| Rankings rebuild | `{swimStyle, distance, season}`   | `{event_id, season}`                      |

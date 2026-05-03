# Jira Replica — Backend API

API REST Node.js/Express pour un réplica de Jira, avec authentification JWT et base de données PostgreSQL.

## Stack technique

- **Node.js** + **Express**
- **PostgreSQL**
- **JWT** pour l'authentification
- **bcryptjs** pour le hachage des mots de passe

## Prérequis

- Node.js installé
- PostgreSQL installé et lancé

## Installation

### 1. Cloner le projet et installer les dépendances

```bash
cd backend
npm install
```

### 2. Configurer les variables d'environnement

Copier le fichier `.env.example` en `.env` :

```bash
cp .env.example .env
```

Puis remplir les valeurs dans `.env` avec tes propres identifiants PostgreSQL.

### 3. Créer la base de données

```bash
psql -U <ton_user_postgres> -d postgres -c "CREATE DATABASE jira_db;"
```

> Sur Mac avec Homebrew, `<ton_user_postgres>` est généralement ton nom de session.  
> Sur Linux/Windows, c'est souvent `postgres`.

### 4. Lancer le serveur

```bash
npm start
```

Le serveur démarre sur `http://localhost:4000`. Les tables sont créées automatiquement au premier lancement.

---

## Variables d'environnement

| Variable | Description | Exemple |
|---|---|---|
| `PORT` | Port du serveur | `4000` |
| `DB_HOST` | Hôte PostgreSQL | `localhost` |
| `DB_PORT` | Port PostgreSQL | `5432` |
| `DB_NAME` | Nom de la base | `jira_db` |
| `DB_USER` | Utilisateur PostgreSQL | `postgres` |
| `DB_PASSWORD` | Mot de passe PostgreSQL | `password` |
| `JWT_SECRET` | Clé secrète JWT | `unechainetreslongue` |

---

## Routes API

### Users
| Méthode | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/users/register` | ❌ | Créer un compte |
| POST | `/api/users/login` | ❌ | Se connecter, retourne un token JWT |

### Projects
| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/projects/getAll` | ✅ | Récupérer tous les projets |
| GET | `/api/projects/get/:id` | ✅ | Récupérer un projet |
| POST | `/api/projects/create` | ✅ | Créer un projet |
| PUT | `/api/projects/update/:id` | ✅ | Modifier un projet (owner uniquement) |
| DELETE | `/api/projects/delete/:id` | ✅ | Supprimer un projet (owner uniquement) |

### Issues
| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/issues/getAll/:project_id` | ✅ | Récupérer toutes les issues d'un projet |
| GET | `/api/issues/get/:id` | ✅ | Récupérer une issue |
| POST | `/api/issues/create` | ✅ | Créer une issue |
| PUT | `/api/issues/update/:id` | ✅ | Modifier une issue |
| DELETE | `/api/issues/delete/:id` | ✅ | Supprimer une issue (owner du projet uniquement) |

> Les routes avec ✅ nécessitent un header `Authorization: Bearer <token>`

---

## Exemple d'utilisation

### 1. Créer un compte
```bash
POST /api/users/register
{
  "email": "test@test.com",
  "password": "123456"
}
```

### 2. Se connecter
```bash
POST /api/users/login
{
  "email": "test@test.com",
  "password": "123456"
}
# Réponse : { "token": "eyJhbG..." }
```

### 3. Créer un projet
```bash
POST /api/projects/create
Authorization: Bearer <token>
{
  "name": "Mon projet",
  "description": "Description du projet"
}
```

### 4. Créer une issue
```bash
POST /api/issues/create
Authorization: Bearer <token>
{
  "title": "Mon premier ticket",
  "description": "Description",
  "priority": "High",
  "project_id": 1,
  "assignee_id": 1
}
```

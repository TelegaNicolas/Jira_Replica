# Telega Jira

A Jira-like project management app built with React, Node.js, PostgreSQL, Docker, and Kubernetes.

![CI/CD](https://github.com/TelegaNicolas/Jira_Replica/actions/workflows/ci-cd.yaml/badge.svg)

## Features

- Authentication with JWT (httpOnly cookies)
- Create and manage projects
- Kanban board with drag & drop
- Issue tracking with priority levels
- Assign issues to team members

## Tech Stack

**Frontend** — React, React Router, Axios, CSS Modules  
**Backend** — Node.js, Express, PostgreSQL  
**Infrastructure** — Docker, Kubernetes, GitHub Actions

## Quick Start

**Requirements:** Docker and Docker Compose installed.

```bash
# Clone the repo
git clone https://github.com/TelegaNicolas/Jira_Replica.git
cd Jira_Replica

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Start everything
docker-compose up --build
```

App runs at `http://localhost:8080`

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```
DB_NAME=jira_db
DB_USER=your_postgres_user
DB_PASSWORD=your_password
JWT_SECRET=a_long_random_string
```

## Local Development

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm start

# Frontend
cd frontend/jira_replica
cp .env.example .env
npm install
npm run dev
```

Backend runs at `http://localhost:4000`  
Frontend runs at `http://localhost:5173`

## Kubernetes (local)

**Requirements:** Docker, Minikube, kubectl installed.

```bash
# Start Minikube
minikube start
minikube addons enable ingress

# Apply secrets (copy and fill in your values first)
cp k8s/secrets.example.yaml k8s/secrets.yaml
kubectl apply -f k8s/

# Start tunnel
sudo minikube tunnel
```

App runs at `http://jira.local` (add `127.0.0.1 jira.local` to `/etc/hosts`)

## CI/CD

On every push to `main`, GitHub Actions automatically:
1. Runs tests
2. Builds Docker images
3. Pushes to Docker Hub

Docker images: [teleganicolas/jira-backend](https://hub.docker.com/r/teleganicolas/jira-backend) · [teleganicolas/jira-frontend](https://hub.docker.com/r/teleganicolas/jira-frontend)

## Project Structure

```
├── backend/          Node.js API
├── frontend/         React app
├── database/         SQL schema
├── k8s/             Kubernetes manifests
├── docker/           Docker config
└── docker-compose.yml
```

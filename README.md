# fullstack-task-app-mern

A full-stack Task Manager application built with the MERN stack, featuring a React frontend, Next.js app, React Native mobile app, REST API backend, Docker support, Kubernetes deployment, and CI/CD with Jenkins.

---

## Project Structure

```
├── backend/          # Express.js REST API
├── frontend/         # React.js frontend
├── nextjs+/          # Next.js app with Tailwind CSS
├── mobile-app/       # React Native (Expo) mobile app
├── nginx/            # Nginx reverse proxy config
├── k8s/              # Kubernetes deployment manifests
├── prometheus/       # Prometheus monitoring config
├── .github/          # GitHub Actions workflows
├── Jenkinsfile       # Jenkins CI/CD pipeline
└── docker-compose.prod.yml
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Frontend | React 18, Axios |
| Next.js App | Next.js 14, Tailwind CSS |
| Mobile | React Native, Expo |
| Auth | JWT, bcryptjs |
| AI | AWS Bedrock |
| DevOps | Docker, Kubernetes, Jenkins, Nginx |
| Monitoring | Prometheus, Winston |

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB
- Docker (optional)

### Backend
```bash
cd backend
npm install
cp .env.production.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Next.js App
```bash
cd nextjs+
npm install
npm run dev
```

### Mobile App
```bash
cd mobile-app
npm install
npm start
```

---

## Docker

```bash
docker-compose -f docker-compose.prod.yml up --build
```

---

## Environment Variables

Copy the example files and fill in your values:

```bash
cp .env.production.example .env.production
cp backend/.env.production.example backend/.env
cp mobile-app/.env.example mobile-app/.env
```

---

## Features

- User authentication (Register / Login / JWT)
- Task CRUD operations
- AI Chat assistant powered by AWS Bedrock
- File upload with OCR (Tesseract.js)
- PDF parsing
- Redis caching
- Rate limiting & security headers (Helmet)
- Swagger API docs
- Prometheus monitoring
- Docker & Kubernetes ready
- CI/CD with Jenkins and GitHub Actions

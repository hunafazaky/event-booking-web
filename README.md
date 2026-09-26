# AdaMatsuri Web

AdaMatsuri Web is the frontend application for AdaMatsuri, a community-focused event booking platform for anime festivals, doujin events, screenings, meetups, and organizer-managed experiences. It gives attendees a way to browse upcoming events, book tickets, and manage their profile, while organizers can create and manage event listings through protected role-based routes.

---

## Tech Stack

- **Runtime / Language:** Node.js + TypeScript
- **Framework:** React 19, Vite, React Router
- **Database:** Not used in the frontend; this app consumes the AdaMatsuri backend API
- **Tooling & Infrastructure:** Tailwind CSS v4, shadcn-style UI primitives, Base UI, Vite, oxlint

---

## Prerequisites

Ensure you have the following installed on your machine before getting started:

- Node.js >= 18 or Bun >= 1.0
- The AdaMatsuri backend API running locally or remotely
- Optional: Docker Compose if you are using the backend container setup

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd adamatsuri-web
```

### 2. Environment Setup

Copy the example environment file and configure the backend API base URL:

```bash
cp .env.example .env.local
```

The default development configuration points to:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

If your backend runs elsewhere, update the value in `.env.local`.

### 3. Install Dependencies

```bash
npm install
# or
bun install
```

---

## Running the Application

### Development Mode

```bash
npm run dev
# or
bun run dev
```

The Vite development server starts the frontend locally for rapid iteration.

### Production Mode

```bash
npm run build
npm run preview
# or
bun run build
bun run preview
```

This builds the app for production and serves the generated bundle locally for preview.

---

## Available Scripts

| Script            | Description                                             |
| :---------------- | :------------------------------------------------------ |
| `npm run dev`     | Starts the Vite development server                      |
| `npm run build`   | Runs TypeScript checks and builds the production bundle |
| `npm run lint`    | Runs the project linter with oxlint                     |
| `npm run preview` | Serves the production build locally for preview         |

---

## API Documentation

This frontend communicates with the AdaMatsuri backend through a REST API. The API base URL is configured via `VITE_API_BASE_URL`, which defaults to `http://localhost:8080/api` when not set.

For endpoint details, request/response schemas, and Swagger/OpenAPI documentation, refer to the backend repository and its API docs.

---

## Testing

This project does not currently include an automated frontend test suite. The available validation command is linting:

```bash
npm run lint
# or
bun run lint
```

---

## Project Structure

```text
adamatsuri-web/
├── public/
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── lib/
│   ├── pages/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── .gitignore
├── components.json
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── bun.lock
└── README.md
```

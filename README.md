# Creating a User listing AI app with different agents
This project is part of my experimentation with AI Agents (Copilot, Claude, Cline etc) creating a simple RESTful Users list with Vue.js, Unit tests and some pre-commit hooks. It demonstrates a minimal Express REST API with a Vue frontend that stores users in a local SQLite database.

In this specific repository, I'll be using Cline (with Laguna S 2.1 Free), free plan.

This project is loosely based on this [YouTube video tutorial](https://www.youtube.com/watch?v=wlpBCazAY9Q&t=377s), but I'm adding my personal preferences.

--------------------

# Vue SQLite Test List

A full-stack **REST API** built with **Express** + **SQLite** (backend) and **Vue.js 3** + **Vite** (frontend) for user management.

## Features

- **REST API** with full CRUD operations:
  - `GET /api/users` — Get all users
  - `GET /api/users/:id` — Get a single user
  - `POST /api/users` — Create a new user
  - `PUT /api/users/:id` — Update an existing user
  - `DELETE /api/users/:id` — Delete a user
- **SQLite** database stored locally in `database/users.db`
- **Vue.js 3** frontend with reactive components
- **Axios** API client with request/response handling
- **Vite** dev server with API proxy to the backend
- Input validation and error handling (400 / 404 / 409)

## Project Structure

```
cline-vue-sql-test-list/
├── backend/
│   ├── package.json
│   ├── server.js          # Express server entry point
│   ├── db.js              # SQLite connection & helpers
│   └── routes/
│       └── users.js       # REST API routes for users
├── frontend/
│   ├── package.json
│   ├── vite.config.js     # Vite config with API proxy
│   ├── index.html
│   └── src/
│       ├── main.js        # Vue app entry point
│       ├── App.vue        # Main app component
│       ├── style.css      # Global styles
│       ├── api/
│       │   └── users.js   # Axios API client
│       └── components/
│           ├── UserForm.vue   # Create/edit user form
│           └── UserList.vue   # Users table listing
├── database/
│   └── users.db           # SQLite database (auto-created)
├── package.json           # Root package with convenience scripts
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://docs.npmjs.com/downloading-npm) (bundled with Node.js)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd vue-sqlite-test-list

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Running the Application

You can run each server independently or use the root scripts.

#### Option 1: Run individually

```bash
# Terminal 1 — Backend (Express on http://localhost:3000)
cd backend
node server.js

# Terminal 2 — Frontend (Vite on http://localhost:5173)
cd frontend
npm run dev
```

#### Option 2: Concurrent (requires `concurrently` at root)

```bash
npm run dev
```

Once both servers are running, open [http://localhost:5173](http://localhost:5173) in your browser.

## API Endpoints

All endpoints are prefixed with `/api/users`.

| Method   | Endpoint       | Description               | Body                        | Success Response |
|----------|----------------|---------------------------|-----------------------------|------------------|
| GET      | `/api/users`   | Get all users             | —                           | `200` — `[{...}]`|
| GET      | `/api/users/:id` | Get a user by ID        | —                           | `200` — `{...}`  |
| POST     | `/api/users`   | Create a new user         | `{name, email, age}`        | `201` — `{...}`  |
| PUT      | `/api/users/:id` | Update a user by ID    | `{name, email, age}`        | `200` — `{...}`  |
| DELETE   | `/api/users/:id` | Delete a user by ID    | —                           | `200` — `{message}` |

### User Object

```json
{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "age": 28,
  "created_at": "2026-10-29 12:00:00",
  "updated_at": "2026-10-29 12:00:00"
}
```

### Error Responses

| Status | Condition                            |
|--------|--------------------------------------|
| 400    | Missing required fields (`name`, `email`) |
| 404    | User not found                       |
| 409    | Email already exists (unique constraint) |
| 500    | Internal server error                |

## Database

The SQLite database file (`users.db`) is automatically created in the `database/` folder on the first server start. The schema is initialized automatically:

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  age INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Frontend

The Vue.js frontend provides a clean, responsive UI:

- **UserForm** — A two-way form that works for both creating and editing users. Pre-fills fields when editing and includes validation.
- **UserList** — A table displaying all users with inline edit and delete buttons.

The Vite dev server proxies `/api/*` requests to `http://localhost:3000` (the Express backend), eliminating CORS issues during development.

  # SkillSyncAI

SkillSyncAI is a full-stack student profile platform. Users can create an account, manage their academic profile, skills, projects, certifications, and resume, then ask an AI assistant questions about their uploaded resume.

## Features

- Google OAuth login and protected API routes
- Student profile management
- Skills, projects, and certification management
- PDF resume upload and storage
- Resume question answering with retrieval-augmented generation (RAG)
- FastAPI Swagger and ReDoc documentation
- React and Vite frontend

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Axios, React Bootstrap |
| Backend | Python, FastAPI, Uvicorn, SQLAlchemy, Pydantic |
| Database | PostgreSQL via `DATABASE_URL` |
| Authentication | Google OAuth 2.0, Google ID-token verification |
| AI and RAG | LangChain, Google Gemini, optional OpenRouter, ChromaDB |
| Documents | PyPDF |

## Repository Structure

```text
skillsyncai/
├── ai/                         # Model setup, document loading, and RAG helpers
├── app/                        # Additional application entry points
├── auth/                       # Password hashing and JWT dependencies
├── database/                   # SQLAlchemy engine and sessions
├── frontend/frontend/          # React/Vite application
│   ├── components/             # Shared UI and auth/theme providers
│   ├── pages/                  # Application pages
│   └── src/                    # React entry point and global styles
├── models/                     # SQLAlchemy models
├── routes/                     # FastAPI route modules
├── schemas/                    # Pydantic request/response models
├── tests/                      # Backend tests
├── main.py                     # FastAPI application
├── requirements.txt            # Python dependencies
└── README.md
```

## Prerequisites

- Python 3.10 or newer
- Node.js and npm
- PostgreSQL, or another database supported by the configured SQLAlchemy URL
- A Google Gemini API key or an OpenRouter API key for AI resume analysis

## Configuration

Create a `.env` file in the project root for database and Google OAuth settings:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/skillsyncai
SECRET_KEY=replace-with-a-long-random-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Configure the AI provider in `ai/.env`:

```env
GEMINI_API_KEY=your-gemini-api-key
# Optional fallback provider:
OPENROUTER_API_KEY=your-openrouter-api-key
```

The backend accepts either `GEMINI_API_KEY` or `GOOGLE_API_KEY` for Gemini. Do not commit either `.env` file or any API key.

## Backend Setup

From the repository root:

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Start the API:

```powershell
python main.py
```

The API is available at `http://localhost:8000`.

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- Health endpoint: `http://localhost:8000/`

## Frontend Setup

Open a second terminal:

```powershell
cd frontend\frontend
npm install
npm run dev
```

The frontend is available at `http://localhost:5173` and uses `http://localhost:8000` as the default API URL. To change it, create `frontend/frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

Useful frontend commands:

```powershell
npm run lint
npm run build
npm run preview
```

## Typical User Workflow

1. Register a user at `/signup`.
2. Log in at `/login`.
3. Complete the student profile.
4. Add skills, projects, and certifications.
5. Upload a PDF resume at `/upload-resume`.
6. Open `/gist-model` and ask questions about the uploaded resume.

Resume analysis requires a valid login token and an uploaded resume belonging to the logged-in student.

## API Overview

All protected endpoints require:

```http
Authorization: Bearer <google_id_token>
```

Main route groups:

| Prefix | Purpose |
| --- | --- |
| `/auth` | Registration, login, JWT verification, and current user |
| `/students` | Student profile operations |
| `/skills` | Skills CRUD operations |
| `/projects` | Project and project-resume operations |
| `/certifications` | Certification operations |
| `/resume` | Resume upload, update, and AI analysis |
| `/admin` | Administrative operations |

Resume analysis uses:

```http
POST /resume/gist-model
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "msg": "How can I improve the skills section of my resume?"
}
```

The endpoint automatically selects the authenticated student's resume. A specific `resumeid` can also be supplied as a query parameter.

## Testing

From the repository root:

```powershell
$env:PYTHONPATH = "."
python -m pytest
```

The frontend can be checked separately:

```powershell
cd frontend\frontend
npm run lint
npm run build
```

## Troubleshooting

- **401 Unauthorized:** sign in again and ensure the frontend has a stored Google `access_token`.
- **Resume not found:** upload a PDF before opening resume analysis.
- **AI model unavailable:** verify the provider key in `ai/.env`, then restart the backend.
- **CORS errors:** run the frontend on `http://localhost:5173`, which is the origin allowed by the API configuration.
- **Database errors:** verify PostgreSQL is running and that `DATABASE_URL` points to an existing database.

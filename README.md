# EventHub - Event Management System

A full-stack Event Management System built with Next.js, NestJS, and PostgreSQL. This application allows users to create, view, update, and delete events, with features including event recommendations and an interactive map view.

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Material UI** - Component library with custom theming
- **React Query** - Data fetching and caching
- **React Hook Form + Zod** - Form handling with validation
- **Leaflet** - Interactive maps with OpenStreetMap
- **TypeScript** - Type safety

### Backend
- **NestJS** - Node.js framework
- **Prisma** - ORM for database access
- **PostgreSQL** - Relational database
- **class-validator** - Request validation
- **TypeScript** - Type safety

## Features

- **Event Management**: Full CRUD operations for events
- **Search & Filter**: Search events by title, description, or location; filter by category
- **Sorting**: Sort events by date, title, or creation date
- **Pagination**: Paginated event listings
- **Event Recommendations**: Algorithm-based similar event suggestions
- **Map View**: Interactive map displaying event locations
- **Responsive Design**: Mobile-first, works on all screen sizes
- **Dark Theme**: Modern dark UI with gradient accents

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd codegeeks
```

### 2. Start PostgreSQL with Docker

```bash
docker-compose up -d
```

This will start a PostgreSQL instance on port 5432 with the following credentials:
- Database: `ems_database`
- User: `ems_user`
- Password: `ems_password`

### 3. Backend Setup

```bash
cd backend

# Create .env file
cat > .env << EOF
DATABASE_URL="postgresql://ems_user:ems_password@localhost:5432/ems_database?schema=public"
PORT=3001
EOF

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed the database with sample data
npm run prisma:seed

# Start the development server
npm run start:dev
```

The backend API will be available at `http://localhost:3001`

### 4. Frontend Setup

```bash
cd frontend

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/events` | List all events (with pagination, filtering, sorting) |
| GET | `/events/:id` | Get a single event |
| GET | `/events/:id/similar` | Get similar events (recommendations) |
| POST | `/events` | Create a new event |
| PUT | `/events/:id` | Update an event |
| DELETE | `/events/:id` | Delete an event |

### Query Parameters for GET /events

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category (CONFERENCE, WORKSHOP, MEETUP, CONCERT, SPORTS, OTHER) |
| `search` | string | Search in title, description, and location |
| `sortBy` | string | Sort field (date, title, createdAt) |
| `sortOrder` | string | Sort direction (asc, desc) |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 100) |

## Event Schema

```typescript
interface Event {
  id: string;          // UUID
  title: string;       // Event title (3-200 chars)
  description: string; // Event description (10-2000 chars)
  date: string;        // ISO date string
  location: string;    // Location name (3-500 chars)
  latitude?: number;   // Optional latitude (-90 to 90)
  longitude?: number;  // Optional longitude (-180 to 180)
  category: Category;  // Event category
  createdAt: string;   // Creation timestamp
  updatedAt: string;   // Last update timestamp
}

enum Category {
  CONFERENCE = 'CONFERENCE',
  WORKSHOP = 'WORKSHOP',
  MEETUP = 'MEETUP',
  CONCERT = 'CONCERT',
  SPORTS = 'SPORTS',
  OTHER = 'OTHER'
}
```

## Recommendation Algorithm

The event recommendation system uses a score-based similarity algorithm with the following weighted factors:

1. **Category Match (+50 points)**: Events in the same category receive the highest weight
2. **Date Proximity (+30 points max)**: Events within 7 days get maximum points, decreasing linearly up to 30 days
3. **Location Proximity (+20 points max)**: Events within 50km get maximum points (if coordinates available), decreasing linearly up to 500km

The algorithm uses the Haversine formula for calculating geographic distances between event coordinates.

## Project Structure

```
codegeeks/
├── backend/
│   ├── src/
│   │   ├── common/           # Guards, filters, middleware
│   │   ├── events/           # Events module (controller, service, DTOs)
│   │   ├── prisma/           # Prisma service
│   │   ├── app.module.ts     # Root module
│   │   └── main.ts           # Application entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.ts           # Database seeder
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API client
│   │   ├── theme/            # MUI theme configuration
│   │   └── types/            # TypeScript types
│   └── package.json
├── docker-compose.yml        # PostgreSQL container
└── README.md
```

## Available Scripts

### Backend

```bash
npm run start:dev     # Start development server with hot reload
npm run build         # Build for production
npm run start:prod    # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database with sample data
npm run prisma:studio    # Open Prisma Studio
```

### Frontend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

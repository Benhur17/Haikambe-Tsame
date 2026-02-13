# Haikambe Tsame Clan Digital Archive

A modern full-stack web application for managing the Haikambe Tsame clan's genealogy, history, events, and media. Built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Member Management** - Full CRUD for clan members with search, filtering, and detailed profiles
- **Family Tree** - Interactive genealogy visualization with expandable/collapsible tree nodes
- **Newborn Registration** - Workflow for submitting and approving new clan member registrations
- **Clan History** - Document and preserve stories, traditions, and heritage by category
- **Media Archive** - Organize photos, videos, and audio into albums with categories
- **Events** - Track clan gatherings, ceremonies, and important occasions
- **Role-Based Access** - 4 roles: Super Admin, Clan Admin, Editor, Viewer
- **Dashboard** - Statistics overview with member analytics and generation distribution

## Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js 5
- **Database**: MongoDB Atlas (Mongoose 9 ODM)
- **Auth**: JWT + bcryptjs (12 salt rounds)
- **Security**: Helmet, rate limiting, mongo-sanitize, compression
- **Logging**: Winston (structured) + Morgan (HTTP)
- **Validation**: Joi schemas on all mutation endpoints

### Frontend
- **UI**: React 19 with TypeScript
- **Build**: Vite 7
- **Styling**: TailwindCSS 4 with custom design system
- **Icons**: React Icons (HeroIcons)
- **Routing**: React Router DOM 7
- **HTTP**: Axios
- **Performance**: Code splitting with React.lazy + Suspense, Error Boundaries

### DevOps
- Docker & Docker Compose
- Nginx reverse proxy (production)
- Health checks on all containers

## Project Structure

```
haikambe-tsame/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── FamilyTree.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── MemberCard.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── StatCard.jsx
│   │   ├── context/        # Auth context provider
│   │   ├── pages/          # Page components (9 pages)
│   │   ├── services/       # API service layer (Axios)
│   │   ├── App.tsx         # Root app with lazy loading
│   │   └── index.css       # Design system & utilities
│   ├── Dockerfile
│   └── nginx.conf
├── server/                 # Express backend
│   ├── middleware/
│   │   ├── auth.js         # JWT auth + role-based authorization
│   │   ├── errorHandler.js # Global error handler + asyncHandler
│   │   └── validate.js     # Joi validation schemas
│   ├── models/             # Mongoose schemas (6 models)
│   ├── routes/             # API route handlers (6 route files)
│   ├── utils/
│   │   ├── errors.js       # Custom error hierarchy
│   │   └── logger.js       # Winston structured logging
│   ├── server.js           # Entry point (security hardened)
│   └── Dockerfile
└── docker-compose.yml
```

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (or local MongoDB)

### Environment Variables

Create a `.env` file in `server/`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/haikambe-tsame
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

### Installation

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Development

```bash
# Start backend (from server/)
npm run dev

# Start frontend (from client/)
npm run dev
```

The API runs on `http://localhost:5000` and the frontend on `http://localhost:5173`.

### Seed Data

```bash
cd server
node seedData.js
```

### Docker Deployment

```bash
# From project root
docker compose up --build -d
```

This starts both services with the client on port 80 and the API on port 5000.

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/change-password` | Change password |

### Members
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/members` | List members (paginated, searchable) |
| GET | `/api/members/stats/overview` | Member statistics |
| GET | `/api/members/family-tree/:id` | Get family tree |
| GET | `/api/members/:id` | Get member by ID |
| POST | `/api/members` | Create member |
| PUT | `/api/members/:id` | Update member |
| DELETE | `/api/members/:id` | Delete member (cascade) |

### Newborn Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/newborn-requests` | List requests |
| POST | `/api/newborn-requests` | Submit request |
| PUT | `/api/newborn-requests/:id/approve` | Approve request |
| PUT | `/api/newborn-requests/:id/reject` | Reject request |

### History
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/history` | List entries |
| GET | `/api/history/:id` | Get entry |
| POST | `/api/history` | Create entry |
| PUT | `/api/history/:id` | Update entry |
| DELETE | `/api/history/:id` | Delete entry |

### Media
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/media` | List albums |
| GET | `/api/media/:id` | Get album |
| POST | `/api/media` | Create album |
| POST | `/api/media/:id/items` | Add item to album |
| DELETE | `/api/media/:id` | Delete album |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List events |
| GET | `/api/events/:id` | Get event |
| POST | `/api/events` | Create event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |

## User Roles & Permissions

| Feature | Super Admin | Clan Admin | Editor | Viewer |
|---------|:-----------:|:----------:|:------:|:------:|
| View Members | Yes | Yes | Yes | Yes |
| Create Members | Yes | Yes | Yes | No |
| Edit Members | Yes | Yes | Yes | No |
| Delete Members | Yes | Yes | No | No |
| Approve Newborns | Yes | Yes | No | No |
| Manage Users | Yes | No | No | No |
| Manage History | Yes | Yes | Yes | No |
| Manage Media | Yes | Yes | Yes | No |

## Security

- Helmet security headers
- Rate limiting (200 req/15min general, 20 req/15min auth)
- NoSQL injection prevention (mongo-sanitize)
- Request body size limits (10KB)
- JWT authentication with role-based authorization
- Joi input validation on all mutation endpoints
- CORS restricted to configured origin
- Gzip compression
- Custom error hierarchy with no stack traces in production
- Structured logging with Winston (file rotation)
- Graceful shutdown handling

## Default Admin

After seeding, login with:
- **Email**: admin@example.com
- **Password**: admin123456

## License

MIT

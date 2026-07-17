# 🏗️ Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (React/Vite)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Login/Signup → Game → Leaderboard → Profile                │
│       ↓            ↓                                          │
│  AuthContext → GameBoard → API Client (Axios)               │
│                                                               │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/WebSocket
┌──────────────────────────▼──────────────────────────────────┐
│                  SERVER (Node.js/Express)                    │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  Routes:                   Middleware:                        │
│  ├── /auth (JWT)           ├── Auth (JWT verification)      │
│  ├── /game (Game logic)    └── Error handling               │
│  └── /leaderboard (Stats)                                    │
│                                                                │
│  Utils:                    Services:                         │
│  ├── GameLogic (rules)     ├── Game management              │
│  └── MarkovModel (AI)      └── User stats update            │
│                                                                │
└──────────────────────────┬──────────────────────────────────┘
                           │ Mongoose ODM
┌──────────────────────────▼──────────────────────────────────┐
│               DATABASE (MongoDB)                              │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  Collections:                                                  │
│  ├── Users (authentication & stats)                          │
│  ├── Games (game history)                                    │
│  └── Leaderboards (rankings)                                │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

## Technology Choices & Justification

### Frontend: React + Vite
**Why?**
- Fast development with HMR
- Excellent component reusability
- Large ecosystem
- Perfect for real-time UI updates

**Key Libraries:**
- `react-router-dom` - Client-side navigation
- `axios` - HTTP requests
- `socket.io-client` - Real-time updates

### Backend: Node.js + Express
**Why?**
- JavaScript full-stack capability
- Fast, lightweight framework
- Great for real-time applications
- Easy to learn and maintain

**Key Libraries:**
- `mongoose` - MongoDB ODM
- `jwt` - Secure authentication
- `socket.io` - WebSocket support
- `bcryptjs` - Password security

### Database: MongoDB
**Why?**
- Flexible schema for game state
- Fast reads/writes
- Scalability
- Easy to prototype

**Collections:**
- Users: `{name, email, password_hash, stats}`
- Games: `{players, score, status, moves}`
- Leaderboard: `{user, rank, winRate, stats}`

## Data Flow

### Authentication Flow
```
User Input → Signup/Login
    ↓
Backend Validation → Password Hash → JWT Token
    ↓
Store Token (localStorage)
    ↓
All Requests Include JWT in Header
```

### Game Flow
```
Create Game → Toss → Play Rounds → Finish Game
    ↓           ↓        ↓              ↓
Initialize  Determine  AI Decision   Calculate Result
Game State  Winner    & Score Update   Update Leaderboard
```

### AI (Markov Model) Flow
```
Player's Move History
    ↓
Calculate Transition Probabilities
    ↓
Predict Next Move (with difficulty adjustment)
    ↓
Determine Counter or Random Move (based on difficulty)
    ↓
AI Move
```

## API Endpoints Design

### RESTful Conventions
```
POST   /api/auth/signup        → Create account
POST   /api/auth/login         → Authenticate
GET    /api/auth/me            → Get current user

POST   /api/game/create        → Start new game
POST   /api/game/toss          → Toss phase
POST   /api/game/play          → Play round
POST   /api/game/finish        → End game

GET    /api/leaderboard/top    → Rankings
GET    /api/leaderboard/my-stats  → User stats
```

## State Management

### Client-Side (React Context)
```
AuthContext
├── user (logged-in user)
├── loading (auth state)
├── login() method
├── logout() method
└── signup() method
```

### Server-Side (MongoDB)
```
User Document
├── Basic Info (name, email)
├── Authentication (password_hash)
└── Stats (gamesPlayed, wins, runs, etc.)
```

## Security Architecture

### Authentication
1. **Password Security**
   - Hashed with bcryptjs (10 salt rounds)
   - Never stored in plain text
   - Salted to prevent rainbow table attacks

2. **Token Security**
   - JWT tokens with 7-day expiration
   - Stored in localStorage (browser memory)
   - Included in Authorization header

3. **Request Validation**
   - Input sanitization
   - Type checking
   - Range validation

### API Security
- ✅ CORS enabled for specific origins
- ✅ Protected routes require JWT
- ✅ Password minimum length validation
- ✅ Email format validation

## Performance Optimizations

### Frontend
1. **Code Splitting**
   - Lazy load components with React.lazy()
   - Dynamic imports for routes

2. **Rendering**
   - Memoization for expensive components
   - useCallback for function props
   - Conditional rendering

3. **Asset Optimization**
   - Vite production build (tree-shaking)
   - CSS minification
   - Image optimization

### Backend
1. **Database**
   - Indexes on frequently queried fields
   - Connection pooling
   - Pagination for leaderboard

2. **API**
   - Response compression
   - Efficient query filtering
   - Caching strategies

## Scalability Considerations

### Current Setup
- Single server instance
- Single database
- Suitable for 100-1000 users

### Future Scaling
```
Load Balancer
├── Server Instance 1
├── Server Instance 2
└── Server Instance N
    ↓
    Database Cluster (MongoDB Atlas)
```

### Optimization for Scale
- Implement Redis for caching
- Use message queues for async tasks
- Database replication
- CDN for static assets
- Horizontal scaling with load balancing

## Error Handling

### Client-Side
```javascript
try {
  const data = await api.call()
  // Success
} catch (error) {
  // Display error to user
  // Log to monitoring service
}
```

### Server-Side
```javascript
// Express middleware catches all errors
app.use((err, req, res, next) => {
  // Log error
  // Send appropriate status code
  // Return error message
})
```

## Testing Strategy

### Manual Testing
- Authentication flow
- Game mechanics
- Leaderboard accuracy
- Edge cases (disconnects, rapid moves)

### Automated Testing (Future)
- Unit tests (Jest)
- Integration tests (Supertest)
- E2E tests (Cypress)

## Deployment Architecture

### Current Local Setup
```
Developer Machine
├── Client (npm run dev)
└── Server (npm run dev)
    └── MongoDB (local)
```

### Production Setup (Recommended)
```
Vercel/Netlify (Frontend)
├── React build
└── CI/CD pipeline

Heroku/Railway (Backend)
├── Node.js server
└── Environment variables

MongoDB Atlas (Database)
├── Cloud cluster
└── Automatic backups
```

## Monitoring & Logging

### Recommended Tools
- **Monitoring**: Sentry for error tracking
- **Logging**: Winston or Pino for structured logs
- **Analytics**: Google Analytics or Mixpanel
- **Database**: MongoDB Atlas monitoring

## Configuration Management

```
Development (.env)
├── PORT=5000
├── NODE_ENV=development
└── MONGODB_URI=mongodb://localhost:27017

Production (.env.production)
├── PORT=process.env.PORT
├── NODE_ENV=production
└── MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net
```

## CI/CD Pipeline (Future)

```
GitHub Push
    ↓
GitHub Actions
├── Lint & Format Check
├── Run Tests
├── Build & Deploy Frontend
└── Deploy Backend
    ↓
Production
```

## Disaster Recovery

- **Database Backups**: MongoDB Atlas automated backups
- **Version Control**: Git for code rollbacks
- **Environment Variables**: Encrypted in deployment platform
- **Secrets Management**: HashiCorp Vault (for large scale)

---

This architecture is designed to be:
- ✅ Scalable for future growth
- ✅ Maintainable with clear separation of concerns
- ✅ Secure with proper authentication
- ✅ Performant with optimization strategies
- ✅ Production-ready for deployment

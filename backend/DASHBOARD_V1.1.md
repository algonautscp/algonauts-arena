# Algonauts Arena Backend v1.1 - Dashboard Extension

## Overview

This extension adds read-heavy dashboard functionality with clear separation of concerns, minimal schema additions, and predictable performance. The implementation follows the specified constraints: no background jobs, no real-time logic, and no overengineering.

## Database Changes

### New Tables

#### 1. `practice_goals`
- **Purpose**: Store soft practice goals set by users
- **Schema**:
  - `id`: UUID (primary key)
  - `userId`: UUID (foreign key → User)
  - `weeklyTarget`: Int (number of problems per week)
  - `minDifficulty`: Enum ("EASY" | "MEDIUM" | "HARD")
  - `createdAt`: DateTime (default now)
- **Rules**: One active goal per user, overwrite on update
- **Indexes**: `userId` (indexed, unique)

#### 2. `mentor_notes`
- **Purpose**: Allow mentors to leave feedback for users
- **Schema**:
  - `id`: UUID (primary key)
  - `mentorId`: UUID (foreign key → User)
  - `userId`: UUID (foreign key → User)
  - `content`: Text
  - `createdAt`: DateTime (default now)
- **Visibility**: Target user, mentor who wrote it, ADMIN only
- **Indexes**: `userId` (indexed), `mentorId` (indexed)

## API Routes

### Dashboard Routes (Read-Only)

#### `GET /api/dashboard/overview`
**Purpose**: High-level personal stats for dashboard header

**Response**:
```json
{
  "rank": 142,
  "practiceStreak": 7,
  "solvedCount": 89
}
```

**Performance**: Uses indexed queries, optimized rank calculation

---

#### `GET /api/dashboard/progress`
**Purpose**: Progress mirror data

**Response**:
```json
{
  "sessionTimeline": [
    {
      "sessionDate": "2024-01-01T00:00:00.000Z",
      "solvedCount": 5
    }
  ],
  "difficultyBreakdown": {
    "EASY": 45,
    "MEDIUM": 32,
    "HARD": 12
  },
  "weakAreas": [
    {
      "difficulty": "MEDIUM",
      "failureRate": 0.65
    }
  ]
}
```

**Rules**: Session-based timeline, rule-based weak areas only

---

#### `GET /api/dashboard/competition-preview`
**Purpose**: Competitive context without full leaderboard

**Response**:
```json
{
  "top5": [
    {
      "userId": "uuid",
      "name": "Alice Chen",
      "solvedCount": 342,
      "rank": 1
    }
  ],
  "myRank": {
    "rank": 142,
    "solvedCount": 89
  }
}
```

**Rules**: Always returns Top 5 + user's rank

---

#### `GET /api/dashboard/activity`
**Purpose**: Social & mentorship signals

**Response**:
```json
{
  "activityFeed": [
    {
      "type": "PRACTICE",
      "message": "Practice session completed",
      "createdAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "mentorNotes": [
    {
      "id": "uuid",
      "mentorName": "John Mentor",
      "content": "Great progress!",
      "createdAt": "2024-01-01T09:00:00.000Z"
    }
  ],
  "announcements": []
}
```

**Rules**: Aggregated data, limited to last 20 entries

### Write Operations

#### `POST /api/practice-goals`
**Purpose**: Create or overwrite practice goal

**Request**:
```json
{
  "weeklyTarget": 10,
  "minDifficulty": "MEDIUM"
}
```

**Validation**: weeklyTarget (1-100), minDifficulty (EASY/MEDIUM/HARD)

---

#### `POST /api/mentor-notes`
**Purpose**: Create mentor note (MENTOR/ADMIN only)

**Request**:
```json
{
  "userId": "target-user-uuid",
  "content": "Focus on dynamic programming"
}
```

**Validation**: userId (required), content (1-1000 chars)

## Architecture

### Route Structure
```
Routes → Controllers → Services → Prisma
```

### Key Files Created
- `src/services/dashboard.service.js` - Dashboard data logic
- `src/services/practiceGoal.service.js` - Practice goals logic
- `src/services/mentorNote.service.js` - Mentor notes logic
- `src/controllers/dashboard.controller.js` - Dashboard endpoints
- `src/controllers/practiceGoal.controller.js` - Practice goals endpoints
- `src/controllers/mentorNote.controller.js` - Mentor notes endpoints
- `src/routes/dashboard.routes.js` - Dashboard routing
- `src/routes/practiceGoal.routes.js` - Practice goals routing
- `src/routes/mentorNote.routes.js` - Mentor notes routing
- `src/middlewares/validation.middleware.js` - Input validation

### Performance Optimizations
- **No joins across more than 3 tables**
- **Indexed queries only**
- **No full-table scans**
- **Optimized rank calculation**
- **Limited result sets** (Top 5, last 20 entries, etc.)

## Security

### Authentication
- All routes require JWT authentication
- JWT payload contains `userId` and `role` only
- `userId` derived from JWT, never from request body

### Authorization
- **Dashboard routes**: All authenticated users
- **Practice goals**: User can only manage their own goals
- **Mentor notes**: 
  - POST: MENTOR or ADMIN only
  - GET: Role-based visibility (user sees own, mentor sees own writes, admin sees all)
  - DELETE: Author or ADMIN only

### Visibility Rules
- **Mentor Notes**: Target user, mentor who wrote it, ADMIN only
- **Practice Goals**: User only
- **Dashboard Data**: User only (no cross-user data exposure)

## Error Handling

### Standard Responses
- **400**: Validation errors
- **401**: Authentication required
- **403**: Access denied (role-based)
- **404**: Resource not found
- **500**: Server errors (development details included)

### Consistent Format
```json
{
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Constraints Met

✅ **No real-time updates** - No WebSockets
✅ **No background jobs** - No cron tasks
✅ **No heavy aggregation** - Simple queries only
✅ **No caching layer** - Direct database queries
✅ **Read-heavy optimized** - Indexed queries
✅ **Minimal schema** - Only 2 new tables
✅ **No joins > 3 tables** - Query optimization
✅ **JWT-only auth** - No cookies, no refresh tokens
✅ **Role-based access** - Proper authorization
✅ **No overengineering** - Simple, predictable code

## Database Migration

Run the following to apply schema changes:
```bash
npx prisma migrate dev --name dashboard-v1.1
npx prisma generate
```

## Testing

### Example API Calls

```bash
# Get dashboard overview
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/dashboard/overview

# Create practice goal
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"weeklyTarget": 10, "minDifficulty": "MEDIUM"}' \
  http://localhost:3000/api/practice-goals

# Create mentor note (MENTOR/ADMIN only)
curl -X POST \
  -H "Authorization: Bearer <mentor-token>" \
  -H "Content-Type: application/json" \
  -d '{"userId": "target-uuid", "content": "Great work!"}' \
  http://localhost:3000/api/mentor-notes
```

## Future Extensibility

The v1.1 implementation provides a solid foundation for:
- Real-time updates (WebSocket layer)
- Advanced analytics (aggregation tables)
- Enhanced notifications (announcement system)
- Goal tracking history (temporal tables)
- Performance metrics (query optimization)

## Stability Notes

- **Existing APIs unchanged** - No breaking changes
- **Backward compatible** - All current functionality preserved
- **Gradual rollout** - New features can be enabled incrementally
- **Monitoring ready** - Error handling and logging in place

The implementation prioritizes stability and predictability over clever optimizations, ensuring the backend remains boring, reliable, and easy to extend.

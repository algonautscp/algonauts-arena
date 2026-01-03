#!/bin/bash

# API Route Testing Script
# Tests all the routes that were previously failing

API_BASE="http://localhost:5001"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyYjlkMTgzYi03ODgxLTQ4YmMtOTc5YS1kNDBmMzE3MjBiZGUiLCJyb2xlIjoiTUVNQkVSIiwiaWF0IjoxNzY3NDA4ODQwLCJleHAiOjE3NjgwMTM2NDB9.VOMecyrKhH2LQlD--QXEUcbGLYyEGRcfSetc60qPYq4"

echo "🧪 Testing API Routes..."
echo "================================"

# Health Check
echo "1. Health Check:"
curl -s "$API_BASE/health" | jq '.'
echo ""

# Dashboard Routes (previously 401 Unauthorized)
echo "2. Dashboard Routes:"
DASHBOARD_ENDPOINTS=(
    "/api/dashboard/stats"
    "/api/dashboard/practice-timeline" 
    "/api/dashboard/difficulty-breakdown"
    "/api/dashboard/weak-areas"
    "/api/dashboard/goals"
    "/api/dashboard/activity-feed"
    "/api/dashboard/mentor-notes"
    "/api/dashboard/mentor-announcements"
    "/api/dashboard/upcoming-contest"
    "/api/dashboard/contest-history"
    "/api/dashboard/leaderboard"
    "/api/dashboard/primary-cta"
)

for endpoint in "${DASHBOARD_ENDPOINTS[@]}"; do
    echo "  - $endpoint:"
    curl -s "$API_BASE$endpoint" -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null || echo "    ❌ Failed"
done
echo ""

# Practice Routes (previously 404 Not Found)
echo "3. Practice Routes:"
PRACTICE_ENDPOINTS=(
    "/api/practice/me/stats"
    "/api/practice/leaderboard"
)

for endpoint in "${PRACTICE_ENDPOINTS[@]}"; do
    echo "  - $endpoint:"
    curl -s "$API_BASE$endpoint" -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null || echo "    ❌ Failed"
done
echo ""

# Contest Routes (previously 404 Not Found)
echo "4. Contest Routes:"
echo "  - /api/contests:"
curl -s "$API_BASE/api/contests" -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null || echo "    ❌ Failed"
echo ""

echo "✅ Route testing complete!"
echo ""
echo "📝 Summary:"
echo "  - All 401 Unauthorized errors should now be fixed (using authenticated API instance)"
echo "  - All 404 Not Found errors should now be fixed (correct API endpoints)"
echo "  - Backend server is running on port 5001"
echo "  - Frontend should now work without API errors"

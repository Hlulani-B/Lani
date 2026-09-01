#!/usr/bin/env bash
# Curl tests for Lani API
# Run: bash curlTests.sh

BASE_URL="http://localhost:3000"

echo "=========================================="
echo "Lani API Curl Tests"
echo "=========================================="
echo ""

# ── 1. GET /api/status ──────────────────────────────────────────
echo "1. Testing GET /api/status..."
echo "----------------------------------------"
curl -s -X GET "${BASE_URL}/api/status" | jq .
echo ""
echo ""

# ── 2. POST /api/chat — Simple action (no parameters) ───────────
echo "2. Testing POST /api/chat — Simple action (turn up volume)..."
echo "----------------------------------------"
curl -s -X POST "${BASE_URL}/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "turn up the volume"}' | jq .
echo ""
echo ""

# ── 3. POST /api/chat — Action with parameters ──────────────────
echo "3. Testing POST /api/chat — Action with parameters (set volume to 50)..."
echo "----------------------------------------"
curl -s -X POST "${BASE_URL}/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "set volume to 50"}' | jq .
echo ""
echo ""

# ── 4. POST /api/chat — Gibberish/unrelated request ─────────────
echo "4. Testing POST /api/chat — Gibberish request..."
echo "----------------------------------------"
curl -s -X POST "${BASE_URL}/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "asdfghjkl random gibberish"}' | jq .
echo ""
echo ""

# ── 5. POST /api/chat — Unrelated request ───────────────────────
echo "5. Testing POST /api/chat — Unrelated request (weather)..."
echo "----------------------------------------"
curl -s -X POST "${BASE_URL}/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "what is the weather today"}' | jq .
echo ""
echo ""

# ── 6. POST /api/chat — Network action (auto-fill params) ───────
echo "6. Testing POST /api/chat — Network action (set static IP)..."
echo "----------------------------------------"
curl -s -X POST "${BASE_URL}/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "set a static IP address"}' | jq .
echo ""
echo ""

# ── 7. POST /api/chat — Wifi action ─────────────────────────────
echo "7. Testing POST /api/chat — Wifi action (turn on wifi)..."
echo "----------------------------------------"
curl -s -X POST "${BASE_URL}/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "turn on wifi"}' | jq .
echo ""
echo ""

# ── 8. POST /api/chat — Brightness action ───────────────────────
echo "8. Testing POST /api/chat — Brightness action (set brightness to 70)..."
echo "----------------------------------------"
curl -s -X POST "${BASE_URL}/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "set brightness to 70 percent"}' | jq .
echo ""
echo ""

# ── 9. POST /api/chat — Theme action ────────────────────────────
echo "9. Testing POST /api/chat — Theme action (enable dark mode)..."
echo "----------------------------------------"
curl -s -X POST "${BASE_URL}/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "enable dark mode"}' | jq .
echo ""
echo ""

# ── 10. POST /api/execute — Execute action directly ─────────────
echo "10. Testing POST /api/execute — Execute volume up directly..."
echo "----------------------------------------"
curl -s -X POST "${BASE_URL}/api/execute" \
  -H "Content-Type: application/json" \
  -d '{"action": "VolumeAction.volumeUp()"}' | jq .
echo ""
echo ""

# ── 11. POST /api/execute — Execute with parameters ─────────────
echo "11. Testing POST /api/execute — Execute volumeSet with params..."
echo "----------------------------------------"
curl -s -X POST "${BASE_URL}/api/execute" \
  -H "Content-Type: application/json" \
  -d '{"action": "VolumeAction.volumeSet", "params": [30]}' | jq .
echo ""
echo ""

# ── 12. POST /api/execute — Invalid action ──────────────────────
echo "12. Testing POST /api/execute — Invalid action..."
echo "----------------------------------------"
curl -s -X POST "${BASE_URL}/api/execute" \
  -H "Content-Type: application/json" \
  -d '{"action": "InvalidAction.invalidMethod()"}' | jq .
echo ""
echo ""

# ── 13. POST /api/chat — Missing message ────────────────────────
echo "13. Testing POST /api/chat — Missing message (should error)..."
echo "----------------------------------------"
curl -s -X POST "${BASE_URL}/api/chat" \
  -H "Content-Type: application/json" \
  -d '{}' | jq .
echo ""
echo ""

# ── 14. POST /api/execute — Missing action ──────────────────────
echo "14. Testing POST /api/execute — Missing action (should error)..."
echo "----------------------------------------"
curl -s -X POST "${BASE_URL}/api/execute" \
  -H "Content-Type: application/json" \
  -d '{}' | jq .
echo ""
echo ""

echo "=========================================="
echo "Tests complete!"
echo "=========================================="

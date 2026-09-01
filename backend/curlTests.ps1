# Curl tests for Lani API (PowerShell version)
# Run: .\curlTests.ps1

$BASE_URL = "http://localhost:3000"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Lani API Curl Tests" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 1. GET /api/status
Write-Host "1. Testing GET /api/status..." -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/status" -Method GET -ErrorAction Stop
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# 2. POST /api/chat - Simple action (no parameters)
Write-Host "2. Testing POST /api/chat - Simple action (turn up volume)..." -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $body = @{ message = "turn up the volume" } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/chat" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# 3. POST /api/chat - Action with parameters
Write-Host "3. Testing POST /api/chat - Action with parameters (set volume to 50)..." -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $body = @{ message = "set volume to 50" } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/chat" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# 4. POST /api/chat - Gibberish/unrelated request
Write-Host "4. Testing POST /api/chat - Gibberish request..." -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $body = @{ message = "asdfghjkl random gibberish" } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/chat" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# 5. POST /api/chat - Unrelated request
Write-Host "5. Testing POST /api/chat - Unrelated request (weather)..." -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $body = @{ message = "what is the weather today" } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/chat" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# 6. POST /api/chat - Network action (auto-fill params)
Write-Host "6. Testing POST /api/chat - Network action (set static IP)..." -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $body = @{ message = "set a static IP address" } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/chat" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# 7. POST /api/chat - Wifi action
Write-Host "7. Testing POST /api/chat - Wifi action (turn on wifi)..." -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $body = @{ message = "turn on wifi" } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/chat" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# 8. POST /api/chat - Brightness action
Write-Host "8. Testing POST /api/chat - Brightness action (set brightness to 70)..." -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $body = @{ message = "set brightness to 70 percent" } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/chat" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# 9. POST /api/chat - Theme action
Write-Host "9. Testing POST /api/chat - Theme action (enable dark mode)..." -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $body = @{ message = "enable dark mode" } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/chat" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# 10. POST /api/execute - Execute action directly
Write-Host "10. Testing POST /api/execute - Execute volume up directly..." -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $actionStr = 'VolumeAction.volumeUp()'
    $body = @{ action = $actionStr } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/execute" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# 11. POST /api/execute - Execute with parameters
Write-Host "11. Testing POST /api/execute - Execute volumeSet with params..." -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $body = @{ action = "VolumeAction.volumeSet"; params = @(30) } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/execute" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# 12. POST /api/execute - Invalid action
Write-Host "12. Testing POST /api/execute - Invalid action..." -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $actionStr = 'InvalidAction.invalidMethod()'
    $body = @{ action = $actionStr } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/execute" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# 13. POST /api/chat - Missing message
Write-Host "13. Testing POST /api/chat - Missing message (should error)..." -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $body = @{} | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/chat" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error (expected): $_" -ForegroundColor Red
}
Write-Host ""
Write-Host ""

# 14. POST /api/execute - Missing action
Write-Host "14. Testing POST /api/execute - Missing action (should error)..." -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $body = @{} | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/execute" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error (expected): $_" -ForegroundColor Red
}
Write-Host ""
Write-Host ""

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Tests complete!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Test Backend Endpoints
Write-Host "🧪 Testing Backend Endpoints..." -ForegroundColor Green

$baseUrl = "https://backend-five-bice-19.vercel.app"

# Test 1: Health Check (should work)
Write-Host "`n1. Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/health/check" -Method GET
    Write-Host "✅ Health Check: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Symptom Analysis (should work without auth now)
Write-Host "`n2. Testing Symptom Analysis..." -ForegroundColor Yellow
try {
    $body = @{
        symptoms = "headache and fever"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$baseUrl/api/health/analyze-symptoms" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Symptom Analysis: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Symptom Analysis Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Chatbot (should work without auth)
Write-Host "`n3. Testing Chatbot..." -ForegroundColor Yellow
try {
    $body = @{
        message = "Hello, how are you?"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$baseUrl/api/chatbot/chat" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Chatbot: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Chatbot Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Testing Complete!" -ForegroundColor Green

# Deploy Backend Fixes to Vercel
Write-Host "🚀 Deploying backend fixes to Vercel..." -ForegroundColor Green

# Navigate to backend directory
Set-Location backend

# Deploy to Vercel
Write-Host "📦 Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🔗 Backend URL: https://backend-five-bice-19.vercel.app/" -ForegroundColor Cyan

# Test the health endpoint
Write-Host "🧪 Testing health endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://backend-five-bice-19.vercel.app/api/health/check" -Method GET
    Write-Host "✅ Health check passed: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🎉 Deployment and testing complete!" -ForegroundColor Green

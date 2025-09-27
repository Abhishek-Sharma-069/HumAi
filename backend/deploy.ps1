# PowerShell script to deploy backend to Vercel
Write-Host "Deploying backend to Vercel..."

# Remove any existing .vercel directory
if (Test-Path ".vercel") {
    Remove-Item -Recurse -Force .vercel
    Write-Host "Removed existing .vercel directory"
}

# Deploy to Vercel
Write-Host "Starting Vercel deployment..."
vercel --yes --prod

Write-Host "Deployment completed!"

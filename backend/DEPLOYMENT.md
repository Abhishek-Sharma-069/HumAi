# Backend Deployment Guide

## 🚀 Deployment Options

### 1. Docker Deployment (Recommended)

#### Prerequisites
- Docker installed
- Backend `.env` file configured

#### Steps
```bash
# Build the Docker image
docker build -t humai-backend .

# Run the container
docker run -d \
  --name humai-backend \
  -p 3000:3000 \
  --env-file .env \
  humai-backend
```

### 2. PM2 Deployment

#### Prerequisites
- Node.js 18+ installed
- PM2 installed globally: `npm install -g pm2`

#### Steps
```bash
# Install dependencies
npm install

# Start with PM2
npm run pm2:start

# Check status
pm2 status

# View logs
npm run pm2:logs
```

### 3. Direct Node.js Deployment

#### Steps
```bash
# Install dependencies
npm install

# Set environment
export NODE_ENV=production

# Start the application
npm run prod
```

## 📋 Environment Variables Required

Create a `.env` file in the backend directory with:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_TOKEN=your-firebase-token

# Backend Configuration
PORT=3000
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com

# API Keys
GEMINI_API_KEY=your-gemini-api-key

# JWT Secret (32+ characters)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# Logging
LOG_LEVEL=info
```

## 🔧 Production Configuration

The backend includes:
- ✅ Security middleware (Helmet, CORS)
- ✅ Rate limiting
- ✅ Request compression
- ✅ Error handling
- ✅ Logging with Winston
- ✅ Environment validation
- ✅ PM2 process management

## 📊 Health Check

The backend provides health check endpoints:
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed system status

## 🚨 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Firebase Service Account**: Keep service account keys secure
3. **CORS**: Configure proper frontend URLs
4. **Rate Limiting**: Adjust limits based on expected traffic
5. **HTTPS**: Use HTTPS in production

## 📝 Monitoring

### PM2 Monitoring
```bash
# View real-time logs
pm2 logs humai-backend

# Monitor resources
pm2 monit

# Restart application
pm2 restart humai-backend
```

### Docker Monitoring
```bash
# View container logs
docker logs humai-backend

# Monitor container stats
docker stats humai-backend
```

## 🔄 Updates

### PM2 Updates
```bash
# Stop application
npm run pm2:stop

# Pull latest code
git pull

# Install new dependencies
npm install

# Restart application
npm run pm2:restart
```

### Docker Updates
```bash
# Stop container
docker stop humai-backend

# Remove old container
docker rm humai-backend

# Build new image
docker build -t humai-backend .

# Start new container
docker run -d --name humai-backend -p 3000:3000 --env-file .env humai-backend
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   # Kill process
   kill -9 <PID>
   ```

2. **Environment variables not loading**
   - Check `.env` file exists in backend directory
   - Verify file permissions
   - Check for syntax errors

3. **Firebase connection issues**
   - Verify service account credentials
   - Check Firebase project ID
   - Ensure proper permissions

4. **CORS errors**
   - Update `FRONTEND_URL` in environment
   - Check CORS configuration in `index.js`

### Logs Location
- PM2: `logs/pm2/`
- Docker: `docker logs humai-backend`
- Direct: Console output

## 📈 Performance Optimization

1. **Enable compression** (already configured)
2. **Use PM2 cluster mode** (already configured)
3. **Monitor memory usage**
4. **Set up log rotation**
5. **Use CDN for static assets**

## 🔐 Security Checklist

- [ ] Environment variables secured
- [ ] Firebase service account protected
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Input validation implemented
- [ ] Error messages sanitized

# Quanta AI Frontend Deployment Guide

This directory contains deployment configurations for various platforms and environments.

## Environment Setup

### Required Environment Variables

Before deploying, ensure you have the following environment variables configured:

#### Core Configuration
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `NEXT_PUBLIC_BACKEND_API_URL` - LangGraph backend API URL (default: http://127.0.0.1:2024)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `NEXT_PUBLIC_APP_URL` - Your application URL

#### Optional Configuration
- `NEXT_PUBLIC_API_TIMEOUT` - API timeout in milliseconds (default: 30000)
- `NEXT_PUBLIC_DEBUG` - Enable debug mode (default: false)
- `NEXT_PUBLIC_GA_TRACKING_ID` - Google Analytics tracking ID
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN for error tracking

## Deployment Platforms

### Vercel Deployment

1. Copy `deployment/vercel.json` to your project root
2. Set environment variables in Vercel dashboard:
   - `@supabase-url` → Your Supabase URL
   - `@supabase-anon-key` → Your Supabase anonymous key
   - `@backend-api-url` → Your backend API URL
   - `@stripe-publishable-key` → Your Stripe publishable key
   - `@app-url` → Your application URL

3. Deploy using Vercel CLI:
   ```bash
   vercel --prod
   ```

### Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t quanta-ai-frontend .
   ```

2. Run with environment variables:
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_SUPABASE_URL=your_url \
     -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
     -e NEXT_PUBLIC_BACKEND_API_URL=your_backend_url \
     -e NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key \
     quanta-ai-frontend
   ```

3. Or use Docker Compose:
   ```bash
   docker-compose up -d
   ```

### Manual Deployment

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. Start the production server:
   ```bash
   npm start
   ```

## Backend Integration

### CORS Configuration

The frontend is configured to work with the LangGraph backend running on port 2024. Ensure your backend has proper CORS configuration:

```python
# In your FastAPI backend
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### API Endpoints

The frontend expects the following backend endpoints:

- `POST /auth/signup` - User registration
- `POST /auth/signin` - User authentication
- `POST /auth/signout` - User logout
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `POST /research` - Submit research request
- `GET /research/{id}` - Get research status
- `GET /research/history` - Get research history
- `DELETE /research/{id}` - Cancel research
- `GET /usage` - Get usage statistics
- `POST /stripe/create-checkout-session` - Create Stripe checkout
- `POST /stripe/create-portal-session` - Create customer portal

## Environment-Specific Configuration

### Development
- Backend URL: `http://127.0.0.1:2024`
- Frontend URL: `http://localhost:3000`
- Debug mode: Enabled

### Staging
- Backend URL: Your staging backend URL
- Frontend URL: Your staging frontend URL
- Debug mode: Enabled

### Production
- Backend URL: Your production backend URL
- Frontend URL: Your production frontend URL
- Debug mode: Disabled
- Analytics: Enabled
- Error tracking: Enabled

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` or production environment files
2. **API Keys**: Use environment-specific API keys
3. **CORS**: Configure CORS properly for your domains
4. **HTTPS**: Always use HTTPS in production
5. **CSP**: Consider implementing Content Security Policy headers

## Monitoring and Analytics

### Error Tracking
Configure Sentry for error tracking:
```bash
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

### Analytics
Configure Google Analytics:
```bash
NEXT_PUBLIC_GA_TRACKING_ID=your_ga_tracking_id
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check backend CORS configuration
2. **Environment Variables**: Ensure all required variables are set
3. **API Connection**: Verify backend is running and accessible
4. **Build Errors**: Check TypeScript and ESLint configurations

### Debug Mode
Enable debug mode for additional logging:
```bash
NEXT_PUBLIC_DEBUG=true
```

## Support

For deployment issues, check:
1. Environment variable configuration
2. Backend connectivity
3. CORS settings
4. Build logs
5. Runtime logs

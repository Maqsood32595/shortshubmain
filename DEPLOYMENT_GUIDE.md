# ShortShub Production Deployment Guide

This guide provides step-by-step instructions for deploying ShortShub to Google Cloud Platform using Cloud Build and Cloud Run.

## Prerequisites

Before starting the deployment, ensure you have:

1. **Google Cloud Project** with billing enabled
2. **Google Cloud SDK** installed and configured
3. **Docker** installed locally
4. **Git** repository with your code
5. **Domain name** (optional, for custom domain)

## Architecture Overview

- **Cloud Run**: Serverless container hosting
- **Cloud SQL**: PostgreSQL database
- **Cloud Storage**: Video file storage
- **Cloud Build**: CI/CD pipeline
- **Secret Manager**: Secure credential storage

## Step 1: Set Up Google Cloud Project

```bash
# Set your project ID
export PROJECT_ID="corded-cable-460921-u1"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  compute.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  storage.googleapis.com \
  cloudresourcemanager.googleapis.com
```

## Step 2: Create Cloud SQL Database

```bash
# Create Cloud SQL instance
gcloud sql instances create shortshub-postgres \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-type=SSD \
  --storage-size=10GB \
  --storage-auto-increase \
  --backup-start-time=02:00 \
  --maintenance-window-day=SUN \
  --maintenance-window-hour=03

# Create database
gcloud sql databases create shortshub \
  --instance=shortshub-postgres

# Create user
gcloud sql users create shortshub_user \
  --instance=shortshub-postgres \
  --password="your-secure-db-password"
```

## Step 3: Set Up Cloud Storage

```bash
# Create storage bucket
gsutil mb -p $PROJECT_ID -l us-central1 gs://shortshub-video-storage

# Set bucket permissions
gsutil iam ch allUsers:objectViewer gs://shortshub-video-storage
```

## Step 4: Configure Secrets in Secret Manager

```bash
# Create secrets
echo -n "your-secure-db-password" | gcloud secrets create db-password --data-file=-
echo -n "your-production-session-secret" | gcloud secrets create session-secret --data-file=-
echo -n "your-google-client-id" | gcloud secrets create google-client-id --data-file=-
echo -n "your-google-client-secret" | gcloud secrets create google-client-secret --data-file=-
echo -n "your-youtube-api-key" | gcloud secrets create youtube-api-key --data-file=-
echo -n "your-gemini-api-key" | gcloud secrets create gemini-api-key --data-file=-

# Grant Cloud Build access to secrets
gcloud secrets add-iam-policy-binding db-password \
  --member="serviceAccount:$PROJECT_ID@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding session-secret \
  --member="serviceAccount:$PROJECT_ID@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding google-client-id \
  --member="serviceAccount:$PROJECT_ID@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding google-client-secret \
  --member="serviceAccount:$PROJECT_ID@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding youtube-api-key \
  --member="serviceAccount:$PROJECT_ID@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:$PROJECT_ID@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## Step 5: Update Cloud Build Configuration

Update the `cloudbuild.yaml` file with your actual values:

1. **Database Password**: Replace `your-secure-db-password` with the actual password
2. **Google OAuth**: Update client ID and secret
3. **API Keys**: Add your YouTube and Gemini API keys
4. **Domain**: Update URLs to match your domain

## Step 6: Configure Cloud Build Triggers

```bash
# Create Cloud Build trigger for main branch
gcloud beta builds triggers create cloud-source-repositories \
  --repo="shortshubmain" \
  --branch-pattern="^main$" \
  --build-config="cloudbuild.yaml" \
  --substitutions=_DB_PASSWORD="your-secure-db-password",_SESSION_SECRET="your-production-session-secret",_GOOGLE_CLIENT_ID="your-google-client-id",_GOOGLE_CLIENT_SECRET="your-google-client-secret",_YOUTUBE_API_KEY="your-youtube-api-key",_GEMINI_API_KEY="your-gemini-api-key"
```

## Step 7: Deploy Manually (First Time)

```bash
# Build and deploy manually first time
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_DB_PASSWORD="your-secure-db-password",_SESSION_SECRET="your-production-session-secret",_GOOGLE_CLIENT_ID="your-google-client-id",_GOOGLE_CLIENT_SECRET="your-google-client-secret",_YOUTUBE_API_KEY="your-youtube-api-key",_GEMINI_API_KEY="your-gemini-api-key"
```

## Step 8: Set Up Custom Domain (Optional)

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service=shortshub-app \
  --region=us-central1 \
  --domain=shortshub.app
```

## Step 9: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services > Credentials**
3. Create OAuth 2.0 credentials for Web Application
4. Add authorized redirect URIs:
   - `https://shortshub.app/api/callback`
   - `http://localhost:5000/api/callback` (for local development)

## Step 10: Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@/db?host=/cloudsql/...` |
| `GOOGLE_CLOUD_PROJECT_ID` | GCP Project ID | `corded-cable-460921-u1` |
| `GOOGLE_CLOUD_STORAGE_BUCKET` | Cloud Storage bucket | `shortshub-video-storage` |
| `SESSION_SECRET` | Session encryption key | Random 32+ character string |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `GOCSPX-...` |
| `YOUTUBE_API_KEY` | YouTube Data API key | `AIzaSy...` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `CORS_ORIGIN` | Allowed CORS origin | `https://shortshub.app` |

## Step 11: Monitoring and Logging

```bash
# View Cloud Run logs
gcloud run services logs read shortshub-app --region=us-central1

# View Cloud Build logs
gcloud builds list --limit=10

# Set up alerts
gcloud alpha monitoring policies create --policy-from-file=monitoring-alerts.yaml
```

## Step 12: Database Migration

```bash
# Run database migrations manually (if needed)
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_DB_PASSWORD="your-secure-db-password",_STEP="migrate"
```

## Step 13: Testing the Deployment

1. **Health Check**: Visit `https://shortshub.app/api/health`
2. **API Test**: Test authentication flow
3. **Video Upload**: Test video upload functionality
4. **Database**: Verify data persistence

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check Cloud SQL instance is running
   - Verify database user credentials
   - Ensure Cloud SQL Admin API is enabled

2. **Build Fails**
   - Check Docker file syntax
   - Verify all environment variables are set
   - Review Cloud Build logs

3. **OAuth Issues**
   - Verify redirect URLs in Google Console
   - Check OAuth credentials are correct
   - Ensure domain is verified

4. **Storage Issues**
   - Verify bucket permissions
   - Check CORS configuration
   - Ensure bucket exists in correct region

### Debug Commands

```bash
# Check service status
gcloud run services describe shortshub-app --region=us-central1

# View recent logs
gcloud logging read "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"shortshub-app\"" --limit=50

# Test database connection
gcloud sql connect shortshub-postgres --user=shortshub_user --database=shortshub
```

## Security Checklist

- [ ] Database password is strong and stored in Secret Manager
- [ ] Session secret is random and secure
- [ ] OAuth credentials are for production environment
- [ ] API keys have restricted usage
- [ ] Cloud Storage bucket has proper permissions
- [ ] HTTPS is enforced
- [ ] CORS is properly configured
- [ ] Input validation is implemented
- [ ] Rate limiting is configured

## Cost Optimization

- **Cloud Run**: Use minimum instances = 0 for development
- **Cloud SQL**: Use smaller instance for development
- **Storage**: Implement lifecycle policies for old videos
- **Builds**: Use build caching to reduce build times

## Next Steps

1. Set up monitoring and alerting
2. Configure backup policies
3. Implement CI/CD for staging environment
4. Add performance monitoring
5. Set up error tracking (Sentry)
6. Configure CDN for static assets

## Support

For issues or questions:
- Check the troubleshooting section above
- Review Cloud Build and Cloud Run logs
- Verify all environment variables are correctly set
- Ensure all required APIs are enabled

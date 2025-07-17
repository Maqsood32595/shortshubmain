#!/bin/bash

# ShortShub Production Deployment Script
# This script automates the deployment process to Google Cloud Platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="corded-cable-460921-u1"
REGION="us-central1"
SERVICE_NAME="shortshub-app"
REPOSITORY_NAME="shortshubmain"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "gcloud CLI is not installed. Please install it first."
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "@"; then
    print_error "Not authenticated with gcloud. Please run: gcloud auth login"
    exit 1
fi

# Set project
print_status "Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Enable required APIs
print_status "Enabling required APIs..."
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  compute.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  storage.googleapis.com \
  cloudresourcemanager.googleapis.com

# Check if secrets exist
print_status "Checking required secrets..."
SECRETS=("db-password" "session-secret" "google-client-id" "google-client-secret" "youtube-api-key" "gemini-api-key")
for secret in "${SECRETS[@]}"; do
    if ! gcloud secrets describe $secret &> /dev/null; then
        print_warning "Secret $secret does not exist. Please create it first."
        echo "Run: echo -n 'your-value' | gcloud secrets create $secret --data-file=-"
    fi
done

# Deploy function
deploy() {
    print_status "Starting deployment..."
    
    # Get secret values
    DB_PASSWORD=$(gcloud secrets versions access latest --secret="db-password")
    SESSION_SECRET=$(gcloud secrets versions access latest --secret="session-secret")
    GOOGLE_CLIENT_ID=$(gcloud secrets versions access latest --secret="google-client-id")
    GOOGLE_CLIENT_SECRET=$(gcloud secrets versions access latest --secret="google-client-secret")
    YOUTUBE_API_KEY=$(gcloud secrets versions access latest --secret="youtube-api-key")
    GEMINI_API_KEY=$(gcloud secrets versions access latest --secret="gemini-api-key")
    
    # Submit build
    print_status "Submitting Cloud Build..."
    gcloud builds submit --config=cloudbuild.yaml \
      --substitutions=_DB_PASSWORD="$DB_PASSWORD",_SESSION_SECRET="$SESSION_SECRET",_GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID",_GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET",_YOUTUBE_API_KEY="$YOUTUBE_API_KEY",_GEMINI_API_KEY="$GEMINI_API_KEY"
    
    print_status "Deployment completed successfully!"
    print_status "Your app should be available at: https://$SERVICE_NAME-$PROJECT_ID.a.run.app"
}

# Health check function
health_check() {
    print_status "Performing health check..."
    URL="https://$SERVICE_NAME-$PROJECT_ID.a.run.app/api/health"
    
    for i in {1..10}; do
        if curl -s -f "$URL" > /dev/null; then
            print_status "Health check passed!"
            return 0
        fi
        print_status "Waiting for service to be ready... (attempt $i/10)"
        sleep 30
    done
    
    print_error "Health check failed. Please check the logs."
    return 1
}

# Main menu
case "${1:-deploy}" in
    "deploy")
        deploy
        ;;
    "health")
        health_check
        ;;
    "logs")
        print_status "Fetching recent logs..."
        gcloud run services logs read $SERVICE_NAME --region=$REGION --limit=50
        ;;
    "status")
        print_status "Service status:"
        gcloud run services describe $SERVICE_NAME --region=$REGION
        ;;
    *)
        echo "Usage: $0 {deploy|health|logs|status}"
        echo ""
        echo "Commands:"
        echo "  deploy  - Deploy the application"
        echo "  health  - Check application health"
        echo "  logs    - View recent logs"
        echo "  status  - Show service status"
        exit 1
        ;;
esac

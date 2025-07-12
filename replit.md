# ShortsHub - AI Video Creation Platform

## Overview

ShortsHub is a full-stack web application for creating viral short-form videos using AI and scheduling them across multiple social media platforms. The application features AI-powered video generation, multi-platform scheduling, and user authentication through Replit Auth.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Styling**: Custom brand gradient system with mobile-first responsive design

### Backend Architecture
- **Runtime**: Node.js 20 with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Session Management**: Express sessions with PostgreSQL store
- **Authentication**: Replit Auth with OpenID Connect

### Key Components

#### Database Schema
- **Users Table**: Stores user profile information (mandatory for Replit Auth)
- **Sessions Table**: Handles session storage (mandatory for Replit Auth)
- **Videos Table**: Stores video metadata and processing status
- **AI Jobs Table**: Tracks AI video generation jobs and progress
- **Scheduled Posts Table**: Manages scheduled social media posts
- **Platform Tokens Table**: Stores OAuth tokens for social media platforms

#### Authentication Flow
- Uses Replit's OpenID Connect for user authentication
- Maintains sessions using PostgreSQL-backed session store
- Protects API routes with authentication middleware
- Supports automatic user creation and profile management

#### AI Video Generation
- Accepts text prompts, style preferences, and duration settings
- Creates AI jobs with progress tracking
- Provides real-time status updates through polling
- Stores generated video results with metadata

#### Social Media Integration
- Supports TikTok, Instagram Reels, and YouTube Shorts
- OAuth token management for platform authentication
- Scheduled posting with configurable timing
- Platform-specific content formatting

## Data Flow

1. **User Authentication**: Users authenticate via Replit Auth, creating a session
2. **Video Creation**: Users input prompts through the AI Editor interface
3. **AI Processing**: Backend creates AI jobs and tracks generation progress
4. **Content Management**: Generated videos are stored and made available for scheduling
5. **Social Scheduling**: Users select platforms and schedule posts with captions
6. **Platform Publishing**: Scheduled posts are processed and published to selected platforms

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **drizzle-orm**: Type-safe database ORM with PostgreSQL support
- **@tanstack/react-query**: Server state management and caching
- **express**: Web application framework
- **passport**: Authentication middleware for OpenID Connect

### UI Dependencies
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library for consistent iconography

### Development Tools
- **vite**: Fast build tool with hot module replacement
- **typescript**: Type safety across the entire application
- **tsx**: TypeScript execution for development server

## Deployment Strategy

### Development Environment
- Uses Vite development server with middleware mode
- Express server handles API routes and serves static files
- Hot module replacement for fast development iteration
- Replit-specific development banner and cartographer integration

### Production Build
- Frontend builds to static assets using Vite
- Backend bundles to ESM using esbuild
- Serves static files through Express in production
- Database migrations handled through Drizzle Kit

### Environment Configuration
- Requires `DATABASE_URL` for PostgreSQL connection
- Uses `SESSION_SECRET` for session encryption
- Supports `REPLIT_DOMAINS` and `ISSUER_URL` for authentication
- Configurable through environment variables

The application follows a modern full-stack architecture with strong type safety, responsive design principles, and scalable database design suitable for a social media content creation platform.
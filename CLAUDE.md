# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Starts Next.js development server on http://localhost:3000
- **Build**: `npm run build` - Creates production build
- **Linting**: `npm run lint` - Runs ESLint (note: disabled during builds via next.config.mjs)
- **Start production**: `npm run start` - Starts production server
- **Install dependencies**: `npm install` - Install all dependencies from package.json
- **Database Management**:
  - `npm run setup-db` - Initialize database schema
  - `npm run deploy-schema` - Deploy schema changes
  - `npm run migrate-data` - Run data migrations
  - `npm run setup-countries` - Setup country data
  - `npm run setup-testimonials` - Setup testimonials data

## Architecture Overview

GetVisa.ID is a comprehensive visa application platform built with Next.js 14 that enables users to find, learn about, and apply for visas through a streamlined WhatsApp-based process.

### Core Technology Stack
- **Frontend**: Next.js 14 App Router with TypeScript
- **Backend**: Supabase (PostgreSQL database + Auth + API)
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS v4 with Geist font family
- **Forms**: React Hook Form with Zod validation
- **Analytics**: Comprehensive GA4 conversion tracking
- **Package Manager**: npm (package-lock.json present)

### Application Structure

#### Public Pages (Main User Flow)
- `app/page.tsx` - Homepage with visa search and popular destinations
- `app/visa/[country]/page.tsx` - Country-specific visa listing page
- `app/visa/[country]/[id]/page.tsx` - Detailed visa application page with contact form
- `app/auth/` - Authentication pages (login/signup)
- `app/resources/` - Blog/resource pages

#### Admin Panel (`/admin/*`)
Complete administrative interface with authentication-protected routes:
- `app/admin/page.tsx` - Admin dashboard overview
- `app/admin/visa-types/` - Full CRUD for visa types management
- `app/admin/countries/` - Country and flag management
- `app/admin/users/` - User management with role-based access
- `app/admin/blog/` - Blog post management system
- `app/admin/testimonials/` - Testimonial management
- `app/admin/contact-leads/` - Lead management with CSV export functionality
- `app/admin/documents/` - Document management
- `app/admin/settings/` - Application settings (WhatsApp numbers, message templates)

#### Dashboard (Currently Unused)
- `app/dashboard/` - User dashboard area (not actively used in current flow)

### Key Features & User Journey

#### Main Application Flow
1. **Homepage**: Users search for visas by destination/passport
2. **Country Selection**: View available visa types for selected country
3. **Visa Details**: Comprehensive visa information with application form
4. **Lead Capture**: Collect user contact information with form validation
5. **WhatsApp Integration**: Redirect to WhatsApp with pre-filled message for application completion
6. **Analytics Tracking**: Full GA4 conversion funnel tracking

#### Admin Features
- Complete visa type management (create, edit, delete, activate/deactivate)
- Country management with flag and description support
- Contact lead tracking with conversion analytics
- Blog content management
- Testimonial management
- Settings configuration for WhatsApp integration
- User role management (admin authentication)

### Technical Implementation

#### Component Architecture
- **shadcn/ui**: "New York" style with CSS variables
- **Mobile-First Design**: Responsive with drawer/sidebar patterns
- **Form Handling**: React Hook Form + Zod validation throughout
- **State Management**: React hooks (useState) for local state
- **API Integration**: Custom service classes (VisaService, SettingsService)

#### Database & Services
- **Supabase Integration**: PostgreSQL with real-time capabilities
- **Service Layer**: `lib/services/` contains business logic
- **Type Safety**: Full TypeScript with database types
- **API Routes**: Next.js API routes for data operations

#### Analytics & Tracking
- **GA4 Events**: Comprehensive conversion tracking
- **Lead Tracking**: Form submissions, WhatsApp clicks, page views
- **Conversion Funnel**: Track user journey from search to application

### Mobile Experience
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Mobile Drawer**: Bottom sheet pattern for visa application forms
- **Sticky CTAs**: Fixed bottom bars for key actions
- **Touch Optimized**: Proper touch targets and interactions

### Configuration Files
- `next.config.mjs` - Next.js configuration with build optimizations
- `components.json` - shadcn/ui configuration
- `tailwind.config.ts` - Tailwind CSS v4 configuration
- `tsconfig.json` - TypeScript configuration with path aliases

### Important Notes
- **Dashboard**: User dashboard exists but is not currently used in the main application flow
- **WhatsApp Integration**: Primary conversion channel for completing visa applications
- **Admin Authentication**: Required for admin panel access via Supabase Auth
- **Mobile Optimization**: Extensive mobile-first design patterns implemented
- **Analytics Focus**: Heavy emphasis on conversion tracking and lead analytics

### Development Patterns
- **Component Development**: Follow shadcn/ui patterns with TypeScript
- **API Development**: Use service layer pattern for business logic
- **Form Development**: Always use React Hook Form + Zod validation
- **Mobile Development**: Implement drawer patterns for mobile forms
- **Analytics**: Include relevant tracking for all user interactions

The codebase prioritizes user experience optimization and conversion tracking, with a focus on the public visa search and application flow rather than traditional user account management.
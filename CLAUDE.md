# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `pnpm dev` or `npm run dev` - Starts Next.js development server
- **Build**: `pnpm build` or `npm run build` - Creates production build
- **Linting**: `pnpm lint` or `npm run lint` - Runs ESLint (note: disabled during builds)
- **Start production**: `pnpm start` or `npm run start` - Starts production server
- **Package manager**: Uses `pnpm` (lock file present) - prefer pnpm over npm when available

## Architecture Overview

This is a Next.js 14 visa application platform (GetVisa.ID) built with the App Router architecture:

### Core Structure
- **App Router**: Uses Next.js 14 App Router with TypeScript
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom configuration, Geist font family
- **Forms**: React Hook Form with Zod validation
- **Package Manager**: pnpm (preferred)

### Key Directories
- `app/` - Next.js App Router pages and layouts
  - `page.tsx` - Landing page with visa search functionality
  - `dashboard/` - Protected dashboard area with sidebar layout
  - `visa/[country]/` - Dynamic country-specific visa pages
- `components/` - Reusable React components
  - `ui/` - shadcn/ui component library
  - Custom components: header, footer, partner-logos, etc.
- `lib/` - Utility functions and configurations
- `hooks/` - Custom React hooks
- `public/` - Static assets including country/destination images

### Architecture Patterns
- **Component Structure**: Uses shadcn/ui "New York" style with CSS variables
- **State Management**: React hooks (useState) for local state
- **Routing**: File-based routing with dynamic routes for countries
- **Layout System**: Nested layouts with dashboard having its own sidebar layout
- **TypeScript**: Strict mode enabled with path aliases (@/* for root)

### Configuration Notes
- Build settings: ESLint and TypeScript errors are ignored during builds
- Image optimization is disabled (`unoptimized: true`)
- Uses custom Tailwind configuration with shadcn/ui integration
- Component aliases configured for easy imports (@/components, @/lib, etc.)

### Dashboard Features
- Sidebar navigation with mobile responsive design
- Applications, Documents, and Profile sections
- User authentication state (currently mock data)
- File upload functionality for documents

The codebase follows Next.js 14 App Router conventions with a focus on visa application processing and user document management.
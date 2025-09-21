# Overview

Sorted is a comprehensive student mental health and wellness application built with React and TypeScript. The app serves as a holistic well-being ecosystem that combines AI-powered mood tracking, thought sorting, music therapy, and wellness features designed specifically for students. The application provides personalized guidance through various interactive modules including vibe checks, thought analysis, music recommendations, mindful breaks, and social wellness features.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Framework
- **React 18** with TypeScript for type safety and modern component patterns
- **Vite** as the build tool for fast development and optimized production builds
- **React Router** for client-side navigation between different app views
- **React Query** (@tanstack/react-query) for server state management and API caching

## UI/UX Design System
- **Tailwind CSS** for utility-first styling with custom wellness-focused color palette
- **Radix UI** components for accessible, unstyled primitives (dialogs, dropdowns, etc.)
- **Shadcn/ui** component library built on top of Radix for consistent design patterns
- **Custom wellness theme** with calming colors (teal, lavender, sage green) optimized for mental health applications
- **Responsive design** with mobile-first approach using Tailwind breakpoints

## Component Architecture
- **Modular component structure** with separation of concerns
- **Enhanced UI components** with wellness-specific variants (mood, energy, calm buttons)
- **Reusable feature cards** for consistent module presentation
- **Theme system** with light/dark mode support via next-themes

## Core Application Modules

### Vibe Check System
- Multi-step mood assessment with emoji-based mood selection
- Energy level tracking and focus area identification
- Comprehensive wellness questionnaire covering sleep, stress, and social connection
- AI persona generation based on user responses

### Thought Sorting Engine
- Natural language processing for thought analysis (mock implementation ready for AI integration)
- Emotion detection and challenge identification
- Personalized insights and actionable steps generation
- Priority-based thought categorization

### Music Therapy Integration
- Spotify Web API integration with curated mood-based playlists
- Multi-language support (English, Spanish, Hindi) for diverse user base
- Vocal vs instrumental music preferences
- Embedded Spotify player with fallback preview functionality

### Wellness Tools
- **Zen Mode**: Focus timer with Pomodoro technique integration
- **Mindful Breaks**: Guided breathing, stretching, and meditation timers
- **Screen Time Tracking**: Device usage monitoring and break reminders
- **Sleep Mode**: Blue light filtering and wellness optimization

### Social Features
- **Squad Goals**: Team-based wellness challenges and group accountability
- **Progress Tracking**: Individual and group wellness metrics
- **Real-time Chat**: Team communication for wellness support

## State Management
- **React Context** for theme management and global app state
- **Local State** with useState for component-specific data
- **React Query** for server state and API response caching
- **LocalStorage** for user preferences and permissions persistence

## Development Tooling
- **TypeScript** with relaxed configuration for rapid development
- **ESLint** with React-specific rules and TypeScript support
- **Vite** configuration optimized for Replit deployment
- **Component auto-tagging** for development environment

## Performance Optimizations
- **Code splitting** through dynamic imports for different app views
- **Lazy loading** of heavy components like Spotify integration
- **Optimized bundle** with Vite's tree shaking and minification
- **CSS-in-JS alternatives** avoided in favor of utility-first Tailwind approach

# External Dependencies

## UI and Styling
- **@radix-ui/react-*** - Complete suite of accessible UI primitives
- **tailwindcss** - Utility-first CSS framework
- **next-themes** - Theme management system
- **lucide-react** - Icon library with mental health appropriate icons
- **class-variance-authority** - Type-safe CSS utility management

## API Integrations
- **@spotify/web-api-ts-sdk** - Official Spotify Web API client for music therapy features
- **Spotify Web Playback SDK** - Browser-based music playback (Premium users)

## Data Management
- **@tanstack/react-query** - Server state management and caching
- **react-hook-form** - Form handling with validation
- **@hookform/resolvers** - Form validation resolvers

## Utility Libraries
- **date-fns** - Date manipulation for wellness tracking
- **clsx** and **tailwind-merge** - Conditional CSS class management
- **embla-carousel-react** - Carousel component for feature showcases

## Development Dependencies
- **@vitejs/plugin-react-swc** - Fast React refresh with SWC compiler
- **typescript** - Type safety and enhanced development experience
- **eslint** with React and TypeScript plugins - Code quality enforcement

## Browser APIs and Permissions
- **Notification API** - For wellness reminders and break notifications
- **Screen Time APIs** - Device usage tracking (simulated for web)
- **Local Storage** - User preferences and session data persistence

## Third-party Services (Integration Ready)
- **Spotify Connect** - Music streaming and playlist management
- **Gemini AI** - Planned integration for thought analysis and persona generation
- **Screen Time APIs** - Native mobile integration for usage tracking
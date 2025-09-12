# Hoop Dreams Basketball Life Simulator

## Overview

Hoop Dreams is a mobile-first basketball life simulation game built with React, TypeScript, and Vite. The game features a pixel art aesthetic inspired by classic arcade basketball games, allowing players to create a basketball player, manage their career progression, and navigate through different basketball scenarios from high school through professional levels.

The game combines traditional sports simulation mechanics with modern web technologies, featuring a comprehensive player creation system, attribute management, badge progression, team dynamics, and career advancement mechanics. The application is designed as a single-page application with client-side routing and local storage for save game management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application follows a component-based React architecture with TypeScript for type safety. The main structural decisions include:

- **Routing System**: Uses Wouter for lightweight client-side routing, supporting multiple game screens including main menu, player creation, dashboard, leagues, and settings
- **State Management**: Implements local storage utilities for persistent game state, player data, save slots, and game settings rather than external state management libraries
- **UI Components**: Built on Radix UI primitives with shadcn/ui components for consistent, accessible interface elements
- **Styling Strategy**: Tailwind CSS with custom design tokens for the pixel art basketball theme, including court purple (#7A5BFF) and electric teal (#38E1C6) accent colors

### Game Logic Architecture
Core game systems are organized into utility modules:

- **Player System**: Comprehensive attribute system with 20+ basketball-specific stats (shooting, finishing, playmaking, defense, physicals) with position-based caps and height modifiers
- **Badge System**: NBA 2K-inspired progression system with tier-based badges (Bronze/Silver/Gold/HOF) tied to attribute thresholds and performance milestones
- **Team Management**: Dynamic roster system with customizable teams, colors, and league structures
- **Career Progression**: Multi-era system supporting high school, college, and professional levels with difficulty scaling

### Mobile-First Design Principles
The application prioritizes mobile experience through:

- **Safe Area Implementation**: Full support for device notches and home indicators using CSS environment variables
- **Touch-Optimized Interface**: Minimum 44px touch targets, swipe-friendly navigation, and thumb-zone optimization
- **Performance Optimization**: Pixel art rendering with image-rendering: pixelated, efficient component structure for 90+ Lighthouse mobile scores
- **Responsive Layout**: Single-column mobile layout with sticky navigation elements that never overlap content

### Data Architecture
Game data is structured around several key entities:

- **Player Data**: Comprehensive player objects including personal info, attributes, badges, career milestones, and progression tracking
- **Save System**: Five-slot save game management with manual and automatic save functionality
- **Configuration System**: Flexible game settings supporting multiple difficulty levels, unit preferences, and theme customization

## External Dependencies

### UI and Component Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives for complex components (dialogs, dropdowns, tooltips, etc.)
- **shadcn/ui**: Pre-built component layer on top of Radix UI providing consistent styling and behavior patterns
- **Tailwind CSS**: Utility-first CSS framework for responsive design and consistent spacing/colors
- **class-variance-authority**: Type-safe variant API for component styling
- **Lucide React**: Icon library providing consistent iconography throughout the application

### Utility Libraries
- **Wouter**: Lightweight routing solution for single-page application navigation
- **React Hook Form**: Form state management with validation support for player creation and settings
- **date-fns**: Date manipulation library for career progression and timeline features
- **clsx**: Utility for conditional CSS class composition

### Development Tools
- **Vite**: Build tool and development server optimized for modern web development
- **TypeScript**: Type system providing compile-time error checking and improved developer experience
- **React Query**: Data fetching and caching library (configured but not actively used in current implementation)

### Backend Dependencies (Configured but Unused)
The project includes backend infrastructure preparation:
- **Drizzle ORM**: Type-safe database query builder configured for PostgreSQL
- **Neon Database**: Serverless PostgreSQL integration setup
- **Express.js**: Web server framework ready for API implementation

### Font Assets
- **Press Start 2P**: Pixel-perfect font from Google Fonts for authentic retro gaming headers
- **Inter**: Modern sans-serif font for readable body text and data displays

The application is currently client-side only with local storage persistence, but includes full backend scaffolding for future server-side features like multiplayer, leaderboards, or cloud save synchronization.
# Design Guidelines for Hoop Dreams Basketball Game

## Design Approach
**Reference-Based Approach**: Drawing inspiration from retro gaming aesthetics combined with modern mobile sports apps like NBA 2K Mobile and ESPN Fantasy. The design balances nostalgic pixel art elements with contemporary mobile UX patterns for optimal playability.

## Core Design Principles
- **Pixel-Perfect Retro Gaming**: Authentic basketball arcade game aesthetic
- **Mobile-First Performance**: Optimized for touch interactions and small screens
- **Basketball Court Immersion**: Visual elements that reinforce the basketball environment
- **Clear Information Hierarchy**: Essential game data easily accessible

## Color Palette

### Primary Colors (Dark Mode Focus)
- **Court Background**: 28 25% 8% (deep charcoal court surface)
- **Basketball Orange**: 20 85% 55% (vibrant basketball accent)
- **Court Lines**: 0 0% 95% (crisp white court markings)
- **Dark Overlay**: 0 0% 0% at 60% opacity (gradient overlay for readability)

### Team Colors System
- Dynamic team colors that integrate with the base palette
- Each team gets primary and secondary colors for jerseys and UI elements
- Colors maintain contrast ratios against dark backgrounds

### Accent Colors
- **Success Green**: 120 45% 50% (stats improvements, wins)
- **Warning Amber**: 35 85% 60% (important notifications)
- **Error Red**: 0 75% 55% (losses, critical alerts)

## Typography
- **Primary Font**: 'Press Start 2P' (Google Fonts) - authentic pixel game feel
- **Secondary Font**: 'Inter' (Google Fonts) - modern readability for longer text
- **Hierarchy**: Large pixel font for headers, clean sans-serif for body text and data tables

## Layout System
**Tailwind Spacing**: Consistent use of 2, 4, 8, and 16 unit spacing system (p-2, m-4, h-8, gap-16)
- **Mobile Grid**: Single column with card-based sections
- **Safe Areas**: Account for mobile notches and home indicators
- **Touch Targets**: Minimum 44px height for all interactive elements

## Component Library

### Navigation
- **Bottom Tab Bar**: Sticky navigation with basketball-themed icons
- **Header**: Minimal design with game title and essential actions
- **Sidebar**: Slide-out menu for secondary navigation (team management, settings)

### Game Interface
- **Court Background**: Full-screen basketball court with subtle arena lighting
- **Player Cards**: Jersey-styled cards with pixel avatars and stats
- **Game Dashboard**: Widget-based layout with next game, league standings, and quick stats

### Data Display
- **League Tables**: Clean, mobile-optimized standings with team logos
- **Statistics Panels**: Card-based stat blocks with basketball iconography
- **Timeline Feed**: Social media style feed for game updates and achievements

### Forms & Controls
- **Player Creation**: Step-by-step wizard with large touch-friendly controls
- **Save/Load Slots**: Visual save file representation with game state previews
- **Team Editor**: Drag-and-drop roster management with player thumbnails

### Overlays
- **Modal Dialogs**: Full-screen on mobile with basketball court background blur
- **Loading States**: Basketball bounce animation or court sweep transitions
- **Notifications**: Toast messages with team color accents

## Images
### Hero/Background Treatment
- **Primary Background**: Pixel art basketball court view from above
- **Arena Atmosphere**: Subtle crowd silhouettes and court lighting effects
- **Player Avatars**: 6-8 distinct pixel art basketball player sprites
- **Team Logos**: Simple geometric designs in team colors
- **No Large Hero Image**: Game uses environmental court background throughout

## Animation Guidelines
**Minimal and Purposeful**:
- **Ball Bounce**: Subtle loading animation
- **Score Counters**: Number animations for stat updates  
- **Page Transitions**: Simple slide transitions between game screens
- **Court Elements**: Subtle parallax on background court elements

## Mobile-Specific Considerations
- **Portrait Orientation**: Optimized for vertical phone usage
- **Gesture Support**: Swipe navigation between dashboard sections
- **Thumb Navigation**: Bottom-heavy interface design for one-handed use
- **Performance**: Crisp pixel rendering without blur on high-DPI screens

This design system creates an authentic basketball gaming experience that feels both nostalgic and modern, perfectly suited for mobile gameplay while maintaining the immersive court atmosphere throughout the user journey.
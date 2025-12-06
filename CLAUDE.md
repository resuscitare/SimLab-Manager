# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SimLab Manager is a simulation laboratory management system for medical education, built with Next.js 15, React 18, TypeScript, and Tailwind CSS. The application manages simulation scenarios, equipment, materials, scheduling, and debriefing for medical training simulations.

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Architecture

### Framework & Routing
- **Next.js 15** with App Router architecture
- Routes are file-based in `app/` directory following Next.js conventions
- Server and client components are separated with `"use client"` directive where needed

### Key Directory Structure

```
app/                          # Next.js App Router pages
├── layout.tsx                # Root layout
├── page.tsx                  # Home/index page
├── login/                    # Authentication
├── dashboard/                # Main dashboard
├── cenarios/                 # Scenario management
├── agendamentos/             # Scheduling
├── checklists/               # Checklist management
├── gestao/                   # Management features (costs, materials, etc.)
├── instrutores/              # Instructor management
├── equipamentos/             # Equipment status
├── materiais/                # Materials management
└── locais/                   # Location management

src/
├── components/               # React components
│   ├── ui/                   # Radix UI components (shadcn/ui)
│   ├── cenario/              # Scenario-specific components
│   │   ├── tabs/             # Scenario form tabs
│   │   └── debriefing/       # Debriefing model forms
│   ├── navigation/           # Navigation components
│   ├── Layout.tsx            # Main layout wrapper (React Router-based - legacy)
│   └── LayoutWrapper.tsx     # Layout wrapper for client components
├── contexts/                 # React contexts
│   └── AuthContext.tsx       # Authentication context (legacy - uses React Router)
├── store/                    # Zustand state management
│   └── authStore.ts          # Auth state (newer implementation)
├── hooks/                    # Custom React hooks
│   ├── useScenarioForm.ts    # Scenario form state management
│   ├── useEstoqueData.ts     # Stock/inventory data management
│   └── use-toast.ts          # Toast notifications
├── types/                    # TypeScript type definitions
│   ├── prisma.ts             # Data model types (scenarios, frames, equipment, etc.)
│   ├── debriefing.ts         # Debriefing model types
│   └── index.ts              # General types
├── lib/                      # Utility libraries
│   └── utils.ts              # Utility functions (cn, etc.)
└── utils/                    # Additional utilities
```

### Migration in Progress
The codebase is transitioning from React Router to Next.js App Router:
- New pages use Next.js App Router in `app/` directory
- Legacy components in `src/components/Layout.tsx` and `src/contexts/AuthContext.tsx` still reference React Router
- Backup of old pages exists in `src/pages_backup/`
- Authentication has dual implementations: `AuthContext` (legacy) and `authStore` (Zustand-based)

### State Management
- **Zustand** for global state (authentication in `authStore.ts`)
- **React Context** for legacy authentication (`AuthContext.tsx`)
- **Custom hooks** for complex form state (e.g., `useScenarioForm.ts`)
- Local storage for persistence of auth state and draft scenarios

### UI Components
- **Radix UI** primitives via shadcn/ui pattern in `src/components/ui/`
- **Tailwind CSS** for styling
- **Lucide React** for icons
- Component variants using `class-variance-authority`
- Utility function `cn()` from `src/lib/utils.ts` for className merging

### Data Models

The application manages complex simulation data structures:

#### Scenario Model
Comprehensive simulation scenario with:
- Basic identification (title, course, class)
- Patient information (demographics, medical history)
- Learning objectives (technical and non-technical)
- Equipment and materials list
- Frames (simulation progression states)
- Resources (images, videos, PDFs, trend files)
- Checklist

#### Frame System
Frames represent distinct states in a simulation scenario:
- Each frame has parameters (vital signs, physiological data)
- Operator instructions and expected participant actions
- Transition conditions between frames (time-based, event-based, parameter-based)
- Initial frame designation for scenario start point

#### Debriefing Models
Multiple structured debriefing frameworks:
- **PEARLS** - Promoting Excellence and Reflective Learning in Simulation
- **TeamGAINS** - Team-based debriefing model
- **3D** - Three-dimensional debriefing
- **GAS** - Gather, Analyze, Summarize
- **Checklist Clínico** - Clinical checklist approach

Each model has specific form components in `src/components/cenario/debriefing/`

### Form Patterns

#### Scenario Creation
Multi-tab form using `useScenarioForm` hook:
1. **Identificação** (Identification) - Basic scenario info
2. **Objetivos** (Objectives) - Learning objectives (SMART)
3. **Paciente** (Patient) - Patient profile and medical history
4. **Frames** - Simulation progression states
5. **Materiais** (Materials) - Equipment and resources
6. **Debriefing** - Post-simulation reflection structure
7. **Revisão** (Review) - Final review before saving

Forms use:
- **react-hook-form** for form state
- **Zod** for validation via `@hookform/resolvers`
- Tab validation with status indicators (completo/ativo/incompleto)
- LocalStorage for draft persistence

### TypeScript Configuration
- Strict mode is **disabled** (`strict: false`)
- No implicit any checking disabled
- Module resolution: `bundler`
- Path alias: `@/*` maps to `./src/*`
- JSX preservation for Next.js

### Authentication
**Current state has dual implementations:**
- Legacy: `AuthContext` with React Router (in some components)
- Modern: `useAuthStore` with Zustand (preferred for new code)

Mock credentials:
- Admin: `admin@resuscitare.com` / `admin123`
- Facilitator: `mariana@resuscitare.com` / `user123`

When adding auth to new components, use `useAuthStore` from `@/store/authStore`

## Development Notes

### Component Development
- All UI components follow shadcn/ui patterns
- Use `"use client"` directive for components with hooks, state, or browser APIs
- Prefer server components by default in App Router pages
- Use the `cn()` utility for conditional classNames

### Data Persistence
- Draft scenarios save to localStorage with key `"cenario_rascunho"`
- Auth state persists in localStorage via Zustand middleware

### Navigation
- Use Next.js `Link` component from `next/link` for routing in new code
- Legacy components may still use React Router's `Link`

### Styling Conventions
- Tailwind utilities throughout
- Color scheme uses CSS variables (defined in `src/index.css`)
- Sidebar uses dedicated color tokens (sidebar, sidebar-primary, sidebar-accent, etc.)
- Active navigation items highlighted in green (`bg-green-600`)

### Import Path Alias
Always use `@/` prefix for imports from `src/`:
```typescript
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { Scenario } from "@/types/prisma"
```

## Common Patterns

### Adding a New Page
1. Create file in `app/[route]/page.tsx`
2. Use server component by default, add `"use client"` if needed
3. Import layout wrapper if authentication is required
4. Follow existing page structure from `app/dashboard/page.tsx` or similar

### Adding a New UI Component
1. Create in `src/components/ui/[component].tsx`
2. Follow Radix UI + shadcn/ui patterns
3. Export component and type definitions
4. Use Tailwind for all styling

### Working with Forms
1. Use `react-hook-form` with Zod validation
2. Leverage existing form components from `src/components/ui/form.tsx`
3. For complex state, create a custom hook (see `useScenarioForm.ts`)
4. Validate before allowing navigation between tabs/steps

### Type Definitions
- Core data models in `src/types/prisma.ts`
- Domain-specific types in dedicated files (e.g., `debriefing.ts`)
- Form data types often separate from entity types (e.g., `ScenarioFormData` vs `Scenario`)

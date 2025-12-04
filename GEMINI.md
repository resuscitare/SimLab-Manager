# Gemini Assistant Guidelines for SimLab Manager

This document provides guidelines for the Gemini AI assistant to ensure its contributions are aligned with the project's standards and conventions.

## 1. Project Overview

- **Project Name:** SimLab Manager
- **Objective:** A web application for managing simulation laboratory resources, including scenarios, schedules, equipment, and checklists.
- **Key Features:** Scenario management, scheduling, resource tracking (equipment, materials), user management (instructors), and reporting.

## 2. Technical Stack

- **Frontend Framework:** React with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with PostCSS
- **UI Components:** Shadcn UI (based on `components.json`)
- **Linting:** ESLint
- **Package Manager:** pnpm

## 3. Coding Conventions

- **Language:** Always use TypeScript. Adhere to modern React practices, including functional components and hooks.
- **Component Structure:**
    - Create new components in the `src/components/` directory.
    - Group related components into subdirectories (e.g., `src/components/cenario/`).
    - Use `PascalCase` for component file and function names (e.g., `MyComponent.tsx`).
- **Styling:**
    - Use Tailwind CSS utility classes directly in the JSX.
    - Avoid creating separate CSS files for components unless absolutely necessary.
- **State Management:**
    - For local component state, use `useState` and `useReducer`.
    - For global state, utilize the existing React Context in `src/contexts/` or ask before adding a new state management library.
- **Imports:** Organize imports in the following order: external libraries, internal absolute paths (`@/`), relative paths.

## 4. Development Workflow

- **Running the App:** To start the development server, run `pnpm dev`.
- **Installing Dependencies:** Use `pnpm add <package-name>` to add a new dependency. Always ask for confirmation before adding new dependencies.
- **Linting:** Before committing, run `pnpm lint` to check for code quality issues.
- **Testing:** When adding new features or fixing bugs, create corresponding tests. (Note: Test framework not yet identified. Please identify and use the existing test setup, or recommend one like Vitest if none exists).

## 5. AI Assistant Behavior

- **Be Proactive:** When implementing a feature, also create or update the necessary tests.
- **Adhere to Conventions:** Strictly follow the coding style, file structure, and naming conventions found in the existing codebase.
- **Communicate Clearly:** Explain the purpose of commands, especially those that modify files or system state.
- **Commit Messages:** Write clear and concise commit messages following the Conventional Commits standard (e.g., `feat: add user login page`, `fix: correct calculation in totals`).
- **Idempotency:** Ensure that your changes are self-contained and don't have unintended side effects.

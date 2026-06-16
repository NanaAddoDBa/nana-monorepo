# NanaPortfolio

A modern personal portfolio built with Next.js App Router, React, TypeScript, Tailwind CSS, and shadcn/ui, following a modular, data-driven, and scalable architecture with clean separation of concerns.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- pnpm

## Project Goals

This project is being built incrementally with a strong focus on:

- modular architecture
- reusable components
- data-driven UI structure
- clean separation of concerns
- maintainability and scalability
- responsive, modern UI
- dark and light theme support

## Current Foundation Status

The project currently includes:

- Next.js application scaffold
- TypeScript configuration
- Tailwind CSS setup
- shadcn/ui initialization
- theme provider wiring
- base folder architecture for layout, sections, shared components, data, config, types, and utilities
- placeholder layout and section components to support composition-first page structure

## Structure Direction

The app is organized so that:

- `app/` contains routing, global layout, and route handlers
- `components/layout/` contains layout-specific UI such as header and footer
- `components/sections/` contains page sections such as hero, about, projects, and contact
- `components/shared/` contains reusable shared presentation components
- `components/ui/` contains shadcn/ui primitives
- `data/` contains content/config data separate from UI
- `types/` contains shared and feature-specific TypeScript types
- `lib/` contains utilities, validation, actions, mappers, and constants
- `config/` contains app-level configuration

## Development

Install dependencies:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```

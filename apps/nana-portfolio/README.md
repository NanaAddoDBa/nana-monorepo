# Nana Portfolio

A personal portfolio built with Next.js App Router, React, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- Responsive portfolio sections for hero, about, experience, education, projects, and contact
- Curated frontend and applied AI projects with clear thesis and prototype labels
- Dark and light theme support
- Contact form with shared client/server validation
- Frontend Engineer and AI Engineer CV downloads (English PDFs)

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- pnpm

## Development

Install dependencies:

```bash
pnpm install
```

Start the local development server:

```bash
pnpm dev
```

Run checks:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Portfolio content and CVs

The public portfolio uses the supplied Frontend Engineer and AI Engineer CVs
as the source for experience, education, languages and selected projects.
Content lives in `data/`; keep dates, role labels and prototype status aligned
when replacing the PDFs.

The two current English PDFs are bundled at:

- `public/documents/nana-addo-frontend-engineer.pdf`
- `public/documents/nana-addo-ai-engineer.pdf`

Update `data/cvDocumentsData.ts` when changing those paths. CV selection is
role-based; legacy `NEXT_PUBLIC_CV_EN_*` and `NEXT_PUBLIC_CV_DE_*` environment
variables no longer override these downloads. Older document files remain
available for existing bookmarks, but are not offered in the interface.

## Project Structure

- `app/` contains routing, global layout, and route handlers
- `components/layout/` contains layout-specific UI such as header and footer
- `components/sections/` contains page sections such as hero, about, projects, and contact
- `components/shared/` contains reusable shared presentation components
- `components/ui/` contains shadcn/ui primitives
- `data/` contains content/config data separate from UI
- `types/` contains shared and feature-specific TypeScript types
- `lib/` contains utilities, validation, actions, and service adapters

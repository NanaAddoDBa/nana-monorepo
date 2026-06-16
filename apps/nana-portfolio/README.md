# Nana Portfolio

A personal portfolio built with Next.js App Router, React, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- Responsive portfolio sections for hero, about, experience, education, projects, and contact
- GitHub-backed project feed with local project data as a fallback
- Dark and light theme support
- Contact form with shared client/server validation
- Google Docs/Drive-backed Software Engineer CV links for English and German

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

## CV Links

The portfolio shows two public CV options:

- `Software Engineer CV (EN)`
- `Software Engineer CV (DE)`

Set these through environment variables:

```bash
NEXT_PUBLIC_CV_EN_URL=
NEXT_PUBLIC_CV_DE_URL=
NEXT_PUBLIC_CV_EN_UPDATED=
NEXT_PUBLIC_CV_DE_UPDATED=
```

You can paste either:

- a Google Docs link such as `https://docs.google.com/document/d/.../edit`
- a Google Drive file link such as `https://drive.google.com/file/d/.../view`
- a direct PDF URL

Google Docs links are converted to PDF export links automatically. Keep the
Google links stable, then update the document/PDF in Drive when the CV changes.
The portfolio can keep using the same URL.

## Project Structure

- `app/` contains routing, global layout, and route handlers
- `components/layout/` contains layout-specific UI such as header and footer
- `components/sections/` contains page sections such as hero, about, projects, and contact
- `components/shared/` contains reusable shared presentation components
- `components/ui/` contains shadcn/ui primitives
- `data/` contains content/config data separate from UI
- `types/` contains shared and feature-specific TypeScript types
- `lib/` contains utilities, validation, actions, and service adapters

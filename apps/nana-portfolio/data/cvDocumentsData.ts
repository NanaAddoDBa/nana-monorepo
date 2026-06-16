import type { CvDocumentGroup } from "@/types/cvDocumentTypes"

export const cvDocumentsData = [
  {
    id: "primaryCv",
    label: "Download CV",
    documents: [
      {
        id: "cv-en",
        locale: "en",
        label: "Download CV (EN)",
        href: "/documents/nana-addo-cv-en.pdf",
      },
      {
        id: "cv-de",
        locale: "de",
        label: "Download CV (DE)",
        href: "/documents/nana-addo-cv-de.pdf",
      },
    ],
  },
] satisfies CvDocumentGroup[]

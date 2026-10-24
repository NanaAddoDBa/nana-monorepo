import type { CvDocumentGroup } from "@/types/cvDocumentTypes"

export const cvDocumentsData: CvDocumentGroup[] = [
  {
    id: "primaryCv",
    label: "Choose a CV · English PDF",
    documents: [
      {
        id: "frontend-engineer",
        locale: "en",
        label: "Frontend Engineer",
        href: "/documents/nana-addo-frontend-engineer.pdf",
      },
      {
        id: "ai-engineer",
        locale: "en",
        label: "AI Engineer",
        href: "/documents/nana-addo-ai-engineer.pdf",
      },
    ],
  },
]

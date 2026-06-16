import type { CvDocument, CvDocumentGroup } from "@/types/cvDocumentTypes"

function resolveGooglePdfUrl(url: string) {
  try {
    const parsedUrl = new URL(url)

    if (parsedUrl.hostname === "docs.google.com") {
      const documentId = parsedUrl.pathname.match(
        /^\/document\/d\/([^/]+)/
      )?.[1]

      if (documentId) {
        return `https://docs.google.com/document/d/${documentId}/export?format=pdf`
      }
    }

    if (
      parsedUrl.hostname === "drive.google.com" ||
      parsedUrl.hostname === "www.drive.google.com"
    ) {
      const fileId =
        parsedUrl.pathname.match(/^\/file\/d\/([^/]+)/)?.[1] ??
        parsedUrl.searchParams.get("id")

      if (fileId) {
        return `https://drive.google.com/uc?export=download&id=${fileId}`
      }
    }
  } catch {
    return url
  }

  return url
}

const availableCvDocuments: CvDocument[] = []

if (process.env.NEXT_PUBLIC_CV_EN_URL) {
  availableCvDocuments.push({
    id: "cv-en",
    locale: "en",
    label: "Software Engineer CV (EN)",
    href: resolveGooglePdfUrl(process.env.NEXT_PUBLIC_CV_EN_URL),
    updatedAt: process.env.NEXT_PUBLIC_CV_EN_UPDATED,
  })
}

availableCvDocuments.push({
  id: "cv-de",
  locale: "de",
  label: "Software Engineer CV (DE)",
  href: process.env.NEXT_PUBLIC_CV_DE_URL
    ? resolveGooglePdfUrl(process.env.NEXT_PUBLIC_CV_DE_URL)
    : "/documents/nana-addo-cv-de.pdf",
  updatedAt: process.env.NEXT_PUBLIC_CV_DE_UPDATED,
})

export const cvDocumentsData = [
  {
    id: "primaryCv",
    label: "Software Engineer CV",
    documents: availableCvDocuments,
  },
] satisfies CvDocumentGroup[]

export type CvDocumentLocale = "en" | "de"

export type CvDocument = {
  id: string
  locale: CvDocumentLocale
  label: string
  href: string
}

export type CvDocumentGroup = {
  id: string
  label: string
  documents: CvDocument[]
}

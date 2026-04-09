import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { skillsData } from "@/data/skillsData"
import type { LanguageSkill, SkillCategory } from "@/types/aboutTypes"

type CategorySection = {
  id: string
  title: string
  type: "categories"
  data: SkillCategory[]
}

type LanguageSection = {
  id: string
  title: string
  type: "languages"
  data: LanguageSkill[]
}

type SkillsAccordionSection = CategorySection | LanguageSection

const skillsAccordionSections: SkillsAccordionSection[] = [
  {
    id: "programming",
    title: "Programming",
    type: "categories",
    data: skillsData.programming,
  },
  {
    id: "testing",
    title: "Testing & QA",
    type: "categories",
    data: skillsData.testing,
  },
  {
    id: "productivity",
    title: "Productivity & Tools",
    type: "categories",
    data: skillsData.productivity,
  },
  {
    id: "languages-spoken",
    title: "Languages Spoken",
    type: "languages",
    data: skillsData.languageSkills,
  },
  {
    id: "soft-skills",
    title: "Soft Skills",
    type: "categories",
    data: skillsData.softSkills,
  },
]

function SkillChip({ name }: Readonly<{ name: string }>) {
  return (
    <span className="inline-flex rounded-sm border border-border/60 bg-background/40 px-3 py-2 text-xs font-semibold tracking-[0.04em] text-card-foreground uppercase">
      {name}
    </span>
  )
}

function SkillCategoryBlock({
  category,
}: Readonly<{
  category: SkillCategory
}>) {
  return (
    <div className="space-y-4 rounded-2xl border border-border/60 bg-secondary/25 p-5">
      <h3 className="text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">
        {category.category}
      </h3>

      <div className="flex flex-wrap gap-2">
        {category.items.map((item) => (
          <SkillChip key={item.slug} name={item.name} />
        ))}
      </div>
    </div>
  )
}

function LanguageSkillCard({
  language,
}: Readonly<{
  language: LanguageSkill
}>) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-secondary/25 px-4 py-4">
      <span className="text-sm font-medium text-card-foreground">
        {language.name}
      </span>
      <span className="text-[0.68rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
        {language.level}
      </span>
    </div>
  )
}

function SkillsSectionContent({
  section,
}: Readonly<{
  section: SkillsAccordionSection
}>) {
  if (section.type === "languages") {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        {section.data.map((language) => (
          <LanguageSkillCard key={language.slug} language={language} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {section.data.map((category) => (
        <SkillCategoryBlock key={category.category} category={category} />
      ))}
    </div>
  )
}

export function SkillsTab() {
  return (
    <Card className="border-border/60 bg-card/40 shadow-none">
      <CardContent className="p-0">
        <Accordion
          type="single"
          collapsible
          defaultValue="programming"
          className="w-full"
        >
          {skillsAccordionSections.map((section) => (
            <AccordionItem
              key={section.id}
              value={section.id}
              className="border-b border-border/60 px-6 last:border-b-0 md:px-8"
            >
              <AccordionTrigger className="py-5 text-left text-lg font-semibold text-card-foreground hover:no-underline">
                {section.title}
              </AccordionTrigger>

              <AccordionContent className="pb-6 md:pb-8">
                <SkillsSectionContent section={section} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

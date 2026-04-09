import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { skillsData } from "@/data/skillsData"

type SkillItem = {
  name: string
  slug: string
}

type SkillCategory = {
  category: string
  items: SkillItem[]
}

type SkillsAccordionSection = {
  id: string
  title: string
  categories?: SkillCategory[]
  languageSkills?: typeof skillsData.languageSkills
  softSkills?: typeof skillsData.softSkills
}

const skillsAccordionSections: SkillsAccordionSection[] = [
  {
    id: "programming",
    title: "Programming",
    categories: skillsData.programming,
  },
  {
    id: "testing",
    title: "Testing & QA",
    categories: skillsData.testing,
  },
  {
    id: "content-creation",
    title: "Content Creation",
    categories: skillsData.contentCreation,
  },
  {
    id: "productivity",
    title: "Productivity & Tools",
    categories: skillsData.productivity,
  },
  {
    id: "languages-spoken",
    title: "Languages Spoken",
    languageSkills: skillsData.languageSkills,
  },
  {
    id: "soft-skills",
    title: "Soft Skills",
    softSkills: skillsData.softSkills,
  },
]

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
          <span
            key={item.slug}
            className="inline-flex rounded-sm border border-border/60 bg-background/40 px-3 py-2 text-xs font-semibold tracking-[0.04em] text-card-foreground uppercase"
          >
            {item.name}
          </span>
        ))}
      </div>
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
                {section.categories ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {section.categories.map((category) => (
                      <SkillCategoryBlock
                        key={category.category}
                        category={category}
                      />
                    ))}
                  </div>
                ) : null}

                {section.languageSkills ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {section.languageSkills.map((language) => (
                      <div
                        key={language.slug}
                        className="flex items-center justify-between rounded-2xl border border-border/60 bg-secondary/25 px-4 py-4"
                      >
                        <span className="text-sm font-medium text-card-foreground">
                          {language.name}
                        </span>
                        <span className="text-[0.68rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                          {language.level}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}

                {section.softSkills ? (
                  <div className="flex flex-wrap gap-2">
                    {section.softSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex rounded-sm border border-border/60 bg-background/40 px-3 py-2 text-xs font-semibold tracking-[0.04em] text-card-foreground uppercase"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : null}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

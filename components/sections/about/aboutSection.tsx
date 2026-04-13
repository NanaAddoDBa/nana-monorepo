import { SectionShell } from "@/components/shared/sectionShell"
import { aboutTabsData } from "@/data/aboutData"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { EducationTab } from "./Tab/EducationTab"
import { ExperienceTab } from "./Tab/ExperienceTab"
import { OverviewTab } from "./Tab/OverviewTab"
import { SkillsTab } from "./Tab/SkillsTab"

const aboutTabPanels = {
  overview: <OverviewTab />,
  skills: <SkillsTab />,
  experience: <ExperienceTab />,
  education: <EducationTab />,
} as const

type VisibleAboutTab = (typeof aboutTabsData)[number] & {
  id: keyof typeof aboutTabPanels
}

const visibleAboutTabs = aboutTabsData.filter(
  (tab): tab is VisibleAboutTab => tab.id !== "certifications"
)

export function AboutSection() {
  return (
    <SectionShell id="about" aria-labelledby="about-heading">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid h-12 w-full grid-cols-2 md:grid-cols-4">
          {visibleAboutTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="h-full text-muted-foreground transition-colors data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {visibleAboutTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-4">
            <Card>
              <CardContent className="p-6 md:p-8 lg:p-10">
                {tab.id === "overview" ? (
                  <h2 id="about-heading" className="sr-only">
                    About Me
                  </h2>
                ) : null}
                {aboutTabPanels[tab.id]}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </SectionShell>
  )
}

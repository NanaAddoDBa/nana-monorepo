import { Container } from "@/components/shared/container"
import { aboutTabsData } from "@/data/aboutTabsData"
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

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading">
      <Container>
        <div className="py-12 md:py-16">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid h-12 w-full grid-cols-2 md:grid-cols-4">
              {aboutTabsData
                .filter((tab) => tab.value !== "certifications")
                .map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.value}
                    className="h-fulltext-muted-foreground transition-colors data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
            </TabsList>

            {aboutTabsData
              .filter((tab) => tab.value !== "certifications")
              .map((tab) => (
                <TabsContent key={tab.id} value={tab.value} className="mt-4">
                  <Card>
                    <CardContent className="p-6 md:p-8 lg:p-10">
                      {tab.value === "overview" ? (
                        <h2 id="about-heading" className="sr-only">
                          About Me
                        </h2>
                      ) : null}
                      {aboutTabPanels[tab.value]}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
          </Tabs>
        </div>
      </Container>
    </section>
  )
}

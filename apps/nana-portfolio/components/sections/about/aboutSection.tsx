"use client"

import * as React from "react"

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

type RenderedAboutTabId = keyof typeof aboutTabPanels
type RenderedAboutTab = Extract<
  (typeof aboutTabsData)[number],
  { id: RenderedAboutTabId }
>

const renderedAboutTabs = aboutTabsData.filter(
  (tab): tab is RenderedAboutTab => tab.id !== "certifications"
)

function resolveAboutTabFromHash(hash: string): RenderedAboutTabId {
  switch (hash) {
    case "#about-skills":
      return "skills"
    case "#about-experience":
      return "experience"
    case "#about-education":
    case "#about-certifications":
      return "education"
    case "#about-overview":
    case "#about":
    default:
      return "overview"
  }
}

function isAboutHash(hash: string) {
  return hash === "#about" || hash.startsWith("#about-")
}

export function AboutSection() {
  const [activeTab, setActiveTab] =
    React.useState<RenderedAboutTabId>("overview")

  React.useEffect(() => {
    const syncTabWithHash = () => {
      const hash = window.location.hash

      if (!isAboutHash(hash)) {
        return
      }

      setActiveTab(resolveAboutTabFromHash(hash))
    }

    syncTabWithHash()
    window.addEventListener("hashchange", syncTabWithHash)

    return () => {
      window.removeEventListener("hashchange", syncTabWithHash)
    }
  }, [])

  const handleTabChange = (value: string) => {
    const nextTab = value as RenderedAboutTabId
    const nextTabData = renderedAboutTabs.find((tab) => tab.id === nextTab)

    setActiveTab(nextTab)

    if (nextTabData) {
      window.history.replaceState(null, "", nextTabData.href)
    }
  }

  return (
    <SectionShell id="about" aria-labelledby="about-heading">
      <div className="mb-8 space-y-3">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Background & capabilities
        </p>
        <h2 id="about-heading" className="font-heading text-3xl md:text-4xl">
          The person behind the work.
        </h2>
      </div>
      <div className="relative">
        {aboutTabsData.map((tab) => (
          <span
            key={tab.id}
            id={tab.href.slice(1)}
            aria-hidden="true"
            className="block h-0 scroll-mt-24"
          />
        ))}

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList
            aria-label="About Nana Addo"
            className="grid w-full grid-cols-2 gap-1 p-1 group-data-horizontal/tabs:h-auto sm:grid-cols-4"
          >
            {renderedAboutTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="h-11 text-muted-foreground transition-colors data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {renderedAboutTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-4">
              <Card>
                <CardContent className="p-4 md:p-8 lg:p-10">
                  {aboutTabPanels[tab.id]}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </SectionShell>
  )
}

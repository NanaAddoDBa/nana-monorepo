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

      document.getElementById(nextTabData.href.slice(1))?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      })
    }
  }

  return (
    <SectionShell id="about" aria-labelledby="about-heading">
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
          <TabsList className="grid h-12 w-full grid-cols-2 md:grid-cols-4">
            {renderedAboutTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="h-full text-muted-foreground transition-colors data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {renderedAboutTabs.map((tab) => (
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
      </div>
    </SectionShell>
  )
}

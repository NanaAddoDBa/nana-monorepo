import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Container } from "@/components/shared/container"
import { Card, CardContent } from "@/components/ui/card"
import { contactData } from "@/data/contactData"
import { socialLinks } from "@/data/socialLinks"
import { ContactForm } from "./contactForm"

const contactMethods = Object.values(contactData.contactInfo)

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-heading">
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
            <div className="space-y-8">
              <div className="space-y-3">
                <h2
                  id="contact-heading"
                  className="font-heading text-4xl text-foreground md:text-5xl"
                >
                  {contactData.title}
                </h2>

                <p className="text-base leading-8 text-muted-foreground">
                  {contactData.subtitle}
                </p>
              </div>

              <div className="space-y-4">
                {contactMethods.map((method) => {
                  const Icon = method.icon

                  return (
                    <Link
                      key={method.label}
                      href={method.href}
                      target={
                        method.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        method.href.startsWith("http")
                          ? "noreferrer"
                          : undefined
                      }
                      className="block"
                    >
                      <Card className="border-border/60 bg-card/40 shadow-none transition-colors hover:border-primary/40">
                        <CardContent className="flex items-center gap-5 p-5">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border/60 bg-background/30 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="space-y-1">
                            <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                              {method.label}
                            </p>
                            <p className="text-lg font-semibold text-card-foreground">
                              {method.value}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>

              <div className="space-y-4">
                <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase">
                  Digital Archives
                </p>

                <div className="flex flex-wrap gap-x-5 gap-y-3">
                  {socialLinks.map((link) => {
                    const Icon = link.icon

                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={link.ariaLabel}
                        className="inline-flex items-center gap-2 text-sm font-medium text-card-foreground transition-colors hover:text-primary"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{link.name}</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>

            <Card className="border-border/60 bg-card/50 shadow-none">
              <CardContent className="space-y-6 p-6 md:p-8">
                <div className="h-1 w-24 rounded-full bg-primary/80" />
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  )
}

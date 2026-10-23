import { Mail, Phone } from "lucide-react";

import { site } from "@/shared/config/site";

export function ContactContent() {
  const phoneLink = site.phone.replace(/[^+\d]/g, "");

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <section className="rounded-3xl border border-border bg-card p-8">
        <Mail className="mb-5 text-primary" size={27} />
        <h2 className="text-xl font-semibold">Email</h2>
        <p className="mt-3 text-muted-foreground">
          {site.bookingEmail
            ? "Contact the rental operator by email."
            : "An operator email address has not been configured."}
        </p>
        {site.bookingEmail && (
          <a
            href={"mailto:" + site.bookingEmail}
            className="mt-5 inline-flex text-primary underline"
          >
            {site.bookingEmail}
          </a>
        )}
      </section>

      <section className="rounded-3xl border border-border bg-card p-8">
        <Phone className="mb-5 text-primary" size={27} />
        <h2 className="text-xl font-semibold">Phone</h2>
        <p className="mt-3 text-muted-foreground">
          {site.phone
            ? "Call the rental operator."
            : "An operator phone number has not been configured."}
        </p>
        {site.phone && (
          <a href={"tel:" + phoneLink} className="mt-5 inline-flex text-primary underline">
            {site.phone}
          </a>
        )}
      </section>
    </div>
  );
}

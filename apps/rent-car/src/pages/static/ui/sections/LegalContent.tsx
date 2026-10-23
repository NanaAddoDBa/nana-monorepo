import { site } from "@/shared/config/site";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Button } from "@/shared/ui/button";

export function PrivacyContent() {
  return (
    <div className="max-w-3xl space-y-6 rounded-3xl border border-border bg-card p-8 leading-8 text-muted-foreground">
      <h2 className="text-2xl font-semibold text-foreground">
        Browser storage and enquiries
      </h2>
      <p>
        Saved vehicles and theme preferences are stored in your browser.
        {site.useEnquiryApi
          ? "When online enquiries are enabled, your contact details and trip are submitted to the operator’s server and stored to process the request. Email notifications may be queued."
          : "The website currently prepares the enquiry draft locally and does not submit it to a server."}
        No card payments are processed.
      </p>
      <p>
        Car photographs are loaded from Unsplash, which receives
        requests from your browser. Hosting and email services may also
        process technical or contact information under their own terms.
      </p>
      <h2 className="text-2xl font-semibold text-foreground">
        Privacy notice pending
      </h2>
      <p>
        Before commercial launch, the rental operator must publish a
        privacy policy covering provider identity, the actual data flows,
        retention, lawful bases, third parties, and applicable privacy rights.
        This technical summary is not a substitute for that policy.
      </p>
    </div>
  );
}

export function TermsContent() {
  return (
    <div className="max-w-3xl space-y-6 rounded-3xl border border-border bg-card p-8 leading-8 text-muted-foreground">
      <h2 className="text-2xl font-semibold text-foreground">
        Rental conditions are not published yet
      </h2>
      <p>
        Listed vehicles, locations and prices are examples, not confirmed
        commercial offers. This website does not reserve cars or collect
        payments.
      </p>
      <p>
        Availability, insurance, deposits, driver eligibility, mileage,
        cancellation conditions, taxes, and additional fees require written
        confirmation from the rental operator.
      </p>
      <p>
        A commercial launch requires published rental terms, pricing and
        cancellation policies, and mandatory business disclosures.
      </p>
      <Button asChild>
        <Link to="/fleet">
          Browse vehicles <ArrowRight size={17} />
        </Link>
      </Button>
    </div>
  );
}

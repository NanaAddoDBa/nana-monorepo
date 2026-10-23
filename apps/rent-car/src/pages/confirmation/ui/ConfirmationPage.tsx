import { Link, useLocation } from "react-router-dom";
import { ArrowRight, CheckCircle2, ClipboardCopy } from "lucide-react";

import type { EnquiryReceipt } from "@/features/booking/lib/api";
import { priceLabel } from "@/shared/config/site";
import { Button } from "@/shared/ui/button";

interface ConfirmationState {
  receipt: EnquiryReceipt;
  vehicleName: string;
}

export function ConfirmationPage() {
  const location = useLocation();
  const state = location.state as ConfirmationState | null;
  const receipt = state?.receipt;
  const valid = receipt && typeof receipt.reference === "string" &&
    receipt.status === "submitted" && typeof receipt.id === "string";
  if (!valid) {
    return (
      <main className="page-container min-h-[65vh] py-24 text-center">
        <h1 className="display-serif text-5xl">No enquiry confirmation in this session</h1>
        <p className="mx-auto my-6 max-w-xl text-muted-foreground">
          We cannot verify an enquiry from this page alone. If you submitted one, check your acknowledgement email or contact the operator.
        </p>
        <Button asChild><Link to="/fleet">Back to vehicles <ArrowRight size={17} /></Link></Button>
      </main>
    );
  }

  return (
    <main className="page-container min-h-[65vh] py-16 md:py-24">
      <section className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-7 text-center md:p-12">
        <CheckCircle2 size={48} className="mx-auto mb-5 text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Enquiry received</p>
        <h1 className="display-serif mt-3 text-5xl">Your request is recorded.</h1>
        <p className="mt-5 leading-7 text-muted-foreground">
          Thank you. Your rental enquiry has been saved; this is not a reservation confirmation.
          The operator must confirm availability and final terms.
        </p>
        <div className="my-8 rounded-2xl bg-muted p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Your reference</p>
          <p className="mt-3 break-words text-2xl font-bold">{receipt.reference}</p>
          <Button className="mt-4" size="sm" variant="outline" onClick={() => {
            void navigator.clipboard.writeText(receipt.reference);
          }}><ClipboardCopy size={15} /> Copy reference</Button>
        </div>
        <div className="space-y-3 text-sm">
          <p><strong>Vehicle:</strong> {state.vehicleName}</p>
          <p><strong>Base estimate:</strong> {priceLabel(receipt.quote.baseAmountCents / 100)}</p>
          <p><strong>Notification:</strong> Queued for delivery</p>
          <p className="text-muted-foreground">{receipt.nextSteps}</p>
        </div>
        <Button className="mt-8" asChild><Link to="/fleet">Explore more cars <ArrowRight size={16} /></Link></Button>
      </section>
    </main>
  );
}

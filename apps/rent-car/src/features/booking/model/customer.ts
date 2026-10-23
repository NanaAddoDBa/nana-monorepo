export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
}

export const emptyCustomer: CustomerDetails = {
  name: "", email: "", phone: "", message: "", consent: false,
};

export function validCustomer(value: CustomerDetails): boolean {
  return value.name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim()) &&
    value.phone.length <= 40 && value.message.length <= 1000 && value.consent;
}

export function customerFromUnknown(value: unknown): CustomerDetails | null {
  if (!value || typeof value !== "object") return null;
  const c = value as Record<string, unknown>;
  if (typeof c.name !== "string" || typeof c.email !== "string" ||
    typeof c.phone !== "string" || typeof c.message !== "string" ||
    typeof c.consent !== "boolean") return null;
  const result = { name: c.name, email: c.email, phone: c.phone, message: c.message, consent: c.consent };
  return validCustomer(result) ? result : null;
}

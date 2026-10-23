import { z } from "zod";

export const tripSchema = z.object({
  pickupLocationId: z.string().min(1).max(60),
  returnLocationId: z.string().min(1).max(60),
  pickupDate: z.string().max(10),
  pickupTime: z.string().max(5),
  returnDate: z.string().max(10),
  returnTime: z.string().max(5),
}).strict();

export const quoteSchema = z.object({
  vehicleId: z.string().min(1).max(80),
  trip: tripSchema,
}).strict();

export const enquirySchema = quoteSchema.extend({
  customer: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(150),
    phone: z.string().trim().max(40).default(""),
    message: z.string().trim().max(1000).default(""),
    consent: z.literal(true),
  }).strict(),
  website: z.string().max(0).optional(),
}).strict();

export type EnquiryInput = z.infer<typeof enquirySchema>;

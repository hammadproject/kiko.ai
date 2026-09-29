import { z } from "zod";

export const businessTypes = [
  "Home services",
  "Healthcare",
  "Real estate",
  "Professional services",
  "Other",
] as const;

const normalizeWhitespace = (value: unknown) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;

const optionalNormalizedText = (maximum: number) =>
  z.preprocess(
    (value) => {
      const normalized = normalizeWhitespace(value);
      return normalized === "" ? undefined : normalized;
    },
    z.string().max(maximum, `Must be ${maximum} characters or fewer.`).optional(),
  );

export const consultationSchema = z.object({
  full_name: z.preprocess(
    normalizeWhitespace,
    z.string().min(1, "Enter your full name.").max(100, "Name must be 100 characters or fewer."),
  ),
  email: z.preprocess(
    (value) => typeof value === "string" ? value.trim().toLowerCase() : value,
    z.string().email("Enter a valid email address.").max(254, "Email must be 254 characters or fewer."),
  ),
  phone_number: z.preprocess(
    normalizeWhitespace,
    z.string()
      .min(7, "Enter a phone number.")
      .max(30, "Phone number must be 30 characters or fewer.")
      .regex(/^[+()\d\s.-]+$/, "Enter a valid phone number.")
      .refine((value) => value.replace(/\D/g, "").length >= 7, "Enter a valid phone number."),
  ),
  business_type: z.preprocess(
    (value) => value === "" ? undefined : normalizeWhitespace(value),
    z.enum(businessTypes, { message: "Choose a valid business type." }).optional(),
  ),
  help_request: optionalNormalizedText(1500),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;
export type ConsultationField = keyof ConsultationInput;

export interface ConsultationActionState {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Partial<Record<ConsultationField, string[]>>;
  bookingUrl?: string;
}

export const initialConsultationState: ConsultationActionState = {
  status: "idle",
  message: "",
};

export function consultationInputFromFormData(formData: FormData) {
  return {
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone_number: formData.get("phone_number"),
    business_type: formData.get("business_type"),
    help_request: formData.get("help_request"),
  };
}

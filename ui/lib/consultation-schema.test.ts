import { describe, expect, it } from "vitest";
import { consultationSchema } from "./consultation-schema";

describe("consultationSchema", () => {
  it("accepts and normalizes a valid submission", () => {
    const result = consultationSchema.parse({
      full_name: "  Alex   Morgan  ",
      email: "  ALEX@EXAMPLE.COM ",
      phone_number: " +1  (555) 123-4567 ",
      business_type: "Home services",
      help_request: "  Help with   after-hours calls. ",
    });

    expect(result).toEqual({
      full_name: "Alex Morgan",
      email: "alex@example.com",
      phone_number: "+1 (555) 123-4567",
      business_type: "Home services",
      help_request: "Help with after-hours calls.",
    });
  });

  it("rejects missing required values and malformed contact details", () => {
    const result = consultationSchema.safeParse({
      full_name: " ",
      email: "not-an-email",
      phone_number: "12",
      business_type: "Unsupported industry",
      help_request: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.full_name).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.phone_number).toBeDefined();
      expect(errors.business_type).toBeDefined();
    }
  });

  it("converts blank optional fields to undefined", () => {
    const result = consultationSchema.parse({
      full_name: "Alex Morgan",
      email: "alex@example.com",
      phone_number: "+1 555 123 4567",
      business_type: "",
      help_request: "   ",
    });

    expect(result.business_type).toBeUndefined();
    expect(result.help_request).toBeUndefined();
  });
});

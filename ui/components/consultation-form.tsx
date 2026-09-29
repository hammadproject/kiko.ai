"use client";

import { type FormEvent, useActionState, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, LoaderCircle, Send } from "lucide-react";
import { useFormStatus } from "react-dom";
import { submitConsultation } from "@/app/actions/consultation";
import {
  businessTypes,
  consultationInputFromFormData,
  consultationSchema,
  initialConsultationState,
  type ConsultationField,
} from "@/lib/consultation-schema";

const fieldOrder: ConsultationField[] = [
  "full_name",
  "email",
  "phone_number",
  "business_type",
  "help_request",
];

function focusField(form: HTMLFormElement | null, field: ConsultationField) {
  const element = form?.elements.namedItem(field);
  if (element instanceof HTMLElement) element.focus();
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-4 rounded-[9px] bg-signal px-5 text-base font-bold text-foreground transition-colors hover:bg-signal-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-65"
    >
      {pending ? (
        <><LoaderCircle className="animate-spin" size={21} aria-hidden="true" /> Sending…</>
      ) : (
        <>Send <Send size={20} aria-hidden="true" /></>
      )}
    </button>
  );
}

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return <p id={id} className="mt-1.5 text-sm font-medium text-red-700">{errors[0]}</p>;
}

export function ConsultationForm() {
  const [state, formAction] = useActionState(submitConsultation, initialConsultationState);
  const [clientErrors, setClientErrors] = useState<Partial<Record<ConsultationField, string[]>>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.bookingUrl && state.status === "success") {
      window.location.assign(state.bookingUrl);
    } else if (state.status === "success") {
      successRef.current?.focus();
    }
  }, [state.bookingUrl, state.status]);

  useEffect(() => {
    if (state.status !== "error" || !state.fieldErrors) return;
    const firstInvalid = fieldOrder.find((field) => state.fieldErrors?.[field]?.length);
    if (firstInvalid) focusField(formRef.current, firstInvalid);
  }, [state]);

  function validateClient(event: FormEvent<HTMLFormElement>) {
    const result = consultationSchema.safeParse(
      consultationInputFromFormData(new FormData(event.currentTarget)),
    );
    if (result.success) {
      setClientErrors({});
      return;
    }

    event.preventDefault();
    const errors = result.error.flatten().fieldErrors;
    setClientErrors(errors);
    const firstInvalid = fieldOrder.find((field) => errors[field]?.length);
    if (firstInvalid) focusField(event.currentTarget, firstInvalid);
  }

  const errors = Object.keys(clientErrors).length ? clientErrors : state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        className="success-reveal flex min-h-[390px] flex-col items-center justify-center rounded-[10px] border border-signal-strong/60 bg-signal/10 px-6 py-12 text-center outline-none focus-visible:ring-2 focus-visible:ring-signal-strong"
        role="status"
        aria-live="polite"
        tabIndex={-1}
      >
        <span className="success-check grid size-16 place-items-center rounded-full bg-signal text-foreground" aria-hidden="true">
          <Check size={31} strokeWidth={2.5} />
        </span>
        <h4 className="mt-6 text-2xl font-semibold tracking-[-0.035em]">Thank you</h4>
        <p className="mt-3 max-w-md text-base leading-7 text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} onSubmit={validateClient} noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="form-label" htmlFor="full_name">Full name <span aria-hidden="true">*</span></label>
          <input className="form-control" id="full_name" name="full_name" type="text" autoComplete="name" placeholder="Alex Morgan" required aria-invalid={Boolean(errors.full_name?.length)} aria-describedby={errors.full_name ? "full-name-error" : undefined} />
          <FieldError id="full-name-error" errors={errors.full_name} />
        </div>
        <div>
          <label className="form-label" htmlFor="email">Email <span aria-hidden="true">*</span></label>
          <input className="form-control" id="email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="alex@example.com" required aria-invalid={Boolean(errors.email?.length)} aria-describedby={errors.email ? "email-error" : undefined} />
          <FieldError id="email-error" errors={errors.email} />
        </div>
        <div>
          <label className="form-label" htmlFor="phone_number">Phone number <span aria-hidden="true">*</span></label>
          <input className="form-control" id="phone_number" name="phone_number" type="tel" autoComplete="tel" inputMode="tel" placeholder="+1 (555) 123-4567" required aria-invalid={Boolean(errors.phone_number?.length)} aria-describedby={errors.phone_number ? "phone-error" : undefined} />
          <FieldError id="phone-error" errors={errors.phone_number} />
        </div>
        <div>
          <label className="form-label" htmlFor="business_type">Business type <span className="font-normal text-muted">(optional)</span></label>
          <div className="relative">
            <select className="form-control appearance-none pr-11" id="business_type" name="business_type" autoComplete="organization" defaultValue="" aria-invalid={Boolean(errors.business_type?.length)} aria-describedby={errors.business_type ? "business-type-error" : undefined}>
              <option value="">Choose your business type</option>
              {businessTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" size={18} aria-hidden="true" />
          </div>
          <FieldError id="business-type-error" errors={errors.business_type} />
        </div>
      </div>

      <div className="mt-6">
        <label className="form-label" htmlFor="help_request">What should kiko.ai help with? <span className="font-normal text-muted">(optional)</span></label>
        <textarea className="form-control consultation-textarea resize-y py-3" id="help_request" name="help_request" placeholder="Tell us about your calls, bookings, or support needs" maxLength={1500} aria-invalid={Boolean(errors.help_request?.length)} aria-describedby={errors.help_request ? "help-request-error" : undefined} />
        <FieldError id="help-request-error" errors={errors.help_request} />
      </div>

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="kiko_form_guard">Leave this field empty</label>
        <input id="kiko_form_guard" name="kiko_form_guard" type="text" tabIndex={-1} autoComplete="off" data-1p-ignore="true" data-lpignore="true" data-bwignore="true" />
      </div>

      <SubmitButton />
      <p className="mt-4 text-center text-xs leading-5 text-muted">By submitting, you agree to be contacted about kiko.ai. Your details are never sold.</p>
      <div className={`mt-4 rounded-lg px-4 py-3 text-sm ${state.status === "error" ? "bg-red-50 text-red-800" : "hidden"}`} role="status" aria-live="polite" tabIndex={-1}>
        {state.message}
      </div>
    </form>
  );
}

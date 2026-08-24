"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input, Textarea } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { nameSchema, phoneSchema } from "@/features/inquiries/schemas";

const TOPICS = [
  "Buying a vehicle",
  "Selling a vehicle",
  "Finance",
  "Verification & inspection",
  "Dealer partnership",
  "Something else",
] as const;

const contactSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: z
    .union([z.literal(""), z.email("Enter a valid email address")])
    .optional(),
  topic: z.enum(TOPICS, { message: "Choose what this is about" }),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more so we can help")
    .max(1000, "Keep it under 1000 characters"),
});

type ContactInput = z.input<typeof contactSchema>;

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      topic: "Buying a vehicle",
      message: "",
    },
  });

  // Read before the early return below — hooks must not be conditional.
  const topic = useWatch({ control: form.control, name: "topic" });

  async function onSubmit() {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSubmitting(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-trust-200 bg-trust-50 p-6 text-center">
        <CheckCircle2 aria-hidden className="mx-auto size-10 text-trust-600" />
        <h2 className="mt-4 font-display text-lg font-bold text-steel-900">
          Message received
        </h2>
        <p className="mt-2 text-sm text-pretty text-steel-600">
          Our team replies within one working day, usually sooner. If it is
          urgent, call us — the number is on this page.
        </p>
      </div>
    );
  }

  const errors = form.formState.errors;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-lg border border-steel-200 bg-white p-5 sm:p-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="c-name"
          label="Your name"
          required
          error={errors.name?.message}
        >
          <Input
            id="c-name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            {...form.register("name")}
          />
        </FormField>

        <FormField
          id="c-phone"
          label="Mobile number"
          required
          error={errors.phone?.message}
        >
          <Input
            id="c-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="98765 43210"
            aria-invalid={Boolean(errors.phone)}
            {...form.register("phone")}
          />
        </FormField>

        <FormField
          id="c-email"
          label="Email"
          hint="Optional"
          error={errors.email?.message}
        >
          <Input
            id="c-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...form.register("email")}
          />
        </FormField>

        <FormField
          id="c-topic"
          label="What is this about?"
          required
          error={errors.topic?.message}
        >
          <Select
            value={topic}
            onValueChange={(value) =>
              form.setValue("topic", value as ContactInput["topic"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="c-topic">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TOPICS.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <FormField
        id="c-message"
        label="Message"
        required
        error={errors.message?.message}
      >
        <Textarea
          id="c-message"
          rows={5}
          aria-invalid={Boolean(errors.message)}
          {...form.register("message")}
        />
      </FormField>

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="sm:min-w-40"
      >
        {submitting && <Loader2 className="animate-spin" />}
        Send message
      </Button>
    </form>
  );
}

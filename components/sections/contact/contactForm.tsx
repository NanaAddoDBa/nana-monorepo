"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { contactData } from "@/data/contactData"
import {
  contactFormSchema,
  type ContactFormValues,
  preferredContactMethodValues,
} from "@/lib/validations/contactFormSchema"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import {
  submitContactForm,
  SubmitContactFormError,
} from "@/lib/actions/submitContactForm"

type ContactFormProps = {
  onSubmit?: (values: ContactFormValues) => Promise<void> | void
}

export function ContactForm({ onSubmit }: Readonly<ContactFormProps>) {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      contactValue: "",
      subject: "",
      message: "",
      preferredContactMethod: preferredContactMethodValues[0],
    },
  })

  async function handleSubmit(values: ContactFormValues) {
    try {
      if (onSubmit) {
        await onSubmit(values)
      } else {
        await submitContactForm(values)
      }

      toast.success(contactData.successMessage)

      form.reset({
        name: "",
        contactValue: "",
        subject: "",
        message: "",
        preferredContactMethod: preferredContactMethodValues[0],
      })
    } catch (error) {
      if (error instanceof SubmitContactFormError && error.fieldErrors) {
        for (const [field, messages] of Object.entries(error.fieldErrors)) {
          const firstMessage = messages?.[0]

          if (!firstMessage) {
            continue
          }

          form.setError(field as keyof ContactFormValues, {
            type: "server",
            message: firstMessage,
          })
        }
      }

      toast.error(
        error instanceof Error ? error.message : contactData.errorMessage
      )
    }
  }

  const preferredContactMethod = form.watch("preferredContactMethod")

  const isEmailMethod = preferredContactMethod === "email"

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      noValidate
      className="space-y-6"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">
            {contactData.formFields.name.label}
          </Label>
          <Input
            id="contact-name"
            placeholder={contactData.formFields.name.placeholder}
            autoComplete="name"
            aria-invalid={form.formState.errors.name ? "true" : "false"}
            {...form.register("name")}
          />
          {form.formState.errors.name ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-value">
            {isEmailMethod
              ? contactData.formFields.contactValue.emailLabel
              : contactData.formFields.contactValue.phoneLabel}
          </Label>
          <Input
            id="contact-value"
            type={isEmailMethod ? "email" : "tel"}
            placeholder={
              isEmailMethod
                ? contactData.formFields.contactValue.emailPlaceholder
                : contactData.formFields.contactValue.phonePlaceholder
            }
            autoComplete={isEmailMethod ? "email" : "tel"}
            aria-invalid={form.formState.errors.contactValue ? "true" : "false"}
            {...form.register("contactValue")}
          />
          {form.formState.errors.contactValue ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.contactValue.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-subject">
          {contactData.formFields.subject.label}
        </Label>
        <Input
          id="contact-subject"
          placeholder={contactData.formFields.subject.placeholder}
          aria-invalid={form.formState.errors.subject ? "true" : "false"}
          {...form.register("subject")}
        />
        {form.formState.errors.subject ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.subject.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">
          {contactData.formFields.message.label}
        </Label>
        <Textarea
          id="contact-message"
          placeholder={contactData.formFields.message.placeholder}
          className="min-h-40"
          aria-invalid={form.formState.errors.message ? "true" : "false"}
          {...form.register("message")}
        />
        {form.formState.errors.message ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.message.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          Preferred Contact Method
        </p>

        <Controller
          name="preferredContactMethod"
          control={form.control}
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="flex flex-wrap gap-x-8 gap-y-3"
            >
              {contactData.preferredContactMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={method.id}
                    id={`contact-method-${method.id}`}
                  />
                  <Label htmlFor={`contact-method-${method.id}`}>
                    {method.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        />

        {form.formState.errors.preferredContactMethod ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.preferredContactMethod.message}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? (
          <>
            <Spinner data-icon="inline-start" />
            <span>Sending...</span>
          </>
        ) : (
          contactData.submitLabel
        )}
      </Button>
    </form>
  )
}

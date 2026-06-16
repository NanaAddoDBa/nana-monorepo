import { z } from "zod"

import { sendContactEmail } from "@/lib/email/sendContactEmail"
import { sendTelegramMessage } from "@/lib/telegram/sendTelegramMessage"
import { contactFormSchema } from "@/lib/validations/contactFormSchema"

export async function POST(request: Request) {
  try {
    const json = await request.json()

    const result = contactFormSchema.safeParse(json)

    if (!result.success) {
      const flattenedErrors = z.flattenError(result.error)

      return Response.json(
        {
          success: false,
          message: "Invalid form submission.",
          fieldErrors: flattenedErrors.fieldErrors,
        },
        { status: 400 }
      )
    }

    if (result.data.preferredContactMethod === "phone") {
      await sendTelegramMessage(result.data)
    } else {
      await sendContactEmail(result.data)
    }

    return Response.json(
      {
        success: true,
        message: "Contact form submitted successfully.",
      },
      { status: 200 }
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to process contact form submission.",
      },
      { status: 500 }
    )
  }
}

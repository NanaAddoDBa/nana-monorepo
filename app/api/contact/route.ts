import { contactFormSchema } from "@/lib/validations/contactFormSchema"

export async function POST(request: Request) {
  try {
    const json = await request.json()

    const result = contactFormSchema.safeParse(json)

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid form submission.",
          fieldErrors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    return Response.json(
      {
        success: true,
        message: "Contact form submitted successfully.",
      },
      { status: 200 }
    )
  } catch {
    return Response.json(
      {
        success: false,
        message: "Unable to process contact form submission.",
      },
      { status: 500 }
    )
  }
}

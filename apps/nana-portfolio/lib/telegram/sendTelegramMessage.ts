import type { ContactFormValues } from "@/lib/validations/contactFormSchema"

type TelegramSendMessageResponse = {
  ok: boolean
  description?: string
  result?: {
    message_id: number
  }
}

function getRequiredEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`${name} is not configured.`)
  }

  return value
}

export async function sendTelegramMessage(values: ContactFormValues) {
  const botToken = getRequiredEnv(
    "TELEGRAM_BOT_TOKEN",
    process.env.TELEGRAM_BOT_TOKEN
  )

  const chatId = getRequiredEnv(
    "TELEGRAM_CHAT_ID",
    process.env.TELEGRAM_CHAT_ID
  )

  const text = [
    "New portfolio phone contact submission",
    "",
    `Name: ${values.name}`,
    `Preferred contact method: ${values.preferredContactMethod}`,
    `Phone: ${values.contactValue}`,
    `Subject: ${values.subject}`,
    "",
    "Message:",
    values.message,
  ].join("\n")

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
      cache: "no-store",
    }
  )

  const data = (await response.json()) as TelegramSendMessageResponse

  if (!response.ok || !data.ok) {
    throw new Error(
      data.description || "Failed to send Telegram contact message."
    )
  }

  if (!data.result?.message_id) {
    throw new Error("Telegram message was accepted without a message id.")
  }

  return data.result.message_id
}

import twilio from 'twilio'

const sendSms = async (
  to,
  message
) => {
  const client =
    twilio(
      process.env
        .TWILIO_ACCOUNT_SID,
      process.env
        .TWILIO_AUTH_TOKEN
    )

  await client.messages.create({
    body: message,
    from:
      process.env
        .TWILIO_PHONE_NUMBER,
    to,
  })
}

export default sendSms
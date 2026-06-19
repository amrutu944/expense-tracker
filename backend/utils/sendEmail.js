import axios from 'axios'

export const isEmailConfigured =
  () => {
    return Boolean(
      process.env.BREVO_API_KEY
    )
  }

const sendEmail = async (
  to,
  subject,
  html
) => {
  try {
    const response =
      await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: {
            name:
              'Expense Tracker 💰',

            email:
              'amrutagowda290@gmail.com',
          },

          to: [
            {
              email: to,
            },
          ],

          subject,

          htmlContent:
            html,
        },
        {
          headers: {
            accept:
              'application/json',

            'api-key':
              process.env
                .BREVO_API_KEY,

            'content-type':
              'application/json',
          },
        }
      )

    console.log(
      'EMAIL SENT ✅',
      response.data
    )
    console.log("Sending email to:", to);

    return response.data
  } catch (error) {
    console.error(
      'BREVO API ERROR:',
      error.response?.data ||
        error.message
    )

    throw error
  }
}

export default sendEmail
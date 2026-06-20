import { Resend } from "resend";
import { EmailConfirmationTemplate } from "@/components/emails/emailConfirmationTemplete";

export const sendConfirmationEmail = async (email: string, link: string, userName: string) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const from = `Issue Reminder <onboarding@resend.dev>`;

  const response = await resend.emails.send({
    from,
    to: email,
    subject: "Verify Your Email Address",
    react: EmailConfirmationTemplate({
      userName,
      verificationUrl: link,
    }),
    headers: {
      // this is important for if the subscriber has to resend the confirmation email.
      // the date header ensures there is a change in the email and it is not marked as spam.
      Date: new Date().toUTCString(),
    },
  });

  return response;
};
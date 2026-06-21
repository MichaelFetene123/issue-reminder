import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { EmailConfirmationTemplate } from "@/components/emails/emailConfirmationTemplete";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendConfirmationEmail = async (
  email: string,
  link: string,
  userName: string
) => {
  try {
    const html = await render(
      EmailConfirmationTemplate({
        userName,
        verificationUrl: link,
      })
    );

    await transporter.sendMail({
      from: `Issue Reminder <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email Address",
      html,
    });

    return { data: { id: "success" }, error: null };
  } catch (err) {
    console.error("Failed to send email:", err);
    return { data: null, error: err };
  }
};
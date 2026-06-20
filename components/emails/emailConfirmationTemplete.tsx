import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "react-email";

interface EmailConfirmationTemplateProps {
  userName: string;
  verificationUrl: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const EmailConfirmationTemplate = ({
  userName,
  verificationUrl,
}: EmailConfirmationTemplateProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className="bg-[#f6f9fc] font-sans">
        <Preview>Verify your email address for Issue Reminder</Preview>
        <Container className="bg-white mx-auto py-5 pb-12 px-0 max-w-[580px] rounded-[8px] mt-8 shadow-sm">
          {/* Logo & Header */}
          <Section className="px-8 pt-6 pb-2 text-center">
            <Img
              src={`${baseUrl}/static/issue-reminder-logo.png`}
              width="48"
              height="48"
              alt="Issue Reminder"
              className="mx-auto"
            />
            <Heading className="text-[24px] font-bold text-center text-[#7c3aed] mt-4 mb-0">
              Issue Reminder
            </Heading>
            <Text className="text-[13px] text-[#9ca3af] mt-1 mb-0">
              Track &amp; manage your issues effortlessly
            </Text>
          </Section>

          {/* Main Content */}
          <Section className="px-8">
            <Text className="text-[16px] leading-[26px] text-[#374151]">
              Hi {userName},
            </Text>
            <Text className="text-[16px] leading-[26px] text-[#374151]">
              Welcome to <strong>Issue Reminder</strong>! To get started
              tracking and managing your issues, please verify your email
              address by clicking the button below.
            </Text>

            {/* Verification Button */}
            <Section className="text-center my-8">
              <Button
                className="bg-[#2563eb] rounded-[6px] text-white text-[16px] font-semibold no-underline text-center block px-6 py-3"
                href={verificationUrl}
              >
                Verify Email Address
              </Button>
            </Section>

            <Text className="text-[14px] leading-[24px] text-[#6b7280]">
              If the button above doesn&apos;t work, copy and paste the
              following URL into your browser:
            </Text>
            <Text className="text-[13px] leading-[22px] text-[#2563eb] break-all bg-[#f3f4f6] p-3 rounded-[4px]">
              <Link href={verificationUrl} className="text-[#2563eb] underline">
                {verificationUrl}
              </Link>
            </Text>

            <Text className="text-[14px] leading-[24px] text-[#6b7280]">
              This verification link will expire in <strong>24 hours</strong>.
              If you did not create an account, you can safely ignore this
              email.
            </Text>
          </Section>

          {/* Footer */}
          <Section className="px-8">
            <Hr className="border-[#e5e7eb] my-6" />
            <Text className="text-[#9ca3af] text-[12px] leading-[20px] text-center m-0">
              This email was sent to verify your account on Issue Reminder.
            </Text>
            <Text className="text-[#9ca3af] text-[12px] leading-[20px] text-center m-0">
              Need help?{" "}
              <Link
                href="mailto:support@issuereminder.dev"
                className="text-[#2563eb] underline"
              >
                Contact Support
              </Link>
            </Text>
            <Text className="text-[#9ca3af] text-[12px] leading-[20px] text-center mt-4 mb-0">
              &copy; {new Date().getFullYear()} Issue Reminder. All rights
              reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

EmailConfirmationTemplate.PreviewProps = {
  userName: "Michael",
  verificationUrl: "https://issuereminder.dev/api/auth/verify?token=example-token-123",
} as EmailConfirmationTemplateProps;

export default EmailConfirmationTemplate;
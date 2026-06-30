"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { resendTokenAction } from "@/lib/resendTokenAction";

const getEmailInboxUrl = (email: string) => {
    if (!email) return null;

    const domain = email.split("@")[1];
    if (domain?.toLowerCase() === "gmail.com") {
        return "https://mail.google.com/";
    }

    return null;
};

export default function PendingPage() {
    const router = useRouter();
    const [email, setEmail] = useState<string>("user@gmail.com");
    const [inboxUrl, setInboxUrl] = useState<string | null>(null);

    // Resend state
    const [isPending, startTransition] = useTransition();
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("pendingRegistrationEmail");
        if (storedEmail) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setEmail(storedEmail);
            setInboxUrl(getEmailInboxUrl(storedEmail));
        }
    }, []);

    // Cooldown timer logic
    useEffect(() => {
        if (cooldown > 0) {
            const timerId = setTimeout(() => setCooldown(c => c - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [cooldown]);

    const handleResend = () => {
        if (cooldown > 0 || isPending) return;

        startTransition(async () => {
            const result = await resendTokenAction(email);

            if (result.alreadyVerified) {
                toast.success("Email is already verified");
                router.push("/dashboard");
                return;
            }

            if (result.error) {
                toast.error(result.error);
            } else if (result.success) {
                toast.success("Verification email resent!");
                setCooldown(60); // start 60s cooldown
            }
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-sm border-none">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                        <Mail className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-semibold tracking-tight">Check your email</CardTitle>
                        <CardDescription className="text-base leading-6  text-muted-foreground">
                            We sent a verification link to <span className="font-light tracking-tight text-sm"> {email}</span>
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {inboxUrl ? (
                        <Button className="w-full rounded-lg h-11 font-semibold" asChild>
                            <Link href={inboxUrl} target="_blank" rel="noopener noreferrer">
                                Open Gmail
                            </Link>
                        </Button>
                    ) : (
                        <Button className="w-full rounded-lg h-11 font-semibold" asChild>
                            <Link href="/signup">Verify Email</Link>
                        </Button>
                    )}
                </CardContent>
                <CardDescription className="flex justify-center tracking-tight items-center pb-6">
                    <span>
                        Didn&apos;t receive the email?{" "}
                        <button
                            onClick={handleResend}
                            disabled={isPending || cooldown > 0}
                            className="text-foreground hover:underline disabled:text-muted-foreground disabled:no-underline disabled:cursor-not-allowed inline-flex items-center transition-colors"
                        >
                            {isPending ? (
                                <><Loader2 className="mr-2 h-3 w-3 animate-spin" /> Sending...</>
                            ) : cooldown > 0 ? (
                                `Resend verification link (${cooldown}s)`
                            ) : (
                                "Resend verification link"
                            )}
                        </button>
                    </span>
                </CardDescription>
            </Card>
        </div>
    );
}

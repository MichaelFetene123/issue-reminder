"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const getEmailInboxUrl = (email: string) => {
    if (!email) return null;

    const domain = email.split("@")[1];
    if (domain?.toLowerCase() === "gmail.com") {
        return "https://mail.google.com/";
    }

    return null;
};

export default function PendingPage() {
    const [email, setEmail] = useState<string>("user@gmail.com");
    const [inboxUrl, setInboxUrl] = useState<string | null>(null);

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("pendingRegistrationEmail");
        if (storedEmail) {
            setEmail(storedEmail);
            setInboxUrl(getEmailInboxUrl(storedEmail));
        }
    }, []);

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
                            We sent a verification code to <span className="font-light tracking-tight text-sm"> {email}</span>
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
                            <Link href="/login">Verify Email</Link>
                        </Button>
                    )}
                </CardContent>
                <CardDescription className="flex justify-center tracking-tight items-center pb-6">
                    <span>Didn't receive the email? <Link href="/registration/resend" className="text-foreground hover:underline">Resend code</Link></span>
                </CardDescription>
            </Card>
        </div>
    );
}

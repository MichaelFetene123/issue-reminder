// @/app/registration/confirm/page.tsx
"use client";
import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyTokenAction } from "@/lib/verifyTokenAction";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

function ConfirmRegistrationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [countdown, setCountdown] = useState(3);
    const [progress, setProgress] = useState(100);
    const hasAttempted = useRef(false);

    useEffect(() => {
        if (!token) {
            router.replace("/");
            return;
        }

        if (hasAttempted.current) return;
        hasAttempted.current = true;

        const confirmRegistration = async () => {
            try {
                await verifyTokenAction(token);
                setStatus("success");
            } catch (error) {
                console.error("Confirmation failed:", error);
                setStatus("error");
            }
        };

        confirmRegistration();
    }, [token, router]);

    useEffect(() => {
        if (status === "success") {
            const timeoutId = setTimeout(() => setProgress(0), 50);

            const intervalId = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalId);
                        router.replace("/");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => {
                clearTimeout(timeoutId);
                clearInterval(intervalId);
            };
        }
    }, [status, router]);

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-sm border-none text-center">
                {status === "loading" && (
                    <CardHeader className="space-y-4">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-2xl font-semibold tracking-tight">Verifying Email</CardTitle>
                            <CardDescription className="text-base">
                                Please wait while we securely confirm your registration.
                            </CardDescription>
                        </div>
                    </CardHeader>
                )}

                {status === "success" && (
                    <>
                        <CardHeader className="space-y-4">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                <CheckCircle2 className="h-8 w-8 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <CardTitle className="text-2xl font-semibold tracking-tight">Email Verified!</CardTitle>
                                <CardDescription className="text-base">
                                    Your account is now active. Welcome aboard!
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                                <div 
                                    className="bg-primary h-full rounded-full" 
                                    style={{ width: `${progress}%`, transition: 'width 3s linear' }}
                                ></div>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">Redirecting to dashboard in {countdown}...</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full rounded-lg h-11 font-semibold" asChild>
                                <Link href="/">Go to Home Now</Link>
                            </Button>
                        </CardFooter>
                    </>
                )}

                {status === "error" && (
                    <>
                        <CardHeader className="space-y-4">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                                <XCircle className="h-8 w-8 text-destructive" />
                            </div>
                            <div className="space-y-2">
                                <CardTitle className="text-2xl font-semibold tracking-tight">Verification Failed</CardTitle>
                                <CardDescription className="text-base">
                                    The link may be invalid or expired. Please request a new verification email.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardFooter>
                            <Button variant="secondary" className="w-full rounded-lg h-11 font-semibold" asChild>
                                <Link href="/">Return to Home</Link>
                            </Button>
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    );
}

export default function ConfirmRegistrationPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        }>
            <ConfirmRegistrationContent />
        </Suspense>
    );
}
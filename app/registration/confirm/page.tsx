// @/app/registration/confirm/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyTokenAction } from "@/actions/verifyTokenAction";
import Link from "next/link";

export default function ConfirmRegistrationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [countdown, setCountdown] = useState(3);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!token) {
            router.replace("/");
            return;
        }

        const confirmRegistration = async () => {
            try {
                // Call the server action which safely interacts with the DB and sets the session
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
            // Start the progress bar animation
            const timeoutId = setTimeout(() => setProgress(0), 50);

            // Update the countdown text and handle redirect
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
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
            <div className="p-8 text-center bg-card border border-border rounded-2xl shadow-xl max-w-md w-full transition-all duration-300">
                {status === "loading" && (
                    <div className="flex flex-col items-center">
                        <div className="relative w-16 h-16 mb-6">
                            <div className="absolute inset-0 rounded-full border-4 border-border"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Verifying Email...</h2>
                        <p className="text-muted-foreground">Please wait while we securely confirm your registration.</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-primary/20">
                            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Email Verified Successfully!</h2>
                        <p className="text-muted-foreground mb-8">Your account is now active. Welcome aboard!</p>
                        
                        <div className="w-full bg-secondary rounded-full h-2 mb-6 overflow-hidden">
                            <div 
                                className="bg-primary h-full rounded-full" 
                                style={{ width: `${progress}%`, transition: 'width 3s linear' }}
                            ></div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-8 font-medium">Redirecting to dashboard in {countdown}...</p>
                        
                        <Link 
                            href="/" 
                            className="w-full inline-flex justify-center items-center px-6 py-3.5 border border-transparent text-base font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                            Go to Home Now
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-destructive/20">
                            <svg className="w-10 h-10 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Verification Failed</h2>
                        <p className="text-muted-foreground mb-8">The link may be invalid or expired. Please request a new verification email.</p>
                        
                        <Link 
                            href="/" 
                            className="w-full inline-flex justify-center items-center px-6 py-3.5 border border-transparent text-base font-medium rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                            Return to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
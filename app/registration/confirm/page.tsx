// @/app/registration/confirm/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyTokenAction } from "@/lib/actions/verifyTokenAction";

export default function ConfirmRegistrationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState("Confirming your registration...");

    useEffect(() => {
        if (!token) {
            router.replace("/");
            return;
        }

        const confirmRegistration = async () => {
            try {
                // Call the server action which safely interacts with the DB and sets the session
                await verifyTokenAction(token);
                setStatus("Registration confirmed! Logging you in...");
                
                setTimeout(() => {
                    router.replace("/"); 
                }, 1500);
            } catch (error) {
                console.error("Confirmation failed:", error);
                setStatus("Confirmation failed. The link may be invalid or expired.");
            }
        };

        confirmRegistration();
    }, [token, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="p-8 text-center border rounded shadow-sm">
                <p className="text-lg font-medium">{status}</p>
            </div>
        </div>
    );
}
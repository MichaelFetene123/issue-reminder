import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default async function PendingPage() {
    const params = useParams()
    console.log('params:', params)
    return (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>
                    {/* icon */}
                    <Mail size={40} className="mx-auto mb-4 text-muted-foreground" />
                    <h1 className="mb-2  font-semibold tracking-tight text-xl md:text-2xl">
                        Verfiy your email
                    </h1>
                </CardTitle>
                <CardDescription>
                    <p className=" mb-10 text-center text-xs leading-6 md:mb-20 md: md:leading-10">
                        Please check your email to confirm your subscription.
                    </p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/login" className="text-primary hover:text-primary/80 transition-colors" >Verify Email</Link>
            </CardContent>
            <CardFooter>
                <p className="mb-10 text-center text-xs leading-6 md:mb-20 md: md:leading-10">
                    Didn't receive the email?
                    <Link href="/registration/resend" className="text-primary hover:text-primary/80 transition-colors" >Resend</Link>
                </p>
            </CardFooter>
        </Card>
    );
}

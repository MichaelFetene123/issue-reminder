"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { House, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { loginAction, type AuthActionResponse } from "@/lib/actions/mutations/auth-mutations";

const initialState: AuthActionResponse = {
  success: false,
  message: '',
  errors: undefined,
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()

  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state?.errors) {
      // Field-level validation errors — shown inline, no toast needed
      return;
    }
    if (state?.error) {
      toast.error(state.error);
    } else if (state?.message) {
      toast.success(state.message);
      // The server action handles revalidatePath('/'), so just push!
      router.push('/dashboard');
    }
  }, [state, router]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center relative">
          <Link href="/" className="absolute left-6 top-6 text-muted-foreground hover:text-primary transition-colors">
            <House className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Link>
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <p className="text-sm text-muted-foreground">
            Login to your account
          </p>
        </CardHeader>
        <CardContent>
          <form action={formAction} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  aria-invalid={!!state?.errors?.email}
                />
                {state?.errors?.email && <FieldError>{state.errors.email[0]}</FieldError>}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  required 
                  aria-invalid={!!state?.errors?.password}
                />
                {state?.errors?.password && <FieldError>{state.errors.password[0]}</FieldError>}
              </Field>
              <Field>
                <Button disabled={isPending} type="submit">
                  {isPending ? <div className="flex justify-center items-center gap-2"><Loader2 className="animate-spin w-5 h-5" /> Logging in...</div> : "Login"}
                </Button>
                <Button variant="outline" type="button" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link href="/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

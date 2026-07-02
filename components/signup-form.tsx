"use client"
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
import { House, Loader2 } from "lucide-react"
import Link from "next/link";

import { useActionState, useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { signupAction, type AuthActionResponse } from "@/lib/actions/mutations/auth-mutations"
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const initialState: AuthActionResponse = {
  success: false,
  message: '',
  errors: undefined,
}

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter()

  const [state, formAction, isPending] = useActionState(signupAction, initialState);
  const [googlePending, setGooglePending] = useState(false)
  const [clientError, setClientError] = useState<string>("");
  const handledState = useRef(state)

  useEffect(() => {
    if (handledState.current === state) return
    handledState.current = state

    if (state?.errors) {
      // Field-level validation errors — shown inline, no toast needed
      return;
    }
    if (state?.error) {
      toast.error(state.error);
    } else if (state?.message) {
      toast.success(state.message);
      if (state.user?.email) {
        sessionStorage.setItem("pendingRegistrationEmail", state.user.email);
      }
      router.push('/registration/pending');
    }
  }, [state, router]);

  const onSubmit = (formData: FormData) => {
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setClientError("Passwords do not match.");
      return; // Stop the form from submitting to the server!
    }

    setClientError("");
    formAction(formData);
  };

  return (
    <Card {...props}>
      <CardHeader className="text-center relative">
        <Link href="/" className="absolute left-6 top-6 text-muted-foreground hover:text-primary transition-colors">
          <House className="h-5 w-5" />
          <span className="sr-only">Home</span>
        </Link>
        <CardTitle className="text-2xl font-bold">Create account</CardTitle>
        <p className="text-sm text-muted-foreground">
          Create An your account
        </p>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} noValidate>
          <FieldGroup>
            {state?.message && state.success && (
              <div className="rounded-md bg-primary/15 p-3 text-sm font-medium text-primary">
                {state.message}
              </div>
            )}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                name="email"
                aria-invalid={!!state?.errors?.email}
              />
              {state?.errors?.email && <FieldError>{state.errors.email[0]}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                required
                name="password"
                aria-invalid={!!state?.errors?.password}
              />
              <FieldDescription>
                Min. 8 chars at least one special character.
              </FieldDescription>
              {state?.errors?.password && <FieldError>{state.errors.password[0]}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input 
                id="confirm-password" 
                type="password" 
                name="confirmPassword"
                required 
                aria-invalid={!!clientError}
              />
    
              {clientError && <FieldError>{clientError}</FieldError>}
            </Field>
            <FieldGroup>
              <Field>
                <Button disabled={isPending} type="submit">{isPending ? <div className="flex justify-center items-center gap-2"><Loader2 className="animate-spin w-5 h-5" /> Creating Account...</div>: "Create Account"}</Button>
                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center gap-2"
                  disabled={googlePending}
                  onClick={() => {
                    setGooglePending(true)
                    signIn("google", { callbackUrl: "/dashboard" })
                  }}
                >
                  {googlePending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )}
                  {googlePending ? "Redirecting…" : "Sign up with Google"}
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/signin">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

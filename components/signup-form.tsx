"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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

import { useActionState, useState, useEffect } from "react"
import { toast } from "sonner"
import { signupAction, type AuthActionResponse } from "@/lib/actions/mutations/auth-mutations"
import { useRouter } from "next/navigation";

const initialState: AuthActionResponse = {
  success: false,
  message: '',
  errors: undefined,
}

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter()

  const [state, formAction, isPending] = useActionState(signupAction, initialState);
  const [clientError, setClientError] = useState<string>("");

  useEffect(() => {
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
                <Button variant="outline" type="button">
                  Sign up with Google
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

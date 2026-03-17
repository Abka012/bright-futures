import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, signInDemo } = useAuth();
  const navigate = useNavigate();

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirmPassword: "", fullName: "" },
  });

  const onSignIn = async (data: SignInFormData) => {
    setIsLoading(true);
    setError(null);
    const { error } = await signIn(data.email, data.password);
    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      navigate("/app");
    }
  };

  const onSignUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError(null);
    const { error } = await signUp(data.email, data.password, data.fullName);
    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      setError("Check your email to confirm your account!");
      setIsLoading(false);
      setIsSignUp(false);
    }
  };

  const onDemoLogin = () => {
    signInDemo();
    navigate("/app");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Bright Futures</CardTitle>
          <CardDescription>
            {isSignUp ? "Create an account to get started" : "Sign in to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isSignUp ? signUpForm.handleSubmit(onSignUp) : signInForm.handleSubmit(onSignIn)} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  {...signUpForm.register("fullName")}
                />
                {signUpForm.formState.errors.fullName && (
                  <p className="text-sm text-red-500">{signUpForm.formState.errors.fullName.message}</p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...(isSignUp ? signUpForm.register("email") : signInForm.register("email"))}
              />
              {(isSignUp ? signUpForm : signInForm).formState.errors.email && (
                <p className="text-sm text-red-500">
                  {(isSignUp ? signUpForm : signInForm).formState.errors.email?.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...(isSignUp ? signUpForm.register("password") : signInForm.register("password"))}
              />
              {(isSignUp ? signUpForm : signInForm).formState.errors.password && (
                <p className="text-sm text-red-500">
                  {(isSignUp ? signUpForm : signInForm).formState.errors.password?.message}
                </p>
              )}
            </div>
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...signUpForm.register("confirmPassword")}
                />
                {signUpForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">{signUpForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
            )}
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>
          {!isSignUp && (
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
            </div>
          )}
          {!isSignUp && (
            <Button type="button" variant="outline" className="w-full" onClick={onDemoLogin} disabled={isLoading}>
              <User className="mr-2 h-4 w-4" />
              Try Demo
            </Button>
          )}
          <div className="mt-4 text-center text-sm">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button type="button" className="text-blue-600 hover:underline" onClick={() => setIsSignUp(false)}>
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button type="button" className="text-blue-600 hover:underline" onClick={() => setIsSignUp(true)}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
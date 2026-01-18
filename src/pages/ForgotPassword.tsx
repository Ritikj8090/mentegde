import type React from "react";
import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // This is where you would make an API call to your backend
      // For demo purposes, we'll simulate a successful request
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitted(true);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-muted/40 p-4">
      {isSubmitted ? (
        <Alert className=" w-full max-w-lg">
          <Mail className="h-4 w-4" />
          <AlertTitle>Check your email</AlertTitle>
          <AlertDescription>
            <span>
              We&apos;ve sent a password reset link to{" "}
              <span className="font-medium">{email}</span>. Please check your
              inbox and follow the instructions to reset your password.
            </span>
            <div className=" w-full flex justify-center items-center">
              <Button asChild variant="link" className=" mt-2 mr-5">
                <Link to="/login">Back to login</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Forgot password
            </CardTitle>
            <CardDescription>
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-sm text-destructive">{error}</div>}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 mt-3">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send reset link"}
              </Button>
              <Button asChild variant="link" className="px-0">
                <Link to="/login">Back to login</Link>
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* <div className="w-full max-w-lg">
        {isSubmitted ? (
          <Alert className="bg-background w-full">
            <Mail className="h-4 w-4" />
            <AlertTitle>Check your email</AlertTitle>
            <AlertDescription className=" inline">
              We&apos;ve sent a password reset link to{" "}
              <span className="font-medium">{email}</span>. Please check your
              inbox and follow the instructions to reset your password.
            </AlertDescription>
            <div className="mt-4 w-full">
              <Button asChild variant="link" className="">
                <Link to="/login">Back to login</Link>
              </Button>
            </div>
          </Alert>
        ) : (
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                Forgot password
              </CardTitle>
              <CardDescription>
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <div className="text-sm text-destructive">{error}</div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 mt-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send reset link"}
                </Button>
                <Button asChild variant="link" className="px-0">
                  <Link to="/login">Back to login</Link>
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div> */}
    </div>
  );
}

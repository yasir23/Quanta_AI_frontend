'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { useAuth } from "@/lib/auth";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" {...props}>
    <path
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .333 5.393.333 12.16s5.534 12.16 12.147 12.16c3.267 0 5.6-1.087 7.4-2.867 1.933-1.8 2.8-4.4 2.8-7.28-.002-1.227-.107-2.333-.333-3.333H12.48z"
      fill="currentColor"
    />
  </svg>
);

export default function SignInPage() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4 fade-in">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl shadow-primary/10">
          <CardHeader className="text-center">
            <Link href="/" className="mx-auto mb-4 flex justify-center">
              <Logo />
            </Link>
            <CardTitle className="text-2xl">Welcome to Quanta</CardTitle>
            <CardDescription>Sign in to see what the world is thinking.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full h-12 text-base" onClick={signInWithGoogle}>
              <GoogleIcon className="mr-3 h-5 w-5" />
              Sign in with Google
            </Button>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{' '}
              <Link href="#" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
            <p className="text-center text-sm text-muted-foreground italic">
             “Quanta reveals patterns, not noise.”
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

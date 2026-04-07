import { SignInForm } from "@/components";
import Logo from "@/components/ui/logo";
import { APP_NAME } from "@/utils/constants/site";
import Link from "next/link";

type Props = {
    searchParams: Record<string, string | string[] | undefined>;
};

const SignInPage = ({ searchParams }: Props) => {
    const authError = typeof searchParams.error === "string" ? searchParams.error : null;

    return (
        <div className="flex flex-col items-start max-w-sm mx-auto h-dvh overflow-hidden pt-4 md:pt-20">
            <div className="flex items-center w-full py-8 border-b border-border/80">
                <Link href="/#home" className="flex items-center gap-x-2">
                    <Logo className="h-6 w-6" />
                    <h1 className="text-lg font-medium">
                        {APP_NAME}
                    </h1>
                </Link>
            </div>

            {authError === "auth" ? (
                <p className="text-sm text-destructive mt-4" role="alert">
                    Sign-in link expired or is invalid. Try again or request a new email.
                </p>
            ) : null}

            <SignInForm />

            <div className="flex flex-col items-start w-full">
                <p className="text-sm text-muted-foreground">
                    By signing in, you agree to our{" "}
                    <Link href="/terms" className="text-primary">
                        Terms of Service{" "}
                    </Link>
                    and{" "}
                    <Link href="/privacy" className="text-primary">
                        Privacy Policy
                    </Link>
                </p>
            </div>
            <div className="flex items-start mt-auto border-t border-border/80 py-6 w-full">
                <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/sign-up" className="text-primary">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
};

export default SignInPage

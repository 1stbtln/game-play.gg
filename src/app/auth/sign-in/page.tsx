import { SignInForm } from "@/components";
import Logo from "@/components/ui/logo";
import { APP_NAME } from "@/utils/constants/site";
import Link from "next/link";

type Props = {
    searchParams: Record<string, string | string[] | undefined>;
};

const SignInPage = ({ searchParams }: Props) => {
    const authError = typeof searchParams.error === "string" ? searchParams.error : null;
    const notice = typeof searchParams.notice === "string" ? searchParams.notice : null;

    return (
        <div className="min-h-dvh w-full overflow-y-auto px-4 py-4 sm:px-6 md:py-8">
            <div className="mx-auto flex w-full max-w-md flex-col">
                <div className="flex items-center w-full py-6 border-b border-border/80 md:py-8">
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

            {notice === "check_email" ? (
                <p className="text-sm text-muted-foreground mt-4" role="status">
                    Account created. Open the confirmation link we emailed you, then sign in below.
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
                <div className="flex items-start mt-8 border-t border-border/80 py-6 w-full md:mt-auto">
                    <p className="text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/sign-up" className="text-primary">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
};

export default SignInPage

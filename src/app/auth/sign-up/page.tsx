import { SignUpForm } from "@/components";
import Logo from "@/components/ui/logo";
import { APP_NAME } from "@/utils/constants/site";
import Link from "next/link";

const SignUpPage = () => {
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

                <SignUpForm />

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
                        Already have an account?{" "}
                        <Link href="/auth/sign-in" className="text-primary">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
};

export default SignUpPage

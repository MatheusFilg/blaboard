import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";
import { Button } from "./ui/button";

export default function SignUpForm({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  const router = useRouter();
  const { isPending } = authClient.useSession();

  const handleSocialSignIn = async (provider: "google" | "github") => {
    await authClient.signIn.social(
      {
        provider,
        callbackURL: `${window.location.origin}/dashboard`,
      },
      {
        onSuccess: () => {
          toast.success("Sign in successful");
        },
        onError: (error) => {
          toast.error(error.error.message || error.error.statusText);
        },
      },
    );
  };

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Create Account</h1>

      <div className="space-y-4">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => handleSocialSignIn("google")}
        >
          Continue with Google
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => handleSocialSignIn("github")}
        >
          Continue with GitHub
        </Button>
      </div>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={onSwitchToSignIn}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Already have an account? Sign In
        </Button>
      </div>
    </div>
  );
}

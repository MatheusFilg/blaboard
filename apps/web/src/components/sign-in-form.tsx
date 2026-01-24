"use client";

import { Github } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";

export default function SignInForm() {
	const { isPending } = authClient.useSession();

	const handleSocialSignIn = async (provider: "google" | "github") => {
		await authClient.signIn.social(
			{
				provider,
				callbackURL: `${window.location.origin}/dashboard`,
			},
			{
				onSuccess: () => {
					toast.success("Login realizado com sucesso");
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
		<div className="flex w-[400px] flex-col items-center gap-8">
			{/* Header */}
			<div className="flex w-full flex-col items-center gap-2">
				<h1 className="font-bold text-2xl text-white">Bem-vindo de volta</h1>
				<p className="text-zinc-400">Entre com sua conta para continuar</p>
			</div>

			{/* Social Buttons */}
			<div className="flex w-full flex-col gap-3">
				<button
					type="button"
					onClick={() => handleSocialSignIn("google")}
					className="flex h-[52px] w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-800 font-medium text-white transition-colors hover:bg-zinc-700"
				>
					<span className="font-bold text-[#4285F4] text-xl">G</span>
					<span>Continuar com Google</span>
				</button>

				<button
					type="button"
					onClick={() => handleSocialSignIn("github")}
					className="flex h-[52px] w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-800 font-medium text-white transition-colors hover:bg-zinc-700"
				>
					<Github className="h-5 w-5" />
					<span>Continuar com GitHub</span>
				</button>
			</div>

			{/* Footer */}
			<div className="flex items-center gap-1.5">
				<span className="text-sm text-zinc-400">Não tem uma conta?</span>
				<Link
					href="/register"
					className="font-semibold text-indigo-500 text-sm hover:text-indigo-400"
				>
					Criar conta
				</Link>
			</div>
		</div>
	);
}

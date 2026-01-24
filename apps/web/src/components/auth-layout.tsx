"use client";

import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

interface AuthLayoutProps {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div className="relative flex min-h-screen bg-background">
			{/* Theme Toggle */}
			<div className="absolute top-6 right-6">
				<AnimatedThemeToggler className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent" />
			</div>

			{/* Content */}
			<div className="flex flex-1 flex-col items-center justify-center p-8">
				{children}
			</div>
		</div>
	);
}

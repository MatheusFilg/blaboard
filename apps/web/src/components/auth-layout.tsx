interface AuthLayoutProps {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div className="flex min-h-screen">
			{/* Left Panel */}
			<div className="hidden w-[720px] flex-col items-center justify-center bg-zinc-900 p-12 lg:flex">
				<div className="flex w-[400px] flex-col items-center gap-6">
					{/* Logo */}
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500" />
						<span className="font-bold text-3xl text-white">Blaboard</span>
					</div>
					{/* Tagline */}
					<p className="text-center text-lg text-zinc-400 leading-relaxed">
						Organize suas tarefas e projetos
						<br />
						de forma simples e eficiente
					</p>
				</div>
			</div>

			{/* Right Panel */}
			<div className="flex flex-1 flex-col items-center justify-center p-12">
				{children}
			</div>
		</div>
	);
}

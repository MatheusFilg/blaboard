"use client";

import {
	ChevronsUpDown,
	LayoutGrid,
	List,
	Settings,
	Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
	id: string;
	name: string;
	color: string;
	active?: boolean;
}

interface NavItem {
	icon: React.ReactNode;
	label: string;
	active?: boolean;
}

interface SidebarProps {
	className?: string;
}

const navItems: NavItem[] = [
	{ icon: <LayoutGrid className="size-5" />, label: "Board", active: true },
	{ icon: <List className="size-5" />, label: "Tasks" },
	{ icon: <Users className="size-5" />, label: "Team" },
	{ icon: <Settings className="size-5" />, label: "Settings" },
];

const projects: Project[] = [
	{ id: "1", name: "BeroBoard App", color: "#6366F1", active: true },
	{ id: "2", name: "Marketing Site", color: "#E85A4F" },
	{ id: "3", name: "Mobile App", color: "#32D583" },
];

export function Sidebar({ className }: SidebarProps) {
	return (
		<aside
			className={cn(
				"flex h-screen w-60 shrink-0 flex-col bg-[#1A1A1E] py-6",
				className,
			)}
		>
			{/* Top section */}
			<div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5">
				{/* Logo */}
				<div className="flex items-center gap-3">
					<div className="flex size-8 items-center justify-center rounded-lg bg-[#6366F1]">
						<span className="text-sm font-bold text-white">B</span>
					</div>
					<span className="text-lg font-bold text-[#FAFAF9]">BeroBoard</span>
				</div>

				{/* Org Selector */}
				<button
					type="button"
					className="flex h-11 items-center justify-between rounded-lg border border-[#2A2A2E] bg-[#16161A] px-3"
				>
					<div className="flex items-center gap-2.5">
						<div className="flex size-7 items-center justify-center rounded-md bg-[#6366F1]">
							<span className="text-[13px] font-semibold text-white">A</span>
						</div>
						<span className="text-sm font-medium text-[#FAFAF9]">Acme Inc</span>
					</div>
					<ChevronsUpDown className="size-4 text-[#4A4A50]" />
				</button>

				{/* Navigation */}
				<nav className="flex flex-col gap-1">
					{navItems.map((item) => (
						<button
							type="button"
							key={item.label}
							className={cn(
								"flex items-center gap-3 rounded-lg px-5 py-2.5",
								item.active
									? "bg-[#6366F1] text-[#FAFAF9]"
									: "text-[#6B6B70] hover:bg-[#16161A]",
							)}
						>
							{item.icon}
							<span
								className={cn(
									"text-sm",
									item.active ? "font-semibold" : "font-medium",
								)}
							>
								{item.label}
							</span>
						</button>
					))}
				</nav>

				{/* Projects */}
				<div className="flex flex-col gap-2 px-5">
					<span className="text-xs font-semibold text-[#4A4A50]">Projects</span>
					{projects.map((project) => (
						<button
							type="button"
							key={project.id}
							className="flex items-center gap-2.5 py-2"
						>
							<div
								className="size-2 rounded"
								style={{ backgroundColor: project.color }}
							/>
							<span
								className={cn(
									"text-[13px] font-medium",
									project.active ? "text-[#FAFAF9]" : "text-[#6B6B70]",
								)}
							>
								{project.name}
							</span>
						</button>
					))}
				</div>
			</div>

			{/* User section */}
			<div className="flex shrink-0 items-center gap-3 px-5 pt-4">
				<div className="flex size-9 items-center justify-center rounded-full bg-[#6366F1]">
					<span className="text-[13px] font-semibold text-white">JS</span>
				</div>
				<div className="flex flex-1 flex-col gap-0.5">
					<span className="text-sm font-medium text-[#FAFAF9]">John Smith</span>
					<span className="text-xs text-[#6B6B70]">john@company.com</span>
				</div>
			</div>
		</aside>
	);
}

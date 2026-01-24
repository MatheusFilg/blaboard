"use client";

import { Sidebar } from "./sidebar";
import { BoardHeader } from "./board-header";
import { KanbanColumn } from "./kanban-column";
import type { TaskCardProps } from "./task-card";

// Sample data based on the Pencil design
const backlogTasks: TaskCardProps[] = [
	{
		title: "Design new dashboard",
		description: "Create wireframes and mockups for the analytics dashboard",
		priority: "medium",
		label: { text: "Design", color: "#6366F1" },
		assignee: { initials: "AM", color: "#E85A4F" },
	},
	{
		title: "Update documentation",
		description: "Review and update API documentation for v2.0",
		priority: "low",
		label: { text: "Docs", color: "#32D583" },
		assignee: { initials: "JS", color: "#6366F1" },
	},
	{
		title: "Research user feedback",
		description: "Analyze user interviews and create summary report",
		priority: "none",
		label: { text: "Research", color: "#E85A4F" },
		assignee: { initials: "LK", color: "#32D583", textColor: "#0B0B0E" },
	},
];

const inProgressTasks: TaskCardProps[] = [
	{
		title: "Implement authentication",
		description: "Add OAuth 2.0 login flow with Google and GitHub",
		priority: "high",
	},
	{
		title: "Implement authentication",
		description: "Add OAuth 2.0 login flow with Google and GitHub",
		priority: "high",
		label: { text: "Backend", color: "#6366F1" },
		assignee: { initials: "AM", color: "#E85A4F" },
	},
	{
		title: "Build notification system",
		description: "Real-time notifications with WebSocket integration",
		priority: "medium",
		label: { text: "Backend", color: "#6366F1" },
		assignee: { initials: "JS", color: "#6366F1" },
	},
	{
		title: "Create API endpoints",
		description: "REST API for task CRUD operations",
		priority: "low",
		label: { text: "Backend", color: "#6366F1" },
		assignee: { initials: "LK", color: "#32D583", textColor: "#0B0B0E" },
	},
	{
		title: "Fix drag and drop bug",
		description: "Cards not reordering correctly on mobile",
		priority: "high",
		label: { text: "Bug", color: "#E85A4F" },
		assignee: { initials: "AM", color: "#E85A4F" },
	},
];

const reviewTasks: TaskCardProps[] = [
	{
		title: "Review PR #142",
		description: "Code review for new search feature implementation",
		priority: "medium",
		label: { text: "Review", color: "#FFB547" },
		assignee: { initials: "JS", color: "#6366F1" },
	},
	{
		title: "Test mobile responsiveness",
		description: "QA testing on iOS and Android devices",
		priority: "low",
		label: { text: "QA", color: "#32D583" },
		assignee: { initials: "LK", color: "#32D583", textColor: "#0B0B0E" },
	},
	{
		title: "Security audit",
		description: "Review authentication flow for vulnerabilities",
		priority: "high",
		label: { text: "Security", color: "#E85A4F" },
		assignee: { initials: "AM", color: "#E85A4F" },
	},
];

const doneTasks: TaskCardProps[] = [
	{
		title: "Setup CI/CD pipeline",
		description: "Configure GitHub Actions for automated deployment",
		completed: true,
		label: { text: "DevOps", color: "#32D583" },
		assignee: { initials: "JS", color: "#6366F1" },
	},
	{
		title: "Database schema design",
		description: "Design and implement PostgreSQL schema",
		completed: true,
		label: { text: "Backend", color: "#6366F1" },
		assignee: { initials: "LK", color: "#32D583", textColor: "#0B0B0E" },
	},
];

export function TaskBoard() {
	return (
		<div className="flex h-screen overflow-hidden bg-[#0B0B0E]">
			<Sidebar />

			{/* Main Content */}
			<main className="flex flex-1 flex-col gap-6 overflow-hidden p-6">
				<BoardHeader
					title="Project Overview"
					subtitle="12 tasks · 4 team members"
				/>

				{/* Board Area */}
				<div className="flex flex-1 gap-4 overflow-x-auto">
					<KanbanColumn
						title="Backlog"
						count={3}
						tasks={backlogTasks}
					/>
					<KanbanColumn
						title="In Progress"
						count={5}
						tasks={inProgressTasks}
					/>
					<KanbanColumn
						title="Review"
						count={3}
						tasks={reviewTasks}
					/>
					<KanbanColumn
						title="Done"
						count={2}
						tasks={doneTasks}
					/>
				</div>
			</main>
		</div>
	);
}

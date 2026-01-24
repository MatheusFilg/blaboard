"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface AddColumnProps {
	onAdd: (name: string) => void;
	isLoading?: boolean;
}

export function AddColumn({ onAdd, isLoading }: AddColumnProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState("");

	const handleSubmit = () => {
		if (!name.trim()) return;
		onAdd(name.trim());
		setName("");
		setIsEditing(false);
	};

	const handleCancel = () => {
		setName("");
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSubmit();
		} else if (e.key === "Escape") {
			handleCancel();
		}
	};

	if (isEditing) {
		return (
			<div className="flex w-72 min-w-72 flex-col gap-2">
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Column name..."
					autoFocus
					className="h-10 rounded-lg border border-[#2A2A2E] bg-[#16161A] px-3 text-sm text-[#FAFAF9] placeholder:text-[#4A4A50] focus:border-[#6366F1] focus:outline-none"
				/>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={handleSubmit}
						disabled={!name.trim() || isLoading}
						className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#6366F1] text-sm font-medium text-white transition-colors hover:bg-[#5558E3] disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isLoading ? "Adding..." : "Add column"}
					</button>
					<button
						type="button"
						onClick={handleCancel}
						className="flex size-9 items-center justify-center rounded-lg border border-[#2A2A2E] text-[#6B6B70] transition-colors hover:bg-[#16161A] hover:text-[#FAFAF9]"
					>
						<X className="size-4" />
					</button>
				</div>
			</div>
		);
	}

	return (
		<button
			type="button"
			onClick={() => setIsEditing(true)}
			className="flex h-10 w-72 min-w-72 items-center justify-center gap-2 rounded-lg border border-dashed border-[#2A2A2E] text-[#6B6B70] transition-colors hover:border-[#3A3A3E] hover:bg-[#16161A] hover:text-[#FAFAF9]"
		>
			<Plus className="size-4" />
			<span className="text-sm font-medium">Add column</span>
		</button>
	);
}

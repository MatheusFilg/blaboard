"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type {
	Column,
	Task,
	CreateTaskInput,
	UpdateTaskInput,
	MoveTaskInput,
} from "@/lib/types";

interface UseBoardOptions {
	organizationId: string;
}

interface UseBoardReturn {
	columns: Column[];
	isLoading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
	createTask: (input: CreateTaskInput) => Promise<Task | null>;
	updateTask: (id: string, input: UpdateTaskInput) => Promise<Task | null>;
	deleteTask: (id: string) => Promise<boolean>;
	moveTask: (input: MoveTaskInput) => Promise<Task | null>;
}

export function useBoard({ organizationId }: UseBoardOptions): UseBoardReturn {
	const [columns, setColumns] = useState<Column[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchColumns = useCallback(async () => {
		if (!organizationId) return;

		setIsLoading(true);
		setError(null);

		try {
			const { data, error: apiError } = await api.columns.get({
				query: { organizationId },
			});

			if (apiError) {
				setError("Failed to fetch columns");
				return;
			}

			setColumns((data as Column[]) ?? []);
		} catch (err) {
			setError("Failed to fetch columns");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	}, [organizationId]);

	useEffect(() => {
		fetchColumns();
	}, [fetchColumns]);

	const createTask = useCallback(
		async (input: CreateTaskInput): Promise<Task | null> => {
			try {
				const { data, error: apiError } = await api.tasks.post(input);

				if (apiError) {
					console.error("Failed to create task:", apiError);
					return null;
				}

				await fetchColumns();
				return data as Task;
			} catch (err) {
				console.error("Failed to create task:", err);
				return null;
			}
		},
		[fetchColumns],
	);

	const updateTask = useCallback(
		async (id: string, input: UpdateTaskInput): Promise<Task | null> => {
			try {
				const { data, error: apiError } = await api.tasks({ id }).patch(input);

				if (apiError) {
					console.error("Failed to update task:", apiError);
					return null;
				}

				await fetchColumns();
				return data as Task;
			} catch (err) {
				console.error("Failed to update task:", err);
				return null;
			}
		},
		[fetchColumns],
	);

	const deleteTask = useCallback(
		async (id: string): Promise<boolean> => {
			try {
				const { error: apiError } = await api.tasks({ id }).delete();

				if (apiError) {
					console.error("Failed to delete task:", apiError);
					return false;
				}

				await fetchColumns();
				return true;
			} catch (err) {
				console.error("Failed to delete task:", err);
				return false;
			}
		},
		[fetchColumns],
	);

	const moveTask = useCallback(
		async (input: MoveTaskInput): Promise<Task | null> => {
			try {
				const { data, error: apiError } = await api.tasks.move.post(input);

				if (apiError) {
					console.error("Failed to move task:", apiError);
					return null;
				}

				await fetchColumns();
				return data as Task;
			} catch (err) {
				console.error("Failed to move task:", err);
				return null;
			}
		},
		[fetchColumns],
	);

	return {
		columns,
		isLoading,
		error,
		refetch: fetchColumns,
		createTask,
		updateTask,
		deleteTask,
		moveTask,
	};
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Column, CreateColumnInput, UpdateColumnInput } from "@/lib/types";
import { boardKeys } from "./keys";

export function useCreateColumn(organizationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: CreateColumnInput) => {
			const { data, error } = await api.columns.post(input);

			if (error) {
				throw new Error("Failed to create column");
			}

			return data as Column;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: boardKeys.columns(organizationId),
			});
		},
	});
}

export function useUpdateColumn(organizationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			input,
		}: {
			id: string;
			input: UpdateColumnInput;
		}) => {
			const { data, error } = await api.columns({ id }).patch(input);

			if (error) {
				throw new Error("Failed to update column");
			}

			return data as Column;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: boardKeys.columns(organizationId),
			});
		},
	});
}

export function useDeleteColumn(organizationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.columns({ id }).delete();

			if (error) {
				throw new Error("Failed to delete column");
			}

			return { success: true };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: boardKeys.columns(organizationId),
			});
		},
	});
}

export function useCreateDefaultColumns(organizationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			columns: { name: string; color?: string; isCompleted?: boolean }[],
		) => {
			const results = await Promise.all(
				columns.map((col) =>
					api.columns.post({
						...col,
						organizationId,
					}),
				),
			);

			const errors = results.filter((r) => r.error);
			if (errors.length > 0) {
				throw new Error("Failed to create some columns");
			}

			return results.map((r) => r.data as Column);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: boardKeys.columns(organizationId),
			});
		},
	});
}

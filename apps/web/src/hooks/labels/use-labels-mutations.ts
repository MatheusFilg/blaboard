import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/lib/api";
import type { CreateLabelInput, TaskLabel } from "~/lib/types";
import { labelsKeys } from "./keys";

export function useCreateLabel(organizationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: CreateLabelInput) => {
			const { data, error } = await api.labels.post({
				text: input.text,
				color: input.color,
			});

			if (error) {
				throw new Error("Failed to create task");
			}

			return data as TaskLabel;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: labelsKeys.labels(organizationId),
			});
		},
	});
}

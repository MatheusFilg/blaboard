"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";
import type { TaskLabel } from "~/lib/types";
import { labelsKeys } from "./labels/keys";

export function useLabels(organizationId: string) {
	return useQuery({
		queryKey: labelsKeys.labels(organizationId),
		queryFn: async () => {
			const { data, error } = await api.labels.get();

			if (error) {
				throw new Error("Failed to fetch labels");
			}

			return (data ?? []) as TaskLabel[];
		},
		enabled: !!organizationId,
	});
}

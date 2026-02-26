import { prisma } from "@blaboard/db";
import type { UpdateMilestonesBody } from "./schemas";

export async function updateMilestone(
	organizationId: string,
	input: UpdateMilestonesBody,
	id: string,
) {
	return prisma.milestone.update({
		where: { id, organizationId },
		data: {
			name: input.name,
			description: input.description,
			status: input.status,
			startDate: input.startDate,
			endDate: input.endDate,
			taskIds: input.taskIds,
		},
	});
}

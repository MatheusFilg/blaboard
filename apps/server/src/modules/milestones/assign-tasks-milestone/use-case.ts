import { prisma } from "@blaboard/db";
import type { AssignTasksMilestoneBody } from "./schemas";

export async function assignTasksMilestone(
	milestoneId: string,
	organizationId: string,
	input: AssignTasksMilestoneBody,
) {
	return await prisma.$transaction(async (tx) => {
		await tx.task.updateMany({
			where: {
				id: { in: input.taskIds },
				organizationId,
			},
			data: {
				milestoneId: milestoneId,
			},
		});

		return await tx.milestone.update({
			where: {
				id: milestoneId,
				organizationId,
			},
			data: {
				taskIds: { push: input.taskIds },
			},
		});
	});
}

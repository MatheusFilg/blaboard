import { prisma } from "@blaboard/db";
import type { AssignTasksMilestoneBody } from "./schemas";

export async function assignTasksMilestone(
	milestoneId: string,
	organizationId: string,
	input: AssignTasksMilestoneBody,
) {
	return await prisma.$transaction(async (tx) => {
		const updatedTasks = await tx.task.updateMany({
			where: {
				id: { in: input.taskIds },
				organizationId,
			},
			data: {
				milestoneId,
			},
		});

		await tx.milestone.update({
			where: {
				id: milestoneId,
			},
			data: {
				taskIds: input.taskIds,
			},
		});

		return updatedTasks;
	});
}

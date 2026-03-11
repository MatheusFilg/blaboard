import { prisma } from "@blaboard/db";

export async function deleteTaskUseCase(id: string, organizationId: string) {
	const task = await prisma.task.delete({
		where: { id, organizationId },
		include: { labels: { select: { id: true, text: true, color: true } } },
	});

	if (task?.milestoneId) {
		await prisma.milestone.update({
			where: { id: task.milestoneId },
			data: {
				taskIds: {
					set:
						(
							await prisma.milestone.findUnique({
								where: { id: task.milestoneId },
							})
						)?.taskIds.filter((taskId) => taskId !== id) || [],
				},
			},
		});
	}

	if (task.labelIds.length > 0) {
		for (const labelId of task.labelIds) {
			const label = await prisma.label.findUnique({
				where: {
					id: labelId,
				},
				select: {
					taskIds: true,
				},
			});

			if (label) {
				await prisma.label.update({
					where: { id: labelId },
					data: {
						taskIds: {
							set: label.taskIds.filter((taskId) => taskId !== id),
						},
					},
				});
			}
		}
	}
	return task;
}

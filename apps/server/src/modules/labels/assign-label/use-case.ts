import { prisma } from "@blaboard/db";
import { NotFoundError } from "@/shared/errors/not-found.error";
import { ConflictError } from "@/shared/errors/conflict.error";

export async function assignLabelUseCase(taskId: string, labelId: string) {
	const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new NotFoundError({ resource: "Task", identifier: taskId });
	
  if (task.labelIds.includes(labelId)) {
    throw new ConflictError({message: "This label is already assigned to this task"})
  }

	const label = await prisma.label.findUnique({ where: { id: labelId } });
	if (!label)
		throw new NotFoundError({ resource: "Label", identifier: labelId });

	return await prisma.task.update({
		where: { id: taskId },
		data: { labels: { connect: { id: labelId } } },
		include: { labels: { select: { text: true, color: true } } },
	});
}

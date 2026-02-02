import { prisma } from "@blaboard/db";
import { NotFoundError } from "@/shared/errors/not-found.error";
import { ConflictError } from "@/shared/errors/conflict.error";

export async function removeLabelUseCase(taskId: string, labelId: string) {
	const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new NotFoundError({ resource: "Task", identifier: taskId });
	
  if (!task.labelIds.includes(labelId)) {
		throw new ConflictError({ message: "This label is not assigned to this task" });
	}

	return await prisma.task.update({
		where: { id: taskId },
		data: { labels: { disconnect: { id: labelId } } },
		include: { labels: { select: { id: true, text: true, color: true } } },
	});
}

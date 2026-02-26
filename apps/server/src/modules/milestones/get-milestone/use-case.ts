import { prisma } from "@blaboard/db";
import { NotFoundError } from "@/shared/errors/not-found.error";

export async function getMilestone(id: string, organizationId: string) {
	const milestone = await prisma.milestone.findUnique({
		where: { id, organizationId },
		include: {
			tasks: {
				select: {
					id: true,
					title: true,
				},
			},
		},
	});

	if (!milestone)
		throw new NotFoundError({ resource: "Milestone", identifier: id });
	return milestone;
}

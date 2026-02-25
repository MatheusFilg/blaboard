import { prisma } from "@blaboard/db";

export async function getMilestones(organizationId: string) {
	const milestones = await prisma.milestone.findMany({
		where: {
			organizationId,
		},
		include: {
			tasks: {
				select: {
					id: true,
					title: true,
				},
			},
		},
	});

	return milestones;
}

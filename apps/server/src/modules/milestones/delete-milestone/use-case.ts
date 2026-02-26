import { prisma } from "@blaboard/db";

export async function deleteMilestone(id: string, organizationId: string) {
	return await prisma.milestone.delete({ where: { id, organizationId } });
}

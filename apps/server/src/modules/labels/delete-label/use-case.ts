import { prisma } from "@blaboard/db";

export async function deleteLabelUseCase(id: string) {
	return await prisma.label.delete({
		where: { id },
	});
}

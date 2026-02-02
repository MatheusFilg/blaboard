import { prisma } from "@blaboard/db";
import type { UpdateLabelBodySchema } from "./schema";

export async function updateLabelUseCase(
	id: string,
	input: UpdateLabelBodySchema,
) {
	return prisma.label.update({
		where: {
			id,
		},
		data: {
			text: input.text,
			color: input.color,
		},
	});
}

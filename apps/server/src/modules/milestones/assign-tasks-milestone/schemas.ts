import z from "zod";

export const assignTasksMilestoneParamsSchema = z.object({
	id: z.string().min(1),
});

export const assignTasksMilestoneBodySchema = z.object({
	taskIds: z.array(z.string()).min(1),
});

export type AssignTasksMilestoneBody = z.infer<
	typeof assignTasksMilestoneBodySchema
>;

export const assignTasksMilestoneResponseSchema = z.object({
	count: z.number(),
});

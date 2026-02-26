import { Elysia } from "elysia";
import { createMilestoneRouter } from "./create-milestone/router";
import { getMilestonesRouter } from "./get-milestones/router";

export const milestonesRouter = new Elysia({
	prefix: "/milestones",
	tags: ["milestones"],
}).use([getMilestonesRouter, createMilestoneRouter]);

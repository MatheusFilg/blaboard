import { Elysia } from "elysia";
import { createMilestoneRouter } from "./create-milestone/router";
import { getMilestonesRouter } from "./get-milestones/router";
import { updateMilestonesRouter } from "./update-milestone/router";

export const milestonesRouter = new Elysia({
	prefix: "/milestones",
	tags: ["milestones"],
}).use([getMilestonesRouter, createMilestoneRouter, updateMilestonesRouter]);

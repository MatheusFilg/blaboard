import { z } from "zod";

const hexColorRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;

export const zHexColor = z.string().regex(hexColorRegex, {
	message: "Must be a valid hex color code (e.g., #FF0000 or #F00)",
});

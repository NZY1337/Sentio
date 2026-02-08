import { z } from "zod";
import { BadRequestException, ErrorCode } from "../middlewares/errorMiddleware";
import { 
    SPACE_TYPES, 
    CATEGORIES, 
    DESIGN_THEMES, 
    SIZE_OPTIONS, 
    QUALITY_OPTIONS, 
    OUTPUT_FORMATS 
} from "../../types/types";

export const ProjectValidator = z.object({
    n: z.number().int().min(1).max(10).optional().default(1),
    prompt: z.string().min(1, "Prompt is required"),
    size: z.enum(SIZE_OPTIONS),
    outputFormat: z.enum(OUTPUT_FORMATS),
    quality: z.enum(QUALITY_OPTIONS),
    category: z.enum(CATEGORIES),
    spaceType: z.enum(SPACE_TYPES),
    designTheme: z.enum(DESIGN_THEMES),
}); // Remove strict mode and images field

// Export the inferred type
export type ValidatedProjectData = z.infer<typeof ProjectValidator>;
import { SizeImageProps, QualityFormatProps } from "../../types";

import { ImageEditParams } from "openai/resources/images";


// Constants
export const MODEL_NAME = "gpt-image-1";
export const BACKGROUND_MODE = "auto";
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const sizeMap: Record<SizeImageProps, ImageEditParams['size']> = {
    SIZE_1024x1024: "1024x1024",
    SIZE_1024x1536: "1024x1536",
    SIZE_1536x1024: "1536x1024",
    AUTO: "auto",
};

export const qualityMap: Record<QualityFormatProps, ImageEditParams['quality']> = {
    HIGH: "high",
    MEDIUM: "medium",
    LOW: "low",
};
import { type ImagesResponse, ImageEditParams } from "openai/resources/images";
import { SizeImageProps, QualityFormatProps, CategoryProps, DesignThemeProps, SpaceTypeProps, OutputFormatProps } from "./types";

export interface ImageCostDetails {
    imageCost: number;
    tokenCost: number;
    totalCost: number;
}

export interface ImageProps {
    id: string;
    projectId: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ImageGenerationResponseProps
    extends ImagesResponse,
    ImageEditParams,
    ImageCostDetails { }

export interface ProjectProps {
    id: string;
    userId: string;
    category: CategoryProps;
    spaceType: SpaceTypeProps;
    designTheme: DesignThemeProps;
    prompt: string;
    size: SizeImageProps;
    quality: QualityFormatProps;
    background: string;
    outputFormat: OutputFormatProps;
    createdAt: Date;
    updatedAt: Date;
    images: Express.Multer.File[];
}

export type OpenAIImageResponse = {
    data: Array<{ b64_json: string }>;
    usage: {
        input_tokens: number;
        output_tokens: number;
        total_tokens: number;
        input_tokens_details: {
            image_tokens: number;
            text_tokens: number;
        };
    };
};

// Service interfaces
export interface GenerateImageParams {
    prompt: string;
    n: number;
    size: SizeImageProps;
    quality: QualityFormatProps;
}

export interface EditImageParams {
    prompt: string;
    n: number; 
    size: SizeImageProps;
    quality: QualityFormatProps;
    files: Express.Multer.File[] ;
}
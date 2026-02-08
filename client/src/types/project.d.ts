import type { CategoryProps, DesignThemeProps, SpaceTypeProps, QualityFormatProps, OutputFormatProps, GeneratedImagesCountProps } from "./misc";

// interface ApiResponse<T> {
//     result: T;
// }

interface FetchedImage {
    url: string;
    id: string;
    createdAt: string;
    projectId: string;
}

interface UploadedImage {
    file: File;
    preview: string
}

export type Image = FetchedImage | UploadedImage;

export interface ProjectProps {
    id: string;
    userId: string;
    category: CategoryProps;
    createdAt: string;
    updatedAt: string;
    prompt: string;
    background: string;
    images: (Image | File)[];
    outputFormat: OutputFormatProps;
    quality: QualityFormatProps;
    size: string;
    designTheme: DesignThemeProps;
    spaceType: SpaceTypeProps;
    n: GeneratedImagesCountProps;
}

// EditableProjectProps
export type EditableProjectProps = Omit<ProjectProps, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'background'> &
    Partial<Pick<ProjectProps, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'background'>>;

export interface ImageGenerationResponseProps {
    id: string;
    projectId: string;
    inputTokens: number;
    imageTokens: number;
    textTokens: number;
    outputTokens: number;
    totalTokens: number;
    imageCost: number;
    tokenCost: number;
    totalCost: number;
    createdAt: string;
    updatedAt: string;
}

export type ProjectResponseProps = {
    project: ProjectProps;
    images: ProjectImageProps[];
    imageGenerationResponse: ImageGenerationResponseProps
};

export type GridCell = null | { loading: true; generationId?: string } | ProjectProps


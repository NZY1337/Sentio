import { SizeImageProps, QualityFormatProps, CategoryProps, DesignThemeProps, SpaceTypeProps, OutputFormatProps } from "./types";

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
}
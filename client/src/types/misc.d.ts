import { DesignThemeProps, SpaceTypeProps } from "./builder";

export type LabelValueItemProps = {
    label: string;
    value: string;
};

export type SpaceTypeProps =
    | 'LIVING_ROOM'
    | 'BEDROOM'
    | 'KITCHEN'
    | 'BATHROOM'
    | 'DINING_ROOM'
    | 'HOME_OFFICE'
    | 'KIDS_ROOM'
    | 'HALLWAY_CORRIDOR'
    | 'BALCONY_TERRACE'
    | 'GAME_ROOM'
    | 'STUDY';

export type CategoryProps =
    | 'DESIGN_GENERATOR'
    | 'DESIGN_EDITOR';

export type DesignThemeProps =
    | 'MODERN'
    | 'CONTEMPORARY'
    | 'MINIMALIST'
    | 'SCANDINAVIAN'
    | 'INDUSTRIAL'
    | 'MID_CENTURY_MODERN'
    | 'TRADITIONAL'
    | 'CLASSIC'
    | 'BAROQUE'
    | 'JAPANESE_ZEN'
    | 'WABI_SABI'
    | 'FARMHOUSE'
    | 'RUSTIC'
    | 'BOHEMIAN'
    | 'ART_DECO'
    | 'VICTORIAN'
    | 'COASTAL'
    | 'TROPICAL'
    | 'URBAN'
    | 'MAXIMALIST'
    | 'FUTURISTIC';

export type OutputFormatProps =
    | 'PNG'
    | 'JPEG'
    | 'WEBP';

export type QualityFormatProps =
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH';

export type SizeImageProps =
    | 'SIZE_1024x1024'
    | 'SIZE_1024x1536'
    | 'SIZE_1536x1024'
    | 'AUTO';

export type GeneratedImagesCountProps = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

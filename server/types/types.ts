export const SPACE_TYPES = [
    'LIVING_ROOM',
    'BEDROOM',
    'KITCHEN',
    'BATHROOM',
    'DINING_ROOM',
    'HOME_OFFICE',
    'KIDS_ROOM',
    'HALLWAY_CORRIDOR',
    'BALCONY_TERRACE',
    'GAME_ROOM',
    'STUDY'
] as const;

export const CATEGORIES = [
    'DESIGN_GENERATOR',
    'DESIGN_EDITOR',
] as const;

export const DESIGN_THEMES = [
    'MODERN',
    'CONTEMPORARY',
    'MINIMALIST',
    'SCANDINAVIAN',
    'INDUSTRIAL',
    'MID_CENTURY_MODERN',
    'TRADITIONAL',
    'CLASSIC',
    'BAROQUE',
    'JAPANESE_ZEN',
    'WABI_SABI',
    'FARMHOUSE',
    'RUSTIC',
    'BOHEMIAN',
    'ART_DECO',
    'VICTORIAN',
    'COASTAL',
    'TROPICAL',
    'URBAN',
    'MAXIMALIST',
    'FUTURISTIC'
] as const;

export const SIZE_OPTIONS = [
    'SIZE_1024x1024',
    'SIZE_1024x1536',
    'SIZE_1536x1024',
    'AUTO'
] as const;

export const QUALITY_OPTIONS = [
    'LOW',
    'MEDIUM',
    'HIGH'
] as const;

export const OUTPUT_FORMATS = [
    'PNG',
    'JPEG',
    'WEBP'
] as const;

// Without as const
// const colors = ['red', 'blue', 'green'];
// colors[0] has type: string

// With as const
// const colors = ['red', 'blue', 'green'] as const;
// colors[0] has type: 'red' (literal type)

// Without as const
// const arr = [1, 2, 3];
// arr.push(4); // ✅ Allowed

// With as const
// const arr = [1, 2, 3] as const;
// arr.push(4); // ❌ Error: Property 'push' does not exist on type 'readonly [1, 2, 3]'

export type SpaceTypeProps = typeof SPACE_TYPES[number];
export type CategoryProps = typeof CATEGORIES[number];
export type DesignThemeProps = typeof DESIGN_THEMES[number];
export type SizeImageProps = typeof SIZE_OPTIONS[number];
export type QualityFormatProps = typeof QUALITY_OPTIONS[number];
export type OutputFormatProps = typeof OUTPUT_FORMATS[number];
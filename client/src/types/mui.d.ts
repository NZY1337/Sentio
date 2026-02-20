import '@mui/material/styles';

interface DashboardPaletteTokens {
    cardBackground: string;
    cardBorder: string;
    cardBorderHover: string;
    pillMetaBackground: string;
    pillMetaBorder: string;
    pillEmotionBackground: string;
    pillEmotionColor: string;
    textMuted: string;
    divider: string;
}

declare module '@mui/material/styles' {
    interface Palette {
        dashboard: DashboardPaletteTokens;
    }
    interface PaletteOptions {
        dashboard?: Partial<DashboardPaletteTokens>;
    }
}

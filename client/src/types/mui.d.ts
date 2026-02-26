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

interface JournalPaletteTokens {
    risk: {
        high: string;
        medium: string;
        low: string;
    };
    status: {
        draft: {
            background: string;
            text: string;
        };
        published: {
            background: string;
            text: string;
        };
    };
    action: {
        edit: {
            background: string;
            hover: string;
        };
        delete: {
            background: string;
            hover: string;
        };
    };
}

declare module '@mui/material/styles' {
    interface Palette {
        dashboard: DashboardPaletteTokens;
        journal: JournalPaletteTokens;
    }
    interface PaletteOptions {
        dashboard?: Partial<DashboardPaletteTokens>;
        journal?: JournalPaletteTokens;
    }
}

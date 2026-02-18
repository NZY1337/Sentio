import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Stack,
    Avatar,
    useTheme,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface JournalStat {
    id: string;
    title: string;
    date: string;
    moodScore: number;
    dominantEmotion: string;
}

const mockData: JournalStat[] = [
    {
        id: "1",
        title: "Good day together",
        date: "17 Apr",
        moodScore: 5.2,
        dominantEmotion: "Fericire",
    },
    {
        id: "2",
        title: "Overwhelmed at work",
        date: "16 Apr",
        moodScore: 5.5,
        dominantEmotion: "Anxietate",
    },
    {
        id: "3",
        title: "Conflict cu șeful",
        date: "12 Apr",
        moodScore: 4.0,
        dominantEmotion: "Stres",
    },
    {
        id: "4",
        title: "Unproductive day",
        date: "08 Apr",
        moodScore: 6.8,
        dominantEmotion: "Tristețe",
    },
    {
        id: "5",
        title: "Relaxing weekend",
        date: "07 Apr",
        moodScore: 7.9,
        dominantEmotion: "Liniște",
    },
];

const emotionColor = (emotion: string) => {
    switch (emotion) {
        case "Fericire":
            return "success";
        case "Anxietate":
            return "warning";
        case "Stres":
            return "error";
        case "Tristețe":
            return "info";
        case "Liniște":
            return "primary";
        default:
            return "default";
    }
};

export default function QuickStatsSection() {
    const theme = useTheme();

    return (
        <Box>
            {/* <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Typography variant="h6" fontWeight={600}>
                    Statistici rapide
                </Typography>

                <Chip
                    label="7 zile"
                    size="small"
                    sx={{
                        background: theme.palette.grey[800],
                    }}
                />
            </Stack> */}

            {/* List */}
            <Stack spacing={1} sx={{ border: "1px solid #23262F", borderRadius: 4, p: 2 }}>
                {mockData.map((entry) => (
                    <Card

                        key={entry.id}
                        sx={{
                            background: "#181B20",
                            borderRadius: 4,
                            border: "1px solid #23262F",
                            transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                            backdropFilter: "blur(6px)",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                borderColor: "#2F3642",
                            },
                        }}
                    >
                        <CardContent sx={{ px: 3, py: 2 }}>
                            <Stack direction="row" alignItems="center" spacing={3}>
                                <Box
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 3,
                                        background: "#1F242B",
                                        border: "1px solid #2A2F38",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{ color: "#6B7280", fontSize: 11 }}
                                    >
                                        {entry.date.split(" ")[0]}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 600 }}
                                    >
                                        {entry.date.split(" ")[1]}
                                    </Typography>
                                </Box>

                                {/* MAIN CONTENT */}
                                <Box flex={1}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 600,
                                            mb: 0.5,
                                            letterSpacing: 0.2,
                                        }}
                                    >
                                        {entry.title}
                                    </Typography>

                                    <Box display="flex" alignItems="center" gap={1.5}>
                                        <Box
                                            sx={{
                                                px: 1.5,
                                                py: 0.4,
                                                borderRadius: 2,
                                                fontSize: 12,
                                                fontWeight: 500,
                                                background: "rgba(255,255,255,0.05)",
                                                color: "#A1A1AA",
                                            }}
                                        >
                                            {entry.dominantEmotion}
                                        </Box>

                                        <Typography
                                            variant="caption"
                                            sx={{ color: "#6B7280" }}
                                        >
                                            AI analyzed
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* SCORE BLOCK */}
                                <Box
                                    sx={{
                                        minWidth: 90,
                                        textAlign: "center",
                                        px: 2,
                                        py: 1.5,
                                        borderRadius: 3,
                                        background: "#1F242B",
                                        border: "1px solid #2A2F38",
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{ color: "#6B7280", fontSize: 11 }}
                                    >
                                        Mood
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            mt: 0.5,
                                            color:
                                                entry.moodScore >= 7
                                                    ? "#22C55E"
                                                    : entry.moodScore >= 5
                                                        ? "#F59E0B"
                                                        : "#EF4444",
                                        }}
                                    >
                                        {entry.moodScore}
                                    </Typography>
                                </Box>

                                {/* ARROW */}
                                <ArrowForwardIosIcon
                                    sx={{
                                        fontSize: 14,
                                        color: "#4B5563",
                                        transition: "0.2s",
                                        "&:hover": { color: "#9CA3AF" },
                                    }}
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Stack>

        </Box>
    );
}

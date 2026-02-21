import * as React from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Stack,
    Avatar,
    ToggleButton,
    ToggleButtonGroup,
    CssBaseline,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { LineChart } from "@mui/x-charts/LineChart";

/* ---------------------- MOCK DATA ---------------------- */

const mood7Days = [
    { date: "2 Apr", score: 5.1 },
    { date: "4 Apr", score: 6.2 },
    { date: "6 Apr", score: 4.8 },
    { date: "8 Apr", score: 6.8 },
    { date: "10 Apr", score: 7.2 },
    { date: "12 Apr", score: 4.0 },
    { date: "14 Apr", score: 5.9 },
];

const mood30Days = [
    ...mood7Days,
    { date: "16 Apr", score: 6.4 },
    { date: "18 Apr", score: 5.3 },
    { date: "20 Apr", score: 6.9 },
    { date: "22 Apr", score: 7.4 },
];

const journalStats = [
    {
        id: "1",
        title: "Good day together",
        date: "17 Apr",
        moodScore: 5.2,
        emotion: "Fericire",
    },
    {
        id: "2",
        title: "Overwhelmed at work",
        date: "16 Apr",
        moodScore: 5.5,
        emotion: "Anxietate",
    },
    {
        id: "3",
        title: "Conflict cu șeful",
        date: "12 Apr",
        moodScore: 4.0,
        emotion: "Stres",
    },
    {
        id: "4",
        title: "Unproductive day",
        date: "08 Apr",
        moodScore: 6.8,
        emotion: "Tristețe",
    },
    {
        id: "5",
        title: "Relaxing weekend",
        date: "07 Apr",
        moodScore: 7.9,
        emotion: "Liniște",
    },
];

/* ---------------------- CHART ---------------------- */

function MoodTrendChart() {
    const [range, setRange] = React.useState("7");
    const data = range === "7" ? mood7Days : mood30Days;
    // Folosim primul jurnal ca exemplu pentru header
    const journal = journalStats[0];

    return (
        <Card sx={(theme) => ({
            // background: theme.palette.background.paper,
            borderRadius: 4,
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
            height: "100%",
        })}>
            <CardContent sx={{ p: 4, }}>
                {/* HEADER */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                    sx={{ width: '100%' }}>
                    <Box>
                        <Typography
                            variant="caption"
                            sx={(theme) => ({
                                color: 'theme.palette.text.secondary', fontWeight: 500,
                            })}>
                            {journal.date}
                        </Typography>

                        <Typography variant="h6" sx={(theme) => ({ fontWeight: 700, mt: 0.5, mb: 1, letterSpacing: 0.2, })}>
                            {journal.title}
                        </Typography>

                        <Typography variant="body2"
                            sx={(theme) => ({
                                color: theme.palette.text.secondary, lineHeight: 1.6, maxWidth: "90%",
                            })}>
                            Juom copilasi na plaisti la lac de munca, termenel limită,
                            întâlnită de jurm say gindulion lat tushen setting...
                        </Typography>
                    </Box>

                    {/* SCORE BOX */}
                    <Box
                        sx={(theme) => ({
                            background: theme.palette.action.selected,
                            borderRadius: 3,
                            px: 2, py: 1.5,
                            textAlign: "center",
                            minWidth: 90,
                            border: `1px solid ${theme.palette.divider}`,
                        })}>
                        <Typography variant="caption" sx={(theme) => ({
                            color: theme.palette.text.secondary, fontWeight: 500,
                        })}>
                            Mood average
                        </Typography>

                        <Box display="flex" alignItems="center" justifyContent="center">
                            <Typography sx={{ fontSize: 18, mr: 0.5 }}>🟡</Typography>
                            <Typography variant="h5" sx={{ color: "#FFD600", fontWeight: 700 }}>
                                6.2
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* META ROW */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="caption" sx={(theme) => ({
                        color: theme.palette.text.secondary, fontWeight: 500,
                    })}>
                        GL DRĂC · 03 sects.
                    </Typography>
                    <Typography variant="caption" sx={(theme) => ({
                        color: theme.palette.text.secondary, fontWeight: 500,
                    })}>
                        Trend analysis
                    </Typography>
                </Box>

                {/* CHART */}
                <Box>
                    <LineChart
                        sx={{ height: '210px' }}
                        xAxis={[
                            {
                                scaleType: "point",
                                data: data.map((d) => d.date),
                                tickLabelStyle: { fill: "#8B949E", fontSize: 12 },
                            },
                        ]}
                        series={[
                            {
                                data: data.map((d) => d.score),
                                area: true,
                                showMark: false,
                                curve: "natural",
                            },
                        ]}
                        grid={{ horizontal: true, vertical: false }}
                    />
                </Box>
            </CardContent>
        </Card>
    );

}

export default MoodTrendChart
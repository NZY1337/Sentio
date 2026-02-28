import * as React from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import type { JournalEntry } from "../../../../types/journal";

type MoodTrendChartProps = {
    journalEntries?: JournalEntry[];
};

const FIVE_MINUTES_MS = 5 * 60 * 1000;
const LAST_HOUR_BUCKETS = 12;

const buildLastHour = (journalEntries: JournalEntry[]) => {
    const now = new Date();
    const start = new Date(now.getTime() - 60 * 60 * 1000);

    const buckets = Array.from({ length: LAST_HOUR_BUCKETS }, (_, index) => {
        const date = new Date(start.getTime() + index * FIVE_MINUTES_MS);
        return {
            label: date.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }),
            values: [] as number[],
        };
    });

    journalEntries.forEach((entry) => {
        if (typeof entry.analysis?.riskScore !== "number") return;

        const createdAt = new Date(entry.createdAt);
        if (Number.isNaN(createdAt.getTime())) return;
        if (createdAt < start || createdAt > now) return;

        const bucketIndex = Math.min(
            LAST_HOUR_BUCKETS - 1,
            Math.max(0, Math.floor((createdAt.getTime() - start.getTime()) / FIVE_MINUTES_MS)),
        );

        buckets[bucketIndex]?.values.push(entry.analysis.riskScore);
    });

    const rawPoints = buckets.map((bucket) => {
        const average = bucket.values.length
            ? bucket.values.reduce((sum, value) => sum + value, 0) / bucket.values.length
            : null;

        return {
            label: bucket.label,
            score: average !== null ? Number(average.toFixed(1)) : null,
            count: bucket.values.length,
        };
    });

    const knownScores = rawPoints.filter((point) => point.score !== null).map((point) => point.score as number);
    const fallbackScore = knownScores.length
        ? Number((knownScores.reduce((sum, value) => sum + value, 0) / knownScores.length).toFixed(1))
        : 0;

    let lastKnown = fallbackScore;

    return rawPoints.map((point) => {
        if (point.score === null) {
            return {
                ...point,
                score: lastKnown,
            };
        }

        lastKnown = point.score;
        return {
            ...point,
        };
    });
};

function MoodTrendChart({ journalEntries = [] }: MoodTrendChartProps) {
    const data = React.useMemo(() => buildLastHour(journalEntries), [journalEntries]);
    const averageMood = React.useMemo(() => {
        const validPoints = data.filter((point) => point.count > 0).map((point) => point.score);
        if (!validPoints.length) return 0;
        const average = validPoints.reduce((sum, value) => sum + value, 0) / validPoints.length;
        return Number(average.toFixed(1));
    }, [data]);

    return (
        <Card sx={(theme) => ({
            borderRadius: 4,
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
            height: "100%",
            width: "100%",
        })}>
            <CardContent sx={{ p: 2 }}>
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
                                color: theme.palette.text.secondary, fontWeight: 500,
                            })}>
                            {new Date().toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}
                        </Typography>

                        <Typography fontSize={20} sx={(theme) => ({ fontWeight: 200, mt: 0.5, mb: 1, letterSpacing: 0.2, })}>
                            Ultima oră
                        </Typography>

                        <Typography variant="body2"
                            sx={(theme) => ({
                                color: theme.palette.text.secondary, lineHeight: 1.6, maxWidth: "90%",
                            })}>
                            Scrie-ti gandurile zilnic pentru a primi insight-uri personalizate și a-ți monitoriza starea emoțională în timp.
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
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                            Mood average
                        </Typography>

                        <Box display="flex" alignItems="center" justifyContent="center">
                            <Typography sx={{ fontSize: 18, mr: 0.5 }}>🟡</Typography>
                            <Typography variant="h5" sx={{ color: "#FFD600", fontWeight: 700 }}>
                                {averageMood.toFixed(1)}
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
                                data: data.map((d) => d.label),
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
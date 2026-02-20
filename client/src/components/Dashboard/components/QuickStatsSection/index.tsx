import {
    Box,
    Typography,
    Card,
    CardContent,
    Stack,
    IconButton,
    Divider,
    Grid
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { JournalEntry } from "../../../../types/journal";

const extractTitle = (content: string): string => {
    try {
        const parsed = JSON.parse(content);
        const firstParagraph = parsed?.content?.[0];
        if (firstParagraph?.content?.[0]?.text) {
            const text = firstParagraph.content[0].text;
            return text.length > 50 ? text.substring(0, 50) + "..." : text;
        }
        return "Journal Entry";
    } catch {
        return content.length > 50 ? content.substring(0, 50) + "..." : content || "Journal Entry";
    }
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    return `${day} ${month}`;
};

interface QuickStatsSectionProps {
    journalEntries: JournalEntry[];
    editMode?: boolean;
    onEdit?: (entry: JournalEntry) => void;
    onDelete?: (entryId: string) => void;
}

export default function QuickStatsSection({ journalEntries, onEdit, onDelete, editMode = false }: QuickStatsSectionProps) {
    return (
        <>
            {journalEntries && journalEntries.map((entry) => {
                const title = extractTitle(entry.content);
                const formattedDate = formatDate(entry.createdAt);
                const dominantEmotion = entry.analysis?.dominantEmotion || "N/A";
                const riskScore = entry.analysis?.riskScore || 0;
                const status = entry.status || "draft";

                return (
                    <Grid key={entry.id} size={{ md: 3 }} spacing={1}>
                        <Card
                            sx={(theme) => ({
                                borderRadius: 3,
                                // background: theme.palette.background.pape r,
                                border: `.1px solid ${theme.palette.divider}`,
                                transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                },
                            })}>
                            <CardContent sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    flexWrap="wrap"
                                    gap={1.5}>
                                    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                                        {/* Date pill */}
                                        <Box sx={(theme) => ({
                                            px: 1, py: 0.5, borderRadius: 2,
                                            background: theme.palette.action.selected,
                                            border: `1px solid ${theme.palette.divider}`,
                                            display: "flex", alignItems: "center",
                                        })}>
                                            <Typography variant="caption" sx={(theme) => ({
                                                color: theme.palette.text.secondary, fontSize: 11,
                                            })}>
                                                {formattedDate.split(" ")[0]}
                                            </Typography>
                                            <Typography variant="caption" sx={(theme) => ({ fontWeight: 500, ml: 0.5, color: theme.palette.text.primary })}>
                                                {formattedDate.split(" ")[1]}
                                            </Typography>
                                        </Box>

                                        {/* Risk pill */}
                                        <Box sx={(theme) => ({
                                            px: 1, py: 0.5, borderRadius: 2,
                                            background: theme.palette.action.selected,
                                            border: `1px solid ${theme.palette.divider}`,
                                            display: "flex", alignItems: "center",
                                        })}>
                                            <Typography variant="caption" sx={(theme) => ({
                                                color: theme.palette.text.secondary, fontSize: 11,
                                            })}>
                                                Risk
                                            </Typography>
                                            <Typography sx={{
                                                fontWeight: 700, ml: 0.75,
                                                color: riskScore >= 7 ? "#EF4444" : riskScore >= 5 ? "#F59E0B" : "#22C55E",
                                            }}>
                                                {riskScore.toFixed(1)}
                                            </Typography>
                                        </Box>

                                        {/* Emotion pill */}
                                        <Box sx={(theme) => ({
                                            px: 1, py: 0.5, borderRadius: 2,
                                            fontSize: 12, fontWeight: 500,
                                            background: theme.palette.action.hover,
                                            color: theme.palette.text.secondary,
                                        })}>
                                            {dominantEmotion}
                                        </Box>
                                    </Stack>

                                    {/* Status */}
                                    <Box sx={{
                                        px: 1, py: 0.5, borderRadius: 2,
                                        fontSize: 11, fontWeight: 600,
                                        textTransform: "uppercase", letterSpacing: 0.6,
                                        background: status === "draft" ? "rgba(251,191,36,0.15)" : "rgba(34,197,94,0.15)",
                                        color: status === "draft" ? "#F59E0B" : "#22C55E",
                                    }}>
                                        {status}
                                    </Box>
                                </Stack>

                                {/* Title */}
                                <Typography variant="subtitle1" sx={(theme) => ({ fontWeight: 600, mt: 2, mb: 1, lineHeight: 1.3, })}>
                                    {title}
                                </Typography>

                                <Divider sx={(theme) => ({
                                    borderColor: theme.palette.divider, my: 1.5,
                                })} />

                                {/* Analysis */}
                                <Typography variant="caption" sx={(theme) => ({
                                    color: theme.palette.text.secondary,
                                })}>
                                    {entry.analysis ? "AI analyzed" : "Pending analysis"} – processed by AI
                                </Typography>

                                {/* Actions */}
                                {!editMode && (
                                    <Stack direction="row" spacing={1} justifyContent="flex-end" mt={2}>
                                        <IconButton
                                            size="small"
                                            onClick={() => onEdit?.(entry)}
                                            sx={{
                                                background: "rgba(59,130,246,0.12)",
                                                borderRadius: 2, transition: "all 0.2s",
                                                "&:hover": { background: "rgba(59,130,246,0.25)", transform: "scale(1.05)" },
                                            }}>
                                            <EditIcon sx={{ fontSize: 18 }} />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => onDelete?.(entry.id)}
                                            sx={{
                                                background: "rgba(239,68,68,0.12)",
                                                borderRadius: 2, transition: "all 0.2s",
                                                "&:hover": { transform: "scale(1.05)" },
                                            }}>
                                            <DeleteIcon sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    </Stack>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </>
    );
}
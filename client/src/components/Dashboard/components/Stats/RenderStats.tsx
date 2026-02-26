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

interface StatsProps {
    journalEntries: JournalEntry[];
    editMode?: boolean;
    onEdit?: (entry: JournalEntry) => void;
    onDelete?: (entryId: string) => void;
}

export default function RenderStats({
    entry,
    status,
    date,
    dominantEmotion,
    riskScore,
    title,
    editMode,
    onEdit,
    onDelete
}: StatsProps & { entry: JournalEntry; status: string; date: string; dominantEmotion: string; riskScore: number; title: string }) {
    return (
        <Card
            sx={(theme) => ({
                width: "100%",
                borderRadius: 3,
                // background: theme.palette.background.pape r,
                border: `1px solid ${theme.palette.divider}`,
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
                    gap={1}>
                    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                        {/* Date pill */}
                        <Box sx={(theme) => ({
                            px: 1, py: 0.5, borderRadius: 2,
                            background: theme.palette.action.selected,
                            border: `1px solid ${theme.palette.divider}`,
                            display: "flex", alignItems: "center",
                        })}>
                            <Typography variant="caption">
                                {date.split(" ")[0]}
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 500, ml: 0.5, }}>
                                {date.split(" ")[1]}
                            </Typography>
                        </Box>

                        {/* Risk pill */}
                        <Box sx={(theme) => ({
                            px: 1, py: 0.5, borderRadius: 2,
                            background: theme.palette.action.selected,
                            border: `1px solid ${theme.palette.divider}`,
                            display: "flex", alignItems: "center",
                        })}>
                            <Typography variant="caption" >
                                Risk
                            </Typography>
                            <Typography sx={(theme) => ({
                                fontWeight: 700, ml: 0.75,
                                color: riskScore >= 7 ? theme.palette.journal.risk.high : riskScore >= 5 ? theme.palette.journal.risk.medium : theme.palette.journal.risk.low,
                            })}>
                                {riskScore.toFixed(1)}
                            </Typography>
                        </Box>

                        {/* Emotion pill */}
                        <Box sx={(theme) => ({
                            px: 1, py: 0.5, borderRadius: 2,
                            fontWeight: 500,
                            background: theme.palette.action.hover,
                        })}>
                            {dominantEmotion}
                        </Box>
                    </Stack>

                    {/* Status */}
                    <Box sx={(theme) => ({
                        px: 1, py: 0.5, borderRadius: 2,
                        textTransform: "uppercase", letterSpacing: 1,
                        background: status === "draft" ? theme.palette.journal.status.draft.background : theme.palette.journal.status.published.background,
                        color: status === "draft" ? theme.palette.journal.status.draft.text : theme.palette.journal.status.published.text,
                    })}>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            {status}
                        </Typography>
                    </Box>
                </Stack>

                {/* Title */}
                <Typography variant="subtitle2" sx={{ fontWeight: 300, mt: 2, mb: 1, lineHeight: 1.3, }}>
                    {title}
                </Typography>

                <Divider sx={(theme) => ({
                    borderColor: theme.palette.divider, my: 1.5,
                })} />

                {/* Analysis */}
                <Typography variant="caption" sx={(theme) => ({
                    color: theme.palette.text.secondary,
                })}>
                    {entry.analysis ? "AI analyzed" : "Pending AI analysis"}
                </Typography>

                {/* Actions */}
                {editMode && (
                    <Stack direction="row" spacing={1} justifyContent="flex-end" mt={2}>
                        <IconButton
                            size="small"
                            onClick={() => onEdit?.(entry)}
                            sx={(theme) => ({
                                background: theme.palette.journal.action.edit.background,
                                borderRadius: 2, transition: "all 0.2s",
                                "&:hover": { background: theme.palette.journal.action.edit.hover, transform: "scale(1.05)" },
                            })}>
                            <EditIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => onDelete?.(entry.id)}
                            sx={(theme) => ({
                                background: theme.palette.journal.action.delete.background,
                                borderRadius: 2, transition: "all 0.2s",
                                "&:hover": { background: theme.palette.journal.action.delete.hover, transform: "scale(1.05)" },
                            })}>
                            <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}
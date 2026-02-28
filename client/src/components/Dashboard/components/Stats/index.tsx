import Grid from "@mui/material/Grid";
import type { JournalEntry } from "../../../../types/journal";
import { extractTitle, formatDate } from "../../../../helpers/helpers";
import RenderStats from "./RenderStats";

export interface StatsProps {
    journalEntries: JournalEntry[];
    editMode?: boolean;
    onEdit?: (entry: JournalEntry) => void;
    onDelete?: (entryId: string) => void;
}

export default function Stats({ journalEntries, onEdit, onDelete, editMode = false }: StatsProps) {
    return (
        <>
            {journalEntries && journalEntries.map((entry) => {
                const title = extractTitle(entry.content);
                const formattedDate = formatDate(entry.createdAt);
                const dominantEmotion = entry.analysis?.dominantEmotion || "N/A";
                const riskScore = typeof entry.analysis?.riskScore === "number" ? entry.analysis.riskScore : null;
                const cognitiveDistortion = entry.analysis?.cognitiveDistortion || "N/A";
                const status = entry.status || "draft";

                return (
                    <Grid size={{ lg: 6 }} key={entry.id}>
                        <RenderStats
                            journalEntries={journalEntries}
                            title={title}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            editMode={editMode}
                            riskScore={riskScore}
                            entry={entry}
                            status={status}
                            date={formattedDate}
                            cognitiveDistortion={cognitiveDistortion}
                            dominantEmotion={dominantEmotion} />
                    </Grid>
                );
            })}
        </>
    );
}
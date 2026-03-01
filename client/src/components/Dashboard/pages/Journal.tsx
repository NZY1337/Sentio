import React from 'react';
import { useState } from 'react';

import { Box, Button, Typography, CircularProgress, Card, CardContent, Grid, Stack, TextField, Divider, Chip } from '@mui/material';
import JournalEditor from '../components/Editor/index';
import { useDashboardContext } from '../context/dashboardContext';
import { useJournalSemanticSearch } from '../hooks/useJournal';

const JournalPage: React.FC = () => {
    const [query, setQuery] = useState('cand m-am simtit cu adevarat vesel?');
    const {
        isJournalsLoading,
        journalsError,
        editingContent,
        editingId,
        editorKey,
        handleNewJournal,
    } = useDashboardContext();
    const semanticSearch = useJournalSemanticSearch();

    if (isJournalsLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (journalsError) {
        return (
            <Box p={3}>
                <Typography color="error">
                    Error loading journal entries: {journalsError.message}
                </Typography>
            </Box>
        );
    }

    const runSearch = async () => {
        if (!query.trim()) return;
        await semanticSearch.mutateAsync({ query: query.trim(), limit: 5 });
    };

    const evidenceIds = new Set((semanticSearch.data?.evidence ?? []).map((item) => item.id));
    const additionalMatches = (semanticSearch.data?.matches ?? []).filter((match) => !evidenceIds.has(match.id));

    return (
        <Grid container spacing={2}>
            <Grid size={{ md: 9 }}>
                <Box mb={4}>
                    {editingId && (
                        <Typography variant="subtitle2" color="primary" mb={1}>
                            Editezi jurnalul <b>{editingId}</b>
                        </Typography>
                    )}
                    <Box sx={{ position: 'relative' }}>
                        <JournalEditor
                            key={editorKey}
                            initialContent={editingContent}
                            editingId={editingId}
                            onSaveOrSubmit={() => {
                                handleNewJournal();
                            }}
                            actionSlot={(
                                <>
                                    <Button variant='contained' color='primary' onClick={() => document.getElementById('save-draft-btn')?.click()}>
                                        salveaza ca ciorna
                                    </Button>
                                    <Button variant='contained' color='primary' onClick={() => document.getElementById('submit-btn')?.click()}>
                                        Trimite pt analiza
                                    </Button>
                                    <Button variant="outlined" color="secondary" onClick={handleNewJournal}>
                                        Clear
                                    </Button>
                                </>
                            )}
                        />
                    </Box>
                </Box>

                <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                        <Typography variant="body2" fontSize={30} mb={2}>Journal Memory Search</Typography>
                        <Typography variant="body2" color="text.secondary" mb={2} width={{ xs: '100%', md: '75%' }}>
                            Întreabă jurnalul tău lucruri precum „când m-am simțit vesel?” și primești răspuns din intrările salvate.
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                            <TextField
                                fullWidth
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Ex: cand m-am simtit cel mai calm?"
                            />
                            <Button
                                variant="contained"
                                onClick={runSearch}
                                disabled={semanticSearch.isPending || !query.trim()}
                            >
                                {semanticSearch.isPending ? 'Caut...' : 'Cauta'}
                            </Button>
                        </Stack>

                        {semanticSearch.isError && (
                            <Typography mt={2} color="error">
                                {(semanticSearch.error as Error).message || 'Search failed'}
                            </Typography>
                        )}

                        {semanticSearch.data && (
                            <Box mt={2}>
                                <Typography variant="subtitle1" fontWeight={600}>Răspuns AI</Typography>
                                <Typography variant="body2" mt={0.5} color="text.secondary">
                                    {semanticSearch.data.answer}
                                </Typography>

                                <Box mt={1.5} p={1.25} borderRadius={2} sx={{ border: '1px solid', borderColor: 'divider' }}>
                                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                        <Typography variant="caption" color="text.secondary">
                                            Search confidence score: {semanticSearch.data.confidence.score}
                                        </Typography>
                                        <Chip
                                            size="small"
                                            color="default"
                                            label={`Search confidence ${semanticSearch.data.confidence.level.toUpperCase()}`}
                                        />
                                    </Stack>
                                    <Typography variant="caption" display="block" color="text.secondary" mt={0.25}>
                                        Query emotion detected: {semanticSearch.data.queryEmotion || 'none'}
                                    </Typography>
                                    <Typography variant="caption" display="block" color="text.secondary" mt={0.25}>
                                        {semanticSearch.data.confidence.rationale}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="subtitle2" mb={1}>Dovezi folosite</Typography>
                                <Stack spacing={1.25} mb={2}>
                                    {semanticSearch.data.evidence.map((item) => (
                                        <Box key={`evidence-${item.id}`} p={1.5} borderRadius={2} sx={{ border: '1px solid', borderColor: 'divider' }}>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(item.createdAt).toLocaleDateString()} · Similarity: {item.similarity} · Emotion: {item.dominantEmotion || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2" mt={0.5}>{item.snippet}</Typography>
                                            <Typography variant="caption" display="block" mt={0.5} color="text.secondary">{item.reason}</Typography>
                                        </Box>
                                    ))}
                                </Stack>

                                <Typography variant="subtitle2" mb={1}>Rezultate relevante</Typography>
                                <Stack spacing={1.25}>
                                    {additionalMatches.map((match) => (
                                        <Box key={match.id} p={1.5} borderRadius={2} sx={{ border: '1px solid', borderColor: 'divider' }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Similarity: {match.similarity} · {new Date(match.createdAt).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="body2" mt={0.5}>
                                                {match.content}
                                            </Typography>
                                        </Box>
                                    ))}
                                    {!additionalMatches.length && (
                                        <Typography variant="caption" color="text.secondary">
                                            Nu mai există rezultate suplimentare în afara dovezilor afișate mai sus.
                                        </Typography>
                                    )}
                                </Stack>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default JournalPage;

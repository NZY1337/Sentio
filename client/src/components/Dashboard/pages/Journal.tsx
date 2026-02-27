import React from 'react';
// Child component to render a read-only Tiptap editor for a journal entry
import { type FC } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyleKit } from '@tiptap/extension-text-style';

import { Box, Button, Typography, CircularProgress, Card, CardContent, Grid } from '@mui/material';
import JournalEditor from '../components/Editor/index';
import { useDashboardContext } from '../context/dashboardContext';

const ReadOnlyJournalEntry: FC<{ content: string }> = ({ content }) => {
    let tiptapContent;
    try {
        tiptapContent = content ? JSON.parse(content) : { type: 'doc', content: [{ type: 'paragraph' }] };
    } catch (e) {
        tiptapContent = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: content || '' }] }] };
    }
    const editor = useEditor({
        extensions: [TextStyleKit, StarterKit],
        content: tiptapContent,
        editable: false,
    });
    return <EditorContent editor={editor} />;
};

const JournalPage: React.FC = () => {
    const {
        isJournalsLoading,
        journalsError,
        editingContent,
        editingId,
        editorKey,
        handleNewJournal,
    } = useDashboardContext();

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
            </Grid>
        </Grid>
    );
};

export default JournalPage;

import React, { useState } from 'react';
// Child component to render a read-only Tiptap editor for a journal entry
import { FC } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyleKit } from '@tiptap/extension-text-style';

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
import { Box, Button, Typography, CircularProgress, Card, CardContent, CardActions, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useJournalEntries, useDeleteJournalEntry, useCreateJournalEntry, useUpdateJournalEntry } from '../hooks/useJournal';
import JournalEditor from '../components/Editor/index';

const JournalPage: React.FC = () => {
    const { data, isLoading, error } = useJournalEntries();
    const deleteJournalEntryMutation = useDeleteJournalEntry();
    // Editor is now handled by JournalEditor component
    const [editingContent, setEditingContent] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editorKey, setEditorKey] = useState(0); // force remount for editor
    const handleEdit = (journal: any) => {
        setEditingContent(journal.content);
        setEditingId(journal.id);
        setEditorKey(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleNew = () => {
        setEditingContent(null);
        setEditingId(null);
        setEditorKey(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (journalEntryId: string) => {
        try {
            await deleteJournalEntryMutation.mutateAsync(journalEntryId);
        } catch (error) {
            setFeedback('Failed to delete entry.');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Typography color="error">
                    Error loading journal entries: {error.message}
                </Typography>
            </Box>
        );
    }

    const journalEntries = data?.journalEntries || [];

    return (
        <Box>
            <Typography variant="h4" component="h1" mb={3}>
                Journal Entries
            </Typography>
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
                            setEditingContent(null);
                            setEditingId(null);
                            setEditorKey(prev => prev + 1);
                        }}
                        actionSlot={(
                            <>
                                <Button variant='contained' color='primary' onClick={() => document.getElementById('save-draft-btn')?.click()}>
                                    salveaza ca ciorna
                                </Button>
                                <Button variant='contained' color='primary' onClick={() => document.getElementById('submit-btn')?.click()}>
                                    Trimite pt analiza
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={handleNew}>
                                    Creează jurnal nou
                                </Button>
                            </>
                        )}
                    />
                </Box>
            </Box>
            {journalEntries.length === 0 ? (
                <Card>
                    <CardContent>
                        <Typography variant="body1" color="text.secondary" align="center">
                            No journal entries yet. Create your first entry to get started!
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                    {journalEntries.map((journal: any) => (
                        <Card key={journal.id}>
                            <CardContent sx={{
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            }}>
                                <Box sx={{
                                    maxHeight: 96, // ~3-4 lines depending on font size
                                    overflow: 'hidden',
                                    position: 'relative',
                                }}>
                                    <ReadOnlyJournalEntry content={journal.content} />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            height: 32,
                                            pointerEvents: 'none',
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end',
                                            pr: 1,
                                            pb: 0.5,
                                        }}
                                    >
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                                            ...
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center" gap={2} mt={1}>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ fontWeight: 500, letterSpacing: 1, opacity: 0.8 }}
                                        display="block"
                                    >
                                        Created: {formatDate(journal.createdAt)}
                                    </Typography>
                                    <Box
                                        px={1.5}
                                        py={0.5}
                                        borderRadius={2}
                                        sx={{
                                            background: (!journal.status || journal.status === 'draft') ? 'rgba(255,255,255,0.10)' : 'rgba(0,255,200,0.10)',
                                            color: (!journal.status || journal.status === 'draft') ? 'warning.main' : 'success.main',
                                            fontWeight: 600,
                                            fontSize: 12,
                                            textTransform: 'uppercase',
                                            letterSpacing: 1,
                                        }}
                                    >
                                        {journal.status ? journal.status : 'draft'}
                                    </Box>
                                </Box>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end', p: 2, gap: 1 }}>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEdit(journal)}
                                    sx={{
                                        background: 'rgba(255,255,255,0.08)',
                                        borderRadius: 2,
                                        transition: 'background 0.2s',
                                        '&:hover': {
                                            background: 'rgba(255,255,255,0.18)',
                                        },
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDelete(journal.id)}
                                    disabled={deleteJournalEntryMutation.isPending}
                                    sx={{
                                        background: 'rgba(255,255,255,0.08)',
                                        borderRadius: 2,
                                        transition: 'background 0.2s',
                                        '&:hover': {
                                            background: 'rgba(255,255,255,0.18)',
                                        },
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default JournalPage;

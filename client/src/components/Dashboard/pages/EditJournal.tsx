import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import JournalEditor from '../components/Editor/index';
import { useJournalEntry } from '../hooks/useJournal';

const EditJournal: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, isLoading, error } = useJournalEntry(id || '');
    const currentJournal = data?.journalEntry;

    // Show loading spinner while data is being fetched
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
                <Alert severity="error">
                    {(error as Error).message || 'Failed to load journal entry'}
                </Alert>
                <Button
                    variant="contained"
                    onClick={() => navigate('/dashboard/journals')}
                    sx={{ mt: 2 }}
                >
                    Back to Journals
                </Button>
            </Box>
        );
    }

    // If journal not found after loading is complete
    if (!currentJournal) {
        return (
            <Box p={3}>
                <Alert severity="error">
                    Journal entry not found (ID: {id})
                </Alert>
                <Button
                    variant="contained"
                    onClick={() => navigate('/dashboard/journals')}
                    sx={{ mt: 2 }}
                >
                    Back to Journals
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Box mb={3}>
                <Typography variant="h4" gutterBottom>
                    Edit Journal
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Editing journal entry: {currentJournal.id}
                </Typography>
            </Box>

            <Box sx={{ position: 'relative' }}>
                <JournalEditor
                    key={id}
                    initialContent={currentJournal.content}
                    editingId={currentJournal.id}
                    onSaveOrSubmit={() => {
                        navigate('/dashboard/journals');
                    }}
                    actionSlot={(
                        <>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={() => document.getElementById('save-draft-btn')?.click()}
                            >
                                Save as Draft
                            </Button>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={() => document.getElementById('submit-btn')?.click()}
                            >
                                Submit for Analysis
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate('/dashboard/journals')}
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                />
            </Box>
        </Box>
    );
};

export default EditJournal;

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    CircularProgress,
} from '@mui/material';

// TODO: Replace with useCreateJournalEntry, useUpdateJournalEntry

interface JournalFormProps {
    open: boolean;
    onClose: () => void;
    journal?: any;
}


// TODO: Replace with journal entry state and logic

import { useCreateJournalEntry, useUpdateJournalEntry } from '../hooks/useJournal';

const JournalForm: React.FC<JournalFormProps> = ({ open, onClose, journal }) => {
    const [content, setContent] = useState(journal?.content || '');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const createJournalEntry = useCreateJournalEntry();
    const updateJournalEntry = useUpdateJournalEntry();

    useEffect(() => {
        setContent(journal?.content || '');
        setError(null);
        setSuccess(null);
    }, [journal, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            if (journal && journal.id) {
                await updateJournalEntry.mutateAsync({ journalEntryId: journal.id, data: { content } });
                setSuccess('Journal entry updated!');
            } else {
                await createJournalEntry.mutateAsync({ content });
                setSuccess('Journal entry created!');
                setContent('');
            }
            setTimeout(() => {
                onClose();
            }, 700);
        } catch (e) {
            setError('Failed to save journal entry.');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>{journal ? 'Edit Journal Entry' : 'New Journal Entry'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Journal Content"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        multiline
                        minRows={4}
                        fullWidth
                        autoFocus
                        required
                        margin="normal"
                    />
                    {error && <Box color="error.main" mb={1}>{error}</Box>}
                    {success && <Box color="success.main" mb={1}>{success}</Box>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={createJournalEntry.isPending || updateJournalEntry.isPending}>
                        {journal ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default JournalForm;

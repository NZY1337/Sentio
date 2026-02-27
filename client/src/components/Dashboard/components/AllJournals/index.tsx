import React, { useState } from 'react';
import { Box, Typography, CircularProgress, Grid, Pagination, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useJournalEntries, useDeleteJournalEntry } from '../../hooks/useJournal';
import Stats from '../Stats';
import type { JournalEntry } from '../../../../types/journal';

const ITEMS_PER_PAGE = 2; // Temporarily set to 2 for testing

const AllJournals: React.FC = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, error } = useJournalEntries({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
    });

    const deleteJournalEntryMutation = useDeleteJournalEntry();

    const handleEditJournal = (journal: JournalEntry) => {
        navigate(`/dashboard/journals/${journal.id}`);
    };

    const handleDeleteJournal = async (journalEntryId: string) => {
        try {
            await deleteJournalEntryMutation.mutateAsync(journalEntryId);
        } catch (error) {
            console.log(error);
        }
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
    const pagination = data?.pagination;

    console.log('API Response:', data);
    console.log('Pagination:', pagination);
    console.log('Total Pages:', pagination?.totalPages);

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">
                    All Journals
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {pagination?.total || 0} {pagination?.total === 1 ? 'entry' : 'entries'}
                </Typography>
            </Stack>

            {journalEntries.length === 0 ? (
                <Box textAlign="center" py={8}>
                    <Typography variant="h6" color="text.secondary">
                        No journal entries found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                        Start writing to see your journals here
                    </Typography>
                </Box>
            ) : (
                <>
                    <Grid container spacing={2}>
                        <Stats
                            journalEntries={journalEntries}
                            onEdit={handleEditJournal}
                            onDelete={handleDeleteJournal}
                            editMode={true}
                        />
                    </Grid>

                    {pagination && pagination.totalPages > 1 && (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Pagination
                                count={pagination.totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
}

export default AllJournals;
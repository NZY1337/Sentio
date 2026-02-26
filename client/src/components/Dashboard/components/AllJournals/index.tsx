import React, { useState } from 'react';
import { Box, Typography, CircularProgress, Grid, Pagination, Stack } from '@mui/material';
import { useDashboardContext } from '../../context/dashboardContext';
import Stats from '../Stats';

const ITEMS_PER_PAGE = 2;

const AllJournals: React.FC = () => {
    const {
        journalEntries,
        isJournalsLoading,
        journalsError,
        handleEditJournal,
        handleDeleteJournal
    } = useDashboardContext();

    const [currentPage, setCurrentPage] = useState(1);

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

    const totalPages = Math.ceil(journalEntries.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedEntries = journalEntries.slice(startIndex, endIndex);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">
                    All Journals
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {journalEntries.length} {journalEntries.length === 1 ? 'entry' : 'entries'}
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
                            journalEntries={paginatedEntries}
                            onEdit={handleEditJournal}
                            onDelete={handleDeleteJournal}
                            editMode={true}
                        />
                    </Grid>

                    {totalPages > 1 && (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Pagination
                                count={totalPages}
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { journalService } from '../../../services/journal';
import type { CreateJournalEntryDto, UpdateJournalEntryDto } from '../../../services/journal/index';
import { useAuth } from '@clerk/clerk-react';

export const useJournalEntries = () => {
    const { getToken } = useAuth();
    return useQuery({
        queryKey: ['journalEntries'],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No authentication token');
            return journalService.getJournalEntries(token);
        },
    });
};

export const useJournalEntry = (journalEntryId: string) => {
    const { getToken } = useAuth();
    return useQuery({
        queryKey: ['journalEntry', journalEntryId],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No authentication token');
            return journalService.getJournalEntryById(journalEntryId, token);
        },
        enabled: !!journalEntryId,
    });
};

export const useCreateJournalEntry = () => {
    const queryClient = useQueryClient();
    const { getToken } = useAuth();
    return useMutation({
        mutationFn: async (data: CreateJournalEntryDto) => {
            const token = await getToken();
            if (!token) throw new Error('No authentication token');
            return journalService.createJournalEntry(data, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
        },
    });
};

export const useUpdateJournalEntry = () => {
    const queryClient = useQueryClient();
    const { getToken } = useAuth();
    return useMutation({
        mutationFn: async ({ journalEntryId, data }: { journalEntryId: string; data: UpdateJournalEntryDto }) => {
            const token = await getToken();
            if (!token) throw new Error('No authentication token');
            return journalService.updateJournalEntry(journalEntryId, data, token);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
            queryClient.invalidateQueries({ queryKey: ['journalEntry', variables.journalEntryId] });
        },
    });
};

export const useDeleteJournalEntry = () => {
    const queryClient = useQueryClient();
    const { getToken } = useAuth();
    return useMutation({
        mutationFn: async (journalEntryId: string) => {
            const token = await getToken();
            if (!token) throw new Error('No authentication token');
            return journalService.deleteJournalEntry(journalEntryId, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
        },
    });
};

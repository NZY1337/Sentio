import { BACKEND_URL } from '../../helpers/constants';

export type CreateJournalEntryDto = {
    content: string;
    status?: string;
};

export type UpdateJournalEntryDto = {
    content?: string;
    status?: string;
};

const getJournalEntries = async (token: string) => {
    const response = await fetch(`${BACKEND_URL}/journal`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch journal entries');
    }
    return response.json();
};

const getJournalEntryById = async (journalEntryId: string, token: string) => {
    const response = await fetch(`${BACKEND_URL}/journal/${journalEntryId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch journal entry');
    }
    return response.json();
};

const createJournalEntry = async (data: CreateJournalEntryDto, token: string) => {
    const response = await fetch(`${BACKEND_URL}/journal`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create journal entry');
    }
    return response.json();
};

const updateJournalEntry = async (journalEntryId: string, data: UpdateJournalEntryDto, token: string) => {
    const response = await fetch(`${BACKEND_URL}/journal/${journalEntryId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update journal entry');
    }
    return response.json();
};

const deleteJournalEntry = async (journalEntryId: string, token: string) => {
    const response = await fetch(`${BACKEND_URL}/journal/${journalEntryId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete journal entry');
    }
    return response.json();
};

export const journalService = {
    getJournalEntries,
    getJournalEntryById,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
};

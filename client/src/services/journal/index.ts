import { BACKEND_URL } from '../../helpers/constants';

export type CreateJournalEntryDto = {
    content: string;
    status?: string;
};

export type UpdateJournalEntryDto = {
    content?: string;
    status?: string;
};

export type PaginationParams = {
    page?: number;
    limit?: number;
};

export type JournalSearchDto = {
    query: string;
    limit?: number;
};

export type JournalSearchResult = {
    id: string;
    createdAt: string;
    status: string;
    content: string;
    similarity: number;
    analysis?: {
        dominantEmotion?: string;
        cognitiveDistortion?: string;
        riskScore?: number;
    };
};

export type JournalSearchResponse = {
    query: string;
    queryEmotion: string | null;
    answer: string;
    confidence: {
        score: number;
        level: 'low' | 'medium' | 'high';
        rationale: string;
    };
    evidence: Array<{
        id: string;
        createdAt: string;
        similarity: number;
        dominantEmotion: string | null;
        snippet: string;
        reason: string;
    }>;
    matches: JournalSearchResult[];
};

const getJournalEntries = async (token: string, params?: PaginationParams) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `${BACKEND_URL}/journal${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
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

const searchJournalEntries = async (data: JournalSearchDto, token: string): Promise<JournalSearchResponse> => {
    const response = await fetch(`${BACKEND_URL}/journal/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to search journal entries');
    }

    return response.json();
};

export const journalService = {
    getJournalEntries,
    getJournalEntryById,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    searchJournalEntries,
};

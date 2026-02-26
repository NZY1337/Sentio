// src/components/Dashboard/DashboardContext.tsx
import { createContext, useState, useContext, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJournalEntries, useDeleteJournalEntry } from '../hooks/useJournal';
import type { JournalEntry } from '../../../types';

type DashboardContextType = {
    // Journal state
    journalEntries: JournalEntry[];
    isJournalsLoading: boolean;
    journalsError: Error | null;
    editingContent: string | null;
    editingId: string | null;
    editorKey: number;

    // Journal actions
    handleEditJournal: (journal: JournalEntry) => void;
    handleNewJournal: () => void;
    handleDeleteJournal: (journalEntryId: string) => Promise<void>;
    formatDate: (dateString: string) => string;
};

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
    const { data: journals, isLoading: isJournalsLoading, error: journalsError } = useJournalEntries();
    const deleteJournalEntryMutation = useDeleteJournalEntry();
    const navigate = useNavigate();

    const [editingContent, setEditingContent] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editorKey, setEditorKey] = useState(0); // force remount for editor

    const journalEntries = journals?.journalEntries || [];

    const handleEditJournal = (journal: JournalEntry) => {
        navigate(`/dashboard/journals/${journal.id}`);
    };

    const handleNewJournal = () => {
        setEditingContent(null);
        setEditingId(null);
        setEditorKey(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteJournal = async (journalEntryId: string) => {
        try {
            await deleteJournalEntryMutation.mutateAsync(journalEntryId);
        } catch (error) {
            console.log(error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <DashboardContext.Provider
            value={{
                journalEntries,
                isJournalsLoading,
                journalsError,
                editingContent,
                editingId,
                editorKey,
                handleEditJournal,
                handleNewJournal,
                handleDeleteJournal,
                formatDate,
            }}>
            {children}
        </DashboardContext.Provider>
    );
};

// Custom hook to use the Dashboard Context
export const useDashboardContext = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboardContext must be used within a DashboardProvider');
    }
    return context;
};


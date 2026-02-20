import './style.css'
import { Box, Button } from '@mui/material'

import { TextStyleKit } from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { useCreateJournalEntry, useUpdateJournalEntry } from '../../hooks/useJournal';
import { useState } from 'react';
import { MenuBar } from './MenuBar';

const extensions = [TextStyleKit, StarterKit]

import { useRef } from 'react';

export default function JournalEditor({ initialContent, editingId, onSaveOrSubmit, actionSlot }: { initialContent?: string | null, editingId?: string | null, onSaveOrSubmit?: () => void, actionSlot?: React.ReactNode }) {
    const [feedback, setFeedback] = useState<string | null>(null);
    const createJournalEntry = useCreateJournalEntry();
    const updateJournalEntry = useUpdateJournalEntry();
    let parsedContent = undefined;

    if (initialContent) {
        try {
            parsedContent = JSON.parse(initialContent);
        } catch {
            parsedContent = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: initialContent }] }] };
        }
    }

    const editor = useEditor({
        extensions,
        content: parsedContent || { type: 'doc', content: [{ type: 'paragraph' }] },
    });

    const saveDraftRef = useRef<HTMLButtonElement>(null);
    const submitRef = useRef<HTMLButtonElement>(null);

    const handleSaveDraft = async () => {
        if (!editor) return;
        const content = editor.getJSON();
        try {
            if (editingId) {
                await updateJournalEntry.mutateAsync({ journalEntryId: editingId, data: { content: JSON.stringify(content), status: 'draft' } });
                setFeedback('Draft updated!');
            } else {
                await createJournalEntry.mutateAsync({ content: JSON.stringify(content), status: 'draft' });
                setFeedback('Draft saved!');
            }
            if (onSaveOrSubmit) onSaveOrSubmit();
        } catch (e) {
            setFeedback('Failed to save draft.');
        }
    };

    const handleSubmit = async () => {
        if (!editor) return;
        const content = editor.getJSON();
        try {
            if (editingId) {
                await updateJournalEntry.mutateAsync({ journalEntryId: editingId, data: { content: JSON.stringify(content), status: 'submitted' } });
                setFeedback('Jurnal actualizat!');
            } else {
                await createJournalEntry.mutateAsync({ content: JSON.stringify(content), status: 'submitted' });
                setFeedback('Jurnal salvat!');
            }
            if (onSaveOrSubmit) onSaveOrSubmit();
        } catch (e) {
            setFeedback('Failed to submit.');
        }
    };

    return (
        <Box className="editor">
            <Box className="editor-container">
                <Box className="menu-bar">
                    <MenuBar editor={editor} />
                </Box>
                <Box>
                    <EditorContent editor={editor} />
                </Box>
            </Box>

            <Box className="editor-footer" display="flex" gap={2} alignItems="center">
                <button ref={saveDraftRef} id="save-draft-btn" style={{ display: 'none' }} onClick={handleSaveDraft} />
                <button ref={submitRef} id="submit-btn" style={{ display: 'none' }} onClick={handleSubmit} />
                {actionSlot}
                {feedback && <Box ml={2} color="primary.main">{feedback}</Box>}
            </Box>
        </Box>
    );
}
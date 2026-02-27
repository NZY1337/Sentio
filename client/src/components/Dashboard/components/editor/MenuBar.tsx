import type { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'

import { Button, IconButton, Tooltip, Typography, Box } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import CodeIcon from '@mui/icons-material/Code';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { menuBarStateSelector } from './menuBarState'

type ActionButtonProps = {
    label: string;
    icon?: React.ReactNode;
    isActive?: boolean;
    disabled?: boolean;
    iconOnly?: boolean;
    onClick: () => void;
};

const ActionButton = ({ label, icon, onClick, isActive, disabled, iconOnly = false }: ActionButtonProps) => {
    if (iconOnly && icon) {
        return (
            <Tooltip title={label}>
                <IconButton
                    size="small"
                    onClick={onClick}
                    disabled={disabled}
                    className={isActive ? 'is-active' : ''}
                    aria-label={label} >
                    {icon}
                </IconButton>
            </Tooltip>
        );
    }

    return (
        <Button
            variant="outlined"
            size="small"
            sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', m: 0.5 }}
            onClick={onClick}
            disabled={disabled}
            className={isActive ? 'is-active' : ''}
            aria-label={label}>
            {icon}
            <Typography variant='body2'>{label}</Typography>
        </Button>
    );
};

const ActionGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Box className='menu-action-group' aria-label={title}>
        <Box className="button-group" sx={{ m: 1 }}>{children}</Box>
    </Box>
);

export const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null;
    }

    const editorState = useEditorState({
        editor,
        selector: menuBarStateSelector,
    });

    return (
        <Box width="100%" sx={{ padding: 0 }}>
            <ActionGroup title="Inline formatting">
                <ActionButton label="Bold" icon={<FormatBoldIcon />} onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editorState.canBold} isActive={editorState.isBold} iconOnly />
                <ActionButton label="Italic" icon={<FormatItalicIcon />} onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editorState.canItalic} isActive={editorState.isItalic} iconOnly />
                <ActionButton label="Strike" icon={<FormatStrikethroughIcon />} onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editorState.canStrike} isActive={editorState.isStrike} iconOnly />
            </ActionGroup>

            <ActionGroup title="Headings">
                <ActionButton label="Paragraph" onClick={() => editor.chain().focus().setParagraph().run()} isActive={editorState.isParagraph} />
                <ActionButton label="H1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editorState.isHeading1} />
                <ActionButton label="H2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editorState.isHeading2} />
                <ActionButton label="H3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editorState.isHeading3} />
                <ActionButton label="H4" onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} isActive={editorState.isHeading4} />
                <ActionButton label="H5" onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()} isActive={editorState.isHeading5} />
                <ActionButton label="H6" onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()} isActive={editorState.isHeading6} />
            </ActionGroup>

            <ActionGroup title="Lists and blocks">
                <ActionButton label="Bullet list" icon={<FormatListBulletedIcon />} onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editorState.isBulletList} iconOnly />
                <ActionButton label="Ordered list" icon={<FormatListNumberedIcon />} onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editorState.isOrderedList} iconOnly />
                <ActionButton label="Code block" icon={<CodeIcon />} onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editorState.isCodeBlock} iconOnly />
                <ActionButton label="Blockquote" icon={<FormatQuoteIcon />} onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editorState.isBlockquote} iconOnly />
                <ActionButton label="Horizontal rule" icon={<LayersClearIcon />} onClick={() => editor.chain().focus().setHorizontalRule().run()} iconOnly />
                <ActionButton label="Hard break" icon={<FormatClearIcon />} onClick={() => editor.chain().focus().setHardBreak().run()} iconOnly />
            </ActionGroup>

            <ActionGroup title="History">
                <ActionButton label="Undo" icon={<UndoIcon />} onClick={() => editor.chain().focus().undo().run()} disabled={!editorState.canUndo} iconOnly />
                <ActionButton label="Redo" icon={<RedoIcon />} onClick={() => editor.chain().focus().redo().run()} disabled={!editorState.canRedo} iconOnly />
            </ActionGroup>
        </Box>
    );
}
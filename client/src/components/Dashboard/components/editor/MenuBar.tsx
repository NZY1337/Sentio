import type { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'

import { Button } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import CodeIcon from '@mui/icons-material/Code';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import Looks4Icon from '@mui/icons-material/Looks4';
import Looks5Icon from '@mui/icons-material/Looks5';
import Looks6Icon from '@mui/icons-material/Looks6';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { menuBarStateSelector } from './menuBarState'

export const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null;
    }

    const editorState = useEditorState({
        editor,
        selector: menuBarStateSelector,
    });

    return (
        <div className="control-group">
            <div className="button-group">
                <Button variant="contained" size="small" sx={{ mr: 1, mt: 1 }} onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editorState.canBold} className={editorState.isBold ? "is-active" : ""}>
                    <FormatBoldIcon /> Bold
                </Button>
                <Button variant="contained" size="small" sx={{ mr: 1, mt: 1 }} onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editorState.canItalic} className={editorState.isItalic ? "is-active" : ""}>
                    <FormatItalicIcon /> Italic
                </Button>
                <Button variant="contained" size="small" sx={{ mr: 1, mt: 1 }} onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editorState.canStrike} className={editorState.isStrike ? "is-active" : ""}>
                    <FormatStrikethroughIcon /> Strike
                </Button>
                <Button variant="contained" size="small" sx={{ mr: 1, mt: 1 }} onClick={() => editor.chain().focus().setParagraph().run()} className={editorState.isParagraph ? "is-active" : ""}>
                    Paragraph
                </Button>
                <Button variant="contained" size="small" sx={{ mr: 1, mt: 1 }} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editorState.isHeading1 ? "is-active" : ""}>
                    <LooksOneIcon /> H1
                </Button>
                <Button variant="contained" size="small" sx={{ mr: 1, mt: 1 }} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editorState.isHeading2 ? "is-active" : ""}>
                    <LooksTwoIcon /> H2
                </Button>
                <Button variant="contained" size="small" sx={{ mr: 1, mt: 1 }} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editorState.isHeading3 ? "is-active" : ""}>
                    <Looks3Icon /> H3
                </Button>
                <Button variant="contained" size="small" sx={{ mr: 1, mt: 1 }} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} className={editorState.isHeading4 ? "is-active" : ""}>
                    <Looks4Icon /> H4
                </Button>
                <Button variant="contained" size="small" sx={{ mr: 1, mt: 1 }} onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()} className={editorState.isHeading5 ? "is-active" : ""}>
                    <Looks5Icon /> H5
                </Button>
                <Button variant="contained" size="small" sx={{ mr: 1, mt: 1 }} onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()} className={editorState.isHeading6 ? "is-active" : ""}>
                    <Looks6Icon /> H6
                </Button>
                <Button variant="contained" size="small" sx={{ mr: 1, mt: 1 }} onClick={() => editor.chain().focus().toggleBulletList().run()} className={editorState.isBulletList ? "is-active" : ""}>
                    <FormatListBulletedIcon /> Bullet list
                </Button>
                <Button variant="contained" size="small" sx={{ mr: 1, mt: 1 }} onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editorState.isOrderedList ? "is-active" : ""}>
                    <FormatListNumberedIcon /> Ordered list
                </Button>
                <Button variant="contained" size="small" sx={{ mr: 1, mt: 1 }} onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editorState.isCodeBlock ? "is-active" : ""}>
                    <CodeIcon /> Code block
                </Button>
                <Button variant="contained" size="small" sx={{ mr: 1, mt: 1 }} onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editorState.isBlockquote ? "is-active" : ""}>
                    <FormatItalicIcon /> Blockquote
                </Button>
                <Button variant="contained" size="small" sx={{ mr: 1, mt: 1 }} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                    <LayersClearIcon /> Horizontal rule
                </Button>
                <Button variant="contained" size="small" sx={{ mr: 1, mt: 1 }} onClick={() => editor.chain().focus().setHardBreak().run()}>
                    <FormatClearIcon /> Hard break
                </Button>
                <Button variant="contained" size="small" sx={{ mr: 1, mt: 1 }} onClick={() => editor.chain().focus().undo().run()} disabled={!editorState.canUndo}>
                    <UndoIcon /> Undo
                </Button>
                <Button variant="contained" size="small" sx={{ mr: 1, mt: 1 }} onClick={() => editor.chain().focus().redo().run()} disabled={!editorState.canRedo}>
                    <RedoIcon /> Redo
                </Button>
            </div>
        </div>
    );
}
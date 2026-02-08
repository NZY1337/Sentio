import React from 'react';
import Dialog from '@mui/material/Dialog';
import { Box } from '@mui/material';
import type { DialogProps } from "@mui/material";

interface GenericDialogProps {
    children: React.ReactNode,
    onClose: () => void,
    open: boolean;
    sx?: object
}

const GenericDialog = ({ children, open, onClose }: GenericDialogProps) => {
    const handleClose: DialogProps["onClose"] = (_, reason) => {
        if (reason && reason === "backdropClick")
            return;
        onClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} >
            <Box sx={{ height: 'inherit', padding: 2 }}>
                {children}
            </Box>
        </Dialog >
    );
}

export default GenericDialog
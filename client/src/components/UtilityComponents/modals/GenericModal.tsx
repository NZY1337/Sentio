import React from 'react';
import Dialog from '@mui/material/Dialog';

interface GenericModalProps {
    children: React.ReactNode,
    open: boolean;
    sx?: object
}

const GenericModal = ({ children, open, }: GenericModalProps) => {
    return (
        <Dialog open={open} fullScreen={true} >
            {children}
        </Dialog >
    );
}

export default GenericModal
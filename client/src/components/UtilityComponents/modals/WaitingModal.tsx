import { useState, useEffect } from 'react';
import DialogContent from '@mui/material/DialogContent';
import GenericDialog from './GenericDialog';
import Typography from '@mui/material/Typography';

import customLoader from "../../../assets/motion-blur-2.svg";

interface PhotoGuidModalProps {
    open: boolean;
    handleClose: () => void;
}

const WaitingModal = ({ open, handleClose }: PhotoGuidModalProps) => {
    const [loadingStep, setLoadingStep] = useState("Starting...");

    useEffect(() => {
        let step = 0;
        setLoadingStep("Starting...");

        const steps = [
            "Generating your design—hang tight!",
            "Working some AI magic behind the scenes...",
            "Creating your image—demand is high, thanks for your patience!",
            "Putting on the final touches...",
        ];


        const interval = setInterval(() => {
            step++;
            if (step < steps.length) {
                setLoadingStep(steps[step]);
            } else {
                clearInterval(interval);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [open]);

    return (
        <GenericDialog open={open} onClose={handleClose} >
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 'auto', textAlign: 'center' }}>
                <img src={customLoader} style={{ height: '80px' }} alt="Loading" />
                <Typography margin={0} fontSize={16}>{loadingStep}</Typography>
            </DialogContent>
        </GenericDialog >
    );
}

export default WaitingModal;

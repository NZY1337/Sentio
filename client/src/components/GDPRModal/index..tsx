import { useState, useRef } from "react";

import { Typography, Button, Box } from "@mui/material";
import GenericDialog from "../UtilityComponents/modals/GenericDialog";
import { useUsersManagement } from "../../hooks/useUserManagement";
import { useAuth } from "@clerk/clerk-react";

interface GDPRModalInterface {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const GDPRModal = ({ open, setOpen }: GDPRModalInterface) => {
    const [disabled, setDisabled] = useState(true);
    const { userId } = useAuth();
    const { updateUserConsentMutation } = useUsersManagement();
    const consentRef = useRef<HTMLDivElement>(null);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.currentTarget;

        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight;
        const clientHeight = target.clientHeight;

        const isBottom = scrollTop + clientHeight >= scrollHeight - 5;

        if (isBottom) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    };

    const autoAcceptPolicty = () => {
        if (consentRef.current) {
            consentRef.current?.scrollTo({
                top: consentRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }

    const onHandleClickAction = () => {
        setOpen(false);
        setDisabled(true);
        if (userId) {
            updateUserConsentMutation.mutate({ userId });
        }
    }

    return (
        <GenericDialog open={open} onClose={() => setOpen(false)}>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                maxHeight: "30vh",
            }}>
                <Box ref={consentRef}
                    onScroll={handleScroll}
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        mb: 2,
                    }}>
                    <Typography sx={{ mb: 1 }}>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                        Ullam quia nisi ratione voluptates!
                        Incidunt exercitationem ducimus quos necessitatibus maiores labore,
                        deleniti laudantium molestias veritatis placeat magni est sit aliquam illum.
                    </Typography>

                    <Typography sx={{ mb: 1 }}>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                        Ullam quia nisi ratione voluptates!
                        Incidunt exercitationem ducimus quos necessitatibus maiores labore,
                        deleniti laudantium molestias veritatis placeat magni est sit aliquam illum.
                    </Typography>

                    <Typography sx={{ mb: 1 }}>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                        Ullam quia nisi ratione voluptates!
                        Incidunt exercitationem ducimus quos necessitatibus maiores labore,
                        deleniti laudantium molestias veritatis placeat magni est sit aliquam illum.
                    </Typography>

                    <Typography sx={{ mb: 1 }}>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                        Ullam quia nisi ratione voluptates!
                        Incidunt exercitationem ducimus quos necessitatibus maiores labore,
                        deleniti laudantium molestias veritatis placeat magni est sit aliquam illum.
                    </Typography>

                    <Typography sx={{ mb: 1 }}>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                        Ullam quia nisi ratione voluptates!
                        Incidunt exercitationem ducimus quos necessitatibus maiores labore,
                        deleniti laudantium molestias veritatis placeat magni est sit aliquam illum.
                    </Typography>
                </Box>

                <Box>
                    <Button
                        disabled={disabled}
                        variant="contained"
                        onClick={onHandleClickAction}
                        sx={{ alignSelf: "flex-end" }}>
                        Accepta si Inchide
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={autoAcceptPolicty}
                        sx={{ alignSelf: "flex-end", ml: 2 }}>
                        Scroll To end
                    </Button>
                </Box>
            </Box>
        </GenericDialog>
    );
};


export default GDPRModal;
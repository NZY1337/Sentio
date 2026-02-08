import React, { useState } from 'react';
import { IconButton, Menu } from '@mui/material';

const DropdownSetting = ({ children, icon }: { children: React.ReactNode, icon: React.ReactElement }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton sx={{ color: '#fff' }} loading={false} onClick={handleOpen}>
                {icon}
            </IconButton>

            <Menu
                sx={{ padding: '10px', background: 'none' }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{
                    vertical: 'bottom', // position the menu so it appears above the anchor point
                    horizontal: 'center',
                }}>
                {children}
            </Menu>
        </>
    );
};

export default DropdownSetting;
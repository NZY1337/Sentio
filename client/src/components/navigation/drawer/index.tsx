import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import RenderLinks from '../RenderLinks';
import { styled } from '@mui/material/styles';
import Close from '@mui/icons-material/Close';
import Menu from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';

const MobileDrawer = styled(Drawer)(({ theme }) => ({
    '.MuiList-root': {
        display: 'flex',
        flexDirection: 'column',
    },
    '.MuiBox-root': {
        position: 'relative',
        marginTop: '.5rem',  
                
        '.MuiList-root': {
            marginTop: '1rem',
        },
    },
    '.MuiMenuItem-root': { 
        minHeight: '48px',
        borderBottom: '1px solid rgba(255, 255, 255, .1)',
        webkitBackgroundClip: 'padding-box',
        backgroundClip: 'padding-box',
    },
    '.close-drawer': { 
        color: theme.palette.warning.light,
        // backgroundColor: 'unset',
        position: 'absolute',
        top: 0,
        right:0,
        '&:hover': {
            boxShadow: 'none',
            color: theme.palette.warning.dark,
            backgroundColor: 'unset',
        }
    },
    '.clerk-signin-button': {
        position: 'relative',
    },
})); 

export default function MenuDrawer() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} onClick={toggleDrawer(false)}>
        <RenderLinks />

        <Button color="warning" className='close-drawer'><Close /></Button>
    </Box>
  );

  return (
    <div>
        <IconButton sx={{ display: { md: "none" }}} onClick={toggleDrawer(true)} >
            <Menu />
        </IconButton>
        
        <MobileDrawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
        </MobileDrawer>
    </div>
  );
}

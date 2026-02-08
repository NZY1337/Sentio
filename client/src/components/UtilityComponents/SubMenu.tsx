import * as React from 'react';
import Menu from '@mui/material/Menu';
import { MenuItem, Link } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link as ReactRouterLink } from 'react-router-dom';

// this can be customized more if needed - passing  submenu link props, etc... | but for now we're good
const SubMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
        <MenuItem disableRipple>
            <Link  onClick={handleClick} display={'flex'} alignItems={'center'}>
                 Solutions  <ExpandMoreIcon />
            </Link>
        </MenuItem>
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
        >
            <MenuItem>
                <Link component={ReactRouterLink} to="/login">
                    Virtual Staging  
                </Link>
            </MenuItem>
            <MenuItem>
                <Link component={ReactRouterLink} to="/login">
                    Empty Your Space  
                </Link>
            </MenuItem>
            <MenuItem>
                <Link component={ReactRouterLink} to="/login">
                    Landscaping 
                </Link>
            </MenuItem>
        </Menu>
    </>
  );
}

export default SubMenu;
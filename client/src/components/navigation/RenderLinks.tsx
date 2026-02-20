import { MenuItem, Link, MenuList } from '@mui/material';
import { Link as ReactRouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';

// clerk
import { SignInButton, useUser, } from '@clerk/clerk-react';

const RenderLinks = () => {
    const { isSignedIn } = useUser();

    return (
        <MenuList sx={{ display: "flex" }}>
            <MenuItem disableRipple >
                <Link
                    component={ReactRouterLink}
                    to="/"
                    sx={{ color: 'white !important', textDecoration: 'none', '&:hover': { color: 'rgba(255,255,255,0.8)' } }}
                >
                    Home
                </Link>
            </MenuItem>
            {isSignedIn ? (
                <MenuItem disableRipple>
                    <Link
                        component={ReactRouterLink}
                        to="/dashboard"
                        sx={{ color: 'white', textDecoration: 'none', '&:hover': { color: 'rgba(255,255,255,0.8) !important' } }}
                    >
                        Dashboard
                    </Link>
                </MenuItem>
            ) :
                <>
                    <MenuItem disableRipple >
                        <SignInButton forceRedirectUrl={`/dashboard`}>
                            <Button className='clerk-signin-button' variant="contained" color="primary">
                                Login / Register
                            </Button>
                        </SignInButton>
                    </MenuItem>
                </>
            }

            {/* <MenuItem><ColorModeSelect /></ MenuItem> */}
        </MenuList>
    )
}

export default RenderLinks
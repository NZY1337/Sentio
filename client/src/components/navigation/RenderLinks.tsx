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
                <Link component={ReactRouterLink} to="/">
                    Home
                </Link>
            </MenuItem>
            {isSignedIn ? (
                <MenuItem disableRipple>
                    <Link
                        component={ReactRouterLink}
                        to="/dashboard">
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
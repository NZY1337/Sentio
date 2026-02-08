import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useUser } from '@clerk/clerk-react';

const ProtectedRoute = () => {
    const { isSignedIn, isLoaded } = useUser();
    const location = useLocation();

    if (!isLoaded) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress size={200} />
            </Box>
        );
    }

    return isSignedIn ? <Outlet /> : <Navigate to="/" replace state={{ from: location }} />;

};

export default ProtectedRoute;

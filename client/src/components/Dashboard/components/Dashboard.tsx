// ctx
import { DashboardProvider } from '../context/dashboardContext';

// hooks
import { useMemo } from 'react';
import { useColorScheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk, useAuth } from '@clerk/clerk-react';

// components
import DashboardTitle from './DashboardTitle';
import DashboardFooter from './DashboardFooter';
import Profile from '../pages/Profile';
import Projects from '../pages/Projects';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { Users } from '../pages/Users';
import { AppProvider } from '@toolpad/core/AppProvider';
import DashboardMain from '../pages/DashboardMain';

// Providers
import { NotificationsProvider } from '@toolpad/core/useNotifications';
import CustomThemeSwitcher from './CustomThemeSwitcher';

// utils
import { DASHBOARD_NAVIGATION } from '../../../helpers/constants';
import { createTheme } from '@mui/material/styles';
import { typography, components, colorSchemes, palette } from '../context/themeContext';

// types
import { type Router } from '@toolpad/core';
import { type Session } from '@toolpad/core/AppProvider';
import NotFoundPage from '../../NotFound/NotFoundPage';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useUser();
    const { signOut } = useClerk();

    useAuth(); // is it necessary to call this here if we're already using useUser and useClerk? maybe not, but it doesn't hurt to ensure the user is authenticated

    const { setMode, mode } = useColorScheme() as {
        setMode: (mode: 'light' | 'dark') => void;
        mode: 'light' | 'dark';
    };

    const dashboardSession = {
        user: {
            name: user?.fullName,
            image: user?.imageUrl || 'https://avatars.githubusercontent.com/c',
            email: user?.emailAddresses[0].emailAddress, id: user?.id
        } as Session['user']
    }

    const router: Router = useMemo(() => ({
        navigate: (path: string | URL) => {
            const newPath = path.toString();
            if (window.location.pathname !== newPath) { // ✅ Prevents re-navigation if already on the same page
                navigate(newPath);
            }
        },
        pathname: window.location.pathname,
        searchParams: new URLSearchParams(window.location.search),
    }), [navigate]);

    const memoizedTheme = useMemo(() =>
        createTheme({
            colorSchemes,
            typography,
            components,
            palette: { ...palette }
        }), [mode]);

    const authentication = useMemo(() => ({
        signIn: () => { }, signOut
    }), [signOut]);

    const renderContent = () => {
        switch (router.pathname) {
            case '/dashboard':
                return <DashboardMain />;

            case '/dashboard/projects':
                return <Projects />;

            case '/dashboard/profile':
                return <Profile />;

            case '/dashboard/users':
                return <Users />;

            default:
                return <NotFoundPage />;
        }
    };

    return (
        <AppProvider
            session={dashboardSession}
            authentication={authentication}
            navigation={DASHBOARD_NAVIGATION}
            router={router}
            theme={memoizedTheme}>
            <DashboardProvider>
                <NotificationsProvider slotProps={{ snackbar: { anchorOrigin: { vertical: 'bottom', horizontal: 'right' } } }}>
                    <DashboardLayout
                        slots={{
                            sidebarFooter: DashboardFooter,
                            appTitle: DashboardTitle,
                            toolbarActions: () => {
                                return <>
                                    <CustomThemeSwitcher setMode={setMode} mode={mode} />
                                </>
                            }
                        }}>
                        <PageContainer
                            title=''
                            // breadcrumbs={[]}
                            className='dashboard-page-container'>
                            {renderContent()}
                        </PageContainer>
                    </DashboardLayout>
                </NotificationsProvider>
            </DashboardProvider>
        </AppProvider>
    );
}

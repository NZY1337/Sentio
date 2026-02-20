// ctx
import { DashboardProvider } from '../context/dashboardContext';

// hooks
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk, useAuth } from '@clerk/clerk-react';

// components
import DashboardTitle from './DashboardTitle';
import DashboardFooter from './DashboardFooter';
import Profile from '../pages/Profile';
import Journal from '../pages/Journal';
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
import { appTheme } from '../../../context/AppTheme';

// types
import { type Router } from '@toolpad/core';
import { type Session } from '@toolpad/core/AppProvider';
import NotFoundPage from '../../NotFound/NotFoundPage';

import { useUsersManagement } from '../../../hooks/useUserManagement';

export default function Dashboard() {
    const { user: suppabaseUser } = useUsersManagement();
    const { user: clerkUser } = useUser();

    const navigate = useNavigate();
    const { signOut } = useClerk();

    useAuth(); // is it necessary to call this here if we're already using useUser and useClerk? maybe not, but it doesn't hurt to ensure the user is authenticated

    const dashboardSession = {
        user: {
            name: clerkUser?.fullName,
            image: clerkUser?.imageUrl || 'https://avatars.githubusercontent.com/c',
            email: clerkUser?.emailAddresses[0].emailAddress, id: clerkUser?.id
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

    const authentication = useMemo(() => ({
        signIn: () => { },
        signOut
    }), [signOut]);

    const renderContent = () => {
        switch (router.pathname) {
            case '/dashboard':
                return <DashboardMain />;

            case '/dashboard/journal':
                return <Journal />;

            case '/dashboard/profile':
                return <Profile />;

            case '/dashboard/users':
                return <Users />;

            default:
                return <NotFoundPage />;
        }
    };

    // it takes a breakpoint or false
    const disableWullwidth = () => router.pathname === '/dashboard/journal' ? 'lg' : false;

    return (

        <AppProvider
            session={dashboardSession}
            authentication={authentication}
            navigation={DASHBOARD_NAVIGATION}
            router={router}
            theme={appTheme}>
            <DashboardProvider>
                <NotificationsProvider slotProps={{ snackbar: { anchorOrigin: { vertical: 'bottom', horizontal: 'right' } } }}>
                    <DashboardLayout
                        slots={{
                            sidebarFooter: DashboardFooter,
                            appTitle: DashboardTitle,
                            toolbarActions: CustomThemeSwitcher,
                        }}>
                        {/* breadcrumbs={[]} */}
                        <PageContainer maxWidth={disableWullwidth()} title=''>
                            {renderContent()}
                        </PageContainer>
                    </DashboardLayout>
                </NotificationsProvider>
            </DashboardProvider>
        </AppProvider >

    );
}

// ctx
import { DashboardProvider } from '../context/dashboardContext';

// hooks
import { useMemo } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useUser, useClerk, useAuth } from '@clerk/clerk-react';

// components
import DashboardTitle from './DashboardTitle';
import DashboardFooter from './DashboardFooter';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { AppProvider } from '@toolpad/core/AppProvider';
import ToolbarActions from './ToolbarActions';

// Providers
import { NotificationsProvider } from '@toolpad/core/useNotifications';

// utils
import { DASHBOARD_NAVIGATION } from '../../../helpers/constants';
import { appTheme } from '../../../context/AppTheme';

// types
import { type Router } from '@toolpad/core';
import { type Session } from '@toolpad/core/AppProvider';

import { useUsersManagement } from '../../../hooks/useUserManagement';

export default function Dashboard() {
    const { user: suppabaseUser } = useUsersManagement();
    const { user: clerkUser } = useUser();

    const navigate = useNavigate();
    const location = useLocation();
    const { signOut } = useClerk();

    useAuth();

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
            if (location.pathname !== newPath) {
                navigate(newPath);
            }
        },
        pathname: location.pathname,
        searchParams: new URLSearchParams(location.search),
    }), [navigate, location]);

    const authentication = useMemo(() => ({
        signIn: () => { },
        signOut
    }), [signOut]);

    // it takes a breakpoint or false
    const disableFullwidth = () => location.pathname !== '/dashboard' ? 'lg' : false;

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
                            toolbarActions: ToolbarActions,
                        }}>
                        <PageContainer maxWidth={disableFullwidth()} title=''>
                            <Outlet />
                        </PageContainer>
                    </DashboardLayout>
                </NotificationsProvider>
            </DashboardProvider>
        </AppProvider>
    );
}

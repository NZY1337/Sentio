import DashboardIcon from '@mui/icons-material/Dashboard';
import UserIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';

// types
import type { Navigation } from '@toolpad/core/AppProvider';

export const BACKEND_URL = "http://localhost:3010/api";

export const DASHBOARD_NAVIGATION: Navigation = [
    {
        segment: 'dashboard',
        title: 'Dashboard',
        icon: <DashboardIcon />,
        // children: [
        //     {
        //         segment: 'raiderz',
        //         title: 'Arc Raiderz',
        //         icon: <DashboardIcon />,
        //     },
        // ],
    },
    {
        segment: 'dashboard/journal',
        title: 'Journal',
        icon: <FolderIcon />,
    },
    {
        segment: 'dashboard/profile',
        title: 'Profile',
        icon: <UserIcon />,
    },
    {
        segment: 'dashboard/users',
        title: 'Users',
        icon: <UserIcon />,
    },
];

export const DASHBOARD_NAV_BACKGROUND = {
    dark: {
        backgroundColor: '#e5e5f7',
        backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, #212121 150px), repeating-linear-gradient(#212121, #000000)`
    },
    light: {
        backgroundColor: '#e5e5f7',
        backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, #efefef 150px), repeating-linear-gradient(#ffffff, #ffffff)`
    },
    setBackgroundNav: function (mode: "light" | "dark") {
        return this[mode];
    },
}

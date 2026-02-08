import type { SidebarFooterProps } from '@toolpad/core/DashboardLayout';
import Typography from '@mui/material/Typography';

function DashboardFooter({ mini }: SidebarFooterProps) {
    return (
        <Typography variant="caption" sx={{ m: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>
            {mini ? '© Andrei Mocanu' : `© ${new Date().getFullYear()} All rights reserved`}
        </Typography>
    );
}

export default DashboardFooter;
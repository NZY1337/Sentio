import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// hooks
import { useNavigate } from 'react-router-dom';

function DashboardTitle() {
    const navigate = useNavigate();
    const handleClick = () => navigate('/');

    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <Typography fontWeight={600} variant="body1" sx={{ cursor: 'pointer', color: 'warning.light' }} onClick={handleClick}>HOME</Typography>
        </Stack>
    );
}

export default DashboardTitle;
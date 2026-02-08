import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flexDirection: 'column',
      }}
    >
      <Box>
        <Typography variant="h1" color="primary" fontWeight="bold">
          404
        </Typography>
        <Typography variant="h5" color="textSecondary" sx={{ mb: 2 }}>
            Oops! The page you’re looking for doesn’t exist.
        </Typography>
        <Button variant="contained" color="primary" size="medium" onClick={handleGoHome}>
            Go Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;

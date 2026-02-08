import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const PulsatingIconTitle = ({ 
        title, 
        animationDelay = 0, 
        icon,
        selected,
    }: { title: string, animationDelay?: number, icon: React.ReactNode, selected: boolean }) => {
    
    return (
        <Box 
            display={'inline-flex'}
            padding={2} 
            borderRadius={2}
            sx={{
                ...(selected ? { 
                    border: '5px solid #191B19', 
                    borderStyle: 'double', 
                    backgroundColor: '#000',
                    opacity: '.9' 
                } : { border: '5px solid transparent' }),

                transition: 'all .5s ease-in-out',
                '& .MuiTypography-root': {
                        color: 'grey.400',
                        transition: 'color .5s ease-in-out'
                },
                '&:hover': {
                    cursor: 'pointer',
                    opacity: '.9',
                    backgroundColor: '#000',
                    '& .MuiTypography-root': {
                        color: 'grey.100',
                        transition: 'color .5s ease-in-out'
                    }
                }
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    fontSize: '1.25rem',
                    zIndex: 1
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 1,
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '-5px',
                            left: '-5px',
                            width: '25px',
                            height: '25px',
                            borderRadius: '50%',
                            backgroundColor: '#ff6f61', // Circle 1
                            zIndex: -1,
                            opacity: '0.2',
                            animation: 'pulsate 4s ease-in-out infinite', // Animation
                            animationDelay: `${animationDelay}s`,
                            animationPlayState: selected ? 'paused' : 'running',
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-5px',
                            right: '-5px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: '#6b5b95', // Circle 2
                            zIndex: -1,
                            opacity: '0.2',
                            animation: 'pulsate 4s ease-in-out infinite',
                            animationDelay: `${animationDelay + 0.5}s`,
                            animationPlayState: selected ? 'paused' : 'running',
                        },
                        '@keyframes pulsate': {
                            '0%': {
                                transform: 'scale(1)',
                                opacity: 0.2,
                            },
                            '50%': {
                                transform: 'scale(1.2)', // Pulsating effect (scale up)
                                opacity: 1,
                            },
                            '100%': {
                                transform: 'scale(1)',
                                opacity: 0.2,
                            },
                        },
                    }}
                >
                    {icon}
                </Box>
                {title}
            </Typography>
        </Box>
    );
};

export default PulsatingIconTitle;
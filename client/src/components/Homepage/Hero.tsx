import { Box, Typography, Container, Button } from '@mui/material';
import ArrowRight from '@mui/icons-material/ArrowRight';
import Navigation from '../navigation/Navigation';

import { TypeAnimation } from 'react-type-animation';

// https://images.unsplash.com/photo-1606744888344-493238951221?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D

const Hero = () => {
    const hero = 'https://images.unsplash.com/photo-1769708984146-11ca9c436685?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    return (
        <Container maxWidth={false}
            sx={{
                height: '93vh',
                width: '100%',
                // backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(https://images.unsplash.com/photo-1512972972907-6d71529c5e92?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url(${hero})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                color: '#fff',
                textAlign: 'center',
                p: 3,
            }}>
            <Navigation />
            <Container>
                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', }}>
                    <Typography variant="body2" sx={{ borderRadius: '8px', fontWeight: '400', fontSize: '18px' }}>
                        <TypeAnimation sequence={['Create de oameni', 1500, 'Pentru Oameni', 1500,]}
                            wrapper="span"
                            cursor={true}
                            repeat={Infinity}
                            speed={75}
                            style={{ display: 'inline-block', color: '#ffa500' }}
                        />
                    </Typography>

                    <Typography variant="h1" sx={{ mb: 3, borderRadius: '8px', fontWeight: 'bold' }}>
                        Bun Venit la Sentio
                    </Typography>

                    <Typography variant="subtitle1" sx={(theme) => ({
                        width: '50%',
                        [theme.breakpoints.down('lg')]: {
                            width: '100%'
                        },
                    })}>
                        Monitorizează-ți emoțiile, înțelege-ți tiparele și primește insight-uri personalizate asistate AI, cu suportul unui psiholog acreditat.
                    </Typography>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start', gap: 2 }}>
                        <Button variant='contained'>Incepe Acum</Button>
                        <Button sx={{ color: 'orange' }} variant='outlined'>Solicită o demonstrație <ArrowRight /></Button>
                    </Box>
                </Box>
            </Container>
        </Container>
    );
};

export default Hero;


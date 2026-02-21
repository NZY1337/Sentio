import { Box, Typography, Container, Button, Grid } from '@mui/material';
import ArrowRight from '@mui/icons-material/ArrowRight';
import Navigation from '../navigation/Navigation';
import './Homepage';
import { TypeAnimation } from 'react-type-animation';
import imageUrl from '../../assets/dashboard.png';
// https://images.unsplash.com/photo-1606744888344-493238951221?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D

const Hero = () => {
    const hero = 'https://images.pexels.com/photos/458530/pexels-photo-458530.jpeg';

    const words = ["REACT", "MUIRE", "FIGMA", "VUEJS"];
    const radius = 120;
    const center = 150;

    // const imageUrl = 'https://images.pexels.com/photos/458530/pexels-photo-458530.jpeg';
    return (
        <>
            <Container maxWidth={false}
                sx={{
                    height: '100vh',
                    // width: '100%',
                    // backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(https://images.unsplash.com/photo-1512972972907-6d71529c5e92?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
                    backgroundImage: `linear-gradient(rgba(24, 5, 5, 0.1), rgba(0, 0, 0, 0.9)), url(${hero})`,
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
                <Container sx={{ height: '100%' }}>
                    <Navigation />
                    <Grid container sx={{ alignItems: 'center', height: '100%', justifyContent: '' }} spacing={4}>
                        <Grid size={{ xl: 6 }} sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', }}>
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
                        </Grid>

                        <Grid size={{ xl: 6 }} >
                            <svg width="300" height="300" viewBox="0 0 300 300">
                                <defs>
                                    <path
                                        id="circlePath"
                                        d={`
                                            M ${center},${center}
                                            m -${radius},0
                                            a ${radius},${radius} 0 1,0 ${radius * 2},0
                                            a ${radius},${radius} 0 1,0 -${radius * 2},0
                                        `}
                                    />
                                </defs>

                                {words.map((word, index) => {
                                    // distribuim fiecare cuvânt pe cerc la un offset egal
                                    const offsetPercent = (index / words.length) * 100;
                                    return (
                                        <text key={index} fontSize="12.5" fontFamily="sans-serif" fill="#c5d6c9" style={{ letterSpacing: "10px", animation: "spin 12s linear infinite" }}>
                                            <textPath href="#circlePath" startOffset={`${offsetPercent}%`} method="align" spacing="auto">
                                                {word}
                                            </textPath>
                                        </text>
                                    );
                                })}

                                <style>{`
                                        @keyframes spin {
                                            0% { transform: rotate(0deg); transform-origin: ${center}px ${center}px; }
                                            100% { transform: rotate(360deg); transform-origin: ${center}px ${center}px; }
                                        }
                                    `}
                                </style>
                            </svg>
                        </Grid>
                    </Grid>
                </Container>
            </Container >
            <Container sx={{ padding: 0, textAlign: 'center' }}>
                <img src={imageUrl} width="100%" height="100%" style={{ objectFit: 'cover', borderRadius: 5 }} alt="Dashboard preview" />
            </Container>
        </>
    );
};

export default Hero;


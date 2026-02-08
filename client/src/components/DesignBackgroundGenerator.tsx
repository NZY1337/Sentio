import React from 'react';
import { Box } from '@mui/material';
import bgShape from '../../src/assets/bg-shapes.jpg';

export default function DesignGeneratorBackground({ children }: { children: React.ReactNode }) {
    return (
        <Box
            className="design-generator-background"
            sx={{
                height: '100%',
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${bgShape})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative!important',
                fontFamily: 'Inter, sans-serif',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -160,
                    right: -160,
                    width: 400,
                    height: 400,
                    bgcolor: '#fff',
                    borderRadius: '50%',
                    opacity: 0.2,
                    filter: 'blur(140px)',
                    zIndex: 0,
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: 200,
                    left: 100,
                    width: 200,
                    height: 200,
                    bgcolor: '#000',
                    borderRadius: '50%',
                    opacity: 0.25,
                    filter: 'blur(80px)',
                    zIndex: 0,
                }}
            />

            {children}
        </Box>
    );
}

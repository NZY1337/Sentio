import React from 'react';
import {
    Typography, Card, CardContent, Box, Chip, Stack,
    useTheme,
    Container,
    Button,
    Grid
} from "@mui/material";

import { mockUsers } from '../../../mockData';

const cardsData = [
    { title: "Pro Membership", price: "€29", desc: "Unlimited AI generations, priority and chat support.", bg: "radial-gradient(circle at bottom right, rgba(0, 255, 200, 0.35), rgba(0,0,0,0) 60%)", },
    {
        title: "Business Plan", price: "€59", desc: "Team collaboration, analytics, wakeup calls & more.", bg: "radial-gradient(circle at bottom right, rgba(138, 43, 226, 0.35), rgba(255,192,203,0) 60%)",
    },
    {
        title: "Enterprise", price: "€99", desc: "Full customization and dedicated support.", bg: "radial-gradient(circle at bottom right, rgba(255,165,0,0.35), rgba(255,255,0,0) 60%)",
    },
];

import MyEditor from '../components/editor/index';

const DashboardMain: React.FC = () => {
    return (
        <Box>
            <HeroCardWithImage />
            <ModernCardGrid />

            {/* <MyEditor /> */}

            {/* {mockUsers.map((user) => (
                <Card key={user.id} sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h5">{user.username}</Typography>
                        <Typography variant="subtitle2">{user.email}</Typography>

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1">Jurnale:</Typography>
                            {user.journals.map((j) => (
                                <Card key={j.id} sx={{ mb: 2, p: 2 }}>
                                    <Typography>{j.content}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Emoție dominantă: {j.analysis.dominantEmotion} | Tipare: {j.analysis.cognitiveDistortion} | Scor risc: {j.analysis.riskScore}
                                    </Typography>
                                </Card>
                            ))}
                        </Box>

                        {user.alerts.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1">Alerte:</Typography>
                                {user.alerts.map((a) => (
                                    <Chip key={a.id} label={a.message} color={a.level === "critical" ? "error" : "warning"} sx={{ mr: 1 }} />
                                ))}
                            </Box>
                        )}
                    </CardContent>
                </Card>
            ))} */}
        </Box>
    );
};

const ModernCardGrid = () => {
    return (
        <Box sx={{ my: 5 }}>
            <Grid container spacing={4}>
                {cardsData.map((card, index) => (
                    <Grid size={{ xs: 12, md: 4 }} key={index}>
                        <Card
                            sx={{
                                borderRadius: 4,
                                overflow: "hidden",
                                backdropFilter: "blur(20px)",
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.2)",
                                transition: "all 0.4s ease",
                                "&:hover": {
                                    transform: "translateY(-8px)",
                                    cursor: 'pointer'
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    p: 3,
                                    // background: card.bg,
                                    borderBottom: "1px solid rgba(255,255,255,0.15)",
                                }}
                            >
                                <Typography
                                    variant="overline"
                                    sx={{ letterSpacing: 2, color: "rgba(255,255,255,0.7)" }}
                                >
                                    PLAN
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 600, color: "white", mt: 1 }}>
                                    {card.title}
                                </Typography>
                            </Box>

                            <CardContent
                                sx={{
                                    position: "relative",
                                    p: 4,
                                    background: card.bg,
                                    // background: `radial-gradient(circle at bottom right, rgba(0, 255, 200, 0.35), rgba(0,0,0,0) 60%)`,
                                }}
                            >
                                <Stack spacing={2}>
                                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                                        {card.desc}
                                    </Typography>

                                    <Typography variant="h3" sx={{ fontWeight: 800, color: "white" }}>
                                        {card.price}
                                        <Typography
                                            component="span"
                                            variant="body1"
                                            sx={{ fontWeight: 400, color: "rgba(255,255,255,0.6)" }}
                                        >
                                            /month
                                        </Typography>
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box >
    );
};

const HeroCardWithImage = () => {
    return (
        <Box
            sx={{
                mb: 4,
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    // maxWidth: 800,
                    height: 350,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 4,
                    position: "relative",
                    overflow: "hidden",
                    backgroundImage: `
            url("https://images.pexels.com/photos/9573973/pexels-photo-9573973.jpeg")
          `,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* DARK OVERLAY */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.45)",
                        backdropFilter: "blur(8px)",
                    }}
                />

                {/* CONTENT */}
                <Box
                    sx={{
                        position: "relative",
                        zIndex: 1,
                        p: 4,
                        color: "white",
                    }}
                >
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                        Welcome to Sentio
                    </Typography>
                    <Typography variant="body1" width="80%" sx={{ color: "rgba(255,255,255,0.8)" }}>
                        We value your privacy and are committed to protecting your personal data. Our application collects and processes data solely for the purpose of providing you with a personalized journaling experience. We do not share your data with third parties, and we implement robust security measures to safeguard your information. By using our application, you consent to our data collection practices as outlined in our Privacy Policy.
                    </Typography>
                    <Button variant="contained" color="primary" sx={{ mt: 3 }}>
                        citeste gdpr
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardMain;

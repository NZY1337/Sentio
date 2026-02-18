import React, { useState } from 'react';
import { Typography, Card, CardContent, Box, Stack, Grid } from "@mui/material";
import GDPRModal from '../../GDPRModal/index.';
import HeroCardWithImage, { HeroCardWithImage2 } from '../../HeroCard';
import { mockUsers } from '../../../mockData';
import { useUsersManagement } from '../../../hooks/useUserManagement';
import Editor from '../components/editor/index';
import QuickStatsSection from '../components/QuickStatsSection';
import MoodTrendChart from '../components/QuickStatsSection/Charts';

const cardsData = [
    { title: "Pro Membership", price: "€29", desc: "Unlimited AI generations, priority and chat support.", bg: "radial-gradient(circle at bottom right, rgba(0, 255, 200, 0.35), rgba(0,0,0,0) 60%)", },
    {
        title: "Business Plan", price: "€59", desc: "Team collaboration, analytics, wakeup calls & more.", bg: "radial-gradient(circle at bottom right, rgba(138, 43, 226, 0.35), rgba(255,192,203,0) 60%)",
    },
    {
        title: "Enterprise", price: "€99", desc: "Full customization and dedicated support.", bg: "radial-gradient(circle at bottom right, rgba(255,165,0,0.35), rgba(255,255,0,0) 60%)",
    },
];

const DashboardMain: React.FC = () => {
    const [isGDPROpen, setIsGDPROpen] = useState(false);
    const { user } = useUsersManagement();

    const handleOpenGDPRModal = () => setIsGDPROpen(true);
    console.log(user?.consent)
    return (
        <Box>
            {/* <ModernCardGrid /> */}
            <GDPRModal open={isGDPROpen} setOpen={setIsGDPROpen} />

            {!user?.consent ? <HeroCardWithImage onClick={handleOpenGDPRModal} /> : null}

            <Box >
                <Box flex={1}>
                    {user?.consent && <HeroCardWithImage2 />}
                </Box>
                <Box flex={2} display="flex" gap={2}>
                    <Box flex={1}>
                        <QuickStatsSection />
                    </Box>
                    <Box flex={1}>
                        <MoodTrendChart />
                    </Box>
                </Box>
            </Box>

            {/* {user?.consent && <Editor />} */}

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

export default DashboardMain;

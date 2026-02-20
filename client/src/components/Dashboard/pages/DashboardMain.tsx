

// hooks
import { useState } from 'react';
import { useUsersManagement } from '../../../hooks/useUserManagement';
import { useDashboardContext } from '../context/dashboardContext';

// components
import { Typography, Card, CardContent, Box, Stack, Grid } from "@mui/material";
import ConsentModal from '../../ConsentModal/index.';
import HeroCardWithImage, { HeroCardWithImage2 } from '../../HeroCard';
import MoodTrendChart from '../components/QuickStatsSection/Charts';
import QuickStatsSection from '../components/QuickStatsSection';

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
    const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
    const {
        journalEntries,
        handleEditJournal,
        handleDeleteJournal
    } = useDashboardContext();
    const { user } = useUsersManagement();

    const handleConsentModal = () => setIsConsentModalOpen(true);

    return (
        <>
            {!user?.consent && (
                <Grid container spacing={2} alignItems="stretch">
                    <Grid size={7} sx={{ display: "flex" }}>
                        <ConsentModal open={isConsentModalOpen} setOpen={setIsConsentModalOpen} />
                        <HeroCardWithImage onClick={handleConsentModal} />
                    </Grid>

                    <Grid size={5} sx={{ display: "flex" }}>
                        <MoodTrendChart />
                    </Grid>
                </Grid>
            )}

            {user?.consent && (
                <Grid container spacing={2}>
                    <Grid size={{ xl: 7 }}>
                        <HeroCardWithImage2 />
                    </Grid>

                    <Grid size={{ xl: 5 }}>
                        <MoodTrendChart />
                    </Grid>

                    <QuickStatsSection editMode={true} onDelete={handleDeleteJournal} onEdit={handleEditJournal} journalEntries={journalEntries} />
                </Grid>
            )}
        </>
    );
};

export const ModernCardGrid = () => {
    return (
        <Grid container mt={5} spacing={2} sx={{ width: '100%' }}>
            {cardsData.map((card, index) => (
                <Grid size={{ xs: 12, md: 4 }} sx={{ width: '100%' }} key={index} >
                    <Card
                        sx={(theme) => ({
                            width: "100%",
                            margin: "0 auto",
                            padding: 0,
                            borderRadius: 4,
                            overflow: "hidden",
                            backdropFilter: "blur(20px)",
                            // background: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            transition: "all 0.4s ease",
                            "&:hover": { transform: "translateY(-8px)", cursor: 'pointer' },
                        })}>
                        <Box sx={(theme) => ({
                            p: 2,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                        })}>
                            <Typography variant="overline" sx={(theme) => ({
                                letterSpacing: 2,
                                color: theme.palette.text.secondary,
                            })}>
                                PLAN
                            </Typography>
                            <Typography variant="h5" sx={(theme) => ({
                                fontWeight: 600,
                                mt: 1,
                            })}>
                                {card.title}
                            </Typography>
                        </Box>

                        <CardContent sx={{ position: "relative", p: 2, background: card.bg }}>
                            <Stack spacing={2}>
                                <Typography variant="body2" sx={(theme) => ({
                                    color: theme.palette.text.secondary,
                                })}>
                                    {card.desc}
                                </Typography>

                                <Typography variant="h3" sx={(theme) => ({
                                    fontWeight: 800,
                                })}>
                                    {card.price}
                                    <Typography
                                        component="span"
                                        variant="body1"
                                        sx={(theme) => ({
                                            fontWeight: 400,
                                            color: theme.palette.text.secondary,
                                        })}
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
    );
};

export default DashboardMain;


// import { mockUsers } from '../../../mockData';
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

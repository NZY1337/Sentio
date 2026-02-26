import {
    Typography, Box, Button,
} from "@mui/material";
import { ModernCardGrid } from "../Dashboard/pages/Dashboard";
import happyDoctor from "../../assets/happy-doctor.png";

interface HeroCardWithImageProps {
    onClick: () => void;
}

const HeroCardWithImage = ({
    onClick
}: HeroCardWithImageProps) => {
    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4,
                position: "relative",
                overflow: "hidden",
                backgroundImage: `url("https://images.pexels.com/photos/9573973/pexels-photo-9573973.jpeg")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}>
            <Box sx={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(8px)",
            }} />
            <Box sx={{
                position: "relative",
                zIndex: 1,
                p: 4,
                color: "white",
            }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    Welcome to Sentio
                </Typography>
                <Typography variant="body1" width="80%" sx={{ color: "rgba(255,255,255,0.8)" }}>
                    We value your privacy and are committed to protecting your personal data. Our application collects and processes data solely for the purpose of providing you with a personalized journaling experience.ur Privacy Policy.
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={onClick}>
                    citeste gdpr
                </Button>
            </Box>
        </Box>
    );
};

export const HeroCardWithImage2 = () => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
            }}>
            <Box
                sx={(theme) => ({
                    p: 2,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    borderRadius: 4,
                    position: "relative",
                    overflow: "hidden",
                    // background: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                })}>
                {/* <Box
                    sx={{
                        position: "absolute",
                        right: 35,
                        top: 45,
                        zIndex: 1,
                        width: 150,
                        animation: "floating 5s ease-in-out infinite",
                        "@keyframes floating": {
                            "0%": { transform: "translateY(0px)" },
                            "50%": { transform: "translateY(-15px)" },
                            "100%": { transform: "translateY(0px)" },
                        },
                    }}>
                    <img
                        src={happyDoctor}
                        width="100%"
                        height="100%"
                        alt="Happy Doctor"
                        style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                </Box> */}

                <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Typography sx={(theme) => ({
                        fontWeight: 400,
                        mb: 1,
                        fontSize: 30,
                    })}>
                        Bine ai venit, Andrei! 👋
                    </Typography>
                    <Typography variant="body1" width="75%" mt={1} sx={(theme) => ({
                        color: theme.palette.text.secondary,
                    })}>
                        We value your privacy and are committed to protecting your personal data. Our application collects and processes data solely for the purpose of providing you with a personalized journaling experience.
                    </Typography>
                </Box>
                <ModernCardGrid />
            </Box>
        </Box>
    );
};

export default HeroCardWithImage
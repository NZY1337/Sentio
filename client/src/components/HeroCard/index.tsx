import {
    Typography, Box,
    Button,
} from "@mui/material";

interface HeroCardWithImageProps {
    onClick: () => void;
}

const HeroCardWithImage = ({
    onClick
}: HeroCardWithImageProps) => {
    return (
        <Box
            sx={{
                mb: 4,
                display: "flex",
                justifyContent: "center",
            }}>
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
                        We value your privacy and are committed to protecting your personal data. Our application collects and processes data solely for the purpose of providing you with a personalized journaling experience. We do not share your data with third parties, and we implement robust security measures to safeguard your information. By using our application, you consent to our data collection practices as outlined in our Privacy Policy.
                    </Typography>
                    <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={onClick}>
                        citeste gdpr
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export const HeroCardWithImage2 = () => {
    return (
        <Box
            sx={{
                mb: 4,
                display: "flex",
                justifyContent: "center",
            }}>
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
            url("https://images.pexels.com/photos/2034892/pexels-photo-2034892.jpeg")
          `,
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
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
                        Bine ai venit, Andrei!
                    </Typography>
                    <Typography variant="body1" width="80%" mt={3} fontSize={20} sx={{ color: "rgba(255,255,255,0.8)" }}>
                        Cum te simti astazi?
                    </Typography>
                    <Typography variant="body1" width="80%" mt={1}>
                        We value your privacy and are committed to protecting your personal data. Our application collects and processes data solely for the purpose of providing you with a personalized journaling experience.
                    </Typography>
                </Box>
            </Box>
        </Box >
    );
};

export default HeroCardWithImage
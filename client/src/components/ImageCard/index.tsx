import {
    Typography, Box, Button,
} from "@mui/material";

interface ImageCardProps {
    onClick: () => void;
    title?: string;
    description?: string;
    bgImage?: string;
    buttonText?: string;
    showButton?: boolean;
}

const ImageCard = ({
    onClick,
    showButton = true,
    title = "Welcome to Sentio",
    description = "We value your privacy and are committed to protecting your personal data. Our application collects and processes data solely for \
    the purpose of providing you with a personalized journaling experience.ur Privacy Policy.",
    bgImage = "https://images.pexels.com/photos/9573973/pexels-photo-9573973.jpeg",
    buttonText = "Citeste GDPR",
}: ImageCardProps) => {
    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
            position: "relative",
            overflow: "hidden",
            backgroundImage: `url("${bgImage}")`,
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
                    {title}
                </Typography>
                <Typography variant="body1" width="80%" sx={{ color: "rgba(255,255,255,0.8)" }}>
                    {description}
                </Typography>
                {showButton && (
                    <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={onClick}>
                        {buttonText}
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default ImageCard
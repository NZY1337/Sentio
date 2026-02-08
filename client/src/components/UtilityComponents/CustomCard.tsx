
import { styled } from "@mui/system";
import { Card  } from "@mui/material";

export const CustomCard = styled(Card)<{selected: boolean}>(({ theme, selected }) => ({
    textAlign: "center",
    padding: theme.spacing(1),
    backgroundColor: selected ? "0 4px 10px rgba(0, 0, 0, 0.1)" : "none",
    boxShadow: selected ? "0 0 5px rgba(255, 255, 255, 0.5), 0 0 30px rgba(0, 150, 255, 0.3)" : "none",
    "&:hover": {
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
    },
    height: 156,
    display: "flex",
    border: selected ? `2px solid ${theme.palette.success.main}` : `1px solid ${theme.palette.divider}`, // Soft white border
    borderRadius: "12px", // Smooth rounded corners
    background: "rgba(255, 255, 255, 0.1)", // Semi-transparent background
    backdropFilter: "blur(10px)", // Glassmorphic blur effect,
    animation: "glow 2s infinite alternate",
    "@keyframes glow": {
        "0%": { boxShadow: "0 0 5px rgba(255, 255, 255, 0.5)" },
        "100%": { boxShadow: "0 0 5px rgba(52, 50, 7, 0.7)" },
    },
}));
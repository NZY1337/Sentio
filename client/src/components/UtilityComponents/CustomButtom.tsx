// components
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

// icons
import DiamondIcon from "@mui/icons-material/Diamond";

// custom more if needed
const CustomButton = ({ title }: {title: string }) => {
    return (
        <Button
                type="submit" //
                size="small"
                variant="contained"
                sx={(theme) => ({
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    gap: "10px",
                    background: `linear-gradient(to right, #000 50%, ${theme.palette.warning.main})`,
                    color: "white",
                    textTransform: "none",
                    transition: 'background-position .2s',
                    backgroundSize: "200% 100%",
                    backgroundPosition: "100% 0",
                    fontWeight: "bold",
                    "&:hover": {
                        backgroundPosition: "0 0",
                        opacity: 0.9,
                    },
                  })}
                >
                    <Typography sx={{ fontWeight: "bold", textTransform: 'uppercase' }}>{title}</Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "#E3F2FD",
                            borderRadius: "15px",
                            padding: "4px 10px",
                        }}>
                        <DiamondIcon sx={{ color: "#60A679" }} fontSize="small"/>
                        <Typography sx={{ color: "#1E1E1E", marginLeft: "4px" }}>1</Typography>
                    </Box>
            </Button>
    )
}

export default CustomButton
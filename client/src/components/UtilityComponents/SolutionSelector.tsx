import { CardActionArea, CardContent, Typography, Grid2 as Grid, Tooltip, Box } from "@mui/material";
import { solutions } from "../../helpers/constants";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { useTheme } from '@mui/material/styles';

import { CustomCard } from "./CustomCard";


const SolutionSelector = ({ maskCategory, setMaskCategory }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    return (
        <Box sx={{ borderRadius: 3 }} mt={3} mb={3}>
            <Grid container spacing={2}>
                {solutions.map((solution) => (
                    <Grid size={{ xs: 6, sm: 12, md: 4, lg: 2.4 }} key={solution.label}>
                        <CustomCard
                            selected={maskCategory === solution.label}
                            onClick={() => setMaskCategory(solution.label)}
                        >
                            <CardActionArea sx={{ height: '100%', display: 'flex', alignItems: 'baseline' }}>
                                <Tooltip title="More info" arrow sx={{ position: "absolute", top: 10, right: 10, fontSize: 16, color: "success.main" }}>
                                    <InfoIcon />
                                </Tooltip>
                                <CardContent>
                                    <Box sx={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", height: '100%' }}>
                                        <Box
                                            sx={{
                                                backgroundColor: isDarkMode ? "#1A1A1A" : "#D4EED8",
                                                borderRadius: "50%",
                                                width: 50,
                                                height: 50,
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            {solution.icon}
                                        </Box>

                                    </Box>
                                    <Typography
                                        sx={{
                                            mt: 1,
                                            color: maskCategory === solution.label ? 'success.main' : "#A0A0A0",
                                        }}
                                    >
                                        {solution.label}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </CustomCard>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default SolutionSelector;
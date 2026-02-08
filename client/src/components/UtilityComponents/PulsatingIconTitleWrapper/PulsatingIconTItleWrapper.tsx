import { useState } from "react";  
import { Grid  } from "@mui/material";
import PulsatingIconTitle from "./PulsatingIconTitle";
import FenceIcon from '@mui/icons-material/Fence';
import BedIcon from '@mui/icons-material/Bed';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';


const PulsatingIconTitleWrapper = () => {
    const [selectedGrid, setSelectedGrid] = useState<string>('interior');

    const [activeIcon] = useState([
        {
            title: 'Interiors',
            icon: <FenceIcon fontSize="large" />,
            animationDelay: 0,
            id: 'interior'
        },
        {
            title: 'Exteriors',
            icon: <BedIcon fontSize="large" />,
            animationDelay: 1,
            id: 'exterior'
        },
        {
            title: 'Gardens',
            icon: <MapsHomeWorkIcon fontSize="large" />,
            animationDelay: 1.25,
            id: 'garden'
        }
    ])

    const handleGridSelect = (id: string) => {
        console.log(id);
        setSelectedGrid(id);
    };

    return (
        <Grid container sx={{ mt: 5 }} justifyContent={'center'} p={0}>
            {activeIcon.map((iconData) => (
                <Grid
                    p={0}
                    size={{ xs: 12, md: 4, lg: 2 }} textAlign={'center'}
                    key={iconData.id}
                    onClick={() => handleGridSelect(iconData.id)}
                >
                    <PulsatingIconTitle
                        title={iconData.title}
                        icon={iconData.icon}
                        animationDelay={iconData.animationDelay}
                        selected={selectedGrid === iconData.id} 
                    />
                </Grid>
            ))}
        </Grid>
    )
}

export default PulsatingIconTitleWrapper
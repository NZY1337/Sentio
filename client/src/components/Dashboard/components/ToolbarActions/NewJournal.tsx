import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


const NewJournal = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/dashboard/journal");
    };

    return (
        <Button onClick={handleClick} variant="contained" color="primary">
            New Journal
        </Button>
    );
}

export default NewJournal;
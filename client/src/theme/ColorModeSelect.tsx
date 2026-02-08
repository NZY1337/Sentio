import { useColorScheme } from '@mui/material/styles';
import Icon from '@mui/material/Icon';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function ColorModeToggle() {
  const { mode, setMode } = useColorScheme();

  if (!mode) {
    return null;
  }

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <Icon  onClick={toggleMode} color="inherit">
      {mode === 'light' ? <LightModeIcon sx={{ color: 'orange' }} />: <DarkModeIcon sx={{ color: 'white' }} />}
    </Icon>
  );
}

import { useCallback, type MouseEvent } from 'react';
import { useColorScheme } from '@mui/material/styles';

// components
import { Tooltip, ToggleButton, ToggleButtonGroup } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const CustomThemeSwitcher = () => {
    const { setMode, mode } = useColorScheme() as {
        setMode: (mode: 'light' | 'dark') => void;
        mode: 'light' | 'dark';
    };

    const handleThemeChange = useCallback((_event: MouseEvent<HTMLElement>, nextMode: 'light' | 'dark' | null) => {
        if (!nextMode) return;
        setMode(nextMode);
    },
        [setMode],
    );

    return (
        <Tooltip title="Theme" enterDelay={800}>
            <ToggleButtonGroup
                aria-label="theme mode"
                value={mode}
                exclusive
                onChange={handleThemeChange}
                size="small"
            >
                <ToggleButton value="light" aria-label="light mode">
                    <LightModeIcon
                        fontSize="small"
                        sx={{ color: mode === 'light' ? 'warning.main' : 'inherit' }}
                    />
                </ToggleButton>
                <ToggleButton value="dark" aria-label="dark mode">
                    <DarkModeIcon fontSize="small" />
                </ToggleButton>
            </ToggleButtonGroup>
        </Tooltip>
    );
}

export default CustomThemeSwitcher;
import { useState, useCallback, type ChangeEvent, type MouseEvent } from 'react';

// components
import { Tooltip, Box, Popover, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

// ! must be a type for these from mui
interface CustomThemeSwitcherProps {
    setMode: (mode: 'light' | 'dark') => void;
    mode: 'light' | 'dark';
}

const CustomThemeSwitcher = ({ setMode, mode }: CustomThemeSwitcherProps) => {
    const handleThemeChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setMode(event.target.value as 'light' | 'dark');
        },
        [setMode],
    );

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

    const toggleMenu = useCallback(
        (event: MouseEvent<HTMLElement>) => {
            setMenuAnchorEl(isMenuOpen ? null : event.currentTarget);
            setIsMenuOpen((previousIsMenuOpen) => !previousIsMenuOpen);
        },
        [isMenuOpen],
    );

    return (
        <>
            <Tooltip title="Settings" enterDelay={1000}>
                <div>
                    <IconButton type="button" aria-label="settings" onClick={toggleMenu}>
                        <SettingsIcon />
                    </IconButton>
                </div>
            </Tooltip>
            <Popover
                open={isMenuOpen}
                anchorEl={menuAnchorEl}
                onClose={toggleMenu}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                disableAutoFocus
            >
                <Box sx={{ p: 2 }}>
                    <FormControl>
                        <FormLabel id="custom-theme-switcher-label">Theme</FormLabel>
                        <RadioGroup
                            aria-labelledby="custom-theme-switcher-label"
                            value={mode}
                            name="custom-theme-switcher"
                            onChange={handleThemeChange}
                        >
                            <FormControlLabel value="light" control={<Radio />} label="Light" />
                            <FormControlLabel value="dark" control={<Radio />} label="Dark" />
                        </RadioGroup>
                    </FormControl>
                </Box>
            </Popover>
        </>
    );
}

export default CustomThemeSwitcher;
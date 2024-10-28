import React, { useContext } from 'react';
import { Box, Typography, Switch, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeProviderComponent';
import { CurrencyContext } from '../context/CurrencyContext';

const PersonalizationSettings = () => {
    const { language, setLanguage } = useContext(LanguageContext);
    const { themeMode, toggleTheme } = useContext(ThemeContext);
    const { currency, setCurrency } = useContext(CurrencyContext);

    return (
        <Box mb={4}>
            <Typography variant="h5" gutterBottom>Personalization</Typography>
            <Box mt={2}>
                <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Spanish</MenuItem>
                        <MenuItem value="fr">French</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box mt={2}>
                <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="EUR">EUR</MenuItem>
                        <MenuItem value="GBP">GBP</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box mt={2}>
                <Typography variant="body1">Theme</Typography>
                <Switch
                    color="primary"
                    checked={themeMode === 'dark'}
                    onChange={toggleTheme}
                /> Dark Mode
            </Box>
        </Box>
    );
};

export default PersonalizationSettings;

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#FF6F61', // Warm coral color
        },
        secondary: {
            main: '#FFD700', // Warm gold color
        },
        background: {
            default: '#FFF5E1', // Light warm background
            paper: '#FFFFFF', // Paper background for cards
        },
        text: {
            primary: '#333333', // Dark text for contrast
            secondary: '#555555', // Slightly lighter text
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
        h4: {
            fontWeight: 700,
            color: '#FF6F61', // Use primary color for headings
        },
        body1: {
            fontSize: '1rem',
            color: '#333333',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'none',
                    padding: '8px 16px',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '16px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                },
            },
        },
    },
});

export default theme;


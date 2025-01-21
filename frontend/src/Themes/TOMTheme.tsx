import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';



const tomTheme = createTheme({
    palette: {
        // primary accent color
        primary: {
            main: '#00A3D3'
        },

    },
    typography: {
        fontFamily: 'TOMFont, Arial, sans-serif',
        allVariants: {
            color: '#4D4D4D'
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    color: '#FFFFFF',
                },
            },
        },
        MuiStepIcon: {
            styleOverrides: {
                text: {
                    fill: '#FFFFFF',
                }
            }
        }
    },
});

export default tomTheme;
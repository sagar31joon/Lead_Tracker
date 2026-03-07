import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6C63FF',
            light: '#9D97FF',
            dark: '#4A42CC',
        },
        secondary: {
            main: '#00E5FF',
            light: '#6EFFFF',
            dark: '#00B2CC',
        },
        success: {
            main: '#4CAF50',
            light: '#81C784',
        },
        warning: {
            main: '#FF9800',
            light: '#FFB74D',
        },
        error: {
            main: '#F44336',
            light: '#E57373',
        },
        background: {
            default: '#0A0E1A',
            paper: '#121829',
        },
        text: {
            primary: '#E8EAED',
            secondary: '#9AA0B4',
        },
        divider: 'rgba(255, 255, 255, 0.06)',
    },
    typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        h4: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        h5: {
            fontWeight: 600,
            letterSpacing: '-0.01em',
        },
        h6: {
            fontWeight: 600,
        },
        body2: {
            color: '#9AA0B4',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: 'rgba(18, 24, 41, 0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 10,
                    padding: '8px 20px',
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #6C63FF 0%, #9D97FF 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5A52E0 0%, #8A84FF 100%)',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    fontSize: '0.75rem',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 10,
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(108, 99, 255, 0.4)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#6C63FF',
                        },
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    padding: '10px 12px',
                    verticalAlign: 'top',
                },
                head: {
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#9AA0B4',
                    backgroundColor: '#141A2E !important',
                    zIndex: 3,
                    position: 'sticky',
                    top: 0,
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'rgba(108, 99, 255, 0.04) !important',
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: '#1E2438',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.8rem',
                    borderRadius: 8,
                },
            },
        },
    },
});

export default theme;

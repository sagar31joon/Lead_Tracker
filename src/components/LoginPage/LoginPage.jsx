import { useState } from 'react';
import {
    Box, TextField, Button, Typography, Paper, InputAdornment,
    IconButton, CircularProgress, Alert,
} from '@mui/material';
import {
    TrackChanges as LogoIcon,
    Visibility as ShowIcon,
    VisibilityOff as HideIcon,
    Email as EmailIcon,
    Lock as LockIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import './LoginPage.css';

const MotionPaper = motion.create(Paper);

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await onLogin(email, password);
        } catch (err) {
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="login-root">
            {/* Animated background orbs */}
            <Box className="login-orb login-orb-1" />
            <Box className="login-orb login-orb-2" />
            <Box className="login-orb login-orb-3" />

            <MotionPaper
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="login-card"
                elevation={0}
            >
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                    <Box className="login-logo">
                        <LogoIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </Box>
                </motion.div>

                <Typography variant="h5" sx={{ fontWeight: 700, mt: 2, mb: 0.5, textAlign: 'center' }}>
                    LeadTracker
                </Typography>
                <Typography variant="body2" sx={{ color: '#9AA0B4', mb: 3.5, textAlign: 'center', fontSize: '0.85rem' }}>
                    Sign in to your business dashboard
                </Typography>

                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 2.5,
                            backgroundColor: 'rgba(244, 67, 54, 0.08)',
                            border: '1px solid rgba(244, 67, 54, 0.2)',
                            color: '#E57373',
                            '& .MuiAlert-icon': { color: '#F44336' },
                        }}
                    >
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        autoFocus
                        sx={{ mb: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon sx={{ color: '#9AA0B4', fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        sx={{ mb: 3 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon sx={{ color: '#9AA0B4', fontSize: 20 }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        size="small"
                                        sx={{ color: '#9AA0B4' }}
                                    >
                                        {showPassword ? <HideIcon fontSize="small" /> : <ShowIcon fontSize="small" />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{
                            py: 1.5,
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            position: 'relative',
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} sx={{ color: '#fff' }} />
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </form>

                <Typography
                    variant="body2"
                    sx={{ mt: 3, textAlign: 'center', color: '#9AA0B4', fontSize: '0.75rem' }}
                >
                    Authorized personnel only
                </Typography>
            </MotionPaper>
        </Box>
    );
}

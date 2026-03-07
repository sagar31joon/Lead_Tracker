import { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, IconButton, Divider, useMediaQuery, AppBar, Toolbar,
  Tooltip, CircularProgress,
} from '@mui/material';
import {
  TableChart as TableIcon,
  Analytics as AnalyticsIcon,
  Menu as MenuIcon,
  TrackChanges as LogoIcon,
  ChevronLeft as CollapseIcon,
  ChevronRight as ExpandIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import theme from './theme';
import { useLeads } from './hooks/useLeads';
import { useAuth } from './hooks/useAuth';
import LeadsTable from './components/LeadsTable/LeadsTable';
import Analytics from './components/Analytics/Analytics';
import LoginPage from './components/LoginPage/LoginPage';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './App.css';

const DRAWER_WIDTH = 240;
const DRAWER_COLLAPSED = 64;

const navItems = [
  { id: 'leads', label: 'Leads', icon: <TableIcon />, description: 'Manage your business leads' },
  { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon />, description: 'View insights & reports' },
];

function App() {
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState('leads');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { leads, loading, error, addLead, updateLead, deleteLead, resetToMock } = useLeads();

  // Auth loading spinner
  if (authLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0E1A' }}>
          <CircularProgress sx={{ color: '#6C63FF' }} />
        </Box>
      </ThemeProvider>
    );
  }

  // Not logged in — show login
  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginPage onLogin={signIn} />
      </ThemeProvider>
    );
  }

  const sidebarCollapsed = !isMobile && !sidebarHovered;
  const currentDrawerWidth = sidebarCollapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH;

  const drawerContent = (
    <Box className={`sidebar-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <Box className="sidebar-logo" onClick={() => { if (isMobile) setMobileOpen(false); }}>
        <Box className="logo-icon-wrapper">
          <LogoIcon sx={{ fontSize: sidebarCollapsed ? 22 : 28, color: '#fff' }} />
        </Box>
        {!sidebarCollapsed && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.2 }}>
              LeadTracker
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.7rem', color: '#9AA0B4' }}>
              Business Dashboard
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: sidebarCollapsed ? 1 : 2 }} />

      {/* Navigation */}
      <List sx={{ px: sidebarCollapsed ? 0.5 : 1.5, mt: 1, flex: 1 }}>
        {navItems.map((item) => (
          <Tooltip key={item.id} title={sidebarCollapsed ? item.label : ''} placement="right">
            <ListItemButton
              selected={activeSection === item.id}
              onClick={() => {
                setActiveSection(item.id);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2.5,
                mb: 0.5,
                py: sidebarCollapsed ? 1.2 : 1.5,
                px: sidebarCollapsed ? 1.5 : 2,
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(108,99,255,0.05))',
                  boxShadow: 'inset 3px 0 0 0 #6C63FF',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(108,99,255,0.08))',
                  },
                },
                '&:hover': {
                  background: 'rgba(255,255,255,0.03)',
                },
              }}
            >
              <ListItemIcon sx={{
                minWidth: sidebarCollapsed ? 'unset' : 40,
                color: activeSection === item.id ? '#6C63FF' : '#9AA0B4',
                justifyContent: 'center',
              }}>
                {item.icon}
              </ListItemIcon>
              {!sidebarCollapsed && (
                <ListItemText
                  primary={item.label}
                  secondary={item.description}
                  primaryTypographyProps={{
                    fontWeight: activeSection === item.id ? 700 : 500,
                    fontSize: '0.9rem',
                  }}
                  secondaryTypographyProps={{ fontSize: '0.7rem' }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>

      {/* Footer */}
      {!sidebarCollapsed ? (
        <Box className="sidebar-footer">
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 1.5 }} />
          <Typography variant="body2" sx={{ color: '#9AA0B4', fontSize: '0.7rem', textAlign: 'center', mb: 1 }}>
            {leads.length} leads tracked
          </Typography>
          <ListItemButton
            onClick={signOut}
            sx={{
              borderRadius: 2.5,
              py: 1,
              px: 2,
              justifyContent: 'flex-start',
              color: '#F44336',
              '&:hover': { background: 'rgba(244, 67, 54, 0.08)' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: '#F44336' }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }}
            />
          </ListItemButton>
        </Box>
      ) : (
        <Box className="sidebar-footer" sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
          <Tooltip title="Sign Out" placement="right">
            <IconButton onClick={signOut} sx={{ color: '#F44336' }}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-root">
        {/* Mobile App Bar */}
        {isMobile && (
          <AppBar
            position="fixed"
            sx={{
              background: 'rgba(10, 14, 26, 0.9)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              boxShadow: 'none',
            }}
          >
            <Toolbar variant="dense">
              <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
              <LogoIcon sx={{ mr: 0.5, color: '#6C63FF', fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>LeadTracker</Typography>
            </Toolbar>
          </AppBar>
        )}

        {/* Sidebar */}
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                background: 'rgba(10, 14, 26, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255,255,255,0.06)',
              },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            onMouseEnter={() => setSidebarHovered(true)}
            onMouseLeave={() => setSidebarHovered(false)}
            sx={{
              width: DRAWER_COLLAPSED, // Keep wrapper exactly 64px to not push content
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: currentDrawerWidth,
                background: 'rgba(10, 14, 26, 0.75)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)', // smoother 60fps easing
                overflowX: 'hidden',
                willChange: 'width', // optimize animation performance
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}

        {/* Main Content */}
        <Box
          className="main-content"
          sx={{
            // No margin-left needed because the Drawer wrapper acts as a 64px flex-item.
            // On mobile, the appBar takes up top space.
            mt: isMobile ? 6 : 0,
          }}
        >
          {/* Header */}
          <Box className="content-header">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ willChange: 'transform, opacity' }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.3 }}>
                {activeSection === 'leads' ? '📊 Leads Management' : '📈 Analytics Dashboard'}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                {activeSection === 'leads'
                  ? 'Track, manage, and convert your business leads'
                  : 'Insights and metrics to fuel your growth'}
              </Typography>
            </motion.div>
          </Box>

          {/* Content */}
          <Box className="content-body">
            <AnimatePresence mode="wait">
              {activeSection === 'leads' ? (
                <motion.div
                  key="leads"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={{ willChange: 'transform, opacity', height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <LeadsTable
                    leads={leads}
                    onAdd={addLead}
                    onUpdate={updateLead}
                    onDelete={deleteLead}
                    onReset={resetToMock}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={{ willChange: 'transform, opacity', height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <Analytics leads={leads} />
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

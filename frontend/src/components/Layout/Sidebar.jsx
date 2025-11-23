import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Avatar,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Dashboard,
  CalendarToday,
  Schedule,
  People,
  Person,
  Home,
  LocalHospital,
  AdminPanelSettings,
  Settings,
  EventAvailable,
  Add,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const drawerWidth = 260;
const collapsedWidth = 70;

const Sidebar = ({ open, onClose, collapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);

  const patientMenuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Dashboard', icon: <Dashboard />, path: '/patient/dashboard' },
    { text: 'Book Appointment', icon: <Add />, path: '/patient/book-appointment' },
    { text: 'My Appointments', icon: <CalendarToday />, path: '/patient/appointments' },
  ];

  const doctorMenuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Dashboard', icon: <Dashboard />, path: '/doctor/dashboard' },
    { text: 'Manage Slots', icon: <Schedule />, path: '/doctor/slots' },
    { text: 'Appointments', icon: <EventAvailable />, path: '/doctor/appointments' },
  ];

  const adminMenuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Admin Dashboard', icon: <AdminPanelSettings />, path: '/admin/dashboard' },
  ];

  const publicMenuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
  ];

  const getMenuItems = () => {
    if (!isAuthenticated) return publicMenuItems;
    switch (role) {
      case 'patient': return patientMenuItems;
      case 'doctor': return doctorMenuItems;
      case 'admin': return adminMenuItems;
      default: return publicMenuItems;
    }
  };

  const menuItems = getMenuItems();

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#1e2a38',
        overflow: 'hidden',

      }}
    >
      {/* Collapse Toggle Button */}
      <Box
        sx={{
          height: '65px',
          p: 2,
          display: { xs: 'none', md: 'flex' },
          justifyContent: collapsed ? 'center' : 'flex-end',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: '#00bcd4',
        }}
      >
        <IconButton
          onClick={onToggleCollapse}
          sx={{
            color: 'black',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      {/* User Profile Section */}
      {isAuthenticated && (
        <>
          <Box
            sx={{
              p: collapsed ? 2 : 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: collapsed ? 'center' : 'flex-start',
              color: 'white',
              background: '#1e2a38',
              borderBottom: '2px solid rgba(0, 188, 212, 0.3)',
            }}
          >
            <Avatar
              sx={{
                width: collapsed ? 40 : 56,
                height: collapsed ? 40 : 56,
                bgcolor: 'white',
                color: '#00bcd4',
                fontSize: collapsed ? '1.2rem' : '1.5rem',
                fontWeight: 'bold',
                mb: collapsed ? 0 : 2,
                transition: 'all 0.3s ease'
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            {!collapsed && (
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.2, color: 'white' }}>
                  {user?.name || 'User'}
                </Typography>
                <Chip
                  icon={role === 'patient' ? <Person /> : role === 'doctor' ? <LocalHospital /> : <AdminPanelSettings />}
                  label={role?.toUpperCase() || 'GUEST'}
                  size="small"
                  sx={{
                    mt: 0.5,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.7rem',
                    height: '20px',
                    '& .MuiChip-icon': {
                      color: 'white',
                      fontSize: '0.9rem'
                    }
                  }}
                />
              </Box>
            )}
          </Box>
          <Divider sx={{ bgcolor: 'rgba(0, 188, 212, 0.2)' }} />
        </>
      )}

      {/* Menu Items */}
      <List sx={{ flex: 1, pt: 2, px: collapsed ? 1 : 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const listItemButton = (
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (onClose) onClose();
              }}
              sx={{
                borderRadius: 2,
                bgcolor: isActive ? 'rgba(0, 188, 212, 0.15)' : 'transparent',
                color: '#e3f2fd',
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: collapsed ? 1 : 2,
                '&:hover': {
                  bgcolor: 'rgba(0, 188, 212, 0.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <ListItemIcon sx={{
                color: isActive ? '#00bcd4' : '#b0bec5',
                minWidth: collapsed ? 'auto' : 40,
                justifyContent: 'center'
              }}>
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.95rem'
                  }}
                />
              )}
            </ListItemButton>
          );

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              {collapsed ? (
                <Tooltip title={item.text} placement="right" arrow>
                  {listItemButton}
                </Tooltip>
              ) : (
                listItemButton
              )}
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      {!collapsed && (
        <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 188, 212, 0.2)' }}>
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#b0bec5' }}>
            Doctor Appointment System 
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#78909c' }}>
            © 2025 All Rights Reserved to SP
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: collapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          transition: 'width 0.3s ease',
          '& .MuiDrawer-paper': {
            width: collapsed ? collapsedWidth : drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: '4px 0 12px rgba(0,0,0,0.1)',
            transition: 'width 0.3s ease',
            overflowX: 'hidden'
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;

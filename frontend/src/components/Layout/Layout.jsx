import React, { useState } from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

// Sidebar width constants
const drawerWidth = 260;
const collapsedWidth = 70;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Toggle mobile sidebar visibility
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Toggle sidebar collapse state
  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        open={mobileOpen} 
        onClose={handleDrawerToggle} 
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { 
            xs: '100%',
            md: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)` 
          },
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a1929 0%, #1e2a38 100%)',
          position: 'relative',
          transition: 'width 0.3s ease',
          overflow: 'auto',
        }}
      >
        <Navbar onMenuClick={handleDrawerToggle} />
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, pb: 6 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
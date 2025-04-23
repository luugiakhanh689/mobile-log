import React from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Box, Avatar, Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

const drawerWidth = 220;
const miniWidth = 72;

export default function Topbar({ drawerOpen, toggleDrawer, tab }) {
  const currentTab = ['Logs', 'Analytics', 'Users', 'Settings'][tab] || '';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#fff',
        color: '#2c2c2c',
        borderBottom: '1px solid #e0e0e0',
        ml: drawerOpen ? `${drawerWidth}px` : `${miniWidth}px`,
        width: drawerOpen ? `calc(100% - ${drawerWidth}px)` : `calc(100% - ${miniWidth}px)`,
        transition: 'all 0.3s ease'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit" onClick={toggleDrawer}>
            {drawerOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="subtitle1" fontWeight={600}>
            Mobile Logs / {currentTab}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Guest account">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>G</Avatar>
              <Typography variant="body2" fontWeight={600}>Guest</Typography>
            </Box>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

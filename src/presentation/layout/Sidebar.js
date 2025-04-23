import React from 'react';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Box, Typography, Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ListAltIcon from '@mui/icons-material/ListAlt';
import InsightsIcon from '@mui/icons-material/Insights';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

const drawerWidth = 220;
const miniWidth = 72;

const menuItems = [
  { label: 'Logs', icon: <ListAltIcon /> },
  { label: 'Analytics', icon: <InsightsIcon /> },
  { label: 'Users', icon: <PeopleIcon /> },
  { label: 'Settings', icon: <SettingsIcon /> }
];

export default function Sidebar({ drawerOpen, tab, setTab }) {
  const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
      open={drawerOpen}
      PaperProps={{
        sx: {
          width: drawerOpen ? drawerWidth : miniWidth,
          overflowX: 'hidden',
          transition: 'width 0.3s ease',
          background: theme.gradients?.primary || theme.palette.primary.main,
          color: '#fff',
          borderRight: 0,
          borderTopRightRadius: 24,
          borderBottomRightRadius: 24,
          boxShadow: '2px 0 8px rgba(0,0,0,0.12)',
        }
      }}
    >
      {/* Header logo */}
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2
        }}
      >
        {drawerOpen ? (
          <Typography variant="h6" fontWeight={700}>
            Dashboards
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <HealthAndSafetyIcon sx={{ fontSize: 32 }} />
          </Box>
        )}
      </Box>


      {/* Divider dưới logo */}
      <Divider
        sx={{
          mx: drawerOpen ? 2 : 1,
          bgcolor: 'rgba(255,255,255,0.3)',
          height: '1px'
        }}
      />

      <List>
        {menuItems.map((item, index) => (
          <ListItem key={item.label} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => setTab(index)}
              selected={tab === index}
              sx={{
                minHeight: 48,
                justifyContent: drawerOpen ? 'initial' : 'center',
                px: 2.5,
                color: '#fff',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)'
                  }
                }
              }}
            >
              <ListItemIcon
                sx={{
                  color: '#fff',
                  minWidth: 0,
                  mr: drawerOpen ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {drawerOpen && <ListItemText primary={item.label} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

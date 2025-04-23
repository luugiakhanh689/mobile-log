import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import LogsTab from '../tabs/LogsTab';
import AnalyticsTab from '../tabs/AnalyticsTab';
import UserManagerTab from '../tabs/UserManagerTab';
import SettingsTab from '../tabs/SettingsTab';

const drawerWidth = 220;
const miniWidth = 72;

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = React.useState(true);
  const [tab, setTab] = React.useState(0);
  const logs = useSelector(state => state.logs.data);

  const renderTab = () => {
    switch (tab) {
      case 0: return <LogsTab />;
      case 1: return <AnalyticsTab logs={Object.values(logs).flat()} />;
      case 2: return <UserManagerTab />;
      case 3: return <SettingsTab />;
      default: return null;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        sx={{
          width: drawerOpen ? drawerWidth : miniWidth,
          flexShrink: 0,
          position: 'fixed',
          height: '100vh',
          zIndex: 1100
        }}
      >
        <Sidebar drawerOpen={drawerOpen} tab={tab} setTab={setTab} />
      </Box>

      <Box
        sx={{
          ml: drawerOpen ? `${drawerWidth}px` : `${miniWidth}px`,
          width: `calc(100% - ${drawerOpen ? drawerWidth : miniWidth}px)`,
          transition: 'all 0.3s ease'
        }}
      >
        <Topbar drawerOpen={drawerOpen} toggleDrawer={() => setDrawerOpen(!drawerOpen)} tab={tab} />
        <Toolbar />
        <Box sx={{ p: 3 }}>
          {renderTab()}
        </Box>
      </Box>
    </Box>
  );
}

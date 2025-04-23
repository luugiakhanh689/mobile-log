import React from 'react';
import {
  Box, Typography, Paper, Switch, FormControlLabel
} from '@mui/material';

export default function SettingsTab() {
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <Box sx={{ mt: 2}}>
      <Typography variant="h6" fontWeight={600}>Settings</Typography>
      <Paper sx={{ mt: 2, p: 2, borderRadius: 6 }}>
        <FormControlLabel
          control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
          label="Enable Dark Mode"
        />
      </Paper>
    </Box>
  );
}

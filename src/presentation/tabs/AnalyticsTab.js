import React from 'react';
import {
  Box, Typography, Paper
} from '@mui/material';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { useSelector } from 'react-redux';

export default function AnalyticsTab() {
  const logs = useSelector(state => state.logs.data);

  const chartData = Object.entries(logs).map(([svc, entries]) => ({
    name: svc,
    logs: entries.length
  }));

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" fontWeight={600}>Log Count by Service</Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="logs" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}

import React from 'react';
import {
  Box, Typography, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, Chip
} from '@mui/material';

const users = [
  { id: 1, name: 'Guest', role: 'Viewer', status: 'Active' },
  { id: 2, name: 'Alpha', role: 'Editor', status: 'Inactive' },
  { id: 3, name: 'Beta', role: 'Admin', status: 'Active' }
];

export default function UserManagerTab() {
  const getStatusChip = (status) => {
    const isActive = status.toLowerCase() === 'active';
    return (
      <Chip
        label={status}
        color={isActive ? 'success' : 'default'}
        variant="filled"
        size="small"
        sx={{
          fontWeight: 600,
          textTransform: 'capitalize',
          bgcolor: isActive ? '#d0f2d8' : '#eee',
          color: isActive ? '#2e7d32' : '#757575'
        }}
      />
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" fontWeight={700}>👥 User Manager</Typography>

      <Paper sx={{
        mt: 2,
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        overflow: 'hidden'
      }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#1976d2' }}>
              {['ID', 'Name', 'Role', 'Status'].map((label, idx) => (
                <TableCell key={idx} sx={{ color: '#fff', fontWeight: 600 }}>{label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{getStatusChip(user.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

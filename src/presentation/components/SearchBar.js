import React from 'react';
import { Box, OutlinedInput, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useTheme } from '@mui/material/styles';

export default function SearchBar({ search, onSearchChange, onOpenFilter }) {
  const theme = useTheme();

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <OutlinedInput
        fullWidth
        size="small"
        placeholder="Tìm kiếm"
        value={search}
        onChange={onSearchChange}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        sx={{ borderRadius: '30px', bgcolor: '#fff' }}
      />
      <Button
        variant="contained"
        onClick={onOpenFilter}
        startIcon={<FilterListIcon />}
        sx={{
          borderRadius: '30px',
          px: 3,
          textTransform: 'none',
          background: theme.gradients?.primary || '#1976d2',
          color: '#fff',
          whiteSpace: 'nowrap'
        }}
      >
        Bộ lọc
      </Button>
    </Box>
  );
}

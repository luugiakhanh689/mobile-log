import React from 'react';
import {
  Box, Drawer, Typography, IconButton, Divider, Chip,
  List, ListItemButton, ListItemText, Button, Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, clearFilter, clearAllFilters } from '../../data/filterSlice';
import TuneIcon from '@mui/icons-material/Tune';

const allowedKeys = ['level', 'device_model', 'device_platform', 'tag'];

export default function FilterDrawer({ open, onClose, onFilterChange }) {
  const dispatch = useDispatch();
  const selectedValues = useSelector(state => state.filters.values);
  const availableFilters = useSelector(state => state.filters.available || {});
  const [selectedKey, setSelectedKey] = React.useState(null);

  const handleToggleValue = (val) => {
    dispatch(setFilter({ key: selectedKey, value: val }));
    onFilterChange?.();
  };

  const handleDeleteChip = (key, val) => {
    dispatch(setFilter({ key, value: val }));
    onFilterChange?.();
  };

  const handleClearAll = () => {
    dispatch(clearAllFilters());
    onFilterChange?.(); 
  };

  const handleBack = () => setSelectedKey(null);

  const activeChips = Object.entries(selectedValues).flatMap(([key, vals]) =>
    vals.map(val => ({ key, val }))
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 30,
          borderBottomLeftRadius: 30,
          backgroundColor: '#f9fbfd'
        }
      }}
    >
      <Box sx={{ width: 340, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TuneIcon fontSize="small" />
            Bộ lọc
          </Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {activeChips.map((chip, i) => (
            <Chip
              key={i}
              label={`${chip.key}: ${chip.val}`}
              onDelete={() => handleDeleteChip(chip.key, chip.val)}
              sx={{ fontSize: 12, bgcolor: '#e3f2fd' }}
            />
          ))}
        </Box>

        {activeChips.length > 0 && (
          <Box textAlign="right" mt={1}>
            <Button size="small" color="error" onClick={handleClearAll}>
              Xoá tất cả
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {!selectedKey ? (
          <Paper variant="outlined" sx={{ borderRadius: 2, p: 1 }}>
            <Typography fontWeight={600} fontSize={14} mb={1}>Danh mục lọc</Typography>
            <List dense>
              {allowedKeys.filter(k => availableFilters[k]?.length).map((key, i) => (
                <ListItemButton
                  key={i}
                  onClick={() => setSelectedKey(key)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&:hover': { bgcolor: '#e3f2fd' }
                  }}
                >
                  <ListItemText primary={key} sx={{ textTransform: 'capitalize' }} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        ) : (
          <>
            <Box display="flex" alignItems="center" mb={1} gap={1}>
              <IconButton onClick={handleBack} size="small"><ArrowBackIosNewIcon fontSize="small" /></IconButton>
              <Typography variant="subtitle1" fontWeight={600}>
                {selectedKey}
              </Typography>
            </Box>

            <Paper variant="outlined" sx={{ borderRadius: 2, p: 1 }}>
              <List dense>
                {(availableFilters[selectedKey] || []).map((val, i) => (
                  <ListItemButton
                    key={i}
                    selected={(selectedValues[selectedKey] || []).includes(val)}
                    onClick={() => handleToggleValue(val)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      '&.Mui-selected': {
                        bgcolor: '#1976d2',
                        color: '#fff',
                        '&:hover': { bgcolor: '#1565c0' }
                      }
                    }}
                  >
                    <ListItemText primary={val} />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </>
        )}
      </Box>
    </Drawer>
  );
}

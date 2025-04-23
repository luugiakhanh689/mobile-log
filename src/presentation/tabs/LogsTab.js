import React from 'react';
import {
  Box, Grid, Paper, Snackbar, Alert, Typography
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../components/SearchBar';
import LogsTable from '../components/LogsTable';
import FilterDrawer from '../components/FilterDrawer';
import { setLogs } from '../../data/logSlice';
import { setAvailableFilters } from '../../data/filterSlice';

const extractFiltersFromFields = (fields, filtersMap) => {
  fields.forEach(f => {
    if (!filtersMap[f.key]) filtersMap[f.key] = new Set();
    filtersMap[f.key].add(f.value);
  });
};

const extractTimestampFromInfo = (infoValue, fallback) => {
  const match = infoValue.match(/\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]/);
  if (match) {
    const str = match[0].slice(1, -1); // remove brackets
    return new Date(str).getTime();
  }
  return fallback;
};

export default function LogsTab() {
  const dispatch = useDispatch();
  const logs = useSelector(state => state.logs.data);
  const [search, setSearch] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [filterOpen, setFilterOpen] = React.useState(false);

  const onDrop = useDropzone({
    onDrop: acceptedFiles => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const raw = JSON.parse(reader.result);
          const data = raw.data || [];
          const grouped = {};
          const filtersMap = {};
          let id = 1;

          data.forEach(trace => {
            trace.spans?.forEach(span => {
              const svc = trace.processes?.[span.processID]?.serviceName || 'Unknown Service';
              if (!grouped[svc]) grouped[svc] = [];

              span.logs?.forEach(log => {
                const fields = log.fields || [];

                extractFiltersFromFields(fields, filtersMap);

                const message = fields.find(f => f.key === 'event')?.value || '';
                const context = fields.map(f => `"${f.key}":"${f.value}"`).join('\n');

                const infoValue = fields.find(f => f.key === 'INFO')?.value || '';
                const infoTimestamp = extractTimestampFromInfo(infoValue, log.timestamp);

                grouped[svc].push({
                  id: id++,
                  timestamp: infoTimestamp, // ✅ sort theo timestamp thật trong INFO
                  message,
                  context
                });
              });
            });
          });

          const allowedKeys = ['level', 'device_model', 'device_platform', 'tag'];
          const available = {};
          for (const key of allowedKeys) {
            if (filtersMap[key]) {
              available[key] = Array.from(filtersMap[key]);
            }
          }

          dispatch(setLogs(grouped));
          dispatch(setAvailableFilters(available));
          setOpenSnackbar(true);
        } catch {
          alert('File không hợp lệ');
        }
      };
      reader.readAsText(acceptedFiles[0]);
    }
  });

  const { getRootProps, getInputProps } = onDrop;

  return (
    <Box component="main" sx={{ flexGrow: 1 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>Logs</Typography>

      <Paper sx={{ p: 3, borderRadius: 4, mb: 4 }}>
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #aaa',
            p: 4,
            mb: 3,
            textAlign: 'center',
            borderRadius: '36px',
            cursor: 'pointer',
            bgcolor: '#fdfdfd',
            fontWeight: 500,
            color: '#555'
          }}
        >
          <input {...getInputProps()} />
          Drop hoặc chọn file JSON để import
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SearchBar
              search={search}
              onSearchChange={(e) => setSearch(e.target.value)}
              onOpenFilter={() => setFilterOpen(true)}
            />
          </Grid>
        </Grid>
      </Paper>

      {Object.entries(logs).map(([svc, rows]) => (
        <LogsTable key={svc} serviceName={svc} rows={rows} search={search} />
      ))}

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onFilterChange={() => setSearch('')}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', borderRadius: 30 }}>
          Import thành công!
        </Alert>
      </Snackbar>
    </Box>
  );
}

import React from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  Pagination, TableSortLabel
} from '@mui/material';
import { useSelector } from 'react-redux';

const formatTimestampVN = (nsString) => {
  const millis = parseInt(nsString?.toString()?.slice(0, -6));
  return new Date(millis).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false
  });
};

const highlightText = (text, keyword) => {
  if (!text || typeof text !== 'string') return text;
  if (!keyword) return text;
  return text.split(new RegExp(`(${keyword})`, 'gi')).map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase()
      ? <span key={i} style={{ backgroundColor: '#fff176', fontWeight: 500 }}>{part}</span>
      : part
  );
};

const getComparator = (order, orderBy) => {
  return (a, b) => {
    const valA = a[orderBy];
    const valB = b[orderBy];
    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  };
};

const safeIncludes = (val, keyword) => {
  if (!keyword) return true;
  try {
    if (typeof val === 'string') return val.toLowerCase().includes(keyword.toLowerCase());
    if (typeof val === 'number') return val.toString().includes(keyword);
    if (val) return JSON.stringify(val).toLowerCase().includes(keyword.toLowerCase());
    return false;
  } catch {
    return false;
  }
};

export default function LogsTable({ serviceName, rows = [], search }) {
  const [page, setPage] = React.useState(1);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('timestamp');
  const filters = useSelector(state => state.filters.values);
  const rowsPerPage = 30;

  React.useEffect(() => setPage(1), [search, filters]);

  const matchesFilters = (row) => {
    return Object.entries(filters).every(([key, values]) => {
      if (!values.length) return true;

      return values.some(val => {
        const regex = new RegExp(`"${key}"\\s*:\\s*"${val}"`, 'i');
        return regex.test(row.context || '');
      });
    });
  };

  const filteredRows = rows.filter(row =>
    Object.values(row).some(val => safeIncludes(val, search)) &&
    matchesFilters(row)
  );

  const sortedRows = React.useMemo(
    () => [...filteredRows].sort(getComparator(order, orderBy)),
    [filteredRows, order, orderBy]
  );

  const paginatedRows = sortedRows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  return (
    <Box sx={{ mb: 5 }}>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1.5,
          px: 3,
          py: 1.5,
          mx: 'auto',
          mb: 3,
          bgcolor: '#e3f2fd',
          borderRadius: 3,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
        }}
      >
        <Box sx={{ fontWeight: 600, fontSize: 16, color: '#1565c0' }}>
          {serviceName}
        </Box>
        <Box sx={{
          px: 2, py: 0.5, bgcolor: '#1976d2', color: '#fff',
          fontWeight: 600, fontSize: 13, borderRadius: '999px'
        }}>
          {filteredRows.length} kết quả
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {[
                { id: 'id', label: 'ID' },
                { id: 'timestamp', label: 'Thời gian' },
                { id: 'context', label: 'Chi tiết' }
              ].map((col) => (
                <TableCell
                  key={col.id}
                  sortDirection={orderBy === col.id ? order : false}
                  sx={{
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    fontWeight: 600,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    fontSize: 14,
                    px: 2,
                    py: 1.2
                  }}
                >
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : 'asc'}
                    onClick={() => handleSort(col.id)}
                    sx={{
                      color: '#fff',
                      '&.Mui-active': { color: '#fff !important' },
                      '& .MuiTableSortLabel-icon': { color: '#fff !important' }
                    }}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  Không có kết quả phù hợp.
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map(row => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}
                >
                  <TableCell align="center">{row.id}</TableCell>
                  <TableCell align="center">{formatTimestampVN(row.timestamp)}</TableCell>
                  <TableCell>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      bgcolor: '#f5f7fa',
                      p: 1.5,
                      borderRadius: 2,
                      border: '1px solid #e0e0e0',
                      fontSize: 13,
                      lineHeight: 1.5
                    }}>
                      {(row.context || '')
                        .split('\n')
                        .filter(line => line.trim() !== '')
                        .map((line, idx) => {
                          const [key, ...valueParts] = line.split(':');
                          const value = valueParts.join(':').trim();
                          return (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                              <Box
                                component="span"
                                sx={{
                                  minWidth: '100px',
                                  fontWeight: 600,
                                  color: '#37474f',
                                  whiteSpace: 'nowrap',
                                  wordBreak: 'break-word'
                                }}
                              >
                                {highlightText(key.trim(), search)}:
                              </Box>
                              <Box
                                component="span"
                                sx={{
                                  flex: 1,
                                  color: '#455a64',
                                  wordBreak: 'break-word',
                                  whiteSpace: 'pre-wrap'
                                }}
                              >
                                {highlightText(value, search)}
                              </Box>
                            </Box>
                          );
                        })}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="flex-end">
        <Pagination
          count={Math.ceil(filteredRows.length / rowsPerPage)}
          page={page}
          onChange={(e, val) => setPage(val)}
          color="primary"
        />
      </Box>
    </Box>
  );
}

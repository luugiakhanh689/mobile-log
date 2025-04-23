import React from 'react';
import {
  Box, Typography, Paper, FormControl, Select, MenuItem, Grid
} from '@mui/material';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import dayjs from 'dayjs';

const filterOptions = [
  { label: '7 ngày gần đây', value: 7 },
  { label: '14 ngày', value: 14 },
  { label: '30 ngày', value: 30 }
];

// ✅ Extract giá trị từ context dạng chuỗi
const extractFromContext = (context = '', key) => {
  const match = context.match(new RegExp(`"${key}"\\s*:\\s*"([^"]+)"`, 'i'));
  return match ? match[1] : 'Khác';
};

// ✅ Build chart data theo field (log_type, platform, level)
const buildChartData = (logs, days, contextKey) => {
  const grouped = {};
  const types = new Set();
  const cutoff = dayjs().subtract(days, 'day').startOf('day').valueOf();

  logs.forEach(log => {
    const ts = typeof log.timestamp === 'string' ? new Date(log.timestamp).getTime() : log.timestamp;
    if (!ts || ts < cutoff) return;

    const date = dayjs(ts).format('DD/MM');
    if (!grouped[date]) grouped[date] = {};

    const type = extractFromContext(log.context, contextKey);
    types.add(type);
    grouped[date][type] = (grouped[date][type] || 0) + 1;
  });

  const allTypes = Array.from(types);
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day').format('DD/MM');
    const entry = { date };
    allTypes.forEach(type => {
      entry[type] = grouped[date]?.[type] || 0;
    });
    result.push(entry);
  }

  return { data: result, types: allTypes };
};

const ChartSection = ({ title, data, types }) => (
  <Paper elevation={2} sx={{ p: 2, borderRadius: 3, height: 360 }}>
    <Typography fontWeight={600} mb={2}>{title}</Typography>
    <ResponsiveContainer width="100%" height="85%">
      <AreaChart data={data}>
        <defs>
          {types.map((type, idx) => (
            <linearGradient id={`color-${type}`} key={type} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`hsl(${idx * 60}, 70%, 50%)`} stopOpacity={0.4} />
              <stop offset="100%" stopColor={`hsl(${idx * 60}, 70%, 50%)`} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        {types.map((type, idx) => (
          <Area
            key={type}
            type="monotone"
            dataKey={type}
            stackId="1"
            stroke={`hsl(${idx * 60}, 70%, 50%)`}
            fill={`url(#color-${type})`}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  </Paper>
);

export default function AnalyticsTab({ logs = [] }) {
  const [days, setDays] = React.useState(7);

  const chartByType = React.useMemo(() => buildChartData(logs, days, 'log_type'), [logs, days]);
  const chartByPlatform = React.useMemo(() => buildChartData(logs, days, 'device_platform'), [logs, days]);
  const chartByLevel = React.useMemo(() => buildChartData(logs, days, 'level'), [logs, days]);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={600}>📊 Thống kê log (theo {days} ngày)</Typography>
        <FormControl size="small">
          <Select
            value={days}
            onChange={(e) => setDays(e.target.value)}
            sx={{ minWidth: 140 }}
          >
            {filterOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ChartSection
            title="Biểu đồ log theo log_type"
            data={chartByType.data}
            types={chartByType.types}
          />
        </Grid>
        <Grid item xs={12}>
          <ChartSection
            title="Biểu đồ log theo device_platform"
            data={chartByPlatform.data}
            types={chartByPlatform.types}
          />
        </Grid>
        <Grid item xs={12}>
          <ChartSection
            title="Biểu đồ log theo level"
            data={chartByLevel.data}
            types={chartByLevel.types}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

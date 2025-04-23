import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' }
  },
  gradients: {
    primary: 'linear-gradient(to right, #1976d2, #21cbf3)'
  }
});

export default theme;

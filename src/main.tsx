import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Router>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <App />
    </LocalizationProvider>
  </Router>
);

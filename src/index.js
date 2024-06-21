import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, FormControlLabel, Box, Typography } from '@mui/material';
import MovieListByGenre from './MovieListByGenre';
import { translations } from './translations.js';

export const TMDB_API_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYzUxM2RjYWMzOTI5NWI5Nzc5MjFjZDhiOWMzNmI0MSIsInN1YiI6IjY2NzVhMDc1MzlkOWEzZTUxZWZjN2VjNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dwCoFa0-2EM5wBQe_TnJ7q0MyQZh4QJdqzUBvTH1D-U';


const App = () => {
  const [language, setLanguage] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: TMDB_API_KEY
      }
    };

    const fetchData = async () => {
      try {
        const response = await fetch('https://api.themoviedb.org/3/authentication', options);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        setData(result);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
    setLoading(false);
  }, []);



  const theme = useMemo(() => createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
  }), [isDarkMode]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };
  if (loading) return <div>Loading...</div>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" justifyContent="center" alignItems="flex-start" p={2}>
        <Container>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box display="flex" alignItems="center" mb={2}>
              <Button variant="contained" onClick={() => changeLanguage('en')} style={{ marginRight: '8px' }}>English</Button>
              <Button variant="contained" onClick={() => changeLanguage('ru')} style={{ marginRight: '8px' }}>Русский</Button>
              <Button variant="contained" onClick={() => changeLanguage('et')} style={{ marginRight: '8px' }}>Eesti</Button>
              <FormControlLabel
                control={<Switch checked={isDarkMode} onChange={toggleTheme} />}
                label={isDarkMode ? translations[language].switchToLight : translations[language].switchToDark}
              />
            </Box>
          </Box>
          <Box>
            <React.StrictMode>
              <MovieListByGenre language={language} />
            </React.StrictMode>
          </Box>
          {/* <Typography variant="h1">{translations[language].hello}</Typography> */}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

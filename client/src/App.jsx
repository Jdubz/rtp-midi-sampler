import Box from '@mui/material/Box';

import Header from './components/Header';
import Footer from './components/Footer';
import Files from './components/files/Files';
import Audio from './components/audio/Audio';

const appStyle = {
  maxWidth: 900,
  margin: '0 auto',
  backgroundColor: 'primary.dark',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
}

const bodyStyle = {
  boxSizing: 'border-box',
  width: '100%',
  flexGrow: 1,
  flexDirection: 'column',
  padding: '1rem',
}

function App() {
  return (
    <Box
      sx={appStyle}
    >
      <Header />
      <Box sx={bodyStyle}>
        <Files />
        <Audio />
      </Box>
      <Footer />
    </Box>
  );
}

export default App;

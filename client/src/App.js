import Box from '@mui/material/Box';

import Header from './components/Header';

const style = {
  maxWidth: 900,
  height: '100%',
  margin: '0 auto',
  backgroundColor: 'primary.dark',
  display: 'flex',
  flexGrow: 1,
}

function App() {
  return (
    <Box
      sx={style}
    >
      <Header />
    </Box>
  );
}

export default App;

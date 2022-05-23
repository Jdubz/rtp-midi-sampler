import React from 'react';

import Box from '@mui/material/Box';

import ApiProvider from './providers/api'
import Header from './components/Header';
import Footer from './components/Footer';
import AccordianGroup from './components/accordianGroup/AccordianGroup';
import Files from './components/files/Files';
import Audio from './components/audio/Audio';
import Midi from './components/midi/Midi';
import Channels from './components/channels/Channels';
import Stream from './components/midi/Stream';

const appStyle = {
  overflow: 'auto',
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
      <ApiProvider>
        <Header />
        <Box sx={bodyStyle}>
          <AccordianGroup items={[
            {
              title: 'Files',
              component: Files
            },
            {
              title: 'Audio Devices',
              component: Audio
            },
            {
              title: 'Midi Devices',
              component: Midi
            },
            {
              title: 'Midi Channels',
              component: Channels
            },
            {
              title: 'Midi Messages',
              component: Stream
            }
          ]} />
        </Box>
        <Footer />
      </ApiProvider>
    </Box>
  );
}

export default App;

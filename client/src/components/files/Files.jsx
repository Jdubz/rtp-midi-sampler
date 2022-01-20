import { useEffect, useState } from 'react';
import axios from 'axios';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import FileList from './FilesList';

export default function Files() {
  const [files, setFiles] = useState([]);

  const getFiles = async () => {
    const files = await axios.get('http://192.168.86.250:8080/file');
    setFiles(files.data);
  }

  useEffect(() => {
    getFiles();
  }, [])

  return(
    <Paper elevation={2} sx={{ padding: '1rem', margin: '1rem 0' }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Files
        </Typography>
      <FileList files={files} />
    </Paper>
  );
}
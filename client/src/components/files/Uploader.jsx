import {useRef, useState} from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function Uploader({ setFiles }) {
  const inputFile = useRef(null)
  const [progress, setProgress] = useState([0, 0]);

  const onClick = () => {
   inputFile.current.click();
  };

  const uploadFiles = async (e) => {
    const { files } = e.target;
    const formData = new FormData();
    let currentFile = 0;
    while (currentFile < files.length) {
      formData.append('file', files[currentFile]);
      currentFile++;
    }
    const uploadResponse = await axios({
      method: 'POST',
      url: (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_SERVER_URL : '') + '/file',
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: (progress) => {
        setProgress([progress.loaded, progress.total])
      }, 
    });
    setFiles(uploadResponse.data);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center', 
      }}
    >
      <Button
        variant="outlined" 
        startIcon={<UploadFileIcon />} 
        onClick={onClick}
      >
        Upload Files
        <input
          type='file'
          ref={inputFile}
          style={{display: 'none'}}
          multiple
          onChange={uploadFiles}
          accept='.wav'
        />
      </Button>
      <Typography sx={{marginLeft: '1rem'}}>
        {progress[0]} / {progress[1]}
      </Typography>
    </Box>
  )
}
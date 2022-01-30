import { useEffect, useState } from 'react';
import axios from 'axios';

import Uploader from './Uploader';
import FileList from './FilesList';

export default function Files() {
  const [files, setFiles] = useState([]);

  const getFiles = async () => {
    const files = await axios.get(
      (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_SERVER_URL : '')
    + '/file');
    setFiles(files.data);
  }

  useEffect(() => {
    getFiles();
  }, [])

  return(
    <>      
      <FileList files={files} />
      <Uploader setFiles={setFiles}/>
    </>
  );
}
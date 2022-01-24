import { useEffect, useState } from 'react';
import axios from 'axios';

import Uploader from './Uploader';
import FileList from './FilesList';

export default function Files() {
  const [files, setFiles] = useState([]);

  const getFiles = async () => {
    const files = await axios.get('http://192.168.86.25:8080/file');
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
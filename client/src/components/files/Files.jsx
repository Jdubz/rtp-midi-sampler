import { useEffect, useState } from 'react';
import axios from 'axios';

import FilesList from './FilesList';

export default function Files() {
  const [folders, setFolders] = useState([]);

  const getSamples = async () => {
    const foldersList = await getFiles();
    setFolders(foldersList);
  }

  const getFiles = async (path) => {
    const url = (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_SERVER_URL : '')
    + '/samples' + (path ? '/' + path : '');
    const filesResponse = await axios.get(url);
    return filesResponse.data;
  }

  useEffect(() => {
    getSamples();
  }, [])

  return(
    <FilesList files={folders} />
  );
}
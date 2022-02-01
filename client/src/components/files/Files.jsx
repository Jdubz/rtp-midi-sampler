import { useEffect, useState } from 'react';
import axios from 'axios';

import AccordianGroup from '../accordianGroup/AccordianGroup';
import FileList from './FilesList';

export default function Files() {
  const [folders, setFolders] = useState({});

  const buildFolders = async () => {
    const foldersList = await getFiles();
    setFolders(foldersList.reduce((folderMap, folderName) => {
      folderMap[folderName] = {
        title: folderName,
        component: () => <FileList files={[]} setFiles={() => getFolder(folderName)} />,
      }
      return folderMap;
    }, {}));
  }

  const getFolder = async (folderName) => {
    const folderResponse = await getFiles(folderName);
    const newFolders = { ...folders };
    newFolders[folderName] = {
      title: folderName,
      component: () => <FileList files={folderResponse} setFiles={() => getFolder(folderName)} />,
    }
    setFolders(newFolders)
  }

  const getFiles = async (path) => {
    const url = (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_SERVER_URL : '')
    + '/file' + (path ? '/' + path : '');
    const filesResponse = await axios.get(url);
    return filesResponse.data;
  }

  useEffect(() => {
    buildFolders();
  }, [])

  return(
    <AccordianGroup items={Object.values(folders)} onChange={getFolder} />
  );
}
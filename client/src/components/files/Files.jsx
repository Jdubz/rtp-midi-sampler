import React, { useContext } from 'react';

import FilesList from './FilesList';

import { ApiContext } from '../../providers/api';

export default function Files() {
  const { files } = useContext(ApiContext);

  return(
    <FilesList files={files} />
  );
}
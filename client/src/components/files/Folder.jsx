import React from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';

import FileList from './FilesList'

const Folder = ({ folder }) =>
  <Accordion sx={{ width: '100%' }}>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
    >
      <Typography variant="h6"sx={{ flexGrow: 1 }}>{folder.name}</Typography>
    </AccordionSummary>
    <Box sx={{ padding: '1rem' }}>
      <FileList files={folder.files} />
    </Box>
  </Accordion>

export default Folder

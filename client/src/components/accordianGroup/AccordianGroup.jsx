import React, { useState } from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';

export default function AccordianGroup({ items, onChange }) {
    const [expanded, setExpanded] = useState('');

    const handleChange = (panel) => (event, isExpanded) => {
      if (onChange && isExpanded) onChange(panel)
      setExpanded(isExpanded ? panel : false);
    };

    return (
      <Box>
        {items.map(item =>
          <Accordion expanded={expanded === item.title} onChange={handleChange(item.title)} key={item.title}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography variant="h6"sx={{ flexGrow: 1 }}>{item.title}</Typography>
            </AccordionSummary>
            <Box sx={{ padding: '1rem' }}>
              <item.component isOpen={expanded === item.title} />
            </Box>
          </Accordion>
        )}
      </Box>
    )
}
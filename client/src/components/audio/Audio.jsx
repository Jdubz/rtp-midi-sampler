import React, { useContext } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

import { ApiContext } from '../../providers/api';

export default function AudioDevices() {
  const { audioDevices, openAudioDevice, currentOutput } = useContext(ApiContext)

  return <List dense={true}>
    {audioDevices.map((device, i) => 
      <ListItem key={i}>
        <ListItemButton onClick={() => openAudioDevice(device, i)}>
          <ListItemText
            primary={device.name}
          />
          <ListItemIcon>
            {device.name === currentOutput
              ? <RadioButtonCheckedIcon />
              : <RadioButtonUncheckedIcon />
            }
            
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
    )}
  </List>
}
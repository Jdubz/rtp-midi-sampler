import { useContext } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

import { ApiContext } from '../../providers/api';

export default function Midi() {
  const { midiDevices, openMidiDevice } = useContext(ApiContext)

  return <List dense={true}>
    {midiDevices.map((device, i) => 
      <ListItem key={i}>
        <ListItemButton onClick={() => openMidiDevice(i)}>
          <ListItemText
            primary={device.name}
          />
          <ListItemIcon>
            {device.open
              ? <RadioButtonCheckedIcon />
              : <RadioButtonUncheckedIcon />
            }
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
    )}
  </List>
}
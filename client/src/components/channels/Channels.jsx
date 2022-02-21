import { useContext, useMemo } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { ApiContext } from '../../providers/api';

export default function Channels() {
  const { channels, setChannel, files } = useContext(ApiContext);

  const folders = useMemo(() => files.reduce((reducer, file) => {
    if (typeof file !== 'string') {
      reducer.push(file.name)
    }
    return reducer
  }, []), [files])

  return <List dense={true}>
    {channels.map((channel, i) => 
      <ChannelSelect
        key={i}
        channel={i}
        value={channel}
        folders={folders}
        onChange={setChannel}
      />
    )}
  </List>
}

function ChannelSelect({ channel, value, folders, onChange }) {
  return <ListItem>
    <ListItemText
      primary={`${channel}.`}
    />
    <FormControl fullWidth>
      <InputLabel>Folder</InputLabel>
      <Select
        value={value || ''}
        label="Folder"
        onChange={(e) => onChange(e.target.value, channel)}
      >
        {folders.map((folder) => 
          <MenuItem key={folder} value={folder}>
            {folder}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  </ListItem>
}
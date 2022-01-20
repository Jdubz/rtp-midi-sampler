import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export default function DeviceList({ devices }) { 
  return(
    <List dense={true}>
      {devices.map((device, i) => 
        <ListItem key={i}>
          <ListItemText
            primary={device.name}
          />
        </ListItem>
      )}
    </List>
  );
}
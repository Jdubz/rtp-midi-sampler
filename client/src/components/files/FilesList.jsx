import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Folder from './Folder'

export default function FileList({ files }) { 
  return(
    <List dense={true}>
      {files.map((file, i) => {
        return <ListItem key={i}>
          {typeof file === 'string'
            ? <ListItemText
              primary={file}
            />
            : <Folder folder={file} />
          }
        </ListItem>
      })}
    </List>
  );
}
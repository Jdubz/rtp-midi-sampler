import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export default function FileList({ files }) { 
  return(
    <List dense={true}>
      {files.map((file, i) => 
        <ListItem key={i}>
          <ListItemText
            primary={file}
          />
        </ListItem>
      )}
    </List>
  );
}
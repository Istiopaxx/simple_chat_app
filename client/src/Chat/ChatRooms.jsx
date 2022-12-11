import React, { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import LanguageIcon from '@material-ui/icons/Language';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import socketIOClient from 'socket.io-client';

import { useGetChatRooms } from '../Services/chatService';
import { authenticationService } from '../Services/authenticationService';
import commonUtilites from '../Utilities/common';

const useStyles = makeStyles((theme) => ({
  subheader: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  globe: {
    backgroundColor: theme.palette.primary.dark,
  },
  subheaderText: {
    color: theme.palette.primary.dark,
  },
  list: {
    maxHeight: 'calc(100vh - 112px)',
    overflowY: 'auto',
  },
}));

const ChatRooms = (props) => {
  const classes = useStyles();
  const [ChatRooms, setChatRooms] = useState([]);
  const [newChatRoom, setNewChatRoom] = useState(null);
  const getChatRooms = useGetChatRooms();

  // Returns the recipient name that does not
  // belong to the current user.
  const handleRecipient = (participants) => {
    for (let i = 0; i < participants.length; i++) {
      if (
        participants[i].username !==
        authenticationService.currentUserValue.username
      ) {
        return participants[i];
      }
    }
    return null;
  };

  useEffect(() => {
    getChatRooms().then((res) => setChatRooms(res));
  }, [newChatRoom]);

  useEffect(() => {
    let socket = socketIOClient(process.env.REACT_APP_API_URL);
    socket.on('messages', (data) => setNewChatRoom(data));

    return () => {
      socket.removeListener('messages');
    };
  }, []);

  return (
    <List className={classes.list}>
      <ListItem
        classes={{ root: classes.subheader }}
        onClick={() => {
          props.setScope('Global Chat');
        }}
      >
        <ListItemAvatar>
          <Avatar className={classes.globe}>
            <LanguageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText className={classes.subheaderText} primary="Global Chat" />
      </ListItem>
      <Divider />

      {ChatRooms && (
        <React.Fragment>
          {ChatRooms.map((c) => (
            <ListItem
              className={classes.listItem}
              key={c._id}
              button
              onClick={() => {
                props.setUser(handleRecipient(c.participants));
                props.setScope(handleRecipient(c.participants).name);
              }}
            >
              <ListItemAvatar>
                <Avatar>
                  {commonUtilites.getInitialsFromName(
                    handleRecipient(c.participants).name
                  )}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={handleRecipient(c.participants).name}
                secondary={<React.Fragment>{c.lastMessage}</React.Fragment>}
              />
            </ListItem>
          ))}
        </React.Fragment>
      )}
    </List>
  );
};

export default ChatRooms;

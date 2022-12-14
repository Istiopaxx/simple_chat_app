import React, { useState, useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import io from 'socket.io-client';

import { useGetUsers } from '../Services/userService';
import commonUtilites from '../Utilities/common';
import { useCreateChatRoom, useGetChatRooms } from '../Services/chatService';
import { authenticationService } from '../Services/authenticationService';
import authHeader from '../Utilities/auth-header';

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
  avatar: {
    margin: theme.spacing(0, 3, 0, 1),
  },
}));

const Users = (props) => {
  const classes = useStyles();
  const [currentUserId] = useState(authenticationService.currentUserValue._id);
  const [users, setUsers] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const getUsers = useGetUsers();
  const getChatRooms = useGetChatRooms();
  const createChatRoom = useCreateChatRoom();
  const token = authHeader().Authorization;
  const socket = io(process.env.REACT_APP_WS_URL, {
    reconnectionDelayMax: 10000,
    auth: {
      token,
    },
  });

  useEffect(() => {
    getUsers().then((res) => setUsers(res));
    getChatRooms().then((res) => setChatRooms(res));
  }, []);

  const handleUserOnClick = (user) => (e) => {
    if (user._id === currentUserId) return;
    let flag = false;
    chatRooms.some((r) => {
      if (r.participants.some((u) => u._id === user._id)) {
        props.setUser(user);
        props.setScope(user.name);
        props.setRoomId(r._id);
        flag = true;
      }
    });
    if (flag) return;
    const createChatRoomDto = {
      participants: [user._id, currentUserId],
    };
    const room = createChatRoom(socket, createChatRoomDto);
    props.setUser(user);
    props.setScope(user.name);
    props.setRoomId(room._id);
  };

  return (
    <List className={classes.list}>
      {users && (
        <React.Fragment>
          {users.map((u) => (
            <ListItem
              className={classes.listItem}
              key={u._id}
              onClick={handleUserOnClick(u)}
              button
            >
              <ListItemAvatar className={classes.avatar}>
                <Avatar>{commonUtilites.getInitialsFromName(u.name)}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={u.name} />
            </ListItem>
          ))}
        </React.Fragment>
      )}
    </List>
  );
};

export default Users;

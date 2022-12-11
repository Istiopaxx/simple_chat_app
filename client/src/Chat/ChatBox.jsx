import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import classnames from 'classnames';
import commonUtilites from '../Utilities/common';
import {
  useGetGlobalMessageHistory,
  useGetGlobalNewMessage,
  useSendGlobalMessage,
  useGetChatMessageHistory,
  useGetChatNewMessage,
  useSendChatMessage,
} from '../Services/chatService';
import { authenticationService } from '../Services/authenticationService';
import io from 'socket.io-client';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  headerRow: {
    maxHeight: 60,
    zIndex: 5,
  },
  paper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: theme.palette.primary.dark,
  },
  messageContainer: {
    height: '100%',
    display: 'flex',
    alignContent: 'flex-end',
  },
  messagesRow: {
    maxHeight: 'calc(100vh - 184px)',
    overflowY: 'auto',
  },
  newMessageRow: {
    width: '100%',
    padding: theme.spacing(0, 2, 1),
  },
  messageBubble: {
    padding: 10,
    border: '1px solid white',
    backgroundColor: 'white',
    borderRadius: '0 10px 10px 10px',
    boxShadow: '-3px 4px 4px 0px rgba(0,0,0,0.08)',
    marginTop: 8,
    maxWidth: '40em',
  },
  messageBubbleRight: {
    borderRadius: '10px 0 10px 10px',
  },
  inputRow: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  form: {
    width: '100%',
  },
  avatar: {
    margin: theme.spacing(1, 1.5),
  },
  listItem: {
    display: 'flex',
    width: '100%',
  },
  listItemRight: {
    flexDirection: 'row-reverse',
  },
}));

const ChatBox = ({ scope, user, roomId }) => {
  const [currentUserId] = useState(
    authenticationService.currentUserValue.userId
  );
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const getGlobalMessageHistory = useGetGlobalMessageHistory();
  const getGlobalNewMessage = useGetGlobalNewMessage();
  const sendGlobalMessage = useSendGlobalMessage();
  const getChatMessageHistory = useGetChatMessageHistory();
  const getChatNewMessage = useGetChatNewMessage();
  const sendChatMessage = useSendChatMessage();

  let chatBottom = useRef(null);
  const classes = useStyles();
  const socket = io();

  const reloadMessages = () => {
    if (scope === 'Global Chat') {
      getGlobalMessageHistory().then((res) => setMessages(res));
    } else if (scope !== null && roomId !== null) {
      getChatMessageHistory(roomId).then((res) => setMessages(res));
    } else {
      setMessages([]);
    }
  };

  useEffect(() => {
    reloadMessages();
  }, [scope, roomId]);

  const appendMessage = (message) => {
    setMessages((messages) => [...messages, message]);
  };

  useEffect(() => {
    if (scope === 'Global Chat') {
      getGlobalNewMessage(appendMessage);
    } else if (scope !== null && roomId !== null) {
      getChatNewMessage(appendMessage);
    } else {
      setMessages([]);
    }
    return () => {
      socket.off('messages/global');
      socket.off('messages');
    };
  }, []);

  const scrollToBottom = () => {
    chatBottom.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const createMessageDto = {
      from: currentUserId,
      content: newMessage,
      roomId,
    };
    if (scope === 'Global Chat') {
      sendGlobalMessage(createMessageDto);
    } else {
      sendChatMessage(createMessageDto);
    }
  };

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} className={classes.headerRow}>
        <Paper className={classes.paper} square elevation={2}>
          <Typography color="inherit" variant="h6">
            {scope}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Grid container className={classes.messageContainer}>
          <Grid item xs={12} className={classes.messagesRow}>
            {messages && (
              <List>
                {messages.map((m) => (
                  <ListItem
                    key={m._id}
                    className={classnames(classes.listItem, {
                      [`${classes.listItemRight}`]:
                        m.from._id === currentUserId,
                    })}
                    alignItems="flex-start"
                  >
                    <ListItemAvatar className={classes.avatar}>
                      <Avatar>
                        {commonUtilites.getInitialsFromName(m.from.name)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      classes={{
                        root: classnames(classes.messageBubble, {
                          [`${classes.messageBubbleRight}`]:
                            m.from._id === currentUserId,
                        }),
                      }}
                      primary={m.from && m.from.name}
                      secondary={<React.Fragment>{m.body}</React.Fragment>}
                    />
                  </ListItem>
                ))}
              </List>
            )}
            <div ref={chatBottom} />
          </Grid>
          <Grid item xs={12} className={classes.inputRow}>
            <form onSubmit={handleSubmit} className={classes.form}>
              <Grid
                container
                className={classes.newMessageRow}
                alignItems="flex-end"
              >
                <Grid item xs={11}>
                  <TextField
                    id="message"
                    label="Message"
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton type="submit">
                    <SendIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChatBox;

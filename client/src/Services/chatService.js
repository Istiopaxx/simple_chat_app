import useHandleResponse from '../Utilities/handle-response';
import authHeader from '../Utilities/auth-header';
import { useSnackbar } from 'notistack';
import socketIOClient from 'socket.io-client';

// Receive global messages
export function useGetGlobalMessageHistory() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  const getGlobalMessages = () => {
    // return fetch(
    //     `${process.env.REACT_APP_API_URL}/chat/messages/global`,
    //     requestOptions
    // )
    //     .then(handleResponse)
    //     .catch(() =>
    //         enqueueSnackbar('Could not load Global Chat', {
    //             variant: 'error',
    //         })
    //     );
    return Promise.resolve([
      {
        id: 1,
        body: 'Hello',
        from: {
          id: 1,
          username: 'John',
          name: 'John',
        },
        date: new Date(),
      },
      {
        id: 1,
        body: 'Hello',
        from: {
          id: 1,
          username: 'John',
          name: 'John',
        },
        date: new Date(),
      },
      {
        id: 1,
        body: 'Hello',
        from: {
          id: 1,
          username: 'John',
          name: 'John',
        },
        date: new Date(),
      },
      {
        id: 1,
        body: 'Hello',
        from: {
          id: 1,
          username: 'John',
          name: 'John',
        },
        date: new Date(),
      },
    ]);
  };

  return getGlobalMessages;
}

export function useGetGlobalNewMessage() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();

  const getGlobalNewMessage = (socket, callback) => {
    socket.on('message/global', (message) => {
      callback(message);
    });
  }

  return getGlobalNewMessage;
}

// Send a global message
export function useSendGlobalMessage() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();

  const sendGlobalMessage = (socket, createMessageDto) => {
    socket.emit('message/gloabal', createMessageDto, (res) => {
      console.log(res);
    });
  };
  return sendGlobalMessage;
}

// Get list of users Chats
export function useGetChatRooms() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  const getChatRooms = () => {
    // return fetch(
    //     `${process.env.REACT_APP_API_URL}/chat/rooms`,
    //     requestOptions
    // )
    //     .then(handleResponse)
    //     .catch(() =>
    //         enqueueSnackbar('Could not load chats', {
    //             variant: 'error',
    //         })
    //     );
    return Promise.resolve([
      {
        participants: [
          {
            id: 1,
            username: 'John',
            name: 'John',
          }
        ],
        lastMessage: 'Hello',
        id: 1,
        date: new Date(),
      },
      {
        participants: [
          {
            id: 1,
            username: 'John',
            name: 'John',
          }
        ],
        lastMessage: 'Hello',
        id: 1,
        date: new Date(),
      },
      {
        participants: [
          {
            id: 1,
            username: 'John',
            name: 'John',
          }
        ],
        lastMessage: 'Hello',
        id: 1,
        date: new Date(),
      }
    ]);
  };

  return getChatRooms;
}

// get Chat messages based on
// to and from id's
export function useGetChatMessageHistory() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  };

  const getChatMessages = roomId => {
    return fetch(
      `${process.env.REACT_APP_API_URL
      }/chat/messages/${roomId}`,
      requestOptions
    )
      .then(handleResponse)
      .catch(() =>
        enqueueSnackbar('Could not load chats', {
          variant: 'error',
        })
      );
  };

  return getChatMessages;
}

export function useGetChatNewMessage() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();

  const getChatNewMessage = (socket, callback) => {
    socket.on('message', (message) => {
      callback(message);
    });
  }

  return getChatNewMessage;
}

export function useSendChatMessage() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();

  const sendChatMessage = (socket, createMessageDto) => {
    socket.emit('message', createMessageDto, (res) => {
      console.log(res);
    });
  }

  return sendChatMessage;
}

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
    return fetch(
      `${process.env.REACT_APP_API_URL}/chat/globalMessage`,
      requestOptions
    )
      .then(handleResponse)
      .catch(() =>
        enqueueSnackbar('Could not load Global Chat', {
          variant: 'error',
        })
      );
  }

  return getGlobalMessages;
}

export function useGetGlobalNewMessage() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();

  const getGlobalNewMessage = (socket, callback) => {
    socket.on('ReceiveMessage', (message) => {
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
    socket.emit('SendGlobalMessage', createMessageDto, (res) => {
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
    return fetch(
      `${process.env.REACT_APP_API_URL}/chat/chatRoom`,
      requestOptions
    )
      .then(handleResponse)
      .catch(() =>
        enqueueSnackbar('Could not load chats', {
          variant: 'error',
        })
      );

  }
  return getChatRooms;
}

export function useCreateChatRoom() {
  const createChatRoom = (socket, createChatRoomDto, cb) => {
    socket.emit('CreatePrivateRoom', createChatRoomDto, (res) => {
      console.log(res);
      cb(res);
    })
  }
  return createChatRoom;
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
      }/chat/privateMessage/${roomId}`,
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
    socket.on('ReceiveMessage', (message) => {
      callback(message);
    });
  }

  return getChatNewMessage;
}

export function useSendChatMessage() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();

  const sendChatMessage = (socket, createMessageDto) => {
    socket.emit('SendPrivateMessage', createMessageDto, (res) => {
      console.log(res);
    });
  }

  return sendChatMessage;
}

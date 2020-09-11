import io from 'socket.io-client';
import { useEffect, useState } from 'react';

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  const connectToSocketServer = (room: string, username: string) => {
    const socketIo = io('http://localhost:3001');

    socketIo.on('connect', () => {
      setIsConnected(true);
      setSocket(socketIo);

      if (room) {
        socketIo.emit('join', { room, username });
      }
    });

    // socketIo.on('joined', (test: any): void => {
    //   console.log(test);
    // });

    // socketIo.on('leaved', (test: any): void => {
    //   console.log(test);
    // });

    socketIo.on('disconnect', (): void => {
      setIsConnected(false);
      setSocket(null);
    });
  };

  const disconnectFromSocketServer = (): void => socket.disconnect();

  useEffect(() => {}, []);

  return {
    socket,
    isConnected,
    connectToSocketServer,
    disconnectFromSocketServer,
  };
};

export default useSocket;

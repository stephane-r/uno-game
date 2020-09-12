import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useUsers, addUser, removeUser } from "../states/users";

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const users = useUsers();

  const connectToSocketServer = (room: string, username: string) => {
    const socketIo = io("http://localhost:3001");

    socketIo.on("connect", () => {
      setIsConnected(true);
      setSocket(socketIo);

      if (room) {
        socketIo.emit("join", { room, username });
      }
    });

    socketIo.on("joined", (user: any): void => {
      addUser(user);
    });

    socketIo.on("leaved", (userId: string): void => {
      console.log(userId);
      removeUser(userId);
    });

    socketIo.on("roomFull", (): void => {
      alert("Room is full ! Disconnect from socket");
      socketIo.disconnect();
    });

    socketIo.on("disconnect", (): void => {
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
    users,
  };
};

export default useSocket;

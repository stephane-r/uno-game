import useSocket from "../hooks/useSocket";
import { useState, useEffect } from "react";
import { useUsers } from "../states/users";

const Home: React.FC = () => {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const {
    isConnected,
    connectToSocketServer,
    disconnectFromSocketServer,
  } = useSocket();
  const users = useUsers();

  useEffect(() => {}, []);

  return (
    <div>
      {isConnected ? (
        <span style={{ color: "green" }}>Connected</span>
      ) : (
        <span style={{ color: "red" }}>Not connected</span>
      )}
      <div>
        <input type="text" onChange={(event) => setRoom(event.target.value)} />
        <input
          type="text"
          onChange={(event) => setUsername(event.target.value)}
        />
        <button
          type="button"
          disabled={room === "" || username === ""}
          onClick={() => connectToSocketServer(room, username)}
        >
          Join
        </button>
      </div>
      {isConnected && (
        <div>
          <button type="button" onClick={disconnectFromSocketServer}>
            Leave
          </button>
          <ul>
            {users.map(({ id, username }) => (
              <li key={id}>{username}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;

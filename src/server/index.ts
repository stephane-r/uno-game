const path = require("path");
const Koa = require("koa");
const Router = require("@koa/router");
const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient();
const hmset = promisify(client.hmset).bind(client);
const hgetall = promisify(client.hgetall).bind(client);
const hmget = promisify(client.hmget).bind(client);
const hdel = promisify(client.hdel).bind(client);
const del = promisify(client.del).bind(client);

client.flushdb();

const port = 3001;

const app = new Koa();
const router = new Router();
const server = require("http").createServer(app.callback());
const io = require("socket.io")(server);

io.on("connection", (socket: any): void => {
  const joinRoom = ({
    room,
    username,
  }: {
    room: string;
    username: string;
  }): void => {
    const test = io.sockets.adapter.rooms[room];

    if (test && test.length === 2) {
      return socket.emit("roomFull");
    }

    return socket.join(
      room,
      async (): Promise<void> => {
        // Save room name on socket instance
        socket.room = room;

        const roomName = `room:${room}`;

        // Set user on Redis
        await hmset([
          `user:${socket.id}`,
          "username",
          username,
          "cards",
          JSON.stringify([0, 5, 9, 3, 7, 9, 1]),
          "room",
          room,
        ]);

        // Set Room on Redis
        await hmset([roomName, `user:${socket.id}`, username]);

        // All notif room with new user
        const result = await hgetall(roomName);
        const users = Object.entries(result).map((item) => ({
          id: item[0],
          username: item[1],
        }));
        io.to(room).emit("joined", users);
      }
    );
  };

  const removeUser = async (): Promise<void> => {
    // Get the user
    const userRoomName = await hmget([`user:${socket.id}`, "room"]);

    if (userRoomName) {
      // Remove from Room
      await hdel(`room:${userRoomName[0]}`, `user:${socket.id}`);
      // Remove user
      await del(`user:${socket.id}`);
    }

    // Remove user from Room
    io.to(socket.room).emit("leaved", `user:${socket.id}`);
  };

  const leaveRoom = (): null => null;
  const leavingRoom = removeUser;

  socket.on("join", joinRoom);
  socket.on("disconnecting", leavingRoom);
  socket.on("disconnect", leaveRoom);
});

router.get(
  "/hello-world",
  async (ctx: any): Promise<any> => {
    ctx.body = {
      status: "success",
      json: "test",
    };
  }
);

app.use(router.routes());

server.listen(port, () => {
  console.log(`> Ready on http://localhost:${port}`);
});

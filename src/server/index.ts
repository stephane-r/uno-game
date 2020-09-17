const path = require('path');
const Koa = require('koa');
const Router = require('@koa/router');
const redis = require('redis');

const client = redis.createClient();

// Next steps :
//  - list all users in room on client
//  - maybe sync directly on db ?

const port = 3001;

const app = new Koa();
const router = new Router();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

io.on('connection', (socket: any): void => {
  const joinRoom = ({
    room,
    username,
  }: {
    room: string;
    username: string;
  }): void => {
    const test = io.sockets.adapter.rooms[room];

    if (test && test.length === 2) {
      return socket.emit('roomFull');
    }

    return socket.join(room, (): void => {
      io.to(room).emit('joined', { id: socket.id, username });
    });
  };

  const leaveRoom = (): void => {
    console.log('leave');
  };

  const leavingRoom = (): void => {
    const rooms = Object.keys(socket.rooms);

    rooms.forEach((room) => io.to(room).emit('leaved', socket.id));
  };

  socket.on('join', joinRoom);
  socket.on('disconnecting', leavingRoom);
  socket.on('disconnect', leaveRoom);
});

router.get(
  '/hello-world',
  async (ctx: any): Promise<any> => {
    ctx.body = {
      status: 'success',
      json: 'test',
    };
  }
);

app.use(router.routes());

server.listen(port, () => {
  console.log(`> Ready on http://localhost:${port}`);
});

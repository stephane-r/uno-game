const path = require('path');
const Koa = require('koa');
const Router = require('@koa/router');

// Next steps :
//  - list all users in room on client
//  - maybe sync directly on db ?

const port = 3001;

const app = new Koa();
const router = new Router();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

io.on('connection', (socket: any): void => {
  const joinRoom = ({ room }: { room: string }): void => {
    socket.join(room, (): void => {
      const rooms = Object.keys(socket.rooms);
      console.log(rooms);
      socket.emit('joined', { room });
    });
  };

  const leaveRoom = (): void => {
    console.log(io.sockets.adapter.rooms);
    socket.emit('leaved');
  };

  socket.on('join', joinRoom);
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

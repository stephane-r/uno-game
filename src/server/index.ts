const path = require("path");
const Koa = require("koa");
const Router = require("@koa/router");

const port = 3001;

const app = new Koa();
const router = new Router();
const server = require("http").createServer(app.callback());
const io = require("socket.io")(server);

io.on("connection", (socket: any): void => console.log(socket));

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

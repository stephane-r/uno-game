const path = require("path");
const Koa = require("koa");
const Router = require("@koa/router");

const port = 3001;

const server = new Koa();
const router = new Router();

router.get(
  "/hello-world",
  async (ctx: any): Promise<any> => {
    ctx.body = {
      status: "success",
      json: "test",
    };
  }
);

server.use(router.routes());
server.listen(port, () => {
  console.log(`> Ready on http://localhost:${port}`);
});

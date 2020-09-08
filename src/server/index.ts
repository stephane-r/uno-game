const Koa = require("koa");
const next = require("next");
const Router = require("@koa/router");

const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, dir: "src/client" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  router.get(
    "/a",
    async (ctx: any): Promise<any> => {
      await app.render(ctx.req, ctx.res, "/a", ctx.query);
      ctx.respond = false;
    }
  );

  router.get(
    "/b",
    async (ctx: any): Promise<any> => {
      await app.render(ctx.req, ctx.res, "/b", ctx.query);
      ctx.respond = false;
    }
  );

  router.all(
    "*",
    async (ctx: any): Promise<any> => {
      await handle(ctx.req, ctx.res);
      ctx.respond = false;
    }
  );

  server.use(
    async (ctx: any, next: any): Promise<any> => {
      ctx.res.statusCode = 200;
      await next();
    }
  );

  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});

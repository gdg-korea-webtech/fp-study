const serve = require("koa-static");
const Koa = require("koa");

const app = new Koa();
const port = parseInt(process.env.PORT || "3030", 10);

app.use(serve("./public")).listen(port);

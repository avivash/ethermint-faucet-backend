import express from "express";
import fastify from "fastify";
import fastifyExpress from "fastify-express";
import metricsPlugin from "fastify-metrics";

import { router as indexRouter } from "./routes/index";
import { router as faucetRouter } from "./routes/faucet";

async function init() {
  // var app = express();
  const app = fastify({
    logger: true,
  });

  app.register(require("fastify-cors"), {
    origin: "*",
  });

  app.addHook("onRequest", (req: any, res: any, next: any) => {
    if (req.url.indexOf("/metrics") > -1) {
      (app as any).basicAuth(req, res, next);
    } else {
      next();
    }
  });

  app.register(metricsPlugin, { endpoint: "/metrics" });

  await app.register(fastifyExpress);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/", indexRouter);
  app.use("/faucet", faucetRouter);

  return app;
}

export { init };

import express from "express";
import fastify from "fastify";
import fastifyExpress from "fastify-express";

import { router as indexRouter } from "./routes/index";
import { router as faucetRouter } from "./routes/faucet";

async function init() {
  const app = fastify({
    logger: true,
  });

  app.register(require("fastify-cors"), {
    origin: "*",
  });

  await app.register(fastifyExpress);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/", indexRouter);
  app.use("/faucet", faucetRouter);

  return app;
}

export { init };

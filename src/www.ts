#!/usr/bin/env node

require("dotenv").config();
require("ts-node").register();
let { init } = require("../src/app");
require("http");

(async () => {
  const app = await init();
  let port = process.env.PORT || "7000";

  // Run the server!
  app.listen(port, function (err, address) {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`server listening on ${address}`);
  });
})();

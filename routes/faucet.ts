import express from "express";
const router = express.Router();

import * as faucet from "../faucet";
import { ethToEthermint, ethermintToEth } from "@hanchon/ethermint-address-converter";

import client from "prom-client";

const counterDrip = new client.Counter({
  name: "faucet_transaction_count",
  help: "faucet_transaction_count is the number of times the faucet dripped",
});

const counterDripError = new client.Counter({
  name: "faucet_transaction_error",
  help: "faucet_transaction_count is the number of times the faucet errored while dripping",
});

function invalidAddress(res:any) {
  counterDripError.inc();
  res.status(422).send(JSON.stringify({ error: "invalid address" }));
}

router.post(
  "/",
  async (req: any, res: any, next: any) => {
    let { address } = req.body;
    try {
      if (address.length < 2) return invalidAddress(res);
      // Hex encoded address
      if (address[0] === "0" && address[1]==="x") {
        if (ethermintToEth(ethToEthermint(address)) !== address) return invalidAddress(res);
        address = ethToEthermint(address)
      } else {
        // Ethermint address
        if (!address.includes("ethm")) return invalidAddress(res);
      }
    } catch(error) {
      return invalidAddress(res)
    }

    try {
      const result = await faucet.sendTokens(address, null);
      console.log('RESULT', result)
      counterDrip.inc();
      res
        .status(201)
        .send(JSON.stringify({ transactionHash: result.transactionHash }));
    } catch (error) {
      counterDripError.inc();
      res.status(422).send(JSON.stringify({ error: error.message }));
    }
  }
);

export { router };

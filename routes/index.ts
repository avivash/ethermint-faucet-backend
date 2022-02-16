import express from "express";
const router = express.Router();

// import { latestTransactionSince } from "../database";
import * as faucet from "../faucet";

import client from "prom-client";

const counterPreflight = new client.Counter({
  name: "faucet_preflight_count",
  help: "faucet_preflight_count is the number of times the faucet served the preflight page",
});

/* GET home page. */
router.get("/", async (req: any, res: any, next: any) => {
  console.log('okay');
  const wallet = await faucet.getWallet();
  console.log('wallet', wallet);
  const chainId = await faucet.getChainId();
  console.log('chainId', chainId);
  const distributionAmount = faucet.getDistributionAmount();
  console.log('distributionAmount', distributionAmount);
  const distrbutionDenom = faucet.getDenom();
  console.log('distrbutionDenom', distrbutionDenom);
  const [{ address }] = await wallet.getAccounts();
  // var unlockDate;

  // if (req.user && req.user.id) {
  //   let cooldownDate = new Date(
  //     (new Date() as any) - (faucet.getWaitPeriod() as any)
  //   );
  //   let transaction: any = await latestTransactionSince(req.user, cooldownDate);
  //   if (transaction)
  //     unlockDate = new Date(
  //       transaction.createdAt.getTime() + faucet.getWaitPeriod()
  //     );
  // }
  console.log('address', address);
  // counterPreflight.inc();
  res.status(200).send(
    JSON.stringify({
      faucetAddress: address,
      // unlockDate,
      chainId,
      distributionAmount,
      distrbutionDenom,
    })
  );
});

export { router };

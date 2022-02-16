import express from "express";
const router = express.Router();

import * as faucet from "../faucet";

/* GET home page. */
router.get("/", async (req: any, res: any, next: any) => {
  const wallet = await faucet.getWallet();
  const chainId = await faucet.getChainId();
  const distributionAmount = faucet.getDistributionAmount();
  const distrbutionDenom = faucet.getDenom();
  const [{ address }] = await wallet.getAccounts();

  res.status(200).send(
    JSON.stringify({
      faucetAddress: address,
      chainId,
      distributionAmount,
      distrbutionDenom,
    })
  );
});

export { router };

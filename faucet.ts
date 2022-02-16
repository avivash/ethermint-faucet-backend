import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient, coins, parseCoins } from "@cosmjs/stargate";
import { stringToPath } from "@cosmjs/crypto";
import parse from "parse-duration";

const NETWORK_RPC_NODE = process.env.NETWORK_RPC_NODE;
const FAUCET_MNEMONIC = process.env.FAUCET_MNEMONIC;
const FAUCET_WAIT_PERIOD = process.env.FAUCET_WAIT_PERIOD || "1h";
const FAUCET_DISTRIBUTION_AMOUNT =
  process.env.FAUCET_DISTRIBUTION_AMOUNT || 1000000000;
const FAUCET_DENOM = process.env.FAUCET_DENOM || "agnt";
const FAUCET_FEES = process.env.FAUCET_FEES || 5000;
const FAUCET_GAS = process.env.FAUCET_GAS || 180000;
const FAUCET_MEMO = process.env.FAUCET_MEMO;
const ADDRESS_PREFIX = process.env.ADDRESS_PREFIX || "ethm";

export const getWallet = () => {
  return DirectSecp256k1HdWallet.fromMnemonic(FAUCET_MNEMONIC as any, {
    prefix: ADDRESS_PREFIX,
    hdPaths: [stringToPath("m/44'/60'/0'/0/0")],
  });
};

export const getDenom = () => {
  return FAUCET_DENOM;
};

export const getWaitPeriod = () => {
  return parse(FAUCET_WAIT_PERIOD);
};

export const getDistributionAmount = () => {
  return FAUCET_DISTRIBUTION_AMOUNT;
};

export const getChainId = async () => {
  const wallet = await getWallet();
  console.log('wallet 2nd', wallet);
  const client = await SigningStargateClient.connectWithSigner(
    NETWORK_RPC_NODE as any,
    wallet
  );
  console.log('client', client);
  return await client.getChainId();
};

export const sendTokens = async (recipientAddress: any, amount: any) => {
  const wallet = await getWallet();
  console.log('sender ' + wallet)
  console.log(JSON.stringify(wallet))
  const [account] = await wallet.getAccounts();
  console.log(account)
  const client = await SigningStargateClient.connectWithSigner(
    NETWORK_RPC_NODE as any,
    wallet
  );
  if (!amount) amount = getDistributionAmount();

  const sendMsg = {
    typeUrl: "/cosmos.bank.v1beta1.MsgSend",
    value: {
      fromAddress: account.address,
      toAddress: recipientAddress,
      amount: parseCoins(`${amount}${FAUCET_DENOM}`),
    },
  };
  const fee = {
    amount: coins(parseInt(FAUCET_FEES as any), FAUCET_DENOM),
    gas: FAUCET_GAS,
  };
  return await client.signAndBroadcast(
    account.address,
    [sendMsg],
    fee as any,
    FAUCET_MEMO
  );
};

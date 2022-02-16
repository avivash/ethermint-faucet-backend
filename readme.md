# Ethermint Faucet

Faucet server for [Ethermint](https://ethermint.dev/)

## How to use

This faucet is configured to work with Ethermint.

## Configuration

```
POSTGRES_HOST: postgres
POSTGRES_PORT: 5432
POSTGRES_DB: faucet
POSTGRES_USER: postgres
POSTGRES_PASSWORD: password
NETWORK_RPC_NODE: tcp://206.189.227.107:26657
FAUCET_WAIT_PERIOD: 1d
FAUCET_DISTRIBUTION_AMOUNT: 1000
FAUCET_DENOM: ethm
FAUCET_FEES: 5000
FAUCET_GAS: 180000
FAUCET_MEMO: Sent from Faucet
FAUCET_MNEMONIC: some secret words here
```

## Endpoints

All endpoints will return the relevant success status if successful. Errors will
return an appropriate error code and a message under the `error` key.

### `GET /`

Returns status about the faucet

#### Response

```
{
  'faucetAddress': 'ethm...',
  'unlockDate': '2020-10-10T14:48:00',
  'chainId': 'ethermint-2',
  'distributionAmount': 10000
}
```

### `POST /faucet`

Request funds from the faucet. Requires an access token.

#### Params

```
{
  'address': 'ethm...'
}
```

#### Response

```
{
  'transactionHash': 'A5BE0243169DAF5A...'
}
```

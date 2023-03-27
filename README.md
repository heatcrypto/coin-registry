# coin-registry
Registry of coin and token information for use in HEAT mobile wallet platform.

Provides information on coins and tokens, included are:

1. Coin/token name
2. Coin/token symbol
3. Token id/address
4. Coin/token logo
5. Coin/token public explorers with url pattern to link to addresses and transactions

## Adding/updating registry data
In order to add new chain start by editing [`registry/chains.json`](https://github.com/heatcrypto/coin-registry/blob/master/registry/chains.json) where we choose a name for the new chain and select a unique identifier number. (Note if the number is not unique the build process later on will warn you and fail).

The name you give for a chain is arbitrary but must match the directory name for our chain in [`registry`](https://github.com/heatcrypto/coin-registry/tree/master/registry) directory.

Inside the chain directory (Example [`registry/bitcoin`](https://github.com/heatcrypto/coin-registry/tree/master/registry/bitcoin)) we create a file named `chain.json`.

```json
{
  "name": "Bitcoin",
  "addressTypes": ["p2pkh"],
  "network": "bitcoin",
  "bip44": 0,
  "explorers": [{
    "tx":"https://www.blockchain.com/btc/tx/$1",
    "addr":"https://www.blockchain.com/btc/address/$1"
  }]
}
```

### AssetTypes
When a chain supports multiple types of balances (or tokens) we must specify these as `assetTypes` in the `chain.json` for that specific chain.

Chains that support just one type of balance (as is the case with Bitcoin) can ommit the `assetTypes` key.

In Ethereum's case there are so called erc20 tokens for which we add support as follows when we view [`registry/ethereum/chain.json`](https://github.com/heatcrypto/coin-registry/blob/master/registry/ethereum/chain.json)

```json
{
  "name": "Ethereum",
  "addressTypes":["0"],
  "bip44": 60,
  "explorers": [{
    "tx": "https://etherscan.io/tx/$1",
    "addr": "https://etherscan.io/address/$1"
  }],
  "assetTypes": [{
    "id":1,
    "name":"Erc20"
  }]
}
```

Asset types support three properties: 
- `id` (must be unique number, cannot be 0)
- `name` which should be kept as short as possible
- `explorers` same as same named property at higher level but overwrites the explorer for an individual asset type

Implicitly every chain has the asset type with id 0, which means the native token type on the chain. For Bitcoin this would be Bitcoin itself and for Ethereum this would be Ether. Later when we declare the individual currencies we will assign the native token currency with id 0 as well.

Now if we view the parent directory of the `chain.json` file we will sed that for each asset type a directory exists.

```bash
$ ls registry/ethereum
0
1
chain.json
```

### Currencies

Ultimately the `coin-registry` is about identifying individual currencies a wallet user could posess, wether these are native tokens (Bitcoin,Ether) or sub-tokens (Erc20, Heat Assets, etc).

As each currency belongs to a chain and each currency has an asset type. We declare currencies `beneath` their asset types and identify them by their unique identifier on their respective platforms (for erc20 this would be their contract address).

The currency id is derived from their parent folder (see example [`registry/ethereum/1/0x170b275CEd089FffAEBFe927F445a350ED9160DC`](https://github.com/heatcrypto/coin-registry/tree/master/coin-registry/ethereum/1/0x170b275CEd089FffAEBFe927F445a350ED9160DC)).

Inside each currency folder we find a file named `currency.json` and one named `logo.png`. The currency.json looks as follows.

```json
{
  "name": "Long name of token",
  "symbol": "Symbol",
  "decimals": 8
}
```

## Building and validating the registry
To validate and build the `registry.json` we run a script. `npm run build` in case of errors the console output will indicate as much.

The resulting registry can be found in the dist folder.


Blockchain	Time Between Blocks (s)	Blocks for Finality	Certainty (%)
Bitcoin	600	6	95
Ethereum	15	12	95
Heat	30	10	80
Litecoin	150	6	95
Bitcoin Cash	600	6	95
FIMK	30	10	80
Heat Testnet	30	10	80
Bitcoin Testnet	600	6	95
Polygon	2	50	95
Fantom	1	50	95
Binance Smart Chain	3	12	95
Avalanche	3	80	95
Arbitrum	1	100	90
Optimism	15	35	90
Solana	0.4	50	95
Gnosis	N/A	N/A	N/A
Celo	5	100	90
Aptos	N/A	N/A	N/A
Moonbeam	6	50	90
Harmony	2	50	90
Tron	3	19	90
Syscoin	60	6	90
Filecoin	30	5	90
Polkadot	6	50	95
Kusama	6	50	95
Ethereum Goerli	15	12	95
Polygon Mumbai	2	50	95
Avalanche Fuji	3	80	95
Dogecoin	60	6	95

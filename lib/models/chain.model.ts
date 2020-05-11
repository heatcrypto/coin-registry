import { ExplorerModel } from './explorer.model';
import { AssetTypeModel } from './asset-type.model';
import { isNumber } from 'util';

/// These maps human readable public key types to the actual numbers used wallet-core
const publicKeyTypes = {
  secp256k1: 0,
  secp256k1Extended: 1,
  nist256p1: 2,
  nist256p1Extended: 3,
  ed25519: 4,
  ed25519Blake2b: 5,
  curve25519: 6,
  ed25519Extended: 7,
}

export class ChainModel {
  constructor(
    public id: number,
    public name: string,
    public addressTypes: Array<string>,

    /// Network identifier for utxo coins must match any of these
    /// https://github.com/trezor/trezor-utxo-lib/blob/trezor/src/networks.js
    public network: string,

    public assetTypes: Array<AssetTypeModel>,
    public bip44: number,
    public explorers: Array<ExplorerModel>,
    public staticFee: string,
    public bip21: string,
    public confirmed: number,
    public blockTime: number,
    public publicKeyType: number,
  ) { }

  static fromJson = (json: any, id: number) => {
    let { name, addressTypes, bip44, explorers, assetTypes, network, staticFee, bip21, confirmed, blockTime, publicKeyType } = json;
    addressTypes = addressTypes || ["0"];
    explorers = explorers || []
    assetTypes = assetTypes || []
    const publicKeyTypeNumeric = publicKeyTypes[publicKeyType]
    if (!isNumber(publicKeyTypeNumeric)) 
      throw new Error(`Invalid publicKeyType '${publicKeyType}'`)
    const chain = new ChainModel(
      id,
      name,
      addressTypes,
      network,
      [],
      bip44,
      [],
      staticFee,
      bip21,
      confirmed,
      blockTime,
      publicKeyTypeNumeric
    );
    chain.assetTypes = assetTypes.map(x => AssetTypeModel.fromJson(x, chain));
    chain.explorers = explorers.map(x => ExplorerModel.fromJson(x));

    // if there is no Native assetType we add that.
    if (!chain.assetTypes.find(x => x.id === 0)) {
      chain.assetTypes.push(AssetTypeModel.fromJson({
        id: 0,
        name: 'Native',
        currencies: [],
        explorers: [],
      }, chain))
    }
    return chain;
  }

  toCompressedJson = () => [
    this.id,
    this.name,
    this.addressTypes,
    this.network,
    this.bip44,
    this.explorers.map(x => x.toCompressedJson()),
    this.staticFee,
    this.assetTypes.map(x => x.toCompressedJson()),
    this.bip21,
    this.confirmed,
    this.blockTime,
    this.publicKeyType,
  ];

  static fromCompressedJson = (data: Array<any>) => {
    const id = data[0];
    const name = data[1];
    const addressTypes = data[2];
    const network = data[3];
    const bip44 = data[4];
    const explorers = data[5].map(x => ExplorerModel.fromCompressedJson(x));
    const staticFee = data[6];
    //const assetTypes = data[7];
    const bip21 = data[8];
    const confirmed = data[9];
    const blockTime = data[10];
    const publicKeyType = data[11];
    const chain = new ChainModel(
      id,
      name,
      addressTypes,
      network,
      [],
      bip44,
      explorers,
      staticFee,
      bip21,
      confirmed,
      blockTime,
      publicKeyType
    );
    chain.assetTypes = data[7].map(x => AssetTypeModel.fromCompressedJson(x, chain));
    return chain;
  };
}

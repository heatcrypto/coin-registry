import { ExplorerModel } from './explorer.model';
import { AssetTypeModel } from './asset-type.model';
import { CurrencyModel } from './currency.model';

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
  ) { }

  static fromJson = (json: any, id: number) => {
    let { name, addressTypes, bip44, explorers, assetTypes, network, staticFee } = json;
    addressTypes = addressTypes || ["0"];
    explorers = explorers || []
    assetTypes = assetTypes || [{
      id: 0,
      name: 'Native',
      currencies: [],
      explorers: [],
    }]
    const chain = new ChainModel(
      id,
      name,
      addressTypes,
      network,
      [],
      bip44,
      [],
      staticFee,
    );
    chain.assetTypes = assetTypes.map(x => AssetTypeModel.fromJson(x, chain));
    chain.explorers = explorers.map(x => ExplorerModel.fromJson(x));
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
  ];

  static fromCompressedJson = (data: Array<any>) => {
    const id = data[0];
    const name = data[1];
    const addressTypes = data[2];
    const network = data[3];
    const bip44 = data[4];
    const explorers = data[5].map(x => ExplorerModel.fromCompressedJson(x));
    const staticFee = data[6];
    const chain = new ChainModel(
      id,
      name,
      addressTypes,
      network,
      [],
      bip44,
      explorers,
      staticFee,
    );
    chain.assetTypes = data[7].map(x => AssetTypeModel.fromCompressedJson(x, chain));
    return chain;
  };
}

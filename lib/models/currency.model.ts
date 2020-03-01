import { ChainModel } from './chain.model';
import { AssetTypeModel } from './asset-type.model';

export class CurrencyModel {
  constructor(
    private _chain: ChainModel,
    private _assetType: number,
    public assetId: string,
    public name: string,
    public symbol: string,
    public decimals: number,
    public iconHref: string,
    public isUtxo: boolean,
  ) { }

  static fromJson = (json: any, chain: ChainModel, assetType: AssetTypeModel, assetId: string, iconHref: string) => {
    const {name, symbol, decimals, isUtxo} = json
    return new CurrencyModel(
      chain,
      assetType.id,
      assetId,
      name,
      symbol,
      decimals,
      iconHref,
      isUtxo,
    )

  }

  toCompressedJson = () => [
    this._assetType,
    this.assetId,
    this.name,
    this.symbol,
    this.decimals,
    this.iconHref,
    this.isUtxo,
  ];

  static fromCompressedJson = (data: Array<any>, chain: ChainModel) => {
    const _assetType = data[0];
    const assetId = data[1];
    const name = data[2];
    const symbol = data[3];
    const decimals = data[4];
    const iconHref = data[5];
    const isUtxo = data[6];
    return new CurrencyModel(
      chain,
      _assetType,
      assetId,
      name,
      symbol,
      decimals,
      iconHref,
      isUtxo,
    );
  };

  get id(): string {
    return `${this._chain.id}:${this._assetType}:${this.assetId.toLowerCase()}`;
  }

  get assetType(): AssetTypeModel {
    return this._chain.assetTypes.find(x => x.id === this._assetType);
  }
}

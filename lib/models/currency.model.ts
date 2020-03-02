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
    this.assetId,
    this.name,
    this.symbol,
    this.decimals,
    this.iconHref,
    this.isUtxo,
  ];

  static fromCompressedJson = (data: Array<any>, chain: ChainModel, assetTypeId: number) => {
    const assetId = data[0];
    const name = data[1];
    const symbol = data[2];
    const decimals = data[3];
    const iconHref = data[4];
    const isUtxo = data[5];
    return new CurrencyModel(
      chain,
      assetTypeId,
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

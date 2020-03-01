import { ExplorerModel } from './explorer.model';
import { CurrencyModel } from './currency.model';
import { ChainModel } from './chain.model';

export class AssetTypeModel {
  constructor(
    public chain: ChainModel,
    public id: number, 
    public name: string, 
    public currencies: Array<CurrencyModel>,
    public explorers: Array<ExplorerModel>,
  ) {}

  static fromJson = (json: any, chain: ChainModel) => {
    const {id,name,explorers} = json;
    return new AssetTypeModel(
      chain,
      id,
      name,
      [],
      explorers||[]
    );
  }

  toCompressedJson = () => ([
    this.id, 
    this.name,
    this.currencies.map(x => x.toCompressedJson()),
    this.explorers.map(x => x.toCompressedJson())
  ]);

  static fromCompressedJson = (data: Array<any>, chain:ChainModel) => {
    return new AssetTypeModel(
      chain,
      data[0], 
      data[1],
      data[2].map(x => CurrencyModel.fromCompressedJson(x, chain)),
      data[3].map(x => ExplorerModel.fromCompressedJson(x))
    );
  };
}

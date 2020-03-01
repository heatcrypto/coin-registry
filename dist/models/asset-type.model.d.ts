import { ExplorerModel } from './explorer.model';
import { CurrencyModel } from './currency.model';
import { ChainModel } from './chain.model';
export declare class AssetTypeModel {
    chain: ChainModel;
    id: number;
    name: string;
    currencies: Array<CurrencyModel>;
    explorers: Array<ExplorerModel>;
    constructor(chain: ChainModel, id: number, name: string, currencies: Array<CurrencyModel>, explorers: Array<ExplorerModel>);
    static fromJson: (json: any, chain: ChainModel) => AssetTypeModel;
    toCompressedJson: () => (string | number | (string | number | boolean)[][])[];
    static fromCompressedJson: (data: any[], chain: ChainModel) => AssetTypeModel;
}

import { ChainModel } from './chain.model';
import { AssetTypeModel } from './asset-type.model';
export declare class CurrencyModel {
    private _chain;
    private _assetType;
    assetId: string;
    name: string;
    symbol: string;
    decimals: number;
    iconHref: string;
    isUtxo: boolean;
    constructor(_chain: ChainModel, _assetType: number, assetId: string, name: string, symbol: string, decimals: number, iconHref: string, isUtxo: boolean);
    static fromJson: (json: any, chain: ChainModel, assetType: AssetTypeModel, assetId: string, iconHref: string) => CurrencyModel;
    toCompressedJson: () => (string | number | boolean)[];
    static fromCompressedJson: (data: any[], chain: ChainModel, assetTypeId: number) => CurrencyModel;
    get id(): string;
    get assetType(): AssetTypeModel;
}

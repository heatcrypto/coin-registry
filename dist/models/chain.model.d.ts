import { ExplorerModel } from './explorer.model';
import { AssetTypeModel } from './asset-type.model';
export declare class ChainModel {
    id: number;
    name: string;
    addressTypes: Array<string>;
    network: string;
    assetTypes: Array<AssetTypeModel>;
    bip44: number;
    explorers: Array<ExplorerModel>;
    staticFee: string;
    bip21: string;
    confirmed: number;
    blockTime: number;
    publicKeyType: number;
    constructor(id: number, name: string, addressTypes: Array<string>, network: string, assetTypes: Array<AssetTypeModel>, bip44: number, explorers: Array<ExplorerModel>, staticFee: string, bip21: string, confirmed: number, blockTime: number, publicKeyType: number);
    static fromJson: (json: any, id: number) => ChainModel;
    toCompressedJson: () => (string | number | string[] | (string | number | (string | number | boolean)[][])[][])[];
    static fromCompressedJson: (data: any[]) => ChainModel;
}

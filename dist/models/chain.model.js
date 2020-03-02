"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const explorer_model_1 = require("./explorer.model");
const asset_type_model_1 = require("./asset-type.model");
class ChainModel {
    constructor(id, name, addressTypes, network, assetTypes, bip44, explorers, staticFee) {
        this.id = id;
        this.name = name;
        this.addressTypes = addressTypes;
        this.network = network;
        this.assetTypes = assetTypes;
        this.bip44 = bip44;
        this.explorers = explorers;
        this.staticFee = staticFee;
        this.toCompressedJson = () => [
            this.id,
            this.name,
            this.addressTypes,
            this.network,
            this.bip44,
            this.explorers.map(x => x.toCompressedJson()),
            this.staticFee,
            this.assetTypes.map(x => x.toCompressedJson()),
        ];
    }
}
exports.ChainModel = ChainModel;
ChainModel.fromJson = (json, id) => {
    let { name, addressTypes, bip44, explorers, assetTypes, network, staticFee } = json;
    addressTypes = addressTypes || ["0"];
    explorers = explorers || [];
    assetTypes = assetTypes || [];
    const chain = new ChainModel(id, name, addressTypes, network, [], bip44, [], staticFee);
    chain.assetTypes = assetTypes.map(x => asset_type_model_1.AssetTypeModel.fromJson(x, chain));
    chain.explorers = explorers.map(x => explorer_model_1.ExplorerModel.fromJson(x));
    if (!chain.assetTypes.find(x => x.id === 0)) {
        chain.assetTypes.push(asset_type_model_1.AssetTypeModel.fromJson({
            id: 0,
            name: 'Native',
            currencies: [],
            explorers: [],
        }, chain));
    }
    return chain;
};
ChainModel.fromCompressedJson = (data) => {
    const id = data[0];
    const name = data[1];
    const addressTypes = data[2];
    const network = data[3];
    const bip44 = data[4];
    const explorers = data[5].map(x => explorer_model_1.ExplorerModel.fromCompressedJson(x));
    const staticFee = data[6];
    const chain = new ChainModel(id, name, addressTypes, network, [], bip44, explorers, staticFee);
    chain.assetTypes = data[7].map(x => asset_type_model_1.AssetTypeModel.fromCompressedJson(x, chain));
    return chain;
};
//# sourceMappingURL=chain.model.js.map
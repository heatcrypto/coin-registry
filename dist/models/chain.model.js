"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const explorer_model_1 = require("./explorer.model");
const asset_type_model_1 = require("./asset-type.model");
const util_1 = require("util");
const publicKeyTypes = {
    secp256k1: 0,
    secp256k1Extended: 1,
    nist256p1: 2,
    nist256p1Extended: 3,
    ed25519: 4,
    ed25519Blake2b: 5,
    curve25519: 6,
    ed25519Extended: 7,
};
class ChainModel {
    constructor(id, name, addressTypes, network, assetTypes, bip44, explorers, staticFee, bip21, confirmed, blockTime, publicKeyType) {
        this.id = id;
        this.name = name;
        this.addressTypes = addressTypes;
        this.network = network;
        this.assetTypes = assetTypes;
        this.bip44 = bip44;
        this.explorers = explorers;
        this.staticFee = staticFee;
        this.bip21 = bip21;
        this.confirmed = confirmed;
        this.blockTime = blockTime;
        this.publicKeyType = publicKeyType;
        this.toCompressedJson = () => [
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
    }
}
exports.ChainModel = ChainModel;
ChainModel.fromJson = (json, id) => {
    let { name, addressTypes, bip44, explorers, assetTypes, network, staticFee, bip21, confirmed, blockTime, publicKeyType } = json;
    addressTypes = addressTypes || ["0"];
    explorers = explorers || [];
    assetTypes = assetTypes || [];
    const publicKeyTypeNumeric = publicKeyTypes[publicKeyType];
    if (!util_1.isNumber(publicKeyTypeNumeric))
        throw new Error(`Invalid publicKeyType '${publicKeyType}'`);
    const chain = new ChainModel(id, name, addressTypes, network, [], bip44, [], staticFee, bip21, confirmed, blockTime, publicKeyTypeNumeric);
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
    const bip21 = data[8];
    const confirmed = data[9];
    const blockTime = data[10];
    const publicKeyType = data[11];
    const chain = new ChainModel(id, name, addressTypes, network, [], bip44, explorers, staticFee, bip21, confirmed, blockTime, publicKeyType);
    chain.assetTypes = data[7].map(x => asset_type_model_1.AssetTypeModel.fromCompressedJson(x, chain));
    return chain;
};
//# sourceMappingURL=chain.model.js.map
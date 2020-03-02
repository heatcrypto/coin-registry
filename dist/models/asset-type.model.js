"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const explorer_model_1 = require("./explorer.model");
const currency_model_1 = require("./currency.model");
class AssetTypeModel {
    constructor(chain, id, name, currencies, explorers) {
        this.chain = chain;
        this.id = id;
        this.name = name;
        this.currencies = currencies;
        this.explorers = explorers;
        this.toCompressedJson = () => ([
            this.id,
            this.name,
            this.currencies.map(x => x.toCompressedJson()),
            this.explorers.map(x => x.toCompressedJson())
        ]);
    }
}
exports.AssetTypeModel = AssetTypeModel;
AssetTypeModel.fromJson = (json, chain) => {
    const { id, name, explorers } = json;
    return new AssetTypeModel(chain, id, name, [], explorers || []);
};
AssetTypeModel.fromCompressedJson = (data, chain) => {
    const id = data[0];
    return new AssetTypeModel(chain, id, data[1], data[2].map(x => currency_model_1.CurrencyModel.fromCompressedJson(x, chain, id)), data[3].map(x => explorer_model_1.ExplorerModel.fromCompressedJson(x)));
};
//# sourceMappingURL=asset-type.model.js.map
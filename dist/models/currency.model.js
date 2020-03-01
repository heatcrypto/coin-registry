"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CurrencyModel {
    constructor(_chain, _assetType, assetId, name, symbol, decimals, iconHref, isUtxo) {
        this._chain = _chain;
        this._assetType = _assetType;
        this.assetId = assetId;
        this.name = name;
        this.symbol = symbol;
        this.decimals = decimals;
        this.iconHref = iconHref;
        this.isUtxo = isUtxo;
        this.toCompressedJson = () => [
            this._assetType,
            this.assetId,
            this.name,
            this.symbol,
            this.decimals,
            this.iconHref,
            this.isUtxo,
        ];
    }
    get id() {
        return `${this._chain.id}:${this._assetType}:${this.assetId.toLowerCase()}`;
    }
    get assetType() {
        return this._chain.assetTypes.find(x => x.id === this._assetType);
    }
}
exports.CurrencyModel = CurrencyModel;
CurrencyModel.fromJson = (json, chain, assetType, assetId, iconHref) => {
    const { name, symbol, decimals, isUtxo } = json;
    return new CurrencyModel(chain, assetType.id, assetId, name, symbol, decimals, iconHref, isUtxo);
};
CurrencyModel.fromCompressedJson = (data, chain) => {
    const _assetType = data[0];
    const assetId = data[1];
    const name = data[2];
    const symbol = data[3];
    const decimals = data[4];
    const iconHref = data[5];
    const isUtxo = data[6];
    return new CurrencyModel(chain, _assetType, assetId, name, symbol, decimals, iconHref, isUtxo);
};
//# sourceMappingURL=currency.model.js.map
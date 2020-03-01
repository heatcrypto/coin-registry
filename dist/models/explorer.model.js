"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExplorerModel {
    constructor(transactionUrl, addressUrl) {
        this.transactionUrl = transactionUrl;
        this.addressUrl = addressUrl;
        this.toCompressedJson = () => [this.transactionUrl, this.addressUrl];
    }
}
exports.ExplorerModel = ExplorerModel;
ExplorerModel.fromJson = (json) => {
    const transactionUrl = json['tx'];
    const addressUrl = json['addr'];
    return new ExplorerModel(transactionUrl, addressUrl);
};
ExplorerModel.fromCompressedJson = (data) => {
    const transactionUrl = data[0];
    const addressUrl = data[1];
    return new ExplorerModel(transactionUrl, addressUrl);
};
//# sourceMappingURL=explorer.model.js.map
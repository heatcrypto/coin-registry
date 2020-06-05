"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HeatPoolModel {
    constructor(address, name, subtitle, description, iconHref) {
        this.address = address;
        this.name = name;
        this.subtitle = subtitle;
        this.description = description;
        this.iconHref = iconHref;
        this.toCompressedJson = () => [this.address, this.name, this.subtitle, this.description, this.iconHref];
    }
}
exports.HeatPoolModel = HeatPoolModel;
//# sourceMappingURL=heat-pool.model.js.map
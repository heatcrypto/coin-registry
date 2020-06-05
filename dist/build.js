"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const build_coin_registry_1 = require("./build-coin-registry");
const build_asset_registry_1 = require("./build-asset-registry");
async function build() {
    await build_coin_registry_1.build();
    await build_asset_registry_1.build();
}
build();
//# sourceMappingURL=build.js.map
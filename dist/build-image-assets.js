"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const _fs = __importStar(require("fs"));
const _fsExtra = require('fs-extra');
const chain_model_1 = require("./models/chain.model");
const build_coin_registry_1 = require("./build-coin-registry");
const fs = _fs.promises;
const fsExtra = _fsExtra.promises;
const registryDir = path.join(__dirname, '..', 'coin-registry');
const distDir = path.join(__dirname, '..', 'dist');
const chainsFile = path.join(registryDir, 'chains.json');
async function build() {
    const indexJson = JSON.parse(await fs.readFile(chainsFile, 'utf8'));
    build_coin_registry_1.validateChainsJson(indexJson);
    const chains = [];
    const chainKeys = Object.keys(indexJson);
    console.log(`Processing a total of ${chainKeys.length} chains`);
    for (let i = 0; i < chainKeys.length; i++) {
        const name = chainKeys[i];
        console.log(`[${i + 1} of ${chainKeys.length}] Processing chain "${name}"`);
        const id = indexJson[name];
        const chainDir = path.join(registryDir, name);
        const chainJsonFile = path.join(chainDir, 'chain.json');
        const chainJson = JSON.parse(await fs.readFile(chainJsonFile, 'utf8'));
        const chainModel = chain_model_1.ChainModel.fromJson(chainJson, id);
        build_coin_registry_1.validateChainModel(chainModel, chainDir);
        const sourceImage = path.join(chainDir, '0', '0', 'logo.png');
        const destImage = path.join(distDir, 'assets', 'icons', `${chainModel.id}_logo.png`);
        await fs.mkdir(path.dirname(destImage), { recursive: true });
        await fsExtra.copyFile(sourceImage, destImage);
    }
    console.log(`Done`);
}
exports.build = build;
//# sourceMappingURL=build-image-assets.js.map
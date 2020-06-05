"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const path = __importStar(require("path"));
const _fs = __importStar(require("fs"));
const chain_model_1 = require("./models/chain.model");
const currency_model_1 = require("./models/currency.model");
const get_dirs_1 = require("./utils/get-dirs");
const fs = _fs.promises;
const registryDir = path.join(__dirname, '..', 'coin-registry');
const distDir = path.join(__dirname, '..', 'dist');
const chainsFile = path.join(registryDir, 'chains.json');
async function build() {
    const indexJson = JSON.parse(await fs.readFile(chainsFile, 'utf8'));
    validateChainsJson(indexJson);
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
        validateChainModel(chainModel, chainDir);
        for (let j = 0; j < chainModel.assetTypes.length; j++) {
            const assetTypeModel = chainModel.assetTypes[j];
            const assetTypeDir = path.join(chainDir, `${assetTypeModel.id}`);
            const currencyIds = (await get_dirs_1.getDirs(assetTypeDir)).map(dir => path.basename(dir));
            for (let k = 0; k < currencyIds.length; k++) {
                const currencyId = currencyIds[k];
                const currencyDir = path.join(assetTypeDir, `${currencyId}`);
                const currencyJsonFile = path.join(currencyDir, 'currency.json');
                const currencyJson = JSON.parse(await fs.readFile(currencyJsonFile, 'utf8'));
                const iconPath = path.join(currencyDir, 'logo.png');
                const iconHref = !_fs.existsSync(iconPath) ? null : path.relative(registryDir, iconPath);
                const currencyModel = currency_model_1.CurrencyModel.fromJson(currencyJson, chainModel, assetTypeModel, currencyId, iconHref);
                assetTypeModel.currencies.push(currencyModel);
            }
        }
        chains.push(chainModel);
    }
    const compressedJson = [];
    chains.forEach(chain => {
        compressedJson.push(chain.toCompressedJson());
    });
    console.log(`Done collecting data, writing registry.json`);
    const registryFile = path.join(distDir, 'registry.json');
    await fs.writeFile(registryFile, JSON.stringify(compressedJson), 'utf-8');
    console.log(`Done`);
}
exports.build = build;
function validateChainsJson(chainsJson) {
    let duplicates = new Set();
    let keys = Object.keys(chainsJson);
    for (let i = 0; i < keys.length; i++) {
        let name = keys[i];
        let id = chainsJson[name];
        if (!_.isNumber(id))
            throw new Error(`Invalid value in chains.json for key ${name}`);
        if (duplicates.has(id))
            throw new Error(`Duplicate id ${id} in chains.json for key ${name}`);
        duplicates.add(id);
        let dir = path.join(registryDir, name);
        if (!_fs.existsSync(dir))
            throw new Error(`Missing directory ${dir} for key ${name}`);
    }
}
function validateChainModel(chainModel, chainDir) {
    let duplicates = new Set();
    let assetTypeIds = chainModel.assetTypes.map(x => x.id);
    for (let i = 0; i < assetTypeIds.length; i++) {
        const id = assetTypeIds[i];
        if (duplicates.has(id))
            throw new Error(`Duplicate asset type id ${id} in ${chainDir}`);
        duplicates.add(id);
        let dir = path.join(chainDir, `${id}`);
        if (!_fs.existsSync(dir))
            throw new Error(`Missing directory for asset type at ${dir}`);
    }
}
//# sourceMappingURL=build-coin-registry.js.map
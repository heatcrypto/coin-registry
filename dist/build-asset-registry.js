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
const get_dirs_1 = require("./utils/get-dirs");
const heat_pool_model_1 = require("./models/heat-pool.model");
const util_1 = require("util");
const fs = _fs.promises;
const distDir = path.join(__dirname, '..', 'dist');
const heatPoolDir = path.join(__dirname, '..', 'asset-registry', 'heat-pool');
async function build() {
    await buildHeatPool();
}
exports.build = build;
async function buildHeatPool() {
    const poolAddresses = (await get_dirs_1.getDirs(heatPoolDir)).map(dir => path.basename(dir));
    const pools = [];
    console.log(`Processing a total of ${poolAddresses.length} pool`);
    for (let i = 0; i < poolAddresses.length; i++) {
        const poolAddress = poolAddresses[i];
        console.log(`[${i + 1} of ${poolAddresses.length}] Processing pool "${poolAddress}"`);
        const poolDir = path.join(heatPoolDir, poolAddress);
        const poolJson = JSON.parse(await fs.readFile(path.join(poolDir, 'pool.json'), 'utf8'));
        if (!util_1.isString(poolJson.name))
            throw new Error(`Invalid heat-pool name for ${poolDir}`);
        if (!util_1.isString(poolJson.subtitle))
            throw new Error(`Invalid heat-pool subtitle for ${poolDir}`);
        const iconPath = path.join(poolDir, 'logo.png');
        const iconHref = !_fs.existsSync(iconPath) ? null : path.relative(heatPoolDir, iconPath);
        const textFile = path.join(poolDir, 'text.md');
        const textContent = !_fs.existsSync(textFile) ? null : await fs.readFile(textFile, 'utf8');
        pools.push(new heat_pool_model_1.HeatPoolModel(poolAddress, poolJson.name, poolJson.subtitle, textContent, iconHref));
    }
    const compressedJson = [];
    pools.forEach(pool => {
        compressedJson.push(pool.toCompressedJson());
    });
    console.log(`Done collecting data, writing heat-pool-registry.json`);
    const registryFile = path.join(distDir, 'heat-pool-registry.json');
    await fs.writeFile(registryFile, JSON.stringify(compressedJson), 'utf-8');
    console.log(`Done`);
}
//# sourceMappingURL=build-asset-registry.js.map
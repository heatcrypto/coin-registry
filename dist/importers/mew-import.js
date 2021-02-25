"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _fs = __importStar(require("fs"));
const fs = _fs.promises;
const path = __importStar(require("path"));
const download_1 = require("../utils/download");
const get_dirs_1 = require("../utils/get-dirs");
const tokenListUrl = 'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/dist/tokens/eth/tokens-eth.json';
const registryDir = path.join(__dirname, '..', '..', 'coin-registry');
const ethereumTokenDir = path.join(registryDir, 'ethereum', '1');
async function run() {
    console.log(`Downloading MEW token list`);
    const mewJson = await download_1.downloadJson(tokenListUrl);
    console.log(`Download complete, found ${mewJson.length} tokens`);
    const tokenDirSet = await createTokenDirSet();
    for (let i = 0; i < mewJson.length; i++) {
        const { symbol, name, address, decimals } = mewJson[i];
        if (tokenDirSet.has(address))
            continue;
        console.log(`Found new token ${address} - ${name}`);
        const tokenDir = path.join(ethereumTokenDir, address);
        _fs.mkdirSync(tokenDir);
        const currencyJsonFile = path.join(tokenDir, 'currency.json');
        await fs.writeFile(currencyJsonFile, JSON.stringify({
            name,
            symbol,
            decimals,
        }, null, 2), 'utf-8');
        const logoPngFile = path.join(tokenDir, 'logo.png');
        const success = await downloadLogoFromTrustAssets(address, logoPngFile);
        if (!success)
            console.log(`Could not download logo for ${address}`);
    }
}
async function createTokenDirSet() {
    const tokenDirs = await get_dirs_1.getDirs(ethereumTokenDir);
    const tokenDirSet = new Set();
    tokenDirs.forEach(dirPath => {
        const address = path.basename(dirPath);
        tokenDirSet.add(address);
    });
    return tokenDirSet;
}
async function downloadLogoFromTrustAssets(address, logoPngFile) {
    const logoUrl = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
    await download_1.downloadFile(logoUrl, logoPngFile);
    return _fs.existsSync(logoPngFile);
}
run();
//# sourceMappingURL=mew-import.js.map
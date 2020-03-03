"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const rp = __importStar(require("request-promise"));
async function downloadJson(sourceUrl) {
    const sourceData = await rp.get(sourceUrl);
    return JSON.parse(sourceData);
}
exports.downloadJson = downloadJson;
async function downloadFile(sourceUrl, destination) {
    try {
        const options = {
            encoding: null,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
                'Cache-Control': 'max-age=0',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
            },
            gzip: true,
        };
        const res = await rp.get(sourceUrl, options);
        const buffer = Buffer.from(res, 'utf8');
        fs.writeFileSync(destination, buffer);
        return true;
    }
    catch (e) {
        console.log(`Download failed. ${e}`);
        return false;
    }
}
exports.downloadFile = downloadFile;
//# sourceMappingURL=download.js.map
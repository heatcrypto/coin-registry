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
async function getDirs(rootDir) {
    const files = await fs.readdir(rootDir);
    const dirs = [];
    for (var index = 0; index < files.length; ++index) {
        const file = files[index];
        if (file[0] !== '.') {
            const filePath = rootDir + '/' + file;
            const stat = await fs.stat(filePath);
            if (stat.isDirectory()) {
                dirs.push(file);
            }
        }
    }
    return dirs;
}
exports.getDirs = getDirs;
//# sourceMappingURL=get-dirs.js.map
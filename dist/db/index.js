"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSeenValueForUrl = exports.urlHasSeen = exports.getSeenValuesForUrl = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const readFile = (0, util_1.promisify)(fs_1.default.readFile);
const writeFile = (0, util_1.promisify)(fs_1.default.writeFile);
const dbPath = path_1.default.join(__dirname, 'db.json');
async function getSeenValuesForUrl(url) {
    try {
        const data = await readFile(dbPath, 'utf8');
        const seenValues = JSON.parse(data);
        return seenValues[url] || [];
    }
    catch (e) {
        writeFile(dbPath, '{}');
        return [];
    }
}
exports.getSeenValuesForUrl = getSeenValuesForUrl;
async function urlHasSeen(url, value) {
    const seenValues = await getSeenValuesForUrl(url);
    return seenValues.includes(value);
}
exports.urlHasSeen = urlHasSeen;
async function addSeenValueForUrl(url, seenValue) {
    let allData;
    try {
        const data = await readFile(dbPath, 'utf8');
        allData = JSON.parse(data);
    }
    catch (e) {
        allData = {};
    }
    if (!allData[url])
        allData[url] = [];
    allData[url].push(seenValue);
    await writeFile(dbPath, JSON.stringify(allData));
}
exports.addSeenValueForUrl = addSeenValueForUrl;
//# sourceMappingURL=index.js.map
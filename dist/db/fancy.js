"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeChecker = exports.addOrUpdateChecker = exports.getChecker = exports.getAllCheckers = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const readFile = (0, util_1.promisify)(fs_1.default.readFile);
const writeFile = (0, util_1.promisify)(fs_1.default.writeFile);
const dbPath = path_1.default.join(__dirname, 'db.json');
async function getAllCheckers() {
    try {
        const data = await readFile(dbPath, 'utf8');
        return JSON.parse(data);
    }
    catch (e) {
        console.log(e);
        await writeFile(dbPath, '[]');
        return [];
    }
}
exports.getAllCheckers = getAllCheckers;
async function getChecker(url) {
    const checkers = await getAllCheckers();
    return checkers.find((c) => c.url === url) || null;
}
exports.getChecker = getChecker;
async function addOrUpdateChecker(data) {
    const checkers = await getAllCheckers();
    const index = checkers.findIndex((c) => c.url === data.url);
    if (index === -1)
        checkers.push(data);
    else
        checkers[index] = data;
    await writeFile(dbPath, JSON.stringify(checkers));
}
exports.addOrUpdateChecker = addOrUpdateChecker;
async function removeChecker(url) {
    const checkers = await getAllCheckers();
    const index = checkers.findIndex((c) => c.url === url);
    if (index !== -1)
        checkers.splice(index, 1);
    await writeFile(dbPath, JSON.stringify(checkers));
}
exports.removeChecker = removeChecker;
//# sourceMappingURL=fancy.js.map
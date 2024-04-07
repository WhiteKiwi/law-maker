"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadLawMakers = exports.patchLawMaker = void 0;
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
async function patchLawMaker(id, patch) {
    const lawMakerFilePath = path_1.default.join(__dirname, `../data/21th-law-makers/${id}.json`);
    const lawMaker = await (0, fs_extra_1.readJSON)(lawMakerFilePath);
    (0, fs_extra_1.writeJsonSync)(lawMakerFilePath, patch(lawMaker), { spaces: 2 });
}
exports.patchLawMaker = patchLawMaker;
async function loadLawMakers() {
    const lawMakerDir = path_1.default.join(__dirname, "../data/21th-law-makers");
    const files = await (0, fs_extra_1.readdir)(lawMakerDir);
    const lawMakers = [];
    for (const file of files) {
        const filePath = path_1.default.join(lawMakerDir, file);
        const lawMaker = await (0, fs_extra_1.readJSON)(filePath);
        lawMakers.push(lawMaker);
    }
    return lawMakers;
}
exports.loadLawMakers = loadLawMakers;

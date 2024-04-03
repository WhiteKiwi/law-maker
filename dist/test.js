"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
const law_maker_1 = require("./law-maker");
const law_maker_candidate_1 = require("./law-maker-candidate");
const region_1 = require("./region");
async function main() {
    {
        const candidatesDir = path_1.default.join(__dirname, "../data/candidates");
        const files = await (0, fs_extra_1.readdir)(candidatesDir);
        for (const file of files) {
            const candidates = await (0, fs_extra_1.readJSON)(path_1.default.join(candidatesDir, file));
            for (const candidate of candidates) {
                try {
                    law_maker_candidate_1.LawMakerCadidate.parse(candidate);
                }
                catch (e) {
                    console.log("candidate error!!!!!!", candidate);
                    throw e;
                }
            }
        }
    }
    {
        const lawMakerDir = path_1.default.join(__dirname, "../data/21th-law-makers");
        const files = await (0, fs_extra_1.readdir)(lawMakerDir);
        for (const file of files) {
            const lawMaker = await (0, fs_extra_1.readJSON)(path_1.default.join(lawMakerDir, file));
            try {
                law_maker_1.LawMaker.parse(lawMaker);
            }
            catch (e) {
                console.log("lawmaker error:", file);
                throw e;
            }
        }
    }
    {
        const filePath = path_1.default.join(__dirname, "../data/regions.json");
        const regionsJson = await (0, fs_extra_1.readJSON)(filePath);
        try {
            region_1.RegionsJson.parse(regionsJson);
        }
        catch (e) {
            console.log("regions.json error !!!!!!!!!!!!!!!");
            throw e;
        }
    }
}
main();

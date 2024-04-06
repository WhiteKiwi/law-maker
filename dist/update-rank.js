"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
const __1 = require("./\uB4F1\uC218");
async function main() {
    const candidates = await loadUnitedCandidates();
    const 남자수 = candidates.filter((c) => c.성별 === "남");
    const 군필수 = 남자수.filter((c) => c.군필여부).length;
    console.log("candidates", candidates.length);
    console.log("남자수", 남자수.length);
    console.log("군필수", 군필수);
    const 전과자수 = candidates.filter((c) => c.전과건수 > 0).length;
    console.log("전과자수", 전과자수);
    const filePath = path_1.default.join(__dirname, "../data/regions.json");
    const regionsJson = await (0, fs_extra_1.readJSON)(filePath);
    const regions = regionsJson.flatMap((region) => region.regions);
    function 지역구(regionId) {
        const filtered = regions.filter((region) => region.id.startsWith(regionId));
        if (!filtered.length) {
            throw new Error("region ??");
        }
        return `${filtered[0].시도} ${filtered.map((r) => r.시군구).join("/")}`;
    }
    const lawMakerDir = path_1.default.join(__dirname, "../data/21th-law-makers");
    const files = await (0, fs_extra_1.readdir)(lawMakerDir);
    const lawMakers = [];
    for (const file of files) {
        const lawMaker = await (0, fs_extra_1.readJSON)(path_1.default.join(lawMakerDir, file));
        const candidate = matchCandidate(lawMaker, candidates);
        if (candidate) {
            lawMakers.push({ ...lawMaker, candidate });
        }
    }
    {
        const rankItems = [];
        const 정렬 = candidates.sort((a, b) => b.재산 - a.재산);
        const ranks = (0, __1.등수)(정렬.map((c) => c.재산));
        for (let i = 0; i < 정렬.length; i++) {
            const candidate = 정렬[i];
            rankItems.push({
                id: candidate.id,
                imageUrl: candidate.imageUrl,
                이름: candidate.이름,
                지역구: 지역구(candidate.regionId),
                정당: candidate.정당,
                재산: candidate.재산,
                rank: ranks[i],
                총원: 정렬.length,
            });
        }
        await (0, fs_extra_1.writeJson)(path_1.default.join(__dirname, "../data/ranking/money.json"), rankItems.sort((a, b) => a.rank - b.rank));
    }
    {
        const rankItems = [];
        function 연평균재산증가율(candidate) {
            if (candidate.연도별_재산.length < 2) {
                return null;
            }
            const sorted재산 = candidate.연도별_재산.sort((a, b) => a.연도 - b.연도);
            return (((sorted재산.at(-1).재산 - sorted재산[0].재산) / sorted재산.length) *
                100);
        }
        function 연평균재산증가량(candidate) {
            if (candidate.연도별_재산.length < 2) {
                return null;
            }
            const sorted재산 = candidate.연도별_재산.sort((a, b) => a.연도 - b.연도);
            return (sorted재산.at(-1).재산 - sorted재산[0].재산) / sorted재산.length;
        }
        const 정렬 = candidates
            .filter((c) => 연평균재산증가율(c) !== null)
            .sort((a, b) => 연평균재산증가율(b) - 연평균재산증가율(a));
        const ranks = (0, __1.등수)(정렬.map((c) => 연평균재산증가율(c)));
        for (let i = 0; i < 정렬.length; i++) {
            const candidate = 정렬[i];
            rankItems.push({
                id: candidate.id,
                imageUrl: candidate.imageUrl,
                이름: candidate.이름,
                지역구: 지역구(candidate.regionId),
                정당: candidate.정당,
                재산증가율: 연평균재산증가율(candidate),
                재산증가량: 연평균재산증가량(candidate),
                rank: ranks[i],
                총원: 정렬.length,
            });
        }
        await (0, fs_extra_1.writeJson)(path_1.default.join(__dirname, "../data/ranking/money-increase.json"), rankItems.sort((a, b) => a.rank - b.rank));
    }
    {
        const rankItems = [];
        function 출석률(candidate) {
            const lawMaker = lawMakers.find((lm) => lm.id === candidate.id_21th);
            if (!lawMaker) {
                return null;
            }
            return lawMaker.본회의_출석률;
        }
        const 정렬 = candidates
            .filter((c) => 출석률(c) !== null)
            .sort((a, b) => 출석률(b) - 출석률(a));
        const ranks = (0, __1.등수)(정렬.map((c) => 출석률(c)));
        for (let i = 0; i < 정렬.length; i++) {
            const candidate = 정렬[i];
            rankItems.push({
                id: candidate.id,
                imageUrl: candidate.imageUrl,
                이름: candidate.이름,
                지역구: 지역구(candidate.regionId),
                정당: candidate.정당,
                본회의출석률: 출석률(candidate),
                rank: ranks[i],
                총원: 정렬.length,
            });
        }
        await (0, fs_extra_1.writeJson)(path_1.default.join(__dirname, "../data/ranking/attendance.json"), rankItems.sort((a, b) => a.rank - b.rank));
    }
    {
        const rankItems = [];
        function 대표발의법안(candidate) {
            const lawMaker = lawMakers.find((lm) => lm.id === candidate.id_21th);
            if (!lawMaker?.상임위원회_출석률.length) {
                return null;
            }
            return lawMaker.대표발의법안;
        }
        const 정렬 = candidates
            .filter((c) => 대표발의법안(c) !== null)
            .sort((a, b) => 대표발의법안(b) - 대표발의법안(a));
        const ranks = (0, __1.등수)(정렬.map((c) => 대표발의법안(c)));
        for (let i = 0; i < 정렬.length; i++) {
            const candidate = 정렬[i];
            rankItems.push({
                id: candidate.id,
                imageUrl: candidate.imageUrl,
                이름: candidate.이름,
                지역구: 지역구(candidate.regionId),
                정당: candidate.정당,
                대표발의법안: 대표발의법안(candidate),
                rank: ranks[i],
                총원: 정렬.length,
            });
        }
        await (0, fs_extra_1.writeJson)(path_1.default.join(__dirname, "../data/ranking/initiative.json"), rankItems.sort((a, b) => a.rank - b.rank));
    }
}
main();
function matchCandidate(lawMaker, candidates) {
    return candidates
        .filter((c) => !c.regionId.includes("_"))
        .find((candidate) => candidate.id_21th === lawMaker.id);
}
async function loadUnitedCandidates() {
    const candidates = [];
    const lawMakerDir = path_1.default.join(__dirname, "../data/candidates");
    const files = await (0, fs_extra_1.readdir)(lawMakerDir);
    for (const file of files) {
        if (file.includes("_")) {
            continue;
        }
        const _candidates = await (0, fs_extra_1.readJSON)(path_1.default.join(lawMakerDir, file));
        candidates.push(..._candidates);
    }
    return candidates;
}

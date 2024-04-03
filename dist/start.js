"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
const search_1 = require("./search");
const __1 = require("./\uB4F1\uC218");
async function main() {
    await sortRegions();
    const candidates = await loadCandidates();
    const lawMakers = [];
    const lawMakerDir = path_1.default.join(__dirname, "../data/21th-law-makers");
    const files = await (0, fs_extra_1.readdir)(lawMakerDir);
    for (const file of files) {
        const lawMaker = await (0, fs_extra_1.readJSON)(path_1.default.join(lawMakerDir, file));
        lawMakers.push(lawMaker);
    }
    await 주요법안표결(lawMakers);
    const map = new Map();
    for (const lawMaker of lawMakers) {
        for (const 위원회 of lawMaker.상임위원회_출석률) {
            const arr = map.get(위원회.위원회) || [];
            arr.push(위원회);
            map.set(위원회.위원회, arr);
        }
    }
    for (const [위원회, 출석정보] of map) {
        const sorted = 출석정보.sort((a, b) => b.출석률 - a.출석률);
        const ranks = (0, __1.등수)(sorted.map((info) => info.출석률));
        for (let i = 0; i < ranks.length; i++) {
            sorted[i].등수 = ranks[i];
            sorted[i].총원 = sorted.length;
        }
    }
    const 출석률정렬 = lawMakers.sort((a, b) => b.본회의_출석률 - a.본회의_출석률);
    const 출석Ranks = (0, __1.등수)(출석률정렬.map((maker) => maker.본회의_출석률));
    for (let i = 0; i < 출석Ranks.length; i++) {
        출석률정렬[i].본회의_출석률_등수 = 출석Ranks[i];
    }
    const 법안정렬 = lawMakers.sort((a, b) => b.대표발의법안 - a.대표발의법안);
    const 법안Ranks = (0, __1.등수)(법안정렬.map((maker) => maker.대표발의법안));
    for (let i = 0; i < 법안Ranks.length; i++) {
        법안정렬[i].대표발의법안_등수 = 법안Ranks[i];
    }
    const 재산정렬 = lawMakers.sort((a, b) => 연평균재산증가(b, candidates) - 연평균재산증가(a, candidates));
    const 재산Ranks = (0, __1.등수)(재산정렬.map((maker) => 연평균재산증가(maker, candidates)));
    for (let i = 0; i < 재산Ranks.length; i++) {
        재산정렬[i].재산등수 = 재산Ranks[i];
        재산정렬[i].연도별_재산 = 재산정렬[i].연도별_재산.sort((a, b) => a.연도 - b.연도);
    }
    for (const lawMaker of lawMakers) {
        await (0, fs_extra_1.writeJSON)(path_1.default.join(lawMakerDir, `${lawMaker.id}.json`), lawMaker, {
            spaces: 2,
        });
    }
    await print동명이인(lawMakers);
    await createRanking(lawMakers);
    await set연도별재산(lawMakers);
    await sortCandidates();
    await createSearchItems();
}
async function createRanking(lawMakers) {
    const rankingFilePath = path_1.default.join(__dirname, "../data/ranking.json");
    const ranking = {
        출석률: lawMakers
            .sort((a, b) => a.본회의_출석률_등수 - b.본회의_출석률_등수)
            .map((maker) => maker.id),
        대표발의법안: lawMakers
            .sort((a, b) => a.대표발의법안_등수 - b.대표발의법안_등수)
            .map((maker) => maker.id),
        연평균_재산_증가량: lawMakers
            .sort((a, b) => a.재산등수 - b.재산등수)
            .map((maker) => maker.id),
    };
    await (0, fs_extra_1.writeJSON)(rankingFilePath, ranking, { spaces: 2 });
}
function 연평균재산증가(maker, candidates) {
    const year23 = candidates.find((candidate) => candidate.id_21th === maker.id);
    const 내림차순_연도별_재산 = maker.연도별_재산.sort((a, b) => b.연도 - a.연도);
    const 최근 = year23
        ? { 연도: 2023, 재산: year23.재산 }
        : 내림차순_연도별_재산[0];
    const 제일오래전 = 내림차순_연도별_재산.at(-1);
    if (!제일오래전 || 제일오래전.연도 === 최근.연도) {
        return 0;
    }
    return (최근.재산 - 제일오래전.재산) / (최근.연도 - 제일오래전.연도);
}
async function loadCandidates() {
    const candidates = [];
    const lawMakerDir = path_1.default.join(__dirname, "../data/candidates");
    const files = await (0, fs_extra_1.readdir)(lawMakerDir);
    for (const file of files) {
        const _candidates = await (0, fs_extra_1.readJSON)(path_1.default.join(lawMakerDir, file));
        candidates.push(..._candidates);
    }
    return candidates;
}
async function set연도별재산(lawMakers) {
    const candidatesDir = path_1.default.join(__dirname, "../data/candidates");
    const files = await (0, fs_extra_1.readdir)(candidatesDir);
    for (const file of files) {
        const candidates = await (0, fs_extra_1.readJSON)(path_1.default.join(candidatesDir, file));
        for (const candidate of candidates) {
            const lawMaker = lawMakers.find((maker) => maker.id === candidate.id_21th);
            candidate.연도별_재산 = [
                ...(lawMaker?.연도별_재산 || []),
                { 연도: 2023, 재산: candidate.재산 },
            ].sort((a, b) => a.연도 - b.연도);
        }
        await (0, fs_extra_1.writeJSON)(path_1.default.join(candidatesDir, file), candidates, { spaces: 2 });
    }
}
async function sortCandidates() {
    const candidatesDir = path_1.default.join(__dirname, "../data/candidates");
    const files = await (0, fs_extra_1.readdir)(candidatesDir);
    for (const file of files) {
        const candidates = await (0, fs_extra_1.readJSON)(path_1.default.join(candidatesDir, file));
        await (0, fs_extra_1.writeJSON)(path_1.default.join(candidatesDir, file), candidates.sort((a, b) => a.기호 - b.기호), { spaces: 2 });
    }
}
async function sortRegions() {
    const filePath = path_1.default.join(__dirname, "../data/regions.json");
    const regionsJson = await (0, fs_extra_1.readJSON)(filePath);
    for (const region of regionsJson) {
        region.regions = region.regions.sort((a, b) => a.시군구.localeCompare(b.시군구));
    }
    await (0, fs_extra_1.writeJSON)(filePath, regionsJson, { spaces: 2 });
}
async function createSearchItems() {
    const searchItems = [];
    const candidatesDir = path_1.default.join(__dirname, "../data/candidates");
    const files = await (0, fs_extra_1.readdir)(candidatesDir);
    for (const file of files) {
        if (file.includes("_")) {
            continue;
        }
        const candidates = await (0, fs_extra_1.readJSON)(path_1.default.join(candidatesDir, file));
        for (const candidate of candidates) {
            const region = await getRegion(candidate.regionId);
            searchItems.push({
                id: candidate.id,
                imageUrl: candidate.imageUrl,
                이름: candidate.이름,
                splitted이름: (0, search_1.splitHangul)(candidate.이름),
                지역구: `${region.시도} ${region.시군구}`,
                정당: candidate.정당,
            });
        }
    }
    await (0, fs_extra_1.writeJSON)(path_1.default.join(__dirname, "../data/search.json"), searchItems, {});
}
async function getRegion(id) {
    const filePath = path_1.default.join(__dirname, "../data/regions.json");
    const regionsJson = await (0, fs_extra_1.readJSON)(filePath);
    for (const parent of regionsJson) {
        for (const region of parent.regions) {
            if (region.id === id) {
                return region;
            }
        }
    }
    const regions = regionsJson
        .map((r) => r.regions)
        .flat()
        .filter((region) => region.id.startsWith(id));
    if (regions.length) {
        return {
            ...regions[0],
            시군구: regions.map((r) => r.시군구).join("/"),
        };
    }
    throw new Error(`Region not found: ${id}`);
}
async function 주요법안표결(lawMakers) {
    const 주요법안 = await (0, fs_extra_1.readJSON)(path_1.default.join(__dirname, "../data/주요법안.json"));
    const 주요법안표결 = await (0, fs_extra_1.readJSON)(path_1.default.join(__dirname, "../data/주요법안표결.json"));
    for (const lawMaker of lawMakers) {
        lawMaker.주요법안표결 = 주요법안.map((법안) => {
            const 법안표결 = 주요법안표결.find((법안) => 법안.의안번호 === 법안.의안번호);
            return {
                별칭: 법안.별칭,
                의안명: 법안.의안명,
                의안번호: 법안.의안번호,
                찬반여부: 찬반여부(lawMaker, 법안표결),
            };
        });
        lawMaker.주요법안표결 = lawMaker.주요법안표결.sort((a, b) => a.의안번호 - b.의안번호);
    }
    function 찬반여부(lawMaker, 법안표결) {
        if (법안표결.찬성.includes(lawMaker.이름)) {
            return "찬성";
        }
        if (법안표결.반대.includes(lawMaker.이름)) {
            return "반대";
        }
        if (법안표결.기권.includes(lawMaker.이름)) {
            return "기권";
        }
        return "불참";
    }
}
function print동명이인(lawMakers) {
    const map = new Map();
    for (const lawMaker of lawMakers) {
        const count = map.get(lawMaker.이름) || 0;
        map.set(lawMaker.이름, count + 1);
    }
    for (const [name, count] of map) {
        if (count > 1) {
            console.log(name, count);
        }
    }
}
main();

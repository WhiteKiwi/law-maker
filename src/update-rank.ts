import { readJSON, readdir, writeJson } from "fs-extra";
import path from "path";
import { LawMaker } from "./law-maker";
import { LawMakerCadidate } from "./law-maker-candidate";
import { 재산RankItem } from "./ranking";
import { RegionsJson } from "./region";
import { 등수 } from "./등수";

async function main() {
  const candidates = await loadUnitedCandidates();

  const filePath = path.join(__dirname, "../data/regions.json");
  const regionsJson: RegionsJson = await readJSON(filePath);
  const regions = regionsJson.flatMap((region) => region.regions);
  function 지역구(regionId: string) {
    const filtered = regions.filter((region) => region.id.startsWith(regionId));
    if (!filtered.length) {
      throw new Error("region ??");
    }
    return `${filtered[0].시도} ${filtered.map((r) => r.시군구).join("/")}`;
  }

  const lawMakerDir = path.join(__dirname, "../data/21th-law-makers");
  const files = await readdir(lawMakerDir);
  const lawMakers = [];
  for (const file of files) {
    const lawMaker: LawMaker = await readJSON(path.join(lawMakerDir, file));
    lawMakers.push(lawMaker);
  }
  {
    const rankItems: 재산RankItem[] = [];
    const 정렬 = lawMakers.sort(
      (a, b) =>
        b.연도별_재산.sort((a, b) => b.재산 - a.재산)[0].재산! -
        a.연도별_재산.sort((a, b) => b.재산 - a.재산)[0].재산!
    );
    const ranks = 등수(정렬.map((maker) => maker.본회의_출석률));
    for (let i = 0; i < 정렬.length; i++) {
      const lawMaker = 정렬[i];
      const candidate = matchCandidate(lawMaker, candidates);
      rankItems.push({
        id: lawMaker.id,
        imageUrl: candidate?.imageUrl,
        이름: lawMaker.이름,
        지역구: candidate ? 지역구(candidate.regionId) : undefined,
        정당: lawMaker.정당,
        재산: lawMaker.연도별_재산.sort((a, b) => b.재산 - a.재산)[0].재산!,
        rank: ranks[i],
      });
    }

    await writeJson(
      path.join(__dirname, "../data/ranking/money.json"),
      rankItems
    );
  }
}
main();

function matchCandidate(
  lawMaker: LawMaker,
  candidates: LawMakerCadidate[]
): LawMakerCadidate | undefined {
  return candidates.find((candidate) => candidate.id_21th === lawMaker.id);
}

async function loadUnitedCandidates(): Promise<LawMakerCadidate[]> {
  const candidates: LawMakerCadidate[] = [];
  const lawMakerDir = path.join(__dirname, "../data/candidates");
  const files = await readdir(lawMakerDir);
  for (const file of files) {
    if (file.includes("_")) {
      continue;
    }
    const _candidates = await readJSON(path.join(lawMakerDir, file));
    candidates.push(..._candidates);
  }
  return candidates;
}

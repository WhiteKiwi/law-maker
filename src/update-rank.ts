import { readJSON, readdir, writeJson } from "fs-extra";
import path from "path";
import { LawMaker } from "./law-maker";
import { LawMakerCadidate } from "./law-maker-candidate";
import {
  공약이행률RankItem,
  공약이행수RankItem,
  대표발의법안RankItem,
  본회의출석률RankItem,
  재산RankItem,
  재산증가율RankItem,
} from "./ranking";
import { RegionsJson } from "./region";
import { 등수 } from "./등수";

async function main() {
  const candidates = await loadUnitedCandidates();
  const 남자수 = candidates.filter((c) => c.성별 === "남");
  const 군필수 = 남자수.filter((c) => c.군필여부).length;
  console.log("candidates", candidates.length);
  console.log("남자수", 남자수.length);
  console.log("군필수", 군필수);
  const 전과자수 = candidates.filter((c) => c.전과건수 > 0).length;
  console.log("전과자수", 전과자수);

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
  const lawMakers: (LawMaker & { candidate: LawMakerCadidate })[] = [];
  for (const file of files) {
    const lawMaker: LawMaker = await readJSON(path.join(lawMakerDir, file));
    const candidate = matchCandidate(lawMaker, candidates);
    if (candidate) {
      lawMakers.push({ ...lawMaker, candidate });
    }
  }
  // money.json
  {
    const rankItems: 재산RankItem[] = [];

    const 정렬 = candidates.sort((a, b) => b.재산 - a.재산);
    const ranks = 등수(정렬.map((c) => c.재산));
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

    await writeJson(
      path.join(__dirname, "../data/ranking/money.json"),
      rankItems.sort((a, b) => a.rank - b.rank)
    );
  }
  // money-increase.json
  {
    const rankItems: 재산증가율RankItem[] = [];
    function 연평균재산증가율(candidate: LawMakerCadidate): number | null {
      if (candidate.연도별_재산.length < 2) {
        return null;
      }
      const sorted재산 = candidate.연도별_재산.sort((a, b) => a.연도 - b.연도);
      // 최근꺼 - 옛날거
      return (
        ((sorted재산.at(-1)!.재산 - sorted재산[0].재산) / sorted재산.length) *
        100
      );
    }
    function 연평균재산증가량(candidate: LawMakerCadidate): number | null {
      if (candidate.연도별_재산.length < 2) {
        return null;
      }
      const sorted재산 = candidate.연도별_재산.sort((a, b) => a.연도 - b.연도);
      // 최근꺼 - 옛날거
      return (sorted재산.at(-1)!.재산 - sorted재산[0].재산) / sorted재산.length;
    }

    const 정렬 = candidates
      .filter((c) => 연평균재산증가율(c) !== null)
      .sort((a, b) => 연평균재산증가율(b)! - 연평균재산증가율(a)!);
    const ranks = 등수(정렬.map((c) => 연평균재산증가율(c)!));
    for (let i = 0; i < 정렬.length; i++) {
      const candidate = 정렬[i];
      rankItems.push({
        id: candidate.id,
        imageUrl: candidate.imageUrl,
        이름: candidate.이름,
        지역구: 지역구(candidate.regionId),
        정당: candidate.정당,
        재산증가율: 연평균재산증가율(candidate)!,
        재산증가량: 연평균재산증가량(candidate)!,
        rank: ranks[i],
        총원: 정렬.length,
      });
    }

    await writeJson(
      path.join(__dirname, "../data/ranking/money-increase.json"),
      rankItems.sort((a, b) => a.rank - b.rank)
    );
  }

  // attendance.json
  {
    const rankItems: 본회의출석률RankItem[] = [];
    function 출석률(candidate: LawMakerCadidate): number | null {
      const lawMaker = lawMakers.find((lm) => lm.id === candidate.id_21th);
      if (!lawMaker) {
        return null;
      }
      return lawMaker.본회의_출석률;
    }

    const 정렬 = candidates
      .filter((c) => 출석률(c) !== null)
      .sort((a, b) => 출석률(b)! - 출석률(a)!);
    const ranks = 등수(정렬.map((c) => 출석률(c)!));
    for (let i = 0; i < 정렬.length; i++) {
      const candidate = 정렬[i];
      rankItems.push({
        id: candidate.id,
        imageUrl: candidate.imageUrl,
        이름: candidate.이름,
        지역구: 지역구(candidate.regionId),
        정당: candidate.정당,
        본회의출석률: 출석률(candidate)!,
        rank: ranks[i],
        총원: 정렬.length,
      });
    }

    await writeJson(
      path.join(__dirname, "../data/ranking/attendance.json"),
      rankItems.sort((a, b) => a.rank - b.rank)
    );
  }

  // initiative.json
  {
    const rankItems: 대표발의법안RankItem[] = [];
    function 대표발의법안(candidate: LawMakerCadidate): number | null {
      const lawMaker = lawMakers.find((lm) => lm.id === candidate.id_21th);
      if (!lawMaker?.상임위원회_출석률.length) {
        return null;
      }
      return lawMaker.대표발의법안;
    }

    const 정렬 = candidates
      .filter((c) => 대표발의법안(c) !== null)
      .sort((a, b) => 대표발의법안(b)! - 대표발의법안(a)!);
    const ranks = 등수(정렬.map((c) => 대표발의법안(c)!));
    for (let i = 0; i < 정렬.length; i++) {
      const candidate = 정렬[i];
      rankItems.push({
        id: candidate.id,
        imageUrl: candidate.imageUrl,
        이름: candidate.이름,
        지역구: 지역구(candidate.regionId),
        정당: candidate.정당,
        대표발의법안: 대표발의법안(candidate)!,
        rank: ranks[i],
        총원: 정렬.length,
      });
    }

    await writeJson(
      path.join(__dirname, "../data/ranking/initiative.json"),
      rankItems.sort((a, b) => a.rank - b.rank)
    );
  }

  // promise-count.json
  {
    const rankItems: 공약이행수RankItem[] = [];
    function 공약이행수(candidate: LawMakerCadidate): number {
      return candidate["21th"]!.공약이행률?.공약이행수 || -1;
    }

    const 정렬 = candidates
      .filter((c) => c["21th"])
      .sort((a, b) => 공약이행수(b)! - 공약이행수(a)!);
    const ranks = 등수(정렬.map((c) => 공약이행수(c)!));
    for (let i = 0; i < 정렬.length; i++) {
      const candidate = 정렬[i];
      rankItems.push({
        id: candidate.id,
        imageUrl: candidate.imageUrl,
        이름: candidate.이름,
        지역구: 지역구(candidate.regionId),
        정당: candidate.정당,
        공약이행수: candidate["21th"]!.공약이행수등수 || null,
        rank: ranks[i],
        총원: 정렬.length,
      });
    }

    await writeJson(
      path.join(__dirname, "../data/ranking/promise-count.json"),
      rankItems.sort((a, b) => a.rank - b.rank)
    );
  }

  // promise-rate.json
  {
    const rankItems: 공약이행률RankItem[] = [];
    function 공약이행률(candidate: LawMakerCadidate): number {
      if (!candidate["21th"]!.공약이행률) {
        return -1;
      }
      return (
        candidate["21th"]!.공약이행률.공약이행수 /
        candidate["21th"]!.공약이행률.총공약수
      );
    }

    const 정렬 = candidates
      .filter((c) => c["21th"])
      .sort((a, b) => 공약이행률(b)! - 공약이행률(a)!);
    const ranks = 등수(정렬.map((c) => 공약이행률(c)!));
    for (let i = 0; i < 정렬.length; i++) {
      const candidate = 정렬[i];
      rankItems.push({
        id: candidate.id,
        imageUrl: candidate.imageUrl,
        이름: candidate.이름,
        지역구: 지역구(candidate.regionId),
        정당: candidate.정당,
        공약이행률: candidate["21th"]!.공약이행률등수 || null,
        rank: ranks[i],
        총원: 정렬.length,
      });
    }

    await writeJson(
      path.join(__dirname, "../data/ranking/promise-rate.json"),
      rankItems.sort((a, b) => a.rank - b.rank)
    );
  }
}
main();

function matchCandidate(
  lawMaker: LawMaker,
  candidates: LawMakerCadidate[]
): LawMakerCadidate | undefined {
  return candidates
    .filter((c) => !c.regionId.includes("_"))
    .find((candidate) => candidate.id_21th === lawMaker.id);
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

import { readJSON, readdir, writeJSON } from "fs-extra";
import path from "path";
import { LawMaker } from "./law-maker";
import { LawMakerCadidate } from "./law-maker-candidate";
import { 등수 } from "./등수";

async function main() {
  const candidates = await loadCandidates();
  const lawMakers: LawMaker[] = [];
  const lawMakerDir = path.join(__dirname, "../data/21th-law-makers");
  const files = await readdir(lawMakerDir);
  for (const file of files) {
    const lawMaker = await readJSON(path.join(lawMakerDir, file));
    lawMakers.push(lawMaker);
  }

  const map = new Map<
    string,
    {
      위원회: string;
      출석률: number;
      등수: number;
      총원: number;
    }[]
  >();
  for (const lawMaker of lawMakers) {
    for (const 위원회 of lawMaker.상임위원회_출석률) {
      const arr = map.get(위원회.위원회) || [];
      arr.push(위원회);
      map.set(위원회.위원회, arr);
    }
  }

  for (const [위원회, 출석정보] of map) {
    const sorted = 출석정보.sort((a, b) => b.출석률 - a.출석률);
    const ranks = 등수(sorted.map((info) => info.출석률));
    for (let i = 0; i < ranks.length; i++) {
      sorted[i].등수 = ranks[i];
      sorted[i].총원 = sorted.length;
    }
  }

  const 출석률정렬 = lawMakers.sort(
    (a, b) => b.본회의_출석률 - a.본회의_출석률
  );
  const 출석Ranks = 등수(출석률정렬.map((maker) => maker.본회의_출석률));
  for (let i = 0; i < 출석Ranks.length; i++) {
    출석률정렬[i].본회의_출석률_등수 = 출석Ranks[i];
  }

  const 법안정렬 = lawMakers.sort((a, b) => b.대표발의법안 - a.대표발의법안);
  const 법안Ranks = 등수(법안정렬.map((maker) => maker.대표발의법안));
  for (let i = 0; i < 법안Ranks.length; i++) {
    법안정렬[i].대표발의법안_등수 = 법안Ranks[i];
  }

  const 재산정렬 = lawMakers.sort(
    (a, b) => 연평균재산증가(b, candidates) - 연평균재산증가(a, candidates)
  );
  const 재산Ranks = 등수(
    재산정렬.map((maker) => 연평균재산증가(maker, candidates))
  );
  for (let i = 0; i < 재산Ranks.length; i++) {
    재산정렬[i].재산등수 = 재산Ranks[i];
    재산정렬[i].연도별_재산 = 재산정렬[i].연도별_재산.sort(
      (a, b) => a.연도 - b.연도
    );
  }

  for (const lawMaker of lawMakers) {
    await writeJSON(path.join(lawMakerDir, `${lawMaker.id}.json`), lawMaker, {
      spaces: 2,
    });
  }

  await createRanking(lawMakers);
}

async function createRanking(lawMakers: LawMaker[]) {
  const rankingFilePath = path.join(__dirname, "../data/ranking.json");
  const ranking: {
    출석률: string[];
    대표발의법안: string[];
    연평균_재산_증가량: string[];
  } = {
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
  await writeJSON(rankingFilePath, ranking, { spaces: 2 });
}

function 연평균재산증가(
  maker: LawMaker,
  candidates: LawMakerCadidate[]
): number {
  const year24 = candidates.find((candidate) => candidate.id_21th === maker.id);
  const 내림차순_연도별_재산 = maker.연도별_재산.sort(
    (a, b) => b.연도 - a.연도
  );

  const 최근 = year24
    ? { 연도: 2024, 재산: year24.재산 }
    : 내림차순_연도별_재산[0];
  const 제일오래전 = 내림차순_연도별_재산.at(-1);
  if (!제일오래전 || 제일오래전.연도 === 최근.연도) {
    return 0;
  }

  return (최근.재산 - 제일오래전.재산) / (최근.연도 - 제일오래전.연도);
}

async function loadCandidates(): Promise<LawMakerCadidate[]> {
  const candidates: LawMakerCadidate[] = [];
  const lawMakerDir = path.join(__dirname, "../data/candidates");
  const files = await readdir(lawMakerDir);
  for (const file of files) {
    const _candidates = await readJSON(path.join(lawMakerDir, file));
    candidates.push(..._candidates);
  }
  return candidates;
}

main();

import { readJSON, readdir, writeJSON } from "fs-extra";
import path from "path";
import { LawMaker } from "./law-maker";
import { LawMakerCadidate } from "./law-maker-candidate";
import { Region, RegionsJson } from "./region";
import { SearchItem, splitHangul } from "./search";
import { 등수 } from "./등수";

async function main() {
  await sortRegions();
  const candidates = await loadCandidates();
  const lawMakers: LawMaker[] = [];
  const lawMakerDir = path.join(__dirname, "../data/21th-law-makers");
  const files = await readdir(lawMakerDir);
  for (const file of files) {
    const lawMaker = await readJSON(path.join(lawMakerDir, file));
    lawMakers.push(lawMaker);
  }
  await 주요법안표결(lawMakers);

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

  await print동명이인(lawMakers);
  await createRanking(lawMakers);
  await set연도별재산(lawMakers);
  await sortCandidates();
  await createSearchItems();
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
  const year23 = candidates.find((candidate) => candidate.id_21th === maker.id);
  const 내림차순_연도별_재산 = maker.연도별_재산.sort(
    (a, b) => b.연도 - a.연도
  );

  const 최근 = year23
    ? { 연도: 2023, 재산: year23.재산 }
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

async function set연도별재산(lawMakers: LawMaker[]): Promise<void> {
  const candidatesDir = path.join(__dirname, "../data/candidates");
  const files = await readdir(candidatesDir);
  for (const file of files) {
    const candidates: LawMakerCadidate[] = await readJSON(
      path.join(candidatesDir, file)
    );

    for (const candidate of candidates) {
      const lawMaker = lawMakers.find(
        (maker) => maker.id === candidate.id_21th
      );
      candidate.연도별_재산 = [
        ...(lawMaker?.연도별_재산 || []),
        { 연도: 2023, 재산: candidate.재산 },
      ].sort((a, b) => a.연도 - b.연도);
    }
    await writeJSON(path.join(candidatesDir, file), candidates, { spaces: 2 });
  }
}

async function sortCandidates() {
  const candidatesDir = path.join(__dirname, "../data/candidates");
  const files = await readdir(candidatesDir);
  for (const file of files) {
    const candidates: LawMakerCadidate[] = await readJSON(
      path.join(candidatesDir, file)
    );
    await writeJSON(
      path.join(candidatesDir, file),
      candidates.sort((a, b) => a.기호 - b.기호),
      { spaces: 2 }
    );
  }
}

async function sortRegions() {
  const filePath = path.join(__dirname, "../data/regions.json");
  const regionsJson: RegionsJson = await readJSON(filePath);
  for (const region of regionsJson) {
    region.regions = region.regions.sort((a, b) =>
      a.시군구.localeCompare(b.시군구)
    );
    // region.regions.forEach((region) => {
    //   region.시군구 = region.시군구.split("시").join("시/").replace(/\/$/, "");
    //   region.시군구 = region.시군구.split("군").join("군/").replace(/\/$/, "");
    //   region.시군구 = region.시군구.split("구").join("구/").replace(/\/$/, "");
    // });
  }
  await writeJSON(filePath, regionsJson, { spaces: 2 });
}
async function createSearchItems() {
  const searchItems: SearchItem[] = [];
  const candidatesDir = path.join(__dirname, "../data/candidates");
  const files = await readdir(candidatesDir);
  for (const file of files) {
    const candidates: LawMakerCadidate[] = await readJSON(
      path.join(candidatesDir, file)
    );
    try {
      for (const candidate of candidates) {
        const region = await getRegion(candidate.regionId);
        searchItems.push({
          id: candidate.id,
          imageUrl: candidate.imageUrl,
          이름: candidate.이름,
          splitted이름: splitHangul(candidate.이름),
          지역구: `${region.시도} ${region.시군구}`,
          정당: candidate.정당,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }
  await writeJSON(path.join(__dirname, "../data/search.json"), searchItems, {});
}

async function getRegion(id: string): Promise<Region> {
  const filePath = path.join(__dirname, "../data/regions.json");
  const regionsJson: RegionsJson = await readJSON(filePath);
  for (const parent of regionsJson) {
    for (const region of parent.regions) {
      if (region.id === id) {
        return region;
      }
    }
  }
  throw new Error(`Region not found: ${id}`);
}

/**
 * 동명이인처리하기
 * - 김병욱 2
 * - 이수진 2
 */
async function 주요법안표결(lawMakers: LawMaker[]) {
  const 주요법안: { 별칭: string; 의안번호: number; 의안명: string }[] =
    await readJSON(path.join(__dirname, "../data/주요법안.json"));
  const 주요법안표결: {
    의안번호: number;
    찬성: string[];
    반대: string[];
    기권: string[];
  }[] = await readJSON(path.join(__dirname, "../data/주요법안표결.json"));

  for (const lawMaker of lawMakers) {
    lawMaker.주요법안표결 = 주요법안.map((법안) => {
      const 법안표결 = 주요법안표결.find(
        (법안) => 법안.의안번호 === 법안.의안번호
      )!;
      return {
        별칭: 법안.별칭,
        의안명: 법안.의안명,
        의안번호: 법안.의안번호,
        찬반여부: 찬반여부(lawMaker, 법안표결),
      };
    });
    lawMaker.주요법안표결 = lawMaker.주요법안표결.sort(
      (a, b) => a.의안번호 - b.의안번호
    );
  }

  function 찬반여부(
    lawMaker: LawMaker,
    법안표결: {
      의안번호: number;
      찬성: string[];
      반대: string[];
      기권: string[];
    }
  ): "찬성" | "반대" | "기권" | "불참" {
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

function print동명이인(lawMakers: LawMaker[]) {
  const map = new Map<string, number>();
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

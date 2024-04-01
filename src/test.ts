import { readJSON, readdir, writeJSON } from "fs-extra";
import path from "path";
import { LawMaker } from "./law-maker";
import { 등수 } from "./등수";

async function main() {
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

  for (const lawMaker of lawMakers) {
    await writeJSON(path.join(lawMakerDir, `${lawMaker.id}.json`), lawMaker, {
      spaces: 2,
    });
  }
}

main();

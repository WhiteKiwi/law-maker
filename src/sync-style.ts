import { readJSON, readdir, writeJsonSync } from "fs-extra";
import path from "path";
import { LawMaker } from "./law-maker";
import { LawMakerCadidate } from "./law-maker-candidate";

async function main() {
  {
    const candidateDir = path.join(__dirname, "../data/candidates");
    const files = await readdir(candidateDir);
    for (const file of files) {
      const filePath = path.join(candidateDir, file);
      const candidates: LawMakerCadidate[] = await readJSON(filePath);
      // sync-detail
      for (const candidate of candidates) {
        writeJsonSync(
          path.join(
            __dirname,
            `../data/candidate-details/${candidate.id}.json`
          ),
          candidate,
          { spaces: 2 }
        );
      }
      writeJsonSync(filePath, candidates, { spaces: 2 });
    }
  }

  {
    const lawMakerDir = path.join(__dirname, "../data/21th-law-makers");
    const files = await readdir(lawMakerDir);
    for (const file of files) {
      const filePath = path.join(lawMakerDir, file);
      const lawMaker: LawMaker = await readJSON(filePath);
      // const 의안번호정렬 = [
      //   2122268, 2102500, 2120877, 2107249, 2121515, 2123038, 2125809, 2119727,
      //   2119142, 2126369, 2125837, 2120933,
      // ];
      // lawMaker.주요법안표결.sort(
      //   (a, b) =>
      //     의안번호정렬.indexOf(a.의안번호) - 의안번호정렬.indexOf(b.의안번호)
      // );
      writeJsonSync(filePath, lawMaker, { spaces: 2 });
    }
  }
}

main();

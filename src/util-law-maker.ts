import { readJSON, readdir, writeJsonSync } from "fs-extra";
import path from "path";
import { LawMaker } from "./law-maker";

export async function patchLawMaker(
  id: string,
  patch: (lawMaker: LawMaker) => LawMaker
) {
  const lawMakerFilePath = path.join(
    __dirname,
    `../data/21th-law-makers/${id}.json`
  );
  const lawMaker = await readJSON(lawMakerFilePath);
  writeJsonSync(lawMakerFilePath, patch(lawMaker), { spaces: 2 });
  // const lawMakerDir = path.join(__dirname, "../data/21th-law-makers");
  // const files = await readdir(lawMakerDir);
  // for (const file of files) {
  //   const filePath = path.join(lawMakerDir, file);
  //   const lawMaker: LawMaker = await readJSON(filePath);
  //   writeJsonSync(filePath, patch(lawMaker), { spaces: 2 });
  // }
}

export async function loadLawMakers(): Promise<LawMaker[]> {
  const lawMakerDir = path.join(__dirname, "../data/21th-law-makers");
  const files = await readdir(lawMakerDir);
  const lawMakers = [];
  for (const file of files) {
    const filePath = path.join(lawMakerDir, file);
    const lawMaker: LawMaker = await readJSON(filePath);
    lawMakers.push(lawMaker);
  }
  return lawMakers;
}

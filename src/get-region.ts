import axios from "axios";
import { writeJSON } from "fs-extra";
import path from "path";
import { Region, RegionsJson } from "./region";

const regionIds = [
  "1100",
  "2600",
  "2700",
  "2800",
  "2900",
  "3000",
  "3100",
  "5100",
  "4100",
  "5200",
  "4300",
  "4400",
  "5300",
  "4600",
  "4700",
  "4800",
  "4900",
];
const regionNames = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "강원특별자치도",
  "충청북도",
  "충청남도",
  "전북특별자치도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
];
async function main() {
  const regionsJson: RegionsJson = [];
  for (let i = 0; i < regionIds.length; i++) {
    const id = regionIds[i];
    const name = regionNames[i];
    const res = await axios.post(
      "http://info.nec.go.kr/bizcommon/selectbox/selectbox_getSggCityCodeJson.json",
      {
        electionId: "0020240410",
        electionCode: 2,
        cityCode: id,
      },
      {
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Accept-Encoding": "gzip, deflate",
          "Accept-Language": "en-US,en;q=0.9,ko;q=0.8",
          Connection: "keep-alive",
          "Content-Length": "50",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Cookie:
            "WMONID=NZweGJMP05H; JSESSIONID=O0Zw2r6P1bEcXdrh3PLkqRBu9fqgspcZZaEEqMsY7QuFNRotz11agSgGcafrfrqL.elecapp5_servlet_engine1",
          Dnt: "1",
          Host: "info.nec.go.kr",
          Origin: "http://info.nec.go.kr",
          Referer:
            "http://info.nec.go.kr/main/showDocument.xhtml?electionId=0020240410&topMenuId=CP&secondMenuId=CPRI03",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    regionsJson.push({
      id,
      name,
      regions: res.data.jsonResult.body
        .map(({ CODE, NAME }: { CODE: string; NAME: string }): Region => {
          let 갑을병정무: any = undefined;
          if (NAME.match(/[갑을병정무]$/)) {
            갑을병정무 = NAME.at(-1);
            NAME = NAME.slice(0, -1);
          }
          return {
            id: CODE,
            시도: name,
            시군구: NAME,
            갑을병정무,
          };
        })
        .sort((a: Region, b: Region) => a.시군구.localeCompare(b.시군구)),
    });
  }
  const filePath = path.join(__dirname, "../data/regions.json");
  await writeJSON(filePath, regionsJson, { spaces: 2 });
}
main();

import axios from "axios";

async function main() {
  const 의안 = [
    2102500, 2107249, 2119142, 2119727, 2120877, 2120933, 2121515, 2122268,
    2123038, 2125809, 2125837, 2126369,
  ];
  const 법안표결List = [];
  for (const 의안번호 of 의안) {
    const 법안표결 = await get주요법안표결(의안번호);
    법안표결List.push(법안표결);
  }
  console.log(JSON.stringify(법안표결List));
}

async function get주요법안표결(의안번호: number): Promise<{
  의안번호: number;
  찬성: string[];
  반대: string[];
  기권: string[];
}> {
  console.log("의안번호", 의안번호);
  const res: any = await axios.post(
    "https://www.assembly.go.kr/portal/cnts/cntsBill/findBpmBillVoteDtl.json",
    `billNo=${의안번호}&_csrf=2ad09d1d-821a-4122-a9a6-a30fc9ad7558`,
    {
      headers: {
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "en-US,en;q=0.9,ko;q=0.8",
        "Content-Length": "57",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Cookie:
          "PHAROSVISITOR=000031ae018e9e9f217435940ac965a5; PHAROSVISITOR=000031ae018e9e9f26e135ec0ac965a5; PCID=7049d560-05df-ba54-98d1-1873cf0665ae-1712258885270; JSESSIONID=uXTkSZSDQDHD6d5M1HKo0ZtNtVBlqsy1XKG41pcV8kwg386dzn3wbDUnTYhuKe0r.amV1c19kb21haW4vbmFob21lMQ==",
        DNT: "1",
        Host: "www.assembly.go.kr",
        Origin: "https://www.assembly.go.kr",
        Referer:
          "https://www.assembly.go.kr/portal/cnts/cntsCont/dataB.do?menuNo=600232&pageIndex=1&cntsDivCd=BILL&fromAge=21&toAge=21&billKindCd=&committeeId=&billNo=2119142&billName=&billNameMb=&fromAgeMb=21&toAgeMb=21&billKindCdMb=&committeeIdMb=&billNoMb=2119142",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
        "sec-ch-ua": '"Chromium";v="123", "Not:A-Brand";v="8"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
      },
    }
  );

  console.log(
    res.data.voteDtlList
      .filter((v: any) => v.hgNm === "이수진" || v.hgNm === "김병욱")
      .map((v: any) => ({
        이름: v.hgNm,
        정당: v.polyNm,
        찬반: v.resultVoteMod,
      }))
  );
  return {
    의안번호,
    찬성: res.data.voteDtlList
      .filter((v: any) => v.resultVoteMod === "찬성")
      .map((v: any) => v.hgNm),
    반대: res.data.voteDtlList
      .filter((v: any) => v.resultVoteMod === "반대")
      .map((v: any) => v.hgNm),
    기권: res.data.voteDtlList
      .filter((v: any) => v.resultVoteMod === "기권")
      .map((v: any) => v.hgNm),
  };
}
main();

const fs = require("fs");
const path = require("path");

const metadataDir = path.join(__dirname, "build", "json"); // 여기에 JSON들이 있는 폴더
const ipfsGatewayPrefix = "https://ipfs.io/ipfs/";

// 수정 대상 IPFS CID
const cid = "bafybeiaqqjrufxd2al54kzu4nxqcc2jjaptisnjr7j3i7tinwryaqatrhi";

fs.readdir(metadataDir, (err, files) => {
  if (err) {
    console.error("❌ 폴더를 읽는 중 오류 발생:", err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(metadataDir, file);

    if (path.extname(file) === ".json") {
      const json = JSON.parse(fs.readFileSync(filePath));

      if (json.image && json.image.startsWith("ipfs://")) {
        const imagePath = json.image.replace("ipfs://", "");
        json.image = ipfsGatewayPrefix + imagePath;

        fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
        console.log(`✅ ${file} 업데이트 완료`);
      }
    }
  });
});

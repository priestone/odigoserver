// server.js
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
// 추가: xml2js
const xml2js = require("xml2js");

const app = express();
app.use(cors()); // 모든 도메인(CORS) 허용

// /api 경로로 들어오는 요청 프록시
app.get("/api", async (req, res) => {
  try {
    const keyword = req.query.keyword || "카페";
    const url = `http://api.kcisa.kr/openapi/API_TOU_048/request?serviceKey=3d9ed2aa-7786-4f16-89a6-90619bf6ce60&numOfRows=50&pageNo=1&keyword=${encodeURIComponent(
      keyword
    )}`;

    const response = await fetch(url);

    // Step1) 텍스트(주로 XML) 형태로 받음
    const xmlData = await response.text();

    // Step2) xml2js로 파싱
    const parser = new xml2js.Parser(/* options */);
    parser.parseString(xmlData, (err, result) => {
      if (err) {
        console.error("XML parse error:", err);
        return res.status(500).json({ error: "Failed to parse XML" });
      }
      // Step3) 파싱된 JS 객체(=JSON 형태) 응답
      res.json(result);
    });
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});

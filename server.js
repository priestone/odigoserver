// server.js

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors()); // 모든 도메인(CORS) 허용

// 예시: /api 경로로 요청이 들어오면 KCISA API를 대신 호출해주는 프록시
app.get("/api", async (req, res) => {
  try {
    // 클라이언트에서 ?keyword=카페 이런 식으로 보내면
    // req.query.keyword로 받을 수 있음
    const keyword = req.query.keyword || "카페";

    // KCISA API를 호출할 URL
    // 여기서 http:// 로 쓰셔야 혼합 콘텐츠를 피할 수 없지만,
    // 프록시를 통해 서버 쪽에서는 http를 써도 상관없음.
    const url = `http://api.kcisa.kr/openapi/API_TOU_048/request?serviceKey=3d9ed2aa-7786-4f16-89a6-90619bf6ce60&numOfRows=50&pageNo=1&keyword=${encodeURIComponent(
      keyword
    )}`;

    // 서버(백엔드)에서 fetch를 통해 API를 대신 호출
    const response = await fetch(url);
    const data = await response.text();
    // KCISA API가 XML을 줄 수도 있고, JSON을 줄 수도 있으니 일단 text()로 받음
    // 만약 JSON 응답이라면 .json()을 써도 됨

    // 받은 데이터를 그대로 클라이언트에게 응답
    res.send(data);
    console.log(data);
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 서버 시작
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});

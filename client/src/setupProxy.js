const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    [
      "/member",
      "/lobby",
      "/download",
      "/friend",
      "/download",
      "/wait",
      "/openvidu/api",
      "/openvidu",
      //
    ], // 프록시를 적용할 경로를 설정합니다. 이 경로를 통해 API 요청을 보냅니다.
    createProxyMiddleware({
      target: "https://i9b109.p.ssafy.io:8443", // 백엔드 서버의 주소를 입력합니다.
      changeOrigin: true,
      secure: false, // 이 부분이 추가된 부분입니다. https를 http로 변환합니다.
    })
  );
};

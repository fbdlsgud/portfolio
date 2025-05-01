import axios from "axios";

// 실무: 환경 변수로 API 주소 분리
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 인증 시
});

export default instance;
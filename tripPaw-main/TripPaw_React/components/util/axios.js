//로그인 관리용

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 주소
  withCredentials: true,            // JWT 쿠키 포함 설정
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;

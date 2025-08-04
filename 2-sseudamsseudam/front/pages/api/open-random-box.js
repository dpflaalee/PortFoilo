// pages/api/open-random-box.js

export default async function handler(req, res) {
  const { category } = req.query;

  try {
    const backendRes = await fetch(`http://localhost:3065/randomBox/open/${category}`, {
      method: 'POST',
      headers: {
        Cookie: req.headers.cookie, // 로그인 세션 전달
      },
    });

    const data = await backendRes.json();
    return res.status(backendRes.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ success: false, message: '프록시 서버 에러' });
  }
}

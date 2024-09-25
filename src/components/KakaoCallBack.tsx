import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (code) {
      fetch('http://localhost:8080/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      })
        .then(response => response.json())
        .then(data => {
          // 토큰 처리 및 사용자 정보 가져오기
          localStorage.setItem('token', data.access_token); // 예: 토큰 저장
          navigate('/'); // 로그인 후 리디렉션
        })
        .catch(error => console.error('Error:', error));
    }
  }, [navigate]);

  return <div>카카오 로그인 중...</div>;
}

export default KakaoCallback;
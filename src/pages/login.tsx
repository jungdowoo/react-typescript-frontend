import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { login as apiLogin, loginAuthor as apiAuthorLogin} from '../api/api';
import '../css/common.css';
import '../css/reset.css';
import '../css/login.css';

interface LoginProps {
  handleLogin: (userData: { userId: string, userName: string, token:string, isAuthor?:boolean }) => void;
}

const Login: React.FC<LoginProps> = ({ handleLogin }) => {
  const [userId, setUserId] = useState<string>('');
  const [userPwd, setUserPwd] = useState<string>('');
  const [redirect, setRedirect] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [userType, setUserType] = useState<string>('regular');

  const handleUserIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const handleUserPwdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserPwd(e.target.value);
  };
  
  const handleUserTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setUserType(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Login.tsx - handleSubmit 함수 호출됨');

    try {
      let response;
      if (userType === 'author') {
        console.log('Login.tsx - @작가 로그인 API 호출전');
        response = await apiAuthorLogin(userId, userPwd);
        console.log('Login.tsx - API 응답:', response);
      } else {
        console.log('Login.tsx - @일반 로그인 API 호출전');
        response = await apiLogin(userId, userPwd);
        console.log('Login.tsx - API 응답:', response);
      }

      // API 응답 로그 추가
      console.log('response.success:', response.success);
      console.log('response.data:', response.data);

      // handleLogin 호출, 조건문을 제거하고 바로 실행
      if (response && response.success && response.data) {
        console.log('Login.tsx - 로그인이 성공하여 handleLogin 호출:', response.data);
        handleLogin({ 
          userId: response.data.userId, 
          userName: response.data.userName, 
          token: response.data.token,
          isAuthor: userType === 'author', // userType을 기준으로 isAuthor 설정
        });

        setRedirect(true);
      } else {
        console.log('Login.tsx - 로그인 실패 또는 응답 데이터 없음:', response);
        setError('로그인 실패: 아이디 또는 비밀번호가 틀렸습니다.');
      }
    } catch (error) {
      console.log('로그인 실패:', error);
      setError('로그인 실패: 아이디 또는 비밀번호가 틀렸습니다.');
    }
  };
  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <div className="login-container">
        <h2>로그인</h2>
        
        <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="userType" className="input_title">
              유저 타입
            </label>
            <select id="userType" value={userType} onChange={handleUserTypeChange}>
              <option value="regular">일반 회원</option>
              <option value="author">작가</option>
            </select>
          </div>
          <div>
            <label htmlFor="userId" className="input_title">아이디</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={handleUserIdChange}
              className="input_txt"
              required
            />
          </div>
          <div>
            <label htmlFor="userPwd" className="input_title">비밀번호</label>
            <input
              type="password"
              id="userPwd"
              value={userPwd}
              onChange={handleUserPwdChange}
              className="input_txt"
              required
            />
          </div>

          

          <button type="submit" className="btn-login">로그인</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default Login;

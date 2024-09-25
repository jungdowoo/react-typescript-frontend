import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import MyPage from '../pages/mypage';

interface HeaderProps {
  isLoggedIn: boolean;
  isAuthor: boolean;
  logout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, isAuthor, logout }) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const handleMouseEnter = (category: string) => {
    setOpenCategory(category);
  };

  const handleMouseLeave = () => {
    setOpenCategory(null);
  };

  useEffect(() => {
    console.log('헤더 렌더링 - 로그인 상태 (isLoggedIn):', isLoggedIn);
    console.log('헤더 렌더링 - 작가여부 (isAuthor):', isAuthor);
  }, [isLoggedIn, isAuthor]);

  return (
    <header className="App-header">
      <div className="main-container header-content">
        <Link to="/">
          <img src="/images/logo_remove.png" alt="logo" />
        </Link>
        <div
          className='hd-right'
          onMouseEnter={() => handleMouseEnter('category')}
          onMouseLeave={handleMouseLeave}
        >
          <a href="#"></a>
          <div id="menuTop1" className="menuTop">카테고리</div>
          {openCategory === 'category' && (
            <div className='dropdown-menu'>
              <Link to="/category/illustration">캐릭터 일러스트</Link>
              <Link to="/category/virtual-broadcast">버츄얼·인터넷 방송</Link>
              <Link to="/category/video-sound">영상 · 음향</Link>
              <Link to="/category/webtoon">웹툰 · 만화</Link>
              <Link to="/category/novel-cover">소설 · 기타 표지</Link>
            </div>
          )}
        </div>
        <div className='hd-right'>
          <Link to="/BoardList">
            <div id="menuTop2" className="menuTop">의뢰 게시판</div>
          </Link>
        </div>
        <div
          className='hd-right'
          onMouseEnter={() => handleMouseEnter('request')}
          onMouseLeave={handleMouseLeave}
        >
          <a href="#"></a>
          <div id="menuTop3" className="menuTop">이용 안내</div>
          {openCategory === 'request' && (
            <div className='dropdown-menu'>
              <a href="#">의뢰자 이용안내</a>
              <a href="#">작가 이용안내</a>
              <a href="#">자주하는 질문</a>
            </div>
          )}
        </div>
        {/* <div className='hd-right'>
          <a href="#"></a>
          <div id="menuTop4" className="menuTop">이용 후기</div>
        </div> */}
        <div
          className='hd-right'
          onMouseEnter={() => handleMouseEnter('customerService')}
          onMouseLeave={handleMouseLeave}
        >
          {/* <a href="#"></a>
          <div id="menuTop5" className="menuTop">고객센터</div>
          {openCategory === 'customerService' && (
            <div className='dropdown-menu'>
              <a href="#">고객 문의</a>
              <a href="#">자주하는 질문</a>
            </div>
          )} */}
        </div>

        <div className='hd-right auth-links'>
        {isLoggedIn ? (
            <>
              {/* 작가인 경우와 일반 사용자인 경우를 구분 */}
              {isAuthor ? (
                <>
                  <Link to="/mypage">작가 마이페이지</Link>
                  <a href="/" onClick={logout}>작가 로그아웃</a>
                </>
              ) : (
                <>
                  <Link to="/profile-edit">마이페이지</Link>
                  <a href="/" onClick={logout}>로그아웃</a>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="topBtn1">로그인</Link>
              <Link to="/signup">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

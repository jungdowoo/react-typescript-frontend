import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Location from '../location';
import Header from '../components/header';  
import '../css/common.css';

const Home: React.FC = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate(); 

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // 검색어 업데이트
  };

  // 검색어 제출 처리
  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      // 검색어가 있으면 category.tsx 페이지로 이동하며 검색어 전달
      navigate(`/category/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  // 엔터 키 입력 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm) {
      // 검색어를 쿼리로 포함하여 검색 결과 페이지로 이동
      navigate(`/category/illustration?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div>
      <main className='main-container'>
        <section>
          <div style={{ height: '600px', width: '130%', backgroundImage: 'url(/images/lala.png)', backgroundSize: '800px 600px', backgroundRepeat: 'no-repeat', backgroundPosition: 'calc(100% - 10px) center' }}></div>

          <div className="search-container">
            <input
              type="text" placeholder="내가 찾는 의뢰 검색하기"
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              style={{
                width: '440px',
                height: '60px',
                border: '2px solid #FF4500',
                borderRadius: '5px',
                fontSize: '24px',
                background: 'url(/images/main_sch.gif) no-repeat right center', 
                backgroundSize: '70px 70px'
              }}
            />
            
          </div>
          <div className="mid-section">
            <h1>안전하게 전문가에게 맡기세요</h1>
              <h2>MEET YOUR CHARACTER</h2>
              <p>버츄얼 캐릭터를 통해 특별한 세상을 만나보세요!</p>
          </div>
          <Location />
        </section>
      </main>
      <div className="main-cate-wrapper">
        <div className="main-cate">
          <ul>
            <li>
              <Link to ="/category/illustration">
                <img src="/images/cm0.png" alt="메인카테고리이미지" />
                <ol>캐릭터 일러스트</ol>
              </Link>
            </li>
            <li>
            <Link to="/category/illustration"> 
              <img src="/images/cm1.png" alt="메인카테고리이미지1" />
              <ol>일러스트</ol>
            </Link>
            </li>
            <li>
              <Link to="/category/virtual-broadcast">
                <img src="/images/cm2.png" alt="메인카테고리이미지2" />
                <ol>버추얼 · Live2D</ol>
              </Link>
            </li>
            <li>
              <Link to="category/novel-cover">
                <img src="/images/cm3.png" alt="메인카테고리이미지3" />
                <ol>소설 커버</ol>
              </Link>
            </li>
            <li>
              <Link to="category/video-sound">
                <img src="/images/cm4.png" alt="메인카테고리이미지4" />
                <ol>영상 · 음향</ol>
              </Link>
            </li>
            <li>
              <Link to="category/webtoon">
                <img src="/images/cm5.png" alt="메인카테고리이미지5" />
                <ol>웹툰 · 만화</ol>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="sitewidth">
        <h2>다양한 작가들의 작품을 만나보세요 !</h2>
        <p>인기작가와 신규작가들에게 의뢰해보세요.</p>
        <div className="banner-row">
          <img src="/images/banner1.png" alt="배너이미지" className='banner-img' />
          <img src="/images/banner2.png" alt="배너이미지" className='banner-img' />
          <img src="/images/banner3.png" alt="배너이미지" className='banner-img' />
          <img src="/images/banner4.png" alt="배너이미지" className='banner-img' />
          <img src="/images/banner5.png" alt="배너이미지" className='banner-img' />
          <img src="/images/banner6.png" alt="배너이미지" className='banner-img' />
          <img src="/images/banner7.png" alt="배너이미지" className='banner-img' />
          <img src="/images/banner8.png" alt="배너이미지" className='banner-img' />
        </div>
      </div>
      <div style={{ background: '#ffa751', padding: '100px 0' }}>
        <div className='tcenter' style={{ fontSize: '30px', letterSpacing: '-1px', color: '#fff' }}>
          저스트 아트만의 편리한 거래 방식
        </div>
      </div>
      <footer className='footer-container'>
      <div className="footer-links">
        <a href="#">자주하는질문</a>
        <Link to="/boardList">의뢰게시판</Link>
        <a href="#">이용약관</a>
        <a href="#">개인정보취급방침</a>
      </div>
      <div className="footer-info">
        <p>연락처: 010-3070-1545 / E-mail : jdw9302@naver.com</p>
        <p>프로젝트명: JustArt 개발자: 정도우 </p>
        <p>저스트 아트는 정식 웹사이트가 아닌 취업목적의 포트폴리오용 웹 사이트입니다. </p>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 INCOWORKS Corp. All Right Reserved.</p>
        <div className="footer-nav">
          <a href="/">HOME</a>
          <a href="#">TOP</a>
      </div>
      </div>
      </footer>
    </div>
  );
}


export default Home;

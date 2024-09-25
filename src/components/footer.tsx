
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/common.css'; 

const Footer: React.FC = () => {
  return (
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
  );
}

export default Footer;

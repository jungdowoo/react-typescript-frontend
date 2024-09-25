import React from 'react';
import { Link } from 'react-router-dom';
import '../css/mypage.css';

const Sidebar: React.FC = () => {
    return (
    <aside className="sidebar">
        <div className="sidebar-section">
            <h2>쇼핑 정보</h2>
                <ul>
                    <li><Link to="/">구매 내역</Link></li>
                    <li><Link to="/">판매 내역</Link></li>
                    <li><Link to="/">보관 판매</Link></li>
                    <li><Link to="/">관심</Link></li>
                </ul>
    </div>
    <div className="sidebar-section">
        <h2>내 정보</h2>
        <ul>
            <li><Link to="/">로그인 정보</Link></li>
            <li><Link to="/">프로필 관리</Link></li>
            <li><Link to="/">판매자 등급</Link></li>
            <li><Link to="/">주소록</Link></li>
            <li><Link to="/">결제 정보</Link></li>
            <li><Link to="/">판매 정산 계좌</Link></li>
            <li><Link to="/">현금영수증 정보</Link></li>
            <li><Link to="/">포인트</Link></li>
            <li><Link to="/">쿠폰</Link></li>
        </ul>
    </div>
    </aside>
  );
};

export default Sidebar;

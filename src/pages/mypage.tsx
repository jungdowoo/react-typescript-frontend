import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './sidebar';
import '../css/mypage.css';

interface MyPageProps {
  userId: string;
  userName: string;
}

const MyPage: React.FC<MyPageProps> = ({ userId, userName }) => {
  const [userImage, setUserImage] = useState<string>('');

  return (
  <div className="mypage-container">
    <Sidebar/>
    <div className="mp-content">
      <div className="profile-header">
        <div className="profile-image">
          {userImage ? (
            <img src={`http://adsf3323.cafe24.com/uploads/${userImage}`} alt="Profile" />
          ) : (
            <img src="../images/blank_profile.png" alt="Default Profile" /> 
          )}
        </div>
        <div className="profile-info">
          <h2>{userName} 님</h2>
          <p>{userId}</p>
        </div>
          <div className="profile-buttons">
            <Link to="/profile-edit" className="profile-edit-button">
              <button>프로필 관리</button>
            </Link>
        </div>
      </div>
    </div>
  </div>
  );
};

export default MyPage;

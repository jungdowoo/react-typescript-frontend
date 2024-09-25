import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import axios from 'axios';
import { AxiosError } from 'axios';
import Sidebar from './sidebar';
import { getCurrentUserProfile, uploadProfileImage } from '../api/api';
import '../css/mypage.css';
import '../css/common.css';

interface User {
  userId: string;
  userName: string;
  phoneNum: string;
  description: string;
  profileImage: string;
}
interface MyPageProps {
  userId: string;
  userName: string;
}
interface ProfileEditProps {
  userId: string;
  userName: string;
}



const ProfileEdit: React.FC<ProfileEditProps> = ({ userId, userName }) => {
  const [user, setUser] = useState<User>({
    userId: userId,
    userName: userName,
    phoneNum:'',
    description: '',
    profileImage: ''
    
  });

  const [newPassword, setNewPassword] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [userImage, setUserImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // 닉네임 수정 상태
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [isEditingId, setIsEditingId] = useState<boolean>(false);
  const [isEditingPassword, setIsEditingPassword] = useState<boolean>(false);
  const [isEditingPhone, setIsEditingPhone] = useState<boolean>(false);


  const [newUserName, setNewUserName] = useState<string>(user.userName);
  const [newUserId, setNewUserId] = useState<string>(user.userId);
  const [newPhoneNum, setNewPhoneNum] = useState<string>(user.phoneNum);

  
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);



  // 파일 입력 필드 참조 useRef 훅
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 기본 이미지 URL 정의
  const defaultProfileImage = '/images/blank_profile.png';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userProfile = await getCurrentUserProfile();
        console.log("Fetched User Profile:", userProfile); 
        if (userProfile && userProfile.userName) {
          setUser(userProfile);
          setUserImage(userProfile.profileImage);
          setNewUserName(userProfile.userName);
          setNewPhoneNum(userProfile.phoneNum);
          console.log("User Profile updated with phone number:", userProfile.phoneNum);
        } else {
          console.error("닉네임 불러오기 실패: userProfile.userName is undefined");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("사용자 데이터를 가져오는 중 오류 발생!", error);
        setIsLoading(false);
        alert("이 기능은 악용으로 인해 막아두엇습니다 ㅠ.ㅠ");
        window.location.href = '/login';
      }
    };
  

    fetchUserData();
  }, []);

  if(isLoading) {
    return <div>Loading...</div>;
  }

  console.log("Rendering Phone Number:", user.phoneNum);

  if(!user.userName) {
    console.log('닉네임 불러오기 실패:', user.userName);
  }
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'userName') {
      setNewUserName(value);
    } else if (name === 'userId') {
      setNewUserId(value);
    } else if (name === 'password') {
      setNewPassword(value);
    } else if (name === 'phoneNum') {
      setNewPhoneNum(value);
    }
  };

  // 각 필드 편집 모드 전환 함수
  const handleEditNameClick = () => {
    console.log("edit button clicked");
    setIsEditingName(true);
  };
  const handleEditIdClick = () => {
    console.log('edit button clicked for ID');
    setIsEditingId(true);
  };
  const handleEditPasswordClick = () => {
    setIsEditingPassword(true);
  };
  const handleEditPhoneClick = () => {
    setIsEditingPhone(true);
  };

  // 각 필드의 편집 모드 취소 함수
  const handleCancelNameClick = () => {
    setIsEditingName(false);
    setNewUserName(user.userName);
    setError(null);
  };
  const handleCancelIdClick = () => {
    setIsEditingId(false);
    setNewUserId(user.userId);
    setError(null);
  };
  const handleCancelPasswordClick = () => {
    setIsEditingPassword(false);
    setNewPassword('');
    setError(null);
  };
  const handleCancelPhoneClick = () => {
    setIsEditingPhone(false);
    setNewPhoneNum(user.phoneNum);
    setError(null);
  }

  // 각 필드의 저장 함수
  const handleSaveNameClick = async () => {
    try {
      const response = await axios.put(`/api/users/profile/${user.userId}/nickname`, {
        userName: newUserName,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      setUser({ ...user, userName: newUserName }); // 닉네임 업데이트
      setIsEditingName(false); // 편집 모드를 비활성화
      alert('닉네임이 성공적으로 변경되었습니다.');
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('닉네임 변경 중 오류 발생:', axiosError);
      if (axiosError.response && axiosError.response.status === 409) {
        alert('이미 존재하는 닉네임입니다.');
      } else {
        alert('닉네임 변경에 실패했습니다.');
      }
    }
  };
  
  const handleSaveIdClick = async () => {
    try {
      const response = await axios.put(`/api/users/profile/${user.userId}/id`, {
        userId: newUserId,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      setUser({ ...user, userId: newUserId }); 
      setIsEditingId(false);
      alert('아이디가 성공적으로 변경되었습니다.');
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('아이디 변경 중 오류 발생:', axiosError);
      if (axiosError.response && axiosError.response.status === 409) {
        alert('이미 존재하는 아이디입니다.');
      } else {
        alert('아이디 변경에 실패했습니다.');
      }
    }
  };
  
  const handleSavePasswordClick = async () => {
    try {
      const response = await axios.put(`/api/users/profile/${user.userId}/password`, {
        password: newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      setIsEditingPassword(false); // 편집 모드를 비활성화
      alert('비밀번호가 성공적으로 변경되었습니다.');
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('비밀번호 변경 중 오류 발생:', axiosError);
      alert('비밀번호 변경에 실패했습니다.');
    }
  };

  const handleSavePhoneClick = async () => {
    try {
      const response = await axios.put(`/api/users/profile/${user.userId}/phone`, {
        phoneNum: newPhoneNum,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      setUser({ ...user, phoneNum: newPhoneNum });
      setIsEditingPhone(false); 
      alert('휴대폰 번호가 성공적으로 변경되었습니다.');
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('휴대폰 번호 변경 중 오류 발생:', axiosError);
      alert('휴대폰 번호 변경에 실패했습니다.');
    }
  };



  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleSave = () => {
    const token = localStorage.getItem('token');
    axios.post(`/api/user/profile/${user.userId}`, user)
      .then(response => {
        alert('Profile updated successfully');
      })
      .catch(error => {
        console.error("There was an error updating the profile!", error);
      });
  };

  const handlePasswordUpdate = () => {
    axios.post(`/api/user/change-password`, { userId: user.userId, newPassword: newPassword })
      .then(response => {
        alert('Password changed successfully');
        setNewPassword('');
      })
      .catch(error => {
        console.error("There was an error changing the password!", error);
      });
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
  
      // 이미지를 미리보기 URL로 설정
      const previewUrl = URL.createObjectURL(file);
      setUserImage(previewUrl); // 선택한 이미지를 즉시 보여주기
  
      try {
        // 이미지 업로드 API 호출을 위한 폼 데이터 생성
        const formData = new FormData();
        formData.append('image', file);

        // 백엔드로 이미지 업로드 요청
        const response = await axios.post('http://localhost:8080/api/users/profile/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // 인증 토큰 헤더에 포함
          },
        });

        const imageUrl = response.data.imageUrl;
        console.log('이미지 업로드 완료:', imageUrl); 

        // 업로드된 이미지 URL을 상태에 반영
        setUser(prevUser => ({ ...prevUser, profileImage: imageUrl })); 
        setUserImage(imageUrl); // 업로드 완료 후, 실제 업로드된 이미지로 업데이트
        localStorage.setItem('profileImageUrl', imageUrl);
      } catch (error) {
        console.error('이미지 변경 중 오류 발생:', error);
        alert("이미지 업로드 중 오류가 발생했습니다.");
        // 필요에 따라 추가적인 오류 처리 로직을 여기에 추가할 수 있습니다.
      } finally {
        // 미리보기 URL 해제 (메모리 누수 방지)
        URL.revokeObjectURL(previewUrl);
      }
    }
  };


  const handleImageDelete = () => {
    const token = localStorage.getItem('token');
    axios.post(`/api/user/profile/delete-image`, { userId: user.userId })
      .then(response => {
        alert('프로필 삭제를 완료하였습니다.');
        setUser(prevUser => ({ ...prevUser, profileImage: defaultProfileImage }));
        setUserImage(defaultProfileImage);
      })
      .catch(error => {
        if(error.response && error.response.status === 404){
          setUser(prevUser => ({ ...prevUser, profileImage: defaultProfileImage }));
          setUserImage(defaultProfileImage);
        }
        console.error("There was an error deleting the image!", error);
      });
  };

  const openFilePicker = () => {
    if (fileInputRef.current) { 
      fileInputRef.current.click();
    }
  };

  return (
    <div className="pro_wrapper">
      <Sidebar/>
    <div className="pro_container">
      <h1>프로필 관리</h1>
      <div className="profile-image-section">
        {userImage ? (
          <img src={userImage} alt="Profile" />
        ) : (
          <img src={defaultProfileImage} alt="Default Profile" />
        )}
        <div className="profile-info">
          <h2>{user.userName || "닉네임 불러오기 실패"}</h2>
        </div>
        <div>
          <input
            type="file"
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <button onClick={openFilePicker} className="btn-modify">이미지 변경</button>
          <button onClick={handleImageDelete} className="btn-modify">삭제</button>
        </div>
      </div>
      <div className="profile-info-section">
        <label>
          닉네임
          <div className="input-wrapper">
          <input 
            type="text" 
            name="userName" 
            value={newUserName} 
            onChange={handleInputChange}
            className="input_unit"
            readOnly ={!isEditingName}
          />
          {!isEditingName && (
            <button onClick={handleEditNameClick} className="btn-modify-small">변경</button> 
        )}
        </div>
          {isEditingName && (
            <div className="button-group"> {/* 버튼을 묶는 div 추가 */}
              <button onClick={handleSaveNameClick} className="btn-save">저장</button>
              <button onClick={handleCancelNameClick} className="btn-cancel">취소</button>
            </div>
        )}
          
        </label>

        <label>
          아이디
          <div className="input-wrapper">
          <input
            type="text"
            name="userId"
            value={newUserId}
            onChange={handleInputChange}
            className="input_unit"
            readOnly={!isEditingId}
            />
            {!isEditingId && (
              <button onClick={handleEditIdClick} className="btn-modify-small">변경</button>
            )}
            </div>
            {isEditingId && (
              <div className="button-group">
                <button onClick={handleSaveIdClick} className="btn-save">저장</button>
                <button onClick={handleCancelIdClick} className="btn-cancel">취소</button>
              </div>
            )}
        </label>

        <label>
          비밀번호
          <div className="input-wrapper">
          <input 
            type="text"
            value={isEditingPassword ? newPassword : '●●●●●●●●●●●●●●●●●●'}
            onChange={handlePasswordChange}
            className="input_unit"
            readOnly ={!isEditingPassword}
          />
          {!isEditingPassword && (
            <button onClick={handleEditPasswordClick} className="btn-modify-small">변경</button>
          )}
          </div>
          {isEditingPassword && (
              <div className="button-group">
                <button onClick={handleSavePasswordClick} className="btn-save">저장</button>
                <button onClick={handleCancelPasswordClick} className="btn-cancel">취소</button>
              </div>
            )}
        </label>

        <label>
          휴대폰 번호
          <div className="input-wrapper">
          <input 
            type="text"
            name="phoneNum"
            value={newPhoneNum}
            onChange={handleInputChange}
            className="input_unit"
            readOnly ={!isEditingPhone}
          />
          {!isEditingPhone && (
                <button onClick={handleEditPhoneClick} className="btn-modify-small">변경</button>
              )}
            </div>
            {isEditingPhone && (
              <div className="button-group">
                <button onClick={handleSavePhoneClick} className="btn-save">저장</button>
                <button onClick={handleCancelPhoneClick} className="btn-cancel">취소</button>
              </div>
            )}
        </label>
      </div>
    </div>
  </div>
  );
};

export default ProfileEdit;

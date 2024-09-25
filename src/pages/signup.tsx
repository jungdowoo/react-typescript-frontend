import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/common.css';
import '../css/reset.css';
import { checkDuplicateUserId, checkDuplicateUserName, registerUser, registerAuthor } from '../api/api';

interface FormData {
  userName: string;
  userId: string;
  userPwd: string;
  pwdCheck: string;
  phoneNum: string;
  authorBio?: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    userName: '',
    userId: '',
    userPwd: '',
    pwdCheck: '',
    phoneNum: '',
    authorBio: ''  
  });

  const [authorFormData, setAuthorFormData] = useState({
    authorName: '',
    authorId: '',
    authorPwd: '',
    pwdCheck: '',
    authorPhoneNum: '',
    authorBio: ''
  });
    

  const [userIdCheckMsg, setUserIdCheckMsg] = useState<string>('');
  const [isUserIdValid, setIsUserIdValid] = useState<boolean>(true);
  const [passwordCheckMsg, setPasswordCheckMsg] = useState<string>('');
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);
  const [pwdMatchCheckMsg, setPwdMatchCheckMsg] = useState<string>('');
  const [isPwdMatchValid, setIsPwdMatchValid] = useState<boolean>(true);
  const [isGeneralMember, setIsGeneralMember] = useState<boolean>(true);
  const [userNameCheckMsg, setUserNameCheckMsg] = useState<string>('');
  const [isUserNameValid, setIsUserNameValid] = useState<boolean>(true);
  const [authorNameCheckMsg, setAuthorNameCheckMsg] = useState<string>('');
  const [isAuthorNameValid, setIsAuthorNameValid] = useState<boolean>(false);

  const navigate = useNavigate();
  
  useEffect(() => {
    const handleBlur = async () => {
      const userId = isGeneralMember ? formData.userId : authorFormData.authorId;
      if (userId) {
        try {
          const isDuplicate = await checkDuplicateUserId(userId);
          if (isDuplicate) {
            setUserIdCheckMsg('이미 사용중인 아이디입니다.');
            setIsUserIdValid(false);
          } else {
            setUserIdCheckMsg('사용 가능한 아이디입니다.');
            setIsUserIdValid(true);
          }
        } catch (error) {
          console.error('아이디 중복 확인 중 오류가 발생했습니다:', error);
          setUserIdCheckMsg('아이디 중복 확인 중 오류가 발생했습니다.');
          setIsUserIdValid(false);
        }
      } else {
        setUserIdCheckMsg('');
        setIsUserIdValid(true);
      }
    };

    handleBlur();
  }, [formData.userId, authorFormData.authorId,isGeneralMember]);

  
  useEffect(() => {
    const handleNameBlur = async () => {
      const userName = formData.userName;
      if (userName) {
        try {
          const isDuplicate = await checkDuplicateUserName(userName);
          if (isDuplicate) {
            setUserNameCheckMsg('이미 사용중인 닉네임입니다.');
            setIsUserNameValid(false);
          } else {
            setUserNameCheckMsg('사용 가능한 닉네임입니다.');
            setIsUserNameValid(true);
          }
        } catch (error) {
          console.error('닉네임 중복 확인 중 오류가 발생했습니다:', error);
          setUserNameCheckMsg('닉네임 중복 확인 중 오류가 발생했습니다.');
          setIsUserNameValid(false);
        }
      } else {
        setUserNameCheckMsg('');
        setIsUserNameValid(true);
      }
    };

    handleNameBlur();
  }, [formData.userName, authorFormData.authorName, isGeneralMember]);

  
  const handlePasswordBlur = () => {
    const password = isGeneralMember ? formData.userPwd : authorFormData.authorPwd;
    const passwordPattern = /^(?=.*[0-9]).{4,12}$/;
    if (!passwordPattern.test(password)) {
      setPasswordCheckMsg('비밀번호는 4-12사이의 숫자를 포함해야 합니다.');
      setIsPasswordValid(false);
    } else {
      setPasswordCheckMsg('');
      setIsPasswordValid(true);
    }
  };

  const handlePwdCheckBlur = () => {
    const pwd = isGeneralMember ? formData.userPwd : authorFormData.authorPwd;
    const pwdCheck = isGeneralMember ? formData.pwdCheck : authorFormData.pwdCheck;
    if (pwd !== pwdCheck) {
      setPwdMatchCheckMsg('비밀번호가 일치하지 않습니다.');
      setIsPwdMatchValid(false);
    } else {
      setPwdMatchCheckMsg('');
      setIsPwdMatchValid(true);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (isGeneralMember) {
      setFormData({
        ...formData,
        [name]: value
      });
    } else {
      setAuthorFormData({
        ...authorFormData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (isGeneralMember) {
      if (formData.userPwd !== formData.pwdCheck) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      try {
        await registerUser(formData);
        alert('회원가입이 완료되었습니다.');
      } catch (error) {
        console.error('회원가입 중 오류가 발생했습니다:', error);
        alert('회원가입 중 오류가 발생했습니다.');
      }
    } else {
      if (authorFormData.authorPwd !== authorFormData.pwdCheck) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      console.log('sending author data:', authorFormData);
  
      try {
        const authorData = {
          authorName: authorFormData.authorName,
          authorId: authorFormData.authorId,
          authorPwd: authorFormData.authorPwd,
          authorPhoneNum: authorFormData.authorPhoneNum,
          authorBio: authorFormData.authorBio || ''
        };
        await registerAuthor(authorData);
        alert('회원가입이 완료되었습니다.');
      } catch (error) {
        console.error('회원가입 중 오류가 발생했습니다:', error);
        alert('회원가입 중 오류가 발생했습니다.');
      }
    }
  };



  const handleButtonClick = (isGeneral: boolean) => {
    setIsGeneralMember(isGeneral);
  };

  const memberSelect = () => (
    <div className="button_container">
      <div
        id="selectBtn_1"
        className={`btn_chk ${isGeneralMember ? 'selected' : 'unselected'}`}
        onClick={() => handleButtonClick(true)}
      >
        <li>일반 회원가입</li>
      </div>
      <div
        id="selectBtn_2"
        className={`btn_chk ${!isGeneralMember ? 'selected' : 'unselected'}`}
        onClick={() => handleButtonClick(false)}
      >
        <li>작가 회원가입</li>
      </div>
    </div>
  );

  const renderForm = () => {
    if (isGeneralMember) {
      return (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userName" className={`input_title ${!isUserNameValid ? 'input_title_error' : ''}`}>이름(닉네임)</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
            />
            <span className={`${!isUserNameValid ? 'input_error' : ''}`}>{userNameCheckMsg}</span>
          </div>
          <div className="form-group">
            <label htmlFor="userId" className={`input_title ${!isUserIdValid ? 'input_title_error' : ''}`}>아이디</label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
            />
            <span className={`${!isUserIdValid ? 'input_error' : ''}`}>{userIdCheckMsg}</span>
          </div>
          <div className="form-group">
            <label htmlFor="userPwd" className={`input_title ${!isPasswordValid ? 'input_title_error' : ''}`}>비밀번호</label>
            <input
              type="password"
              id="userPwd"
              name="userPwd"
              value={formData.userPwd}
              onChange={handleChange}
              onBlur={handlePasswordBlur}
              required
            />
            <span className={`${!isPasswordValid ? 'input_error' : ''}`}>{passwordCheckMsg}</span>
          </div>
          <div className="form-group">
            <label htmlFor="pwdCheck" className={`input_title ${!isPwdMatchValid ? 'input_title_error' : ''}`}>비밀번호 확인</label>
            <input
              type="password"
              id="pwdCheck"
              name="pwdCheck"
              value={formData.pwdCheck}
              onChange={handleChange}
              onBlur={handlePwdCheckBlur}
              required
            />
            <span className={`${!isPwdMatchValid ? 'input_error' : ''}`}>{pwdMatchCheckMsg}</span>
          </div>
          <div className="form-group">
            <label htmlFor="phoneNum" className='input_title'>휴대전화 번호</label>
            <input
              type="tel"
              id="phoneNum"
              name="phoneNum"
              value={formData.phoneNum}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-login">회원 가입</button>
          
        </form>
      );
    } else {
      return (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="authorName" className={`input_title ${!isAuthorNameValid ? 'input_title_error' : ''}`}>작가 이름(실명)</label>
            <input
              type="text"
              id="authorName"
              name="authorName"
              value={authorFormData.authorName}
              onChange={handleChange}
              required
            />
            <span className={`${!isAuthorNameValid ? 'input_error' : ''}`}>{authorNameCheckMsg}</span>
          </div>
          <div className="form-group">
            <label htmlFor="authorId" className={`input_title ${!isUserIdValid ? 'input_title_error' : ''}`}>작가 아이디</label>
            <input
              type="text"
              id="authorId"
              name="authorId"
              value={authorFormData.authorId}
              onChange={handleChange}
              required
            />
            <span className={`${!isUserIdValid ? 'input_error' : ''}`}>{userIdCheckMsg}</span>
          </div>
          <div className="form-group">
            <label htmlFor="authorPwd" className={`input_title ${!isPasswordValid ? 'input_title_error' : ''}`}>비밀번호</label>
            <input
              type="password"
              id="authorPwd"
              name="authorPwd"
              value={authorFormData.authorPwd}
              onChange={handleChange}
              onBlur={handlePasswordBlur}
              required
            />
            <span className={`${!isPasswordValid ? 'input_error' : ''}`}>{passwordCheckMsg}</span>
          </div>
          <div className="form-group">
            <label htmlFor="pwdCheck" className={`input_title ${!isPwdMatchValid ? 'input_title_error' : ''}`}>비밀번호 확인</label>
            <input
              type="password"
              id="pwdCheck"
              name="pwdCheck"
              value={authorFormData.pwdCheck}
              onChange={handleChange}
              onBlur={handlePwdCheckBlur}
              required
            />
            <span className={`${!isPwdMatchValid ? 'input_error' : ''}`}>{pwdMatchCheckMsg}</span>
          </div>
          <div className="form-group">
            <label htmlFor="authorPhoneNum" className='input_title'>휴대전화 번호</label>
            <input
              type="tel"
              id="authorPhoneNum"
              name="authorPhoneNum"
              value={authorFormData.authorPhoneNum}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="authorBio" className='input_title'>작가 소개</label>
            <textarea
              id="authorBio"
              name="authorBio"
              value={authorFormData.authorBio || ''}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-login">회원가입</button>
          
        </form>
      );
    }
  };

  return (
    <div className="signup-container">
      <h2>{isGeneralMember ? '일반회원 가입' : '작가 회원 가입'}</h2>
      {memberSelect()}
      {renderForm()}
    </div>
  );
}

export default Signup;

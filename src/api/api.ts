import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-type': 'application/json',
  },
});

interface LoginResponse {
  success: boolean;
  data?: {
    userId: string;
    userName: string;
    token: string;
    isAuthor?: boolean;
  };
  error?: string;
  message?: string;
}
interface UserProfile {
  userId: string;
  userName: string;
  phoneNum: string;
  description: string;
  profileImage: string;
}
interface RegisterUserData {
  userName: string;
  userId: string;
  userPwd: string;
  phoneNum: string;
}

interface RegisterAuthorData {
  authorName: string;
  authorId: string;
  authorPwd: string;
  authorPhoneNum: string;
  authorBio: string;
}

// 로그인 API 호출
export const login = async (userId: string, userPwd: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/api/users/login', { userId, userPwd });
    console.log('로그인 API 응답:', response.data);

    if (response.data.success && response.data.data) {
      localStorage.setItem('token', response.data.data.token);
      return {
        ...response.data,
        data: {
          ...response.data.data,
          isAuthor: response.data.data.isAuthor ?? false
        }
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('로그인 API 오류:', error);
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
      try {
        const response = await apiClient.post<LoginResponse>('/api/authors/login', { userId, userPwd });
        console.log('작가 로그인 응답:', response.data);
        
        if (response.data.success&& response.data.data) {
          localStorage.setItem('token', response.data.data.token);
          return {
            ...response.data,
            data: {
              ...response.data.data,
              isAuthor: true 
            }
          };
        }
        
        return response.data;
      } catch (authorError) {
        if (axios.isAxiosError(authorError) && authorError.response) {
          return authorError.response.data;
        }
        throw authorError;
      }
    }
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
};
// 작가 로그인 API 호출
// export const loginAuthor = async (authorId: string, authorPwd: string): Promise<LoginResponse> => {
//   try {
//     const response = await apiClient.post<LoginResponse>('/api/author/login', { authorId, authorPwd });
//     return response.data;
//   } catch (error) {
//     console.error('작가 로그인 오류:', error);
//     if (axios.isAxiosError(error) && error.response) {
//       return error.response.data;
//     }
//     throw error;
//   }
// };
export const loginAuthor = async (authorId: string, authorPwd: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/api/author/login', { authorId, authorPwd });
    console.log('작가 로그인 API 응답:', response.data);

    if (response.data.success && response.data.data) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('작가 로그인 API 오류:', error);
    throw error;
  }
};

// 프로필 이미지 업로드  API 호출
export const uploadProfileImage = async (imageFile: File): Promise<string> => {
  try {
    const token = localStorage.getItem('token'); 
    if (!token) {
      alert('Please log in again.');
      window.location.href = '/login'; 
      throw new Error('No token found');
       
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    console.log('이미지 업로드 중..');

    const response = await apiClient.post<{ imageUrl: string }>('/api/users/profile/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}` 
      }
    });

    console.log('API응답:', response.data);

    const imageUrl = response.data.imageUrl;
    console.log('이미지 업로드 완료:', imageUrl);

    return response.data.imageUrl; 
  } catch (error) {
    console.error('프로필 이미지 업로드 오류:', error);

    if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
      // 인증 오류 처리 추가
      alert('인증이 만료되었습니다. 다시 로그인해주세요.');
      window.location.href = '/login'; 
    }

    throw error;
  }
};

// 현재 로그인한 사용자의 프로필 정보 가져오기
export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  try {
    const token = localStorage.getItem('token'); 
    if (!token) {
      alert("세션 만료.재로그인하세요");
      window.location.href= ' /login';
      throw new Error("No token found");
    }
    const response = await apiClient.get<UserProfile>('/api/users/profile/current', {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    });
    console.log("Fetched User Profile: ", response.data);
    return response.data;
  } catch (error) {
    console.error('사용자 프로필 정보 가져오기 오류:', error);
    throw error;
  }
};

// 아이디 중복 체크 API 호출
export const checkDuplicateUserId = async (userId: string): Promise<boolean> => {
  try {
    const response = await apiClient.post<{ isDuplicate: boolean }>('http://localhost:8080/api/users/check-duplicate', { userId });
    return response.data.isDuplicate;
  } catch (error) {
    console.error('아이디 중복 체크 오류:', error);
    throw error;
  }
};

// 닉네임 중복 체크 API 호출
export const checkDuplicateUserName = async (userName: string): Promise<boolean> => {
  try {
    const response = await apiClient.post<{ isDuplicate: boolean }>('http://localhost:8080/api/users/check-name-duplicate', { userName });
    return response.data.isDuplicate;
  } catch (error) {
    console.error('닉네임 중복 체크 오류:', error);
    throw error;
  }
};

// 일반 회원가입 API 호출
export const registerUser = async (userData: RegisterUserData): Promise<any> => {
  try {
    const response = await apiClient.post('/api/users/register', userData);
    return response.data;
  } catch (error) {
    console.error('회원가입 오류:', error);
    throw error;
  }
};

// 작가 회원가입 API 호출
export const registerAuthor = async (authorData: RegisterAuthorData): Promise<any> => {
  try {
    const response = await apiClient.post('/api/author/create', authorData);
    return response.data;
  } catch (error) {
    console.error('작가 회원가입 오류:', error);
    throw error;
  }
};

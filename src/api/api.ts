import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://jungdowoo.store',
    headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
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


export const login = async (userId: string, userPwd: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/api/users/login', { userId, userPwd });


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

export const loginAuthor = async (authorId: string, authorPwd: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/api/author/login', { authorId, authorPwd });

    if (response.data.success && response.data.data) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};


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

    const response = await apiClient.post<{ imageUrl: string }>('/api/users/profile/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    const imageUrl = response.data.imageUrl;

    return response.data.imageUrl;
  } catch (error) {


    if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
      alert('인증이 만료되었습니다. 다시 로그인해주세요.');
      window.location.href = '/login';
    }

    throw error;
  }
};


export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("세션이 만료되었습니다.");
      window.location.href= ' /login';
      throw new Error("No token found");
    }
    const response = await apiClient.get<UserProfile>('/api/users/profile/current', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkDuplicateUserId = async (userId: string): Promise<boolean> => {
  try {
    const response = await apiClient.post<{ isDuplicate: boolean }>('/api/users/check-duplicate', { userId });
    return response.data.isDuplicate;
  } catch (error) {
    throw error;
  }
};

export const checkDuplicateUserName = async (userName: string): Promise<boolean> => {
  try {
    const response = await apiClient.post<{ isDuplicate: boolean }>('/api/users/check-name-duplicate', { userName });
    return response.data.isDuplicate;
  } catch (error) {
    throw error;
  }
};


export const registerUser = async (userData: RegisterUserData): Promise<any> => {
  try {
    const response = await apiClient.post('/api/users/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerAuthor = async (authorData: RegisterAuthorData): Promise<any> => {
  try {
    const response = await apiClient.post('/api/author/create', authorData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

import React, { FC, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Home from './pages/Home';
import Signup from './pages/signup';
import Login from './pages/login';
import MyPage from './pages/mypage';
import Header from './components/header';
import BoardList from './routes/BoardList';
import BoardForm from './routes/BoardForm';
import BoardDetail from './routes/BoardDetail';
import ProfileEdit from './pages/profile-edit';
import { Post } from './types';
import CategoryPage from './pages/category';
import ArtworkForm from './pages/artworkform';
import ArtworkDetail from './pages/artworkDetail';
import SearchResults from './pages/searchResult';
import './css/App.css';
import './css/common.css';

const App: FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);

 
  const handleLogin = (userData: { userId: string, userName: string, token:string, isAuthor?: boolean }) => {
    console.log('App.tsx - handleLogin 호출됨:', userData);

    localStorage.setItem('jwtToken', userData.token);
    localStorage.setItem('userId', userData.userId);
    localStorage.setItem('userName',userData.userName);
    localStorage.setItem('isAuthor', String(userData.isAuthor || false));
    
    setUserId(userData.userId);
    setUserName(userData.userName);
    setIsLoggedIn(true);

    if (userData.isAuthor) {
      setIsAuthor(true);
      console.log('작가 로그인성공!!!:', true);
    } else {
      setIsAuthor(false);
    }
    console.log('현재 isAuthor 상태:', isAuthor);
  };

  const logout = () => {
    console.log('로그아웃 함수 호출');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('isAuthor');
    setIsLoggedIn(false);
    setUserId('');
    setUserName('');
    setIsAuthor(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const storedIsAuthor = localStorage.getItem('isAuthor') === 'true'; 

    if (token) {
      setIsLoggedIn(true);
      setIsAuthor(storedIsAuthor);
    }
  }, []);

  useEffect(() => {
    console.log('현재 로그인 상태 (isLoggedIn):', isLoggedIn);
    console.log('현재 작가 여부 상태 (isAuthor):', isAuthor);
  }, [isLoggedIn, isAuthor]);


  const addPost = (post: Post) => {
    setPosts([...posts, { ...post, id: posts.length + 1 }]);
  };

  return (
    <AuthProvider>
    <Router>
      <Header isLoggedIn={isLoggedIn} isAuthor={isAuthor} logout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/boardlist" element={<BoardList posts={posts} />} />
        <Route path="/boardform" element={isLoggedIn ? <BoardForm addPost={addPost} /> : <Navigate to="/login" />} />
        <Route path="/board/:id" element={<BoardDetail />} />
        <Route path="/mypage" element={isLoggedIn ? <MyPage userId={userId} userName={userName} /> : <Navigate to="/login" />} />
        <Route path="/profile-edit" element={isLoggedIn ? <ProfileEdit userId={userId} userName={userName}/> : <Navigate to="/login" />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/artworkform" element={<ArtworkForm />} />
        <Route path="/artworkDetail/:id" element={<ArtworkDetail />} />
        <Route path="/search" element={<SearchResults />}/>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Post } from '../types';

const SearchResults: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`/api/posts/search?query=${query}`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  return (
    <div>
        <h2>검색 결과</h2>
        {posts.length > 0 ? (
        <ul>
        {posts.map((post) => (
            <li key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <Link to={`/post/${post.id}`}>게시물 보기</Link>
            </li>
        ))}
        </ul>
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default SearchResults;

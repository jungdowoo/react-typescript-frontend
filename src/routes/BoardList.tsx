import React, { useEffect, useState, ChangeEvent, KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Banner from '../banner';
import '../css/board.css';
import { Post } from '../types'; 


const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
};

interface BoardListProps {
    posts: Post[];
}

const BoardList: React.FC<BoardListProps> = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const postsPerPage = 10;
    const pagesPerBatch = 5;
    const navigate = useNavigate();
    const [category, setCategory] = useState<string>('');
    const [subCategory, setSubCategory] =useState<string>('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/posts');

                if(!response.ok){
                    throw new Error('Failed to fetch posts');
                }

                const data = await response.json();
                console.log("Fetched posts:", data);

                const formattedData = data.map((post: Post) => ({
                    ...post,
                    dueDate: formatDate(post.dueDate),
                    deadline: formatDate(post.deadline),
                }));

                setPosts(formattedData);
                setFilteredPosts(formattedData);
                console.log(formattedData);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);

     // 검색어가 비어 있을 때 전체 목록을 보여주기 위한 useEffect 추가
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredPosts(posts);  // 검색어가 없으면 전체 포스트 목록을 보여줌
        }
    }, [searchTerm, posts]);


    const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'bcate') {
            setCategory(value);
        } else if (name === 'bcate2') {
            setSubCategory(value);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const handleSearch = () => {
        const trimmedSearchTerm = searchTerm.trim().toLowerCase();


        const filtered = posts.filter(post =>
            (post.title && post.title.toLowerCase().includes(trimmedSearchTerm)) ||
            (post.userId && post.userId.toLowerCase().includes(trimmedSearchTerm)) ||
            (post.content && post.content.toLowerCase().includes(trimmedSearchTerm))
        );
        setFilteredPosts(filtered);
        setCurrentPage(1);
    };
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const handleWriteButtonClick = () => {
        navigate('/boardform');
    };

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const startPage = Math.floor((currentPage - 1) / pagesPerBatch) * pagesPerBatch + 1;
    const endPage = Math.min(startPage + pagesPerBatch - 1, totalPages);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button 
                    key={i}
                    onClick={() => paginate(i)}
                    className={`btn-page ${i === currentPage ? 'active' : ''}`}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };

    return (
        <>
            <Banner title="게시판 목록" description="원하는 글을 검색하거나 작성하세요!"/>
            <div className="board_container">
                <form name="searchForm" method="post" onSubmit={(e) => e.preventDefault()}>
                    <div className="board_ul">
                        <ul>
                            <li>
                                <select name="bcate" onChange={handleCategoryChange}>
                                    <option value="">카테고리</option>
                                    <option value="일러스트">일러스트</option>
                                    <option value="버츄얼·방송">버츄얼·방송</option>
                                    <option value="영상·음향">영상·음향</option>
                                    <option value="웹툰">웹툰</option>
                                    <option value="소설·표지">소설·표지</option>
                                </select>
                            </li>
                            <li>
                                <select name="bcate2" onChange={handleCategoryChange}>
                                    <option value="">머리글</option>
                                    <option value="방송용">방송용</option>
                                    <option value="상업용">상업용</option>
                                    <option value="비상업용">비상업용</option>
                                    <option value="협업">협업</option>
                                    <option value="기타">기타</option>
                                </select>
                            </li>
                            <ul>
                            <input
                                className="searchFrm"
                                type="text"
                                name="word"
                                placeholder='작성자,제목'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </ul>
                        </ul>
                        <button type="button" className="btn-search" onClick={handleSearch}>검색</button>
                    </div>
                </form>
                <div className="board_content">
                    <table className="bd_table">
                        <thead>
                            <tr>
                                <th>접수중</th>
                                <th>카테고리</th>
                                <th>제목</th>
                                <th>작성자</th>
                                <th>완료기한</th>
                                <th>접수마감</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPosts.map(post => (
                                <tr key={post.id}>
                                    <td>접수중</td>
                                    <td>{post.category}</td>
                                    <td><Link to={`/board/${post.id}`}>{post.title}</Link></td>
                                    <td>{post.userId}</td>
                                    <td>{post.dueDate}</td>
                                    <td>{post.deadline}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        {startPage > 1 && (
                            <button onClick={() => setCurrentPage(startPage - 1)}>...</button>
                        )}
                        {renderPageNumbers()}
                        {endPage < totalPages && (
                            <button onClick={() => setCurrentPage(endPage + 1)}>...</button>
                        )}
                    </div>
                    <div className="write_button">
                        <button className="btn btn-write" onClick={handleWriteButtonClick}>글쓰기</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BoardList;

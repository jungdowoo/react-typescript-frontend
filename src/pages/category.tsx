import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../css/category.css';
import Banner from '../banner';
import Footer from '../components/footer';

const CategoryPage: React.FC = () => {
    const { categoryName } = useParams<{ categoryName: string }>();
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>(''); 
    const [artworks, setArtworks] = useState<any[]>([]);
    const [imagePreview, setImagePreview] =useState<string[]>([]);
    const [isLoggedIn, setIsLoggedIn ] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    const categoryMap: { [key: string]: string } = {
        "illustration": "캐릭터일러스트",
        "virtual-broadcast": "버츄얼, 인터넷 방송",
        "video-sound": "video-sound,영상 음향",
        "webtoon": "webtoon,웹툰 만화",
        "novel-cover": "novel-cover,소설 기타 표지"
    };
    
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('query');
        if (query) {
          setSearchTerm(query.toLowerCase());
        }
      }, [location.search]);



    // 작품 목록을 가져오는 함수
    const fetchArtworks = async () => {
        try {
            
             // categoryName이 undefined일 경우를 대비해 빈 문자열을 기본값으로 사용
            const mappedCategory = categoryMap[categoryName || ''] || categoryName; 
            if (!mappedCategory) {
                console.error('Invalid category name');
                return;
            }
            console.log(`Fetching artworks for category: ${mappedCategory}`);
            
            // JWT 토큰을 optional하게 설정
            const token = localStorage.getItem('jwtToken');

            const headers: { [key: string]: string } = {
                'Content-Type' : 'application/json',
            };
            // 토큰이 있을 때만 Authorization 헤더 추가
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(`/api/artworks?category=${mappedCategory}`, {
                method: 'GET',
                headers: headers,
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            // 응답 바디를 텍스트 형식으로 출력하여 디버깅
            const responseBody = await response.text();
            console.log('Response body:', responseBody);

            if (response.headers.get('content-type')?.includes('application/json')) {
                const data = JSON.parse(responseBody);
                console.log('Fetched Artworks Data:', data);
                setArtworks(data); 
            } else {
                console.error('Received non-JSON response');
            }
        } catch (error) {
            console.error('ERROR fetching artworks:', error);
        }
    };
    // 로그인 상태 확인 함수
    const checkLoginStatus = () => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            setIsLoggedIn(true);  // 토큰이 있으면 로그인 상태로 설정
        } else {
            setIsLoggedIn(false);  // 토큰이 없으면 로그아웃 상태로 설정
        }
    };

    useEffect(() => {
        if (categoryName) { 
            fetchArtworks();
        }
        checkLoginStatus();  
    }, [categoryName]);
 // 필터링된 데이터 디버깅
 useEffect(() => {
    console.log('Filtered Artworks:', artworks);
}, [artworks]);

    // 카테고리 이름이 변경될 때마다 작품 목록을 새로 불러옴
    useEffect(() => {
        if (categoryName) { 
            fetchArtworks();
        }
    }, [categoryName]);

    // artwork 데이터 확인
    useEffect(() => {
        console.log(artworks);
    },[artworks]);

    // 이미지 미리보기 렌더링 함수
    const renderImagePreview = (images: string[]) => {
        return (
            <div className="image-preview">
                {images.slice(0, 3).map((image, index) => (
                    <img key={index} src={image} alt="작품 미리보기" className="preview-image" />
                ))}
            </div>
        );
    };
    
    useEffect(() => {
        console.log('Image previews updated:', imagePreview);  // 이미지 미리보기 배열 확인
    }, [imagePreview]);


    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
    };

    // 검색어 필터링 함수
    const handleSearch = () => {
        return artworks.filter((artwork) => 
            artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            artwork.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };
     

    const handleRegisterClick = () => {
        navigate('/artworkform');
    };
    // 작품들 필터링
    const filteredArtworks = artworks.filter((artwork) =>
        searchTerm === '' ||
        artwork.title?.toLowerCase().includes(searchTerm) ||
        artwork.content?.toLowerCase().includes(searchTerm)
    );

    // 공통된 UI를 렌더링하는 함수 
    // const renderCommonCategoryContent = (title: string) => {
    //     const items = [
    //         { src: "../images/categoryimg/catemain1.png", alt: "일러스트 1" },
    //         { src: "../images/categoryimg/catemain2.png", alt: "일러스트 2" },
    //         { src: "../images/categoryimg/catemain3.png", alt: "일러스트 3" },
    //         { src: "../images/categoryimg/catemain4.png", alt: "일러스트 4" }
    //     ];
        

    //     const allItems = [
    //         ...items,
    //         ...artworks.map(artwork => ({
    //             src: artwork.imagePath,
    //             alt: artwork.title
    //         }))
    //     ];
        
    //     const filteredItems = items.filter(item =>
    //         item.alt.toLowerCase().includes(searchTerm)
    //     );

    //     return (
    //         <>
    //             <h2 className="cate-h2">{title}</h2>
    //             <div className="category-grid">
    //                 {filteredItems.map((item, index) =>(
    //                     <div key={index} className="category-item">
    //                         <img src={item.src} alt={item.alt} className="artwork-image"/>
    //                         <div className="artwork-info">
    //                             <h3>{item.alt}</h3>
    //                         </div>
    //                     </div>
    //                 ))}
    //             </div>
    //         </>
    //     );
    // };
    const renderCommonCategoryContent = (title: string) => {
        return (
            <>
                <h2 className="cate-h2">{title}</h2>
                <div className="category-grid">
                    {filteredArtworks.map((artwork, index) => (
                        <div key={index} className="category-item">
                            {artwork.artworkId ? (
                                <Link to={`/artworkDetail/${artwork.artworkId}`}>
                                    <div className="artwork-card">
                                        {/* 이미지 미리보기 추가 */}
                                        <div className="artwork-image-wrapper">
                                        {artwork.imagePaths ? (
                                            <div className="image-preview">
                                                {console.log(artwork.imagePaths)}
                                                {artwork.imagePaths
                                                    .split(',')
                                                    .slice(0, 3) // 최대 3개의 이미지 미리보기
                                                    .map((imagePath: string, idx: number) => (
                                                        <img
                                                            key={idx}
                                                            src={`/uploads/${imagePath.trim()}`}
                                                            alt="작품 미리보기"
                                                            className="preview-image"
                                                        />
                                                    ))}
                                            </div>
                                        ) : (
                                            <div className="no-image">이미지 없음</div>
                                        )}
                                    </div>
                                        
                                        {/* 작가 이름 및 소개 */}
                                        <div className="artwork-info">
                                        <div className="author-description">
                                            <span>{artwork.authorName ? `${artwork.authorName} 작가` : '작가 이름'} /</span>
                                            <span className="description">{artwork.title || '제목없음'}</span>
                                        </div>
                                         {/* 별점 및 카테고리 */}
                                        <div className="rating-and-category">
                                            <span className="rating">⭐⭐⭐⭐⭐{artwork.rating }</span>
                                            <span className="category">{artwork.category}</span>
                                        </div>
                                            {/* 가격 */}
                                        <div className="price">
                                            {artwork.price?.toLocaleString() || '가격 정보 없음'}원~
                                        </div>
                                    </div>
                                    </div>
                                {/* 태그 표시 부분 추가 */}
                                <div className="artwork-tags">
                                    {Array.isArray(artwork.tags) && artwork.tags.map((tag: string, idx: number) => (
                                        <span key={idx} className="tag">{tag}</span>
                                    ))}
                                </div>
                            </Link>
                            ) : (
                                <p>Invalid artwork: Missing ID</p>
                            )}
                        </div>
                    ))}
                </div>
                {/* 여기에서 미리보기 이미지를 렌더링 */}
                {imagePreview.length > 0 && (
                    <div className="preview-container">
                        <h4>미리보기</h4>
                        {renderImagePreview(imagePreview)}
                    </div>
                )}
            </>
        );
    };


    // 카테고리별 데이터를 보여주는 함수
    const renderCategoryContent = () => {
        switch (categoryName) {
            case 'illustration':
                return renderCommonCategoryContent('캐릭터 일러스트');
            case 'virtual-broadcast':
                return renderCommonCategoryContent('버츄얼·인터넷 방송');
            case 'video-sound':
                return renderCommonCategoryContent('영상 · 음향');
            case 'webtoon':
                return renderCommonCategoryContent('웹툰 · 만화');
            case 'novel-cover':
                return renderCommonCategoryContent('소설 · 기타 표지');
            default:
                return <h2>존재하지 않는 카테고리입니다.</h2>;
        }
    };

    return (
        <div className="category-page">
            <Banner title="작품 리스트" description="커미션은 상업적인 용도로 사용이 불가능합니다." showCategoryNav={true}/>
            <div className="catecontainer">
            {/* 카테고리별 컨텐츠 */}
            <div className="category-content">
                {renderCategoryContent()}
            </div>

            {/*검색창 추가*/ }
            {/* <div className="search-bar">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="검색어를 입력하세요..."
                    className="search-input"
                />
                <button className="search-button">검색</button>
            </div> */}
            {/*해쉬태그 박스*/ }
            {/* <div className="hashtag-container">
                    <span>#SD</span> <span>#LD</span> <span>#방송용</span>
                    <span>#캐릭터디자인</span> <span>#일러스트</span> 
                    
            </div> */}
            {/* 작가 등록 버튼 */ }
            {isLoggedIn && (
                <div className="action-buttons">
                <button className="register-button" onClick={handleRegisterClick}>작품 등록</button>
            </div>
            )}
           
        </div>
        <Footer />
        </div>
        
    );
};

export default CategoryPage;


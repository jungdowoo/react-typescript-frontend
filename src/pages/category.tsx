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

    const fetchArtworks = async () => {
        try {
            const mappedCategory = categoryMap[categoryName || ''] || categoryName; 
            if (!mappedCategory) {
                console.error('Invalid category name');
                return;
            }
            console.log(`Fetching artworks for category: ${mappedCategory}`);
            
            
            const token = localStorage.getItem('jwtToken');

            const headers: { [key: string]: string } = {
                'Content-Type' : 'application/json',
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(`/api/artworks?category=${mappedCategory}`, {
                method: 'GET',
                headers: headers,
            });
            
            const responseBody = await response.text();
            console.log('Response body:', responseBody);

            if (response.headers.get('content-type')?.includes('application/json')) {
                const data = JSON.parse(responseBody);
                setArtworks(data); 
            } else {
                console.error('Received non-JSON response');
            }
        } catch (error) {
            console.error('ERROR fetching artworks:', error);
        }
    };
    
    const checkLoginStatus = () => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            setIsLoggedIn(true);  
        } else {
            setIsLoggedIn(false); 
        }
    };

    useEffect(() => {
        if (categoryName) { 
            fetchArtworks();
        }
        checkLoginStatus();  
    }, [categoryName]);
 
 useEffect(() => {
    console.log('Filtered Artworks:', artworks);
}, [artworks]);

    
    useEffect(() => {
        if (categoryName) { 
            fetchArtworks();
        }
    }, [categoryName]);

    
    useEffect(() => {
        console.log(artworks);
    },[artworks]);
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
        console.log('Image previews updated:', imagePreview);
    }, [imagePreview]);


    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
    };

    
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
    const filteredArtworks = artworks.filter((artwork) =>
        searchTerm === '' ||
        artwork.title?.toLowerCase().includes(searchTerm) ||
        artwork.content?.toLowerCase().includes(searchTerm)
    );

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
                                        <div className="artwork-image-wrapper">
                                        {artwork.imagePaths ? (
                                            <div className="image-preview">
                                                {console.log(artwork.imagePaths)}
                                                {artwork.imagePaths
                                                    .split(',')
                                                    .slice(0, 3) 
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
                                        
                                        <div className="artwork-info">
                                        <div className="author-description">
                                            <span>{artwork.authorName ? `${artwork.authorName} 작가` : '작가 이름'} /</span>
                                            <span className="description">{artwork.title || '제목없음'}</span>
                                        </div>
                                        <div className="rating-and-category">
                                            <span className="rating">⭐⭐⭐⭐⭐{artwork.rating }</span>
                                            <span className="category">{artwork.category}</span>
                                        </div>
                                        <div className="price">
                                            {artwork.price?.toLocaleString() || '가격 정보 없음'}원~
                                        </div>
                                    </div>
                                    </div>
                                
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
                
                {imagePreview.length > 0 && (
                    <div className="preview-container">
                        <h4>미리보기</h4>
                        {renderImagePreview(imagePreview)}
                    </div>
                )}
            </>
        );
    };
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
            <div className="category-content">
                {renderCategoryContent()}
            </div>
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


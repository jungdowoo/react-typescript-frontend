
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Footer from '../components/footer';
import rehypeRaw from 'rehype-raw';
import '../css/artwork.css';

const ArtworkDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    const [artwork, setArtwork] = useState<any>(null);

    // 선택된 글의 정보를 가져오는 함수
    const fetchArtworkDetail = async () => {
        try {
            const response = await fetch(`/api/artworks/${id}`);  
            const data = await response.json();
            console.log('Artwork data:', data);
            setArtwork(data);
        } catch (error) {
            console.error('Error fetching artwork details:', error);
        }
    };


    useEffect(() => {
        if(!id) {
            console.error("No ID Provided");
            return;
        }
        fetchArtworkDetail(); 
    }, [id]);

    if (!artwork) {
        return <div>Loading...</div>;
    }

    // price가 없을때 
    const displayPrice = typeof artwork.price === 'number' ? artwork.price.toLocaleString() : '가격 정보 없음';

    return (
        <div className="artwork-detail-container">
            {/* 상단 카테고리, 제목표시*/} 
            <div className="artwork-header">
                <div className="artwork-category">
                    {artwork.category} / {artwork.subCategory}
                </div>
                <h1 className="artwork-title">{artwork.title}</h1>
            </div>
            {/*메인 콘텐츠 영역*/ }
            <div className="artwork-content">
                {/*왼쪽에 이미지*/ }
                <div className="artwork-image-container">
                {artwork.imagePaths && artwork.imagePaths.split(',').map((imagePath: string, index: number) => (
                    <img 
                        key={index}
                        src={`http://localhost:8080/uploads/${imagePath.trim()}`} 
                        alt={`이미지 ${index + 1}`}
                        className="artwork-image" 
                    />
                ))}
                </div>

                 {/* 추가된 description 표시 영역 */}
                <div className="artwork-description">
                    <h2>작품 설명</h2>
                    {/* <p>{artwork.content || '설명이 없습니다.'}</p> */}
                    {/* 마크다운을 HTML로 렌더링하고, HTML도 처리하도록 rehypeRaw 추가 */}
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                        {artwork.content}
                    </ReactMarkdown>
          
                </div>

                {/* 프로필 박스 */}
                <div className="artlist-profile">
                    <div className="artist-profile-image">
                        <img src="/images/banner4.png" alt="프로필 이미지" />
                    </div>
                    <div className="artist-name">
                        {artwork.authorName ? `${artwork.authorName} 작가님` : '작가'}
                    </div>
                    <div className="artist-introduction">
                        {artwork.authorDescription || '작가님의 소개가 없습니다.'}  {/* 소개가 있을 때 표시 */}
                    </div>
                    <div className="artist-description">
                    <p><img src="/images/icon_star.gif" style={{ width: '80px', overflow: 'hidden' }} alt="star icon" /> 평점: 5.0 </p>
                        <p>문의 답변율: 100%</p>
                        <p>패널티: 0회</p>
                        <p>가격: {displayPrice}원</p>
                    </div>
                    <div className="contact-info">
                        <p>연락처: 결제 후에 확인 가능합니다.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
        
        
    );
    
};

export default ArtworkDetail;

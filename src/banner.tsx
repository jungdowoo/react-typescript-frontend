import React from 'react';
import { Link, useLocation } from 'react-router-dom';



interface BannerProps {
    title: string;
    description: string;
    showCategoryNav?: boolean;
}

const Banner: React.FC<BannerProps> = ({ title, description, showCategoryNav }) => {
    const currentLocation = useLocation();
    return (
        <div className="banner">
            <h1>{title}</h1>
            <p>{description}</p>

            {showCategoryNav && ( 
                <nav className="category-nav">
                <ul>
                        <li className={currentLocation.pathname === '/category/illustration' ? 'active' : ''}>
                            <Link to="/category/illustration">캐릭터 일러스트</Link>
                        </li>
                        <li className={currentLocation.pathname === '/category/virtual-broadcast' ? 'active' : ''}>
                            <Link to="/category/virtual-broadcast">버츄얼·인터넷방송</Link>
                        </li>
                        <li className={currentLocation.pathname === '/category/video-sound' ? 'active' : ''}>
                            <Link to="/category/video-sound">영상·음향</Link>
                        </li>
                        <li className={currentLocation.pathname === '/category/webtoon' ? 'active' : ''}>
                            <Link to="/category/webtoon">웹툰 · 만화</Link>
                        </li>
                        <li className={currentLocation.pathname === '/category/novel-cover' ? 'active' : ''}>
                            <Link to="/category/novel-cover">소설 · 기타</Link>
                    </li>
                </ul>
            </nav>
        )}
    </div>
    );
};

export default Banner;

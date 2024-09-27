import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/board.css';
import Banner from '../banner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


interface BoardFormProps {
    addPost: (post: any) => void;
}

const BoardForm: React.FC<BoardFormProps> = ({ addPost }) => {
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [isCautionChecked, setIsCautionChecked] = useState<boolean>(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [budget, setBudget] = useState<string>('');
    const [closingDate, setClosingDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [category, setCategory] = useState<string>('');
    const [subCategory, setSubCategory] = useState<string>('');

    const formatDate = (date: Date | null) => {
        if (!date) return '';
        const year = date.getFullYear().toString().slice(-2);
        const month = ('0' + (date.getMonth() +1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }


    const navigate = useNavigate();

    const getUserIdFromToken = (): string | null => {
        const token = localStorage.getItem('token');
        if (!token)return null;

        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        try {
            const decodedData = JSON.parse(window.atob(base64));
            return decodedData.sub; 
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };
    const userId = getUserIdFromToken();
    console.log("Extracted userId from token:", userId);


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!userId) {
            console.error("User Id could not be extracted from the token.");
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('dueDate', formatDate(endDate));
        formData.append('deadline', formatDate(closingDate));
        formData.append('userId', userId || '');
        formData.append('category', category);
        formData.append('subCategory', subCategory);

        if (file) {
            formData.append('file', file);
        }

        try {
            const response = await fetch('http://adsf3323.cafe24.com/api/posts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const data = await response.json();
            addPost(data);
            navigate('/boardlist');
        } catch (error: any) {
            console.error('Error creating post:', error.message);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleCautionCheck = () => {
        setIsCautionChecked(!isCautionChecked);
    };

    return (
        <div>
            <Banner title="의뢰 게시판" description="원하시는 작품을 편하고 빠르게 의뢰하세요!"/>
        <div className="board-form-container">
            
            <div className="guide_box">
                <p className="guide_title">의뢰 방법</p>
                <ul className="guide_list">
                    <li><span>01.</span> 의뢰 글 작성</li>
                    <li><span>02.</span> 글의 댓글로 달린 링크 중에서 마음에 드는 작가에게 문의</li><br></br>
                    <li><span>03.</span> 협의된 금액으로 아트머그에서 주문 및 결제</li>
                    <li><span>04.</span> 작성글 접수 마감</li>
                </ul>
            </div>
            <form onSubmit={handleSubmit} className="board-form">
                <div className="row cf">
                    <ul className="item1">카테고리</ul>
                    <ul>
                        <select
                            name="cate"
                            style={{ width: '172px' }}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            >
                            <option value="">카테고리</option>
                            <option value="일러스트">일러스트</option>
                            <option value="버츄얼·방송">버츄얼·방송</option>
                            <option value="영상·음향">영상·음향</option>
                            <option value="웹툰">웹툰</option>
                            <option value="소설·표지">소설·표지</option>
                        </select>
                        <select
                            name="cate2"
                            style={{ width: '172px' }}
                            value={subCategory}
                            onChange={(e) => setSubCategory(e.target.value)}
                            
                            >
                            <option value="">머리글</option>
                            <option value="방송용">방송용</option>
                            <option value="상업용">상업용</option>
                            <option value="비상업용">비상업용</option>
                            <option value="협업">협업</option>
                            <option value="기타">기타</option>
                        </select>
                    </ul>
                </div>
                <div className='row cf'>
                    <ul className='item1'>제목</ul>
                    <ul>
                        <input
                            type="text"
                            name="title"
                            style={{ width: '530px' }}
                            className='input_search'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </ul>
                </div>
                <div className="row cf">
                    <ul className="item1">내용</ul>
                    <div style={{ flex: 1}}>
                        <li id="caution" style={{ display: isCautionChecked ? 'none' : 'block' , marginBottom: '10px'}}>
                        <p className="caution-title">등록 전 주의사항</p>
                            <div className="caution-list">
                                <p>- 사용 용도를 꼭 입력 바랍니다.</p>
                                <p>- 직거래가 금지되어있으며, 연락처는 결제 이후에만 교환 가능합니다.</p>
                                <p>- 개인 연락이 가능한 연락처, SNS, 사이트 주소 등을 기입할 수 없습니다.</p>
                            </div>
                            <input
                                type="checkbox"
                                id="check"
                                onChange={handleCautionCheck}
                            />
                            <label htmlFor="check" className="bold">내용을 확인했습니다.</label>
                            
                        </li>
                    </div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="bd_text"
                        required
                    />
                </div>
                <div className="row cf">
                    <ul className="item1">파일 업로드</ul>
                    <ul>
                        <input type="file" onChange={handleFileChange} />
                        {imagePreview && <img src={imagePreview} alt="미리보기" style={{ width: '200px', marginTop: '10px' }} />}
                    </ul>
                </div>
                <div className="row cf">
                    <ul className="item1">예산</ul>
                    <ul>
                        <input
                            type="text"
                            name="budget"
                            className="input_search"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            />
                        <p style={{ color: 'red', marginTop: '5px' }}>
                        * 예산이 지나치게 낮은 경우 공개가 제한될 수 있습니다.
                        </p>
                    </ul>
                </div>
                <div className="row cf">
                    <ul className="item1">작업 마감일</ul>
                    <ul>
                    <DatePicker
                        selected={endDate}
                        onChange={(date: Date | null) => setEndDate(date)} 
                        dateFormat="yy-MM-dd"
                        className="input_search"
                        showTimeSelect={false}
                    />
                        <p style={{ marginTop: '5px' }}>
                         * 최종 작업을 완료 기한입니다.
                        </p>
                    </ul>
                </div>
                <div className="row cf">
                    <ul className="item1">접수 마감일</ul>
                    <ul>
                    <DatePicker
                        selected={closingDate} 
                        onChange={(date: Date | null) => setClosingDate(date)} 
                        dateFormat="yy-MM-dd"
                        className="input_search"
                        showTimeSelect={false}
                    />
                        <p style={{ marginTop: '5px' }}>
                            * 지원자 접수를 마감하는 기한입니다.
                        </p>
                    </ul>
                </div>
                <button
                    type="submit"
                    className="btn-login"
                    style={{
                        width:'200px',
                        height:'50px',
                        padding: '15px 30px',
                        display:'block',
                        marginLeft:'auto'
                    }}
                    >작성</button>
            </form>
            
        </div>
       
        </div>
    );
};

export default BoardForm;

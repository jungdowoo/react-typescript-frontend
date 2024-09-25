import React, { useState,useRef, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import Footer from '../components/footer';
import '../css/artwork.css';
import Banner from '../banner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ArtworkForm: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const editorRef = useRef<Editor>(null);
    const [description, setDescription] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [price, setPrice] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [subCategory, setSubCategory] = useState<string>('');
    const [deadline, setDeadline] = useState<Date | null>(null);
    const [completionDate, setCompletionDate] = useState<Date | null>(null);

    const navigate = useNavigate();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        console.log('Selected files:', selectedFiles);

        setFiles(selectedFiles);

        if (selectedFiles.length > 0) {
            const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file)); // 파일 미리보기 URL 생성
            setImagePreview(previewUrls);
        }
    };

    const categoryMap: { [key: string]: string } = {
        "캐릭터일러스트": "illustration",
        "버츄얼, 인터넷 방송": "virtual-broadcast",
        "영상 음향": "video-sound",
        "웹툰 만화": "webtoon",
        "소설 기타 표지": "novel-cover"
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // 에디터에서 작성한 내용을 가져옴
        const editorInstance = editorRef.current?.getInstance();
        const description = editorInstance?.getMarkdown();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', description || '');

        const mappedCategory = categoryMap[category] || "unknown-category"; 
        formData.append('category', mappedCategory);

        formData.append('category', category);
        formData.append('subCategory', subCategory);
        formData.append('price', String(parseFloat(price)));
        formData.append('deadline', deadline ? deadline.toISOString() : '');
        formData.append('completionDate', completionDate ? completionDate.toISOString() : '');

        files.forEach((file) => {
            formData.append('images', file);
            console.log('Uploading file:', file); 
        });

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('http://localhost:8080/api/artworks/artupload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const data = await response.json();
            console.log('Artwork created:', data);
            navigate(`/category/${mappedCategory}`);
            // if (category === '캐릭터 일러스트') {
            //     navigate('/category/illustration');
            // } else if (category === '3D버츄얼·인터넷 방송') {
            //     navigate('/category/virtual-broadcast');
            // } else if (category === '영상·음향') {
            //     navigate('/category/video-sound');
            // }  else if (category === '웹툰 ·만화') {
            //     navigate('/category/webtoon');
            // } else if (category === '소설·기타표지') {
            //     navigate('/category/novel-cover');
            // }
        } catch (error) {
            console.error('Error creating artwork:', error);
        }
    };

    return (
        <div>
            <Banner title="작품 등록" description="당신의 멋진 작품을 등록하세요!" />
            <div className="artwork-form-container">
                <form onSubmit={handleSubmit} className="artwork-form">
                    <div className="form-group">
                        <label htmlFor="title">제목</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">내용</label>
                        <Editor
                            initialValue="" 
                            previewStyle="vertical"
                            height="400px"
                            initialEditType="wysiwyg"
                            useCommandShortcut={true}
                            ref={editorRef} 
                            hooks={{
                                addImageBlobHook: async (blob, callback) => {
                                    console.log('Selected file in editor:', blob);

                                    // 이미지 업로드 로직
                                    const formData = new FormData();
                                    formData.append('file', blob);

                                    try {
                                        const token = localStorage.getItem('jwtToken');
                                        const response = await fetch('http://localhost:8080/api/artworks/uploadImage',{
                                            method: 'POST',
                                            headers: {
                                                'Authorization': `Bearer ${token}`,
                                            },
                                            body: formData,
                                        });

                                        if(!response.ok) {
                                            throw new Error('Image upload failed');
                                        }

                                        const data = await response.json();
                                        const imageUrl = data.url;

                                        callback(imageUrl, 'image');
                                        console.log('Uploaded Image URL: ', imageUrl);

                                        setImagePreview((prevPreviews) => [...prevPreviews, imageUrl]);
                                    } catch (error) {
                                        console.error('Image upload error:', error);
                                        console.log('Updated preview list:', imagePreview);
                                    }
                                }
                            }}
                        />
                    </div>

                        <div className="form-group">
                            <label htmlFor="fileUpload">파일 첨부</label>
                            <input 
                                type="file"
                                id="fileupload"
                                multiple
                                onChange={handleFileChange}
                                />
                        </div>
                    <div className="form-group">
                        <label htmlFor="category">카테고리</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">카테고리 선택</option>
                            <option value="캐릭터일러스트">캐릭터일러스트</option>
                            <option value="버츄얼, 인터넷 방송">3D버츄얼·인터넷 방송</option>
                            <option value="영상 음향">영상·음향</option>
                            <option value="웹툰 만화">웹툰·만화</option>
                            <option value="소설 기타 표지">소설·기타 표지</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="subCategory">서브 카테고리</label>
                        <select
                            id="subCategory"
                            value={subCategory}
                            onChange={(e) => setSubCategory(e.target.value)}
                            required
                        >
                            <option value="">서브 카테고리 선택</option>
                            <option value="commercial">상업용</option>
                            <option value="non-commercial">비상업용</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">가격</label>
                        <input
                            type="text"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>작업 마감일</label>
                        <DatePicker
                            selected={completionDate}
                            onChange={(date) => setCompletionDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className="date-picker"
                        />
                    </div>

                    <div className="form-group">
                        <label>접수 마감일</label>
                        <DatePicker
                            selected={deadline}
                            onChange={(date) => setDeadline(date)}
                            dateFormat="yyyy-MM-dd"
                            className="date-picker"
                        />
                    </div>

                    

                    <button type="submit" className="btn-submit">작품 등록</button>
                </form>
            </div>
        </div>
        
    );
    <Footer />
};

export default ArtworkForm;

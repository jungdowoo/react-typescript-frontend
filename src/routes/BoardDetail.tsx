import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Banner from '../banner';
import Footer from '../components/footer';


interface Post {
    id: number;
    title: string;
    content: string;
    category: string;
    type: string;
    dueDate: string;
    deadline: string;
    budget: string;
    userId: string;
    createdAt: string;
    fileName?: string;
}
interface Comment {
    id: number;
    postId: number;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
    profileImageUrl: string;
}

const BoardDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);

    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>('');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };


    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/posts/${id}`);
                if (response.ok) {
                    const data = await response.json();

                    const formattedPost = {
                        ...data,
                        dueDate: formatDate(data.dueDate),
                        deadline: formatDate(data.deadline),
                        createdAt: formatDate(data.createdAt),
                    };

                    setPost(formattedPost);
                } else {
                    setPost(null);
                }
            } catch (error) {
                console.error('Error fetching post:', error);
                setPost(null);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/posts/${id}/comments`);
                if (response.ok) {
                    const data = await response.json();
                    setComments(data);
                } else {
                    setComments([]);
                }
                } catch (error) {
                    console.error('Error fetching comments:', error);
                    setComments([]);
                }
        };

        fetchPost();
        fetchComments();
    }, [id]);

    const handleSubmitComment = async () => {
        if (newComment.trim() === '') return;

        const userName = localStorage.getItem('userName');
        const userId = localStorage.getItem('userId');
        const profileImageUrl = localStorage.getItem('profileImageUrl');

        const commentData = {
            postId:Number(id),
            userId: userId,
            userName: userName,
            profileImageUrl:profileImageUrl,
            content: newComment,
            createdAt: new Date().toISOString(),
        };
        try {
            const token = localStorage.getItem('jwtToken');
            console.log('JWT Token:', token);
            const response = await fetch(`http://localhost:8080/api/posts/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(commentData),
            });
            if(response.ok) {
                const savedComment = await response.json();
                setComments([...comments, savedComment]);
                setNewComment('');
            } else {
                console.error ('Failed to Post comment');
            }
        } catch(error) {
            console.error ('Error posting comment:', error);
        }
    };
    const handleEditPost = async () => {
        const updatedTitle = prompt('게시물 제목을 수정하세요:',post?.title);
        const updatedContent = prompt('게시물 내용을 수정하세요:', post?.content);

        if (updatedTitle !== null && updatedContent !== null) {
            const updatedPost = {
                ...post,
                title:updatedTitle,
                content: updatedContent,
            };
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await fetch (`http://localhost:8080/api/posts/${id}`,{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body:JSON.stringify(updatedPost),
                });
                if(response.ok) {
                    const savedPost = await response.json();
                    setPost(savedPost);
                } else {
                    throw new Error('Failed to update post');
                }
            } catch (error) {
                console.error('Error updating post:', error);
            }
        }
    };
    const handleDeletePost = async () => {
        if(window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await fetch(`http://localhost:8080/api/posts/${id}`,{
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    navigate('/');
                } else {
                    throw new Error('Failed to delete post');
                }
            } catch (error){
                console.error('Error deleting post:', error);
            }
        }
    };

    const handleEditComment = async (commentId: number) => {
        const updatedContent = prompt('댓글을 수정하세요:');
        if (updatedContent !== null) {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('jwtToken');

            try {
                const response = await fetch(`http://localhost:8080/api/posts/${id}/comments/${commentId}`,{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body:JSON.stringify({ content: updatedContent, userId}),
                });
                
                if (response.ok) {
                    const updatedComment = await response.json();
                    setComments(comments.map((comment) =>
                        comment.id === commentId ? updatedComment : comment
                    ));
                } else {
                    throw new Error('Failed to update comment');
                }
            } catch (error) {
                console.error('Error updating comment:', error);
            }
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('jwtToken');

        try{
            const response = await fetch(`http://localhost:8080/api/posts/${id}/comments/${commentId}`,{
                method : 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ userId }),
            });

            if(response.ok) {
                setComments(comments.filter((comment) => comment.id !== commentId));
            } else {
                throw new Error('Failed to delete comment');
            }
        } catch (error){
            console.error('Error deleting comment:', error);
        }
    };

    if (!post) {
        return <div>게시물을 찾을 수 없습니다.</div>;
    }

    return (
        <div>
            <Banner title="게시물 상세보기" description={`제목: ${post.title}`}/>
            <div className="post-container">
                <div className="post-header">
                    <span className="post-status">접수중</span>
                    <h1>{post.title}</h1>
                    <div className="post-meta">
                        <span className="post-category">{post.category}</span>
                        <span className="post-type">{post.type}</span>
                    </div>
                </div>
            <div className="post-details-row">
                <div className="post-info">
                    <p>작업 완료 기한: <span>{post.dueDate}</span></p>
                    <p>접수 마감일: <span>{post.deadline}</span></p>
                    <p>예산: <span>{post.budget}</span></p>
                    <span>작성자: {post.userId}</span>
                </div>
            </div>
                <div className="post-content">
                    <p>{post.content}</p>
                    {post.fileName && (
                        <img
                            src={`/uploads/${post.fileName}`}
                            alt="Attached file"
                            style={{ maxWidth:'100%', height:'auto'}}
                            />
                    )}
                </div>
                {post.userId === localStorage.getItem('userId') && (
                    <div className="post-action">
                        <button className="btn-cancel" onClick={handleEditPost}>게시글 수정</button>
                        <button className="btn-cancel" onClick={handleDeletePost}>게시글 삭제</button>
                    </div>
                )}
                <div className="comments-section">
                    <h2>댓글</h2>
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.id} className="comment">
                                <div className="comment-content">
                            
                                <p className="comment-user">
                                    {comment.profileImageUrl &&(
                                        <img
                                            src={comment.profileImageUrl}
                                            alt={`${comment.userName}프로필이미지`}
                                            className="profile-image"
                                            />
                                    )}
                                    <strong>{comment.userName}</strong> </p>
                                <p className="comment-text">{comment.content}</p>
                                <p className="comment-date">({formatDate(comment.createdAt)})</p>
                                {comment.userId === localStorage.getItem('userId') && (
                                    <div className="comment-actions">
                                        <button className="btn-cancel" onClick={() => handleEditComment(comment.id)}>수정</button>
                                        <button className="btn-cancel" onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        ))
                    ):(
                        <p> 댓글이 없습니다.</p>
                    )}
                </div>
                <div className="comment-form">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="댓글을 작성하세요"
                        
                    ></textarea>
                    <button className="btn-comment" onClick={handleSubmitComment}>댓글 달기</button>
                </div>
                    
            </div>
            <Footer />
        </div>
    );
};

export default BoardDetail;

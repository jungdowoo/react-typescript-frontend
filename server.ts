import express, { Request, Response } from 'express';
import cors from 'cors';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();
const port = 8080;

// CORS 미들웨어 설정
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const users: { userName: string, userId: string, userPwd: string, phoneNum: string, profileImage?: string, description?: string }[] = [];
const authors: { userName: string, userId: string, userPwd: string, phoneNum: string, authorBio: string }[] = [];
const posts: { id: number, title: string, content: string }[] = [
  { id: 1, title: '첫 번째 게시글', content: '첫번째 게시글입니다.' },
  { id: 2, title: '두 번째 게시글', content: '두번째 게시글' }
];

// 아이디 중복 체크 엔드포인트
app.post('/users/check-duplicate', (req: Request, res: Response) => {
  const { userId } = req.body;
  const isDuplicate = users.some(user => user.userId === userId);
  res.json({ isDuplicate });
});

// 닉네임 중복 체크 엔드포인트
app.post('/users/check-name-duplicate', (req: Request, res: Response) => {
  const { userName } = req.body;
  const isDuplicate = users.some(user => user.userName === userName);
  res.json({ isDuplicate });
});

// 작가 닉네임 중복 체크 엔드포인트
app.post('/authors/check-name-duplicate', (req: Request, res: Response) => {
  const { userName } = req.body;
  const isDuplicate = authors.some(author => author.userName === userName);
  res.json({ isDuplicate });
});

// 일반 회원가입 엔드포인트
app.post('/api/users/register', (req: Request, res: Response) => { 
  const { userName, userId, userPwd, phoneNum } = req.body;
  const newUser = { userName, userId, userPwd, phoneNum };
  users.push(newUser); 
  res.json({ success: true }); 
});

// 작가 회원가입 엔드포인트
app.post('/api/author/create', (req: Request, res: Response) => { 
  const { authorName, authorId, authorPwd, authorPhoneNum, authorBio } = req.body;
  authors.push({ userName: authorName, userId: authorId, userPwd: authorPwd, phoneNum: authorPhoneNum, authorBio: authorBio });
  res.json({ success: true });
});

// 로그인 엔드포인트 추가
/*app.post('/api/users/login', (req: Request, res: Response) => { 
  const { userId, userPwd } = req.body;
  const user = users.find(u => u.userId === userId && u.userPwd === userPwd); 
  if (user) {
    res.json({
      success: true, 
      data: {
        userId: user.userId,
        userName: user.userName
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});*/

// 사용자 프로필 정보 반환 엔드포인트 
app.get('/api/user/profile/current', (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const user = users.find(user => user.userId === userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// get/api/posts 엔드포인트
app.get('/api/posts', (req: Request, res: Response) => {
  res.json(posts);
});

// post /api/posts 엔드포인트 추가
app.post('/api/posts', (req: Request, res: Response) => {
  const { title, content } = req.body;
  const newPost = { id: posts.length + 1, title, content };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// 파일 업로드 설정 (기본 파일 경로 수정)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Images Only!'));
    }
  }
});

// 파일 업로드 엔드포인트 추가(게시판 파일업로드)
app.post('/api/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.status(200).json({ filename: req.file.filename });
});

// 예제 API 엔드포인트
app.get('/api/location', (req: Request, res: Response) => {
  res.json({ location: 'Seoul' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const express = require('express');
//express 내부에 http 모듈이 내장되어 있어 서버의 역할 가능
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const session = require('express-session');

dotenv.config();
const app = express();
app.set('port', process.env.PORT||3000); //서버가 실행될 포트를 설정, process.env에 PORT 속성이 있다면 그 값을, 없다면 기본값 3000번 사용

app.use(morgan('dev')); //인수로 dev 외에 combined, common, short, tiny를 넣을 수 있음
//GET / 500 11.599 ms - 49 
//http 메서드, 주소, http 상태 코드, 응답 속도, 응답 바이트 순

app.use('/', express.static(path.join(__dirname, 'public'))); 
//app.use('요청 경로', express.static('실제 경로'))
//static 미들웨어는 정적인 파일들을 제공하는 라우터 역할을 함

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));

//미들웨어는 use와 함께 사용
//app.use(미들웨어)
/*
app.use((req, res, next)=>{
    console.log('모든 요청에 다 실행됩니다.');
    next();
});
*/
//====================================

const multer = require('multer');
const fs = require('fs');

try{
    fs.readdirSync('uploads');
}catch(error){
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        //uploads라는 폴더에 파일명+현재시간.확장자로 업로드
        destination(req, file, done){ //req에는 요청에 대한 정보, file에는 업로드한 파일에 대한 정보 done은 함수
            done(null, 'uploads/'); //uploads라는 폴더가 존재해야 함. 없다면 fs 모듈을 이용해 서벌르 시작할 때 생성
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext)+Date.now() + ext);
        },
    }),
    limits: {fileSize: 5 * 1024 * 1024},
});

app.get('/upload', (req, res)=>{;
    res.sendFile(path.join(__dirname + '/html/multipart.html'))
})

app.post('/upload', upload.single('image'), (req, res)=>{
    console.log(req.file, req.body);
    res.send('ok');
}); //여러 파일을 업로드하고 싶으면 html input 태그에 multiple 사용, single을 array로 교체

//==============
/*

app.get('/', (req, res, next)=>{
    console.log('GET / 요청에서만 실행됩니다.');
    next();
}, (req, res)=>{
    throw new Error('에러는 에러처리 미들웨어로 갑니다.')
});

app. use((err, req, res, next)=>{
    console.error(err);
    res.status(500).send(err.message);
});
*/
/*

app.get('/', (req, res)=>{ //주소에 대한 get 요청이 올 때 어떤 동작을 할지 적는 부분
    //req: 요청에 관한 정보
    //res: 응답에 관한 정보
    //res.send('Hello, Express'); //GET / 요청시 응답으로 헬로, 익스프레스를 전송
    res.sendFile(path.join(__dirname, '/html/index.html')); //html로 응답하고 싶다면 sendFile 사용
});

*/

app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기 중');
});


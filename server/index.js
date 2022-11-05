const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require("./models/User");
const { auth } = require("./middleware/auth")
// 개인정보 담아놓은 곳에서 가져오기
const config = require("./config/key");

// bodyParser가 client에서 오는 정보를 서버에서 분석해서 가져올 수 있도록 하기 위해 아래의 두 줄 사용
// application/x-www-form-unlencoded
// 이렇게 된 데이터를 가져오는데 사용
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 가져오는데 사용
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
// 이 아랫부분엔 개인정보가 담겨있으므로, git에 올라가면 안된다.
// gitignore에 추가
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello world! 안녕하세요!'))

// client에서 get으로 줬으므로 get으로 받는다.
app.get('/api/hello', (req, res) => {
    // 여기서 보내는 res(response, 응답)는 요청을 보냈던 client의 LandingPage에서 다시 받는다.
    res.send('Hello world ~ !')
})

// 회원가입
app.post('/api/users/register', (req, res) => {
    // 회원 가입할 때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다
    // 이를 위해 User.js의 내용을 가져온다.

    //req.body에는 아래와 같은 정보가 담긴다.
    //{
    //    id: "hello"
    //    password: "1234"
    //}
    const user = new User(req.body)

    // user의 내용이 mongodb에 저장
    // 저장에 앞서 비밀번호 암호화 하는 것이 위에 과정
    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err })
        // err가 없는 경우
        // json파일로 보냈는데 성공할 경우, success : true가 뜨도록 함
        // Postman으로 회원가입 정보 보내서 확인 가능
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) =>{
    // 요청된 이메일을 DB에서 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        // 요청된 이메일이 DB에 있다면 비번이 맞는 비번인지 확인한다.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
            // 비번까지 맞다면, 토큰을 생성한다.
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                // 토큰을 저장한다. 어디에? 쿠키나 로컬스토리지에 저장
                // 쿠키를 사용하기 위해 쿠키파서 설치
                // user.token을 쿠키에 저장
                res.cookie("x_auth", user.token)
                    .status(200)
                // 로그인 성공시, loginSuccess: true를 보여주고, userID를 보여줌
                // 크롬 확장도구의 Redux_devTools의 State를 통해 확인 가능
                    .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})

// auth는 middleware. 중간에서 뭔가를 하는 것
app.get('/api/users/auth', auth , (req, res) => {
    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말.
    res.status(200).json({
        _id: req.user._id,
        // role이 0이면 일반유저, role이 0이 아니면 관리자
        isAdmin: req.user.role === 0 ? false : true,
        // 인증된 사람인지, 즉 로그인된 사람인지
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

// 로그아웃 기능 구현
app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id },
        // 로그아웃을 위해 기존에 있던 토큰을 지운다.
        { token: "" }
        , (err, user) => {
            if(err) return res.json({ success:false, err });
            return res.status(200).send({
                success: true
            })
        })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
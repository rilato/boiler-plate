const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require("./models/User");

// 개인정보 담아놓은 곳에서 가져오기
const config = require("./config/key");

// bodyParser가 client에서 오는 정보를 서버에서 분석해서 가져올 수 있도록 하기 위해 아래의 두 줄 사용
// application/x-www-form-unlencoded
// 이렇게 된 데이터를 가져오는데 사용
app.use(bodyParser.urlencoded({extended: true}));

// application/json 가져오는데 사용
app.use(bodyParser.json());

const mongoose = require('mongoose')
// 이 아랫부분엔 개인정보가 담겨있으므로, git에 올라가면 안된다.
// gitignore에 추가
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello world! 안녕하세요!'))

app.post('/register', (req, res) => {
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
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        // err가 없는 경우
        // json파일로 보냈는데 성공할 경우, success : true가 뜨도록 함
        // Postman으로 회원가입 정보 보내서 확인 가능
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
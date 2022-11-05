const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// 10자리의 비밀번호인 솔트라운즈
const saltRounds = 10
// 사용하려면 npm install jsonwebtoken --save
const jwt = require('jsonwebtoken');

// 스키마 작성
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        // 공백을 없애주는 역할을 trim이 수행
        // croco 1997 -> croco1997
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    // 어떤 유저가 관리자가 될 수도 있고, 일반 유저가 될 수 있으므로 role 설정
    // 1이면 관리자, 0이면 일반 유저
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    // 토큰이 사용할 수 있는 유효기간
    tokenExp: {
        type: Number
    }
})

// index.js에서 save가 들어가기 전에, 여기서 무언가를 한다는 의미!
// parameter next를 통해, 이 함수가 끝난 후 다음 문장 수행하도록 함.
userSchema.pre('save', function (next) {
    // this는 위의 스키마를 가리킨다.
    var user = this;

    // 이메일 등이 변경되는 것과 관계 없이, 비밀번호를 바꿀 때에만 암호화한다.
    if(user.isModified('password')){
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)

            // 첫 번째 인자는 유저가 입력한 원래 비밀번호를 의미
            bcrypt.hash(user.password, salt, function (err, hash) {
                if(err) return next(err)
                // Store hash in your password DB.
                user.password = hash
                // 해시 완료 후 돌아가기 위해 사용
                next()
            })
        })
    } else {
        // 비밀번호를 바꾸지 않는 경우는 그냥 next
        next()
    }
})


userSchema.methods.comparePassword = function(plainPassword, cb){
    // plainPassword 1234567
    // 암호화된 비밀번호 : $2b$10$..g.GzGNrtogcFlso8Xljesqz88pb85gvecaUMz3P0n95NI0N03w6
    // 두 개가 같은지 체크
    // 방법은 plainPassword를 다시 암호화해서 암호화된 코드와 비교

    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    // jsonwebtoken을 이용해서 토큰을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    //user._id + 'secretToken'을 통해 token을 만들고, 나중에 secretToken을 넣었을 때 user._id를 얻을 수 있도록 함
    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function (err, user){
            if (err) return cb(err);
            cb(null, user)
        })
    })
}

// 스키마를 모델로 감싸줌
const User = mongoose.model('User', userSchema)

// 다른 곳에서도 사용할 수 있도록 export
module.exports = {User}
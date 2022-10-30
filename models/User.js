const mongoose = require('mongoose');

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

// 스키마를 모델로 감싸줌
const User = mongoose.model('User', userSchema)

// 다른 곳에서도 사용할 수 있도록 export
module.exports = {User}
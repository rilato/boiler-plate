import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from './types';

export function loginUser(dataTosubmit) {
        // server 폴더에 있는 index.js에서 app.post가 있는 위치에 설정된 경로인
        // /api/users/login과 똑같이 맞춰준다.
        // 여기서 request는 백엔드에서 가져온 모든 데이터
        const request = axios.post('/api/users/login', dataTosubmit)
            .then(response => response.data)

        // request를 넣어주는데 이거는 다시 user_reducer.js에 넣어줘서 확장프로그램의 State가 작동되는 것.
        return {
            type: LOGIN_USER,
            payload: request
        }
}

// RegisterPage의 registerUser와 동일한 이름을 갖도록 한다.
export function registerUser(dataTosubmit) {
    // server 폴더에 있는 index.js에서 app.post가 있는 위치에 설정된 경로인
    // /api/users/register와 똑같이 맞춰준다.
    const request = axios.post('/api/users/register', dataTosubmit)
        .then(response => response.data)

    // return된 type은 type.js에서 정의
    return {
        type: REGISTER_USER,
        payload: request
    }
}

// get 메소드에서는 parameter를 필요로 하지 않는다.
export function auth() {
    // get 메소드로 request를 보낸다.
    const request = axios.get('/api/users/auth')
        .then(response => response.data)

    // return된 type은 type.js에서 정의
    return {
        type: AUTH_USER,
        payload: request
    }
}
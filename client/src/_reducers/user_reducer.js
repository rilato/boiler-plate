import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from '../_actions/types';

// reducer는 현재 state와 action object를 받은 후에  next state를 return하는 역할
export default function (state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            // ...은 위에 parameter의 state를 똑같이 가져오는 역할
            // loginSuccess에는 user_action.js에서의 payload를 넣어주는 역할
            // 크롬 확장도구인 Redux DevTools의 State에서 확인 가능
            return {...state, loginSuccess: action.payload}
            break;
        case REGISTER_USER:
            // 원본 state를 ...으로 가져오고
            // 서버에서 가져온 response를 action.payload로 넣어줌
            return {...state, register: action.payload}
            break;
        case AUTH_USER:
            // action.payload에는 server/index.js에서 유저와 관련된 모든 정보를 담고있음.
            return {...state, userData: action.payload}
            break;
        default:
            return state;
    }
}
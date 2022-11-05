import React, {useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

//import { logoutUser } from '../../../_actions/user_action';
//import { useDispatch } from 'react-redux';

function LandingPage() {
    const navigate = useNavigate();
    // LandingPage에 들어오자마자 useEffect()를 실행한다!
    // 여기서 axios가 보낸 애는 server에 있는 index.js에서 받을 수 있다!
    useEffect(() => {
        // 아무런 작업 없이, 아래와 같이 코딩하면, server의 포트는 localhost:5000인데,
        // client의 포트는 localhost:3000이라 에러가 발생한다!
        // 따라서 npm install http-proxy-middleware를 해주고,
        // src의 하위 파일로 setupProxy.js를 만든 후 포트를 설정한 후 작업한다.
        axios.get('/api/hello')
        .then(response => console.log(response))
    }, [])

    const onClickHandler = () => {
        axios.get('/api/users/logout')
            .then(response => {
                if(response.data.success) {
                    navigate('/login');
                } else {
                    alert('로그아웃 하는데 실패했습니다.');
                }
            }) 
        }

    return (
        <div style={{
            display:'flex', justifyContent:'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <h2>시작 페이지</h2>
            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
    )
}

export default LandingPage
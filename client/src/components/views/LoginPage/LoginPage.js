import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../../_actions/user_action';
// V6로 넘어오면서 history.push가 navigate로 바뀜
import { useNavigate } from 'react-router-dom'

function LoginPage() {
    const dispatch = useDispatch();
    // V6로 넘어오면서 navigate로 바뀜 
    const navigate = useNavigate();
    // const [Email, setEmail] = useState(initialState)
    // initialState의 처음은 빈 칸이므로 ""
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        // event.preventDefault()를 해주지 않으면, login 버튼 클릭시, 페이지가 refresh됨
        event.preventDefault();

        let body = {
            email: Email,
            password: Password
        }

        // 여기있는거는 src의 actions폴더의 user_action.js에서 구현
        // body에서 email과 password 넣어준 것을 user_action.js에서 parameter로 받음
        // 또한 로그인 후, 메인 페이지로의 이동을 위해 dispatch(loginUser(body)) 다음의 코드를 작성
        dispatch(loginUser(body))
            .then(response => {
                // 로그인이 성공하면
                if(response.payload.loginSuccess){
                    // home 페이지로 이동
                    // V6로 넘어오면서 history.push가 navigate로 바뀜
                    navigate('/')
                } else {
                    alert('Error')
                }
            })
    }

    return (
        <div style={{
            display:'flex', justifyContent:'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            {/* 이메일이나 비번을 타이핑을할 때, onChange를 통해 Email과 Password 값을 바꿔준다*/}
            <form style={{ display:'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage

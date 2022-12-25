import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { registerUser } from '../../../_actions/user_action';
// V6로 넘어오면서 history.push가 navigate로 바뀜
import { useNavigate } from 'react-router-dom'

// props는 로그인 성공 후 홈페이지로 이동하기 위해 설정
function RegisterPage(props) {
    const dispatch = useDispatch();
    // V6로 넘어오면서 navigate로 바뀜 
    const navigate = useNavigate();
    // const [Email, setEmail] = useState(initialState)
    // initialState의 처음은 빈 칸이므로 ""
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [Name, setName] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onNameHandler = (event) => {
        setName(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        // event.preventDefault()를 해주지 않으면, login 버튼 클릭시, 페이지가 refresh됨
        event.preventDefault();

        if(Password !== ConfirmPassword){
            return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
        }

        let body = {
            email: Email,
            name: Name,
            password: Password
        }

        // redux를 쓰지 않는 경우, 원래는 다음과 같이 씀
        // Axios.post('.api/users/register', body)

        // 액션의 이름은 registerUser
        dispatch(registerUser(body))
            .then(response => {
                // 회원가입이 성공하면
                if(response.payload.success){
                    // home 페이지로 이동
                    // V6로 넘어오면서 history.push가 navigate로 바뀜
                    navigate('/login')
                } else {
                    alert('Failed to sign up')
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

                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} />

                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />

                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
                <br />
                <button type="submit">
                    회원 가입
                </button>
            </form>
        </div>
    )
}

export default RegisterPage

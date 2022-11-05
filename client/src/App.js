import React from 'react';

import {
  BrowserRouter as Router,
  // Switch는 v5버전이고, 현재는 v6이므로 Routes를 쓴다.
  Routes,
  Route,
  //Link
} from "react-router-dom";

// 필요한 모든 페이지의 컴포넌트를 추가한다.
import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from './components/views/RegisterPage/RegisterPage'
import Auth from './hoc/auth'

function App() {
  return (
    <Router>
    <div>

      {/*
        A <Switch> looks through all its children <Route>
        elements and renders the first one whose path
        matches the current URL. Use a <Switch> any time
        you have multiple routes, but you want only one
        of them to render at a time
      */}
      {
        /* 이 아래쪽 부분도 Switch대신에 Routes를 쓴다 */
      }
      {
        // path는 URL에 칠 때 localhost:3000/여기에 뭐나올지 정하는거고
        // element={<LandingPage />}에서 LandingPage는 내가 만든 페이지 이름으로, 실제 코드가 작동하는 부분
      }
      {
        // higier order component, 즉 hoc인 Auth가 LandingPage 등을 감싸도록 한다.

        // Auth 함수는 auth.js와 관련 있는 함수다.
        
        // 해당 유저가 어떤 사람인지 파악하여, null, true, false 값을 지정한다.
        // null => 아무나 출입이 가능한 페이지
        // true => 로그인한 유저만 출입이 가능한 페이지
        // false => 로그인한 유저는 출입 불가능한 페이지

        // LandingPage는 아무나 들어갈 수 있으므로 null
        // LoginPage는 로그인한 유저는 출입할 수 없으므로 false
        // RegisterPage도 로그인한 유저는 출입할 수 없으므로 false

        // admin한 유저(관리자)만 들어갈 수 있는 페이지를 만들기 위해서는 다음과 같이 코딩한다.
        // <Route  path="/" element={Auth(LandingPage, null, true)} />
      }
      <Routes>
        <Route  path="/" element={Auth(LandingPage, null)} />
        <Route  path="/login" element={Auth(LoginPage, false)} />
        <Route  path="/register" element={Auth(RegisterPage, false)} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
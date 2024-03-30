import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import puppy from '../../images/dog-ga9d6fbf94_640.png';
import { authService } from '../../fbase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const StyleLogin = styled.div`
  width: 320px;
  margin: 0 auto;

  .puppy {
    width: 200px;
    height: 270px;
    margin: 0 auto;
    margin-top: 50px;
    img {
      width: 100%;
    }
  }

  .login-title {
    text-align: center;
    font-weight: 400;
  }

  .login-form {
    width: 100%;
    margin-top: 20px;
    input {
      width: 100%;
      height: 40px;
      box-sizing: border-box;
      margin-bottom: 10px;
    }
    input[type='text'] {
      border: none;
      border-bottom: 1px solid #ccc;
      outline: none;
    }
    input[type='password'] {
      border: none;
      border-bottom: 1px solid #ccc;
      outline: none;
    }
    input[type='submit'] {
      background-color: #f7f791;
      border: none;
      border-radius: 20px;
      margin-top: 20px;
      cursor: pointer;
    }
  }

  .sns-login {
    width: 100%;
    .sns-title {
      color: #888;
      font-size: 13px;
      font-weight: 400;
      text-align: center;
    }

    button {
      width: 100%;
      height: 40px;
      border: 1px solid #ccc;
      border-radius: 20px;
      background-color: #fff;
      cursor: pointer;
    }
  }
`;

const Login = () => {
  let navigate = useNavigate();
  // 이메일과 비밀번호 입력 상태
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  // 에러메세지 텍스트 출력 상태
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const accountSubmit = async (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    let data;
    try {
      // 회원가입
      // createUserWithEmailAndPassword()는 이메일과 비밀번호를 사용하여 새로운 사용자 계정을 생성하는 메서드
      data = await createUserWithEmailAndPassword(authService, email, password);
      // 페이지 이동
      navigate('/login');

      console.log(data);
    } catch (error) {
      console.log(error);
      setErrorMessage((error as Error).message.replace('Firebase: ', '')); // replace()를 사용하여 'Firebase' 문자열을 ''로 대체
    }
  };
  return (
    <StyleLogin>
      <div className="puppy">
        <img src={puppy} title="강아지이미지" />
      </div>
      <h2 className="login-title">회원가입</h2>
      <form onSubmit={accountSubmit} className="login-form">
        <input
          type="text"
          placeholder="이메일을 입력해주세요"
          onChange={onChangeEmail}
          value={email}
        />
        <input
          type="password"
          placeholder="비밀번호를 입력해주세요"
          onChange={onChangePassword}
          value={password}
        />
        <span>{errorMessage}</span>
        <input type="submit" value="회원가입"></input>
      </form>
    </StyleLogin>
  );
};

export default Login;

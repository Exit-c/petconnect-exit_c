import React, { useState, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import puppy from '../../images/dog-ga9d6fbf94_640.png';
import { authService } from '../../fbase';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

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

  .account-box {
    width: 100%;
    button {
      width: 100%;
      height: 40px;
      box-sizing: border-box;
      margin-bottom: 10px;
      background-color: #f7f791;
      border: none;
      border-radius: 20px;
      cursor: pointer;

      .account-link {
        color: #000;
        text-decoration: none;
      }
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
      margin-bottom: 10px;
    }
    .github-login {
      background-color: #02040a;
      color: #fff;
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
  // 이메일로그인 submit
  const loginSubmit = async (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    let data;
    try {
      // 로그인
      // signInWithEmailAndPassword()는 이메일과 비밀번호로 사용자 인증을 수행하는 메서드
      data = await signInWithEmailAndPassword(authService, email, password);
      navigate('/');

      console.log(data);
    } catch (error) {
      console.log(error);
      setErrorMessage((error as Error).message.replace('Firebase: ', '')); // replace()를 사용하여 'Firebase' 문자열을 ''로 대체
    }
  };
  // 소셜로그인 클릭이벤트
  const onSocialClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = event;
    let provider;
    if (name === 'google') {
      provider = new GoogleAuthProvider();
    } else if (name === 'facebook') {
      provider = new GithubAuthProvider();
    }
    if (provider) {
      await signInWithPopup(authService, provider);
    }
    navigate('/');
  };

  return (
    <StyleLogin>
      <div className="puppy">
        <img src={puppy} alt="강아지그림" />
      </div>
      <h2 className="login-title">로그인</h2>
      <form onSubmit={loginSubmit} className="login-form">
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
        <input type="submit" value="로그인"></input>
      </form>
      <div className="account-box">
        <button>
          <Link to="/account" className="account-link">
            회원가입
          </Link>
        </button>
      </div>
      <div className="sns-login">
        <h3 className="sns-title">간편 SNS 로그인</h3>
        <button onClick={onSocialClick} name="google">
          구글로 로그인
        </button>
        <button
          onClick={onSocialClick}
          name="facebook"
          className="github-login"
        >
          깃허브로 로그인
        </button>
      </div>
    </StyleLogin>
  );
};

export default Login;

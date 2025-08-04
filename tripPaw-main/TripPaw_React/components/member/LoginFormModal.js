import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import styled from 'styled-components';

const logoPath = '/image/logo/TripPaw-logo.png';
const backgroundImagePath = '/images/background-image.jpg';
const googleIconPath = '/image/member/google.png';
const kakaoIconPath = '/image/member/kakao.png';
const naverIconPath = '/image/member/naver.png';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 50px;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 30px;
  max-width: 450px;
  width: 100%;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const LoginBox = styled.div`
  width: 100%;
  max-width: 400px;
  text-align: center;
  margin: auto;
`;

const LoginFormTag = styled.form`
  .logo-login-section {
    margin-top:30px;
    margin-bottom: 30px;
    .logo-img {
      height: 50px;
    }
  }

  .welcome-text {
    font-size: 16px;
    color: #666;
    margin-bottom: 30px;
  }
`;

const InputGroup = styled.div`
  text-align: left;
  margin-bottom: 20px;
  position: relative;

  label {
    display: block;
    font-size: 14px;
    color: #555;
    margin-bottom: 8px;
  }

  input {
    width: 100%;
    padding: 12px 10px;
    border: none;
    border-bottom: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    box-sizing: border-box;
    margin-bottom: 10px;
  }
`;

const PasswordToggle = styled.div`
  position: absolute;
  right: 10px;
  top: 15px;
  cursor: pointer;
  color: #999;
`;

const OptionsGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  font-size: 14px;

  .remember-me {
    display: flex;
    align-items: center;
    input[type="checkbox"] {
      margin-right: 8px;
    }
  }

  .forgot-password {
    color: #007bff;
    text-decoration: none;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;

  &:hover {
    background-color: #333;
  }
`;

const SocialLogin = styled.div`
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;

  p {
    font-size: 14px;
    color: #777;
    margin-bottom: 15px;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
`;

const SocialIcon = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  img {
    width: 25px;
    height: 24px;
  }

  &:hover {
    transform: translateY(-2px);
  }
`;

const SignupLink = styled.div`
  margin-top: 30px;
  font-size: 14px;
  color: #777;

  .signup-text {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
  }
`;

const LoginFormModal = ({ onToggleForm, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const loginSubmit = await axios.post(`/api/auth/login`, {
        username: username,
        password: password
      }, {
        withCredentials: true,
      });

      if (loginSubmit.status === 200) {
        if (onLoginSuccess) {
          onLoginSuccess(loginSubmit.data);
        }
      }
    } catch (err) {
      alert('로그인 실패');
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onToggleForm}>×</CloseButton>
        <LoginBox>
          <LoginFormTag onSubmit={handleSubmit}>
            <div className="logo-login-section">
              <img src={logoPath} alt="로고" className="logo-img" />
            </div>

            <InputGroup>
              <label htmlFor="username"></label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder='아이디를 입력해주세요'
              />
            </InputGroup>

            <InputGroup>
              <label htmlFor="password"></label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder='비밀번호를 입력해주세요'
              />
              <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '숨기기' : '보기'}
              </PasswordToggle>
            </InputGroup>

            <OptionsGroup>
              <div className="remember-me">
                <input type="checkbox" id="rememberMe" />
                <label htmlFor="rememberMe">아이디 기억하기</label>
              </div>
              <a href="#" className="forgot-password">비밀번호를 잊으셨나요?</a>
            </OptionsGroup>

            <LoginButton type="submit">로그인</LoginButton>
          </LoginFormTag>

          <SocialLogin>
            <p>소셜 아이디로 로그인하기</p>
            <SocialIcons>
              <SocialIcon><img src={googleIconPath} alt="구글" /></SocialIcon>
              <SocialIcon href={`/oauth2/authorization/kakao`}><img src={kakaoIconPath} alt="카카오" /></SocialIcon>
              <SocialIcon><img src={naverIconPath} alt="네이버" /></SocialIcon>
            </SocialIcons>
          </SocialLogin>

          <SignupLink>
            <p>아직 회원이 아니신가요? <a href="#" className="signup-text" onClick={() => Router.push("/member/signup")}>회원가입하기</a></p>
          </SignupLink>
        </LoginBox>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoginFormModal;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import AuthContainer from '@/components/member/AuthContainer';

const logoPath = '/image/logo/TripPaw-logo-white.png';
const backgroundImagePath = '/image/logo/main.png';
const googleIconPath = '/image/member/google.png';
const kakaoIconPath = '/image/member/kakao.png';
const naverIconPath = '/image/member/naver.png';

const PageWrapper = styled.div`
  margin: 0;
  font-family: Arial, sans-serif;
  //display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  //background-color: #f0f2f5;
  //border:2px solid red;
  width:100%;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  //max-width: 1200px;
   height: 100vh;
  min-height: 600px;
  border-radius: 0 ;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  //border:2px solid blue;
`;

const ImageSection = styled.div`
  flex: 2;
  position: relative;
  overflow: hidden;
  //border:2px solid red;


  .background-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 0 20px 20px 0 ;
  }
`;

const LogoTopLeft = styled.div`
  position: absolute;
  top: 30px;
  left: 40px;
  z-index: 10;

  .logo-img {
    height: 40px;
    width: auto;
  }
`;

const LoginSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  padding: 40px;
`;

const LoginBox = styled.div`
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const LoginForm = styled.form`
  .logo-login-section {
    margin-bottom: 20px;
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
  }
`;

const PasswordToggle = styled.div`
  position: absolute;
  right: 10px;
  top: 40px; /* label 높이를 고려한 위치 조정 */
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


// --- React 컴포넌트 --- //

function LoginPage({ children }) {
  // 폼 입력 값을 관리하기 위한 state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 비밀번호 보이기/숨기기 상태 관리
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault(); // 폼 기본 제출 동작 방지
    const loginSubmit = await axios.post(`/api/auth/login`, {
      username: username,
      password: password
    }, {
      withCredentials: true,
    })
    Router.replace('/')
  };

  return (
    <PageWrapper>
      <Container>
        <ImageSection>
          <LogoTopLeft>
            <div
              style={{ cursor: 'pointer', marginBottom: '20px', marginTop: '0px' }}
              onClick={() => Router.push('/')}
            >
              <img src={logoPath} alt="로고" className="logo-img" />
            </div>
          </LogoTopLeft>
          <img src={backgroundImagePath} alt="배경 이미지" className="background-image" />
        </ImageSection>

        <LoginSection>
          {/* <AuthContainer/> */}
          {children}
        </LoginSection>
      </Container>
    </PageWrapper>
  );
}

export default LoginPage;

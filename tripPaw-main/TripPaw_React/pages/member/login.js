import React from 'react';
import AuthLayout from './loginLayout';
import LoginForm from '../../components/member/LoginForm'; // LoginForm을 별도 컴포넌트로 분리했다고 가정

function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}

export default LoginPage;
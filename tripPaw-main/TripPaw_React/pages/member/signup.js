import React from 'react';
import AuthLayout from './loginLayout';
import SignForm from '../../components/member/SignForm'; // SignForm을 별도 컴포넌트로 분리했다고 가정
function SignupPage() {
  return (
    <AuthLayout>
      <SignForm />
    </AuthLayout>
  );
}

export default SignupPage;
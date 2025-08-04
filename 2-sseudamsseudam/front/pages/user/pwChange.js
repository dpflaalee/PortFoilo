import React from 'react';
import PwChangeForm from '../../components/user/PwChangeForm'
const pwChange = () => {
  ///////////////////////////
  return (
    <>

      <div 
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "100vh", // 화면 전체 높이 확보
                }}
                >
                <PwChangeForm />
            </div>
    </>
  );
}

export default pwChange;
import React, { useState } from "react";
import { useSelector } from 'react-redux';
import AppLayout from "../../components/AppLayout";
import 'antd/dist/antd.css';
import KakaoMap from "@/components/map/KakaoMap";

const KakaoMapPage = () => {
  const user = useSelector(state => state.user);
  
  return (
    <AppLayout>
      <>
      <KakaoMap userName={user?.user?.nickname || '홍길동'} />
      </>
    </AppLayout >
  );
}

export default KakaoMapPage;
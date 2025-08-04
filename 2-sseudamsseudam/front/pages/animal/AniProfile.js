import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { loadAniProfiles } from '@/reducers/animal';
import AppLayout from '@/components/AppLayout';
import AnimalProfileCard from '@/components/animal/AnimalProfileCard'; // 등록된 리스트
import AniFollow from '@/components/animal/AniFollow';

const AniProfile = () => {
  const dispatch = useDispatch();
  useEffect(() => {
  }, []);
  return (
    <AppLayout>
      <h2>동물 프로필 목록</h2>
      <AnimalProfileCard /> {/* Redux의 animals 배열 사용 */}
      <AniFollow/>
    </AppLayout>
  );
};

export default AniProfile;

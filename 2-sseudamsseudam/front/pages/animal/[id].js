import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { loadAnimalProfile } from '@/reducers/animal';
import AppLayout from '@/components/AppLayout';
import AnimalProfileCard from '@/components/animal/AnimalProfileCard'; // 등록된 리스트
import AniFollow from '@/components/animal/AniFollow';
import AnimalList from '@/components/animal/AnimalList';
import { LOAD_MY_INFO_REQUEST } from '@/reducers/user';
import { LOAD_ANIMAL_LIST_REQUEST } from '@/reducers/animal';

const AniProfile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const user = useSelector(state => state.user );

  const { userAnimals, selectedAnimal } = useSelector((state) => state.animal);

  useEffect(() => {
    if (id) {
      dispatch(loadAnimalProfile(id)); 
    }
  }, [id]);

  useEffect(() => {
  if (user) {
    dispatch({ type: LOAD_ANIMAL_LIST_REQUEST });
  }
}, [user]);

  return (
    <AppLayout>
      <AnimalProfileCard ownerId={selectedAnimal?.UserId} />
      <AnimalList animals={userAnimals} ownerId={selectedAnimal?.UserId}/>
      <AniFollow ownerId={selectedAnimal?.UserId}/>
    </AppLayout>
  );
};

export default AniProfile;

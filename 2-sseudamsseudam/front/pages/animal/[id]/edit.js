import React from 'react';
import Router from 'next/router';
import AppLayout from '@/components/AppLayout';
import AnimalEdit from '@/components/animal/AnimalEdit';

const Edit = () => {
  return (
    <AppLayout>
      <AnimalEdit/>
    </AppLayout>
  );
};
export default Edit;
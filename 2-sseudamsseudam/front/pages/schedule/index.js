import React from 'react';
import AppLayout from '../../components/AppLayout';
import EventScheduleList from '../../components/Calendar/EventSchedule/EventScheduleList';

const schedule = () => {
  return (
    <AppLayout>
      <EventScheduleList />
    </AppLayout>
  );
};

export default schedule;

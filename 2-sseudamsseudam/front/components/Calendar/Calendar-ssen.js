import React, { useEffect, useState } from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import { useRouter } from 'next/router';

function EnglishCalendar() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());

function getItem(label, icon) {
  return { label, icon };
}

const CalendarUI = styled.div`
  background-color: #fff;

  .react-calendar__month-view__weekdays {
    display: none !important;
  }

  .react-calendar__navigation {
    display: none !important;
  }

  .react-calendar__tile {
    font-size: 16px;
    text-align: center;
  }
  
  .react-calendar__tile > abbr {
    position: relative;
    z-index: 2;
    line-height: 1;
    user-select: none;
  }

  .react-calendar__tile--active {
    background: none !important;
    color: inherit !important;
  }

  .react-calendar {
    border: none !important;
    box-shadow: none !important;
    max-width: 19em !important;
  }

  .react-calendar__tile:disabled {
    color: #ffffff !important;
    pointer-events: none;
  }

  .react-calendar__month-view__days__day--neighboringMonth:disabled,
  .react-calendar__decade-view__years__year--neighboringDecade:disabled,
  .react-calendar__century-view__decades__decade--neighboringCentury:disabled {
    color: #ffffff !important;
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color:rgb(219, 219, 219);
    border-radius: 50%;
  }

  .react-calendar__month-view__days__day--neighboringMonth,
  .react-calendar__decade-view__years__year--neighboringDecade,
  .react-calendar__century-view__decades__decade--neighboringCentury {
    color: #ffffff !important;
    pointer-events: none;
  }

  .react-calendar__tile--now {
    background:rgb(171, 231, 247) !important;
    border-radius: 50%;
  }

  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    background: rgb(171, 231, 247) !important;
    border-radius: 50%;
  }

  .react-calendar__tile--hasActive:enabled:hover,
  .react-calendar__tile--hasActive:enabled:focus {
    background: rgb(171, 231, 247) !important;
  }

  .react-calendar__tile--active {
    background: rgb(171, 231, 247) !important;
    border-radius: 50%;
    color: white;
  }

  .react-calendar--selectRange .react-calendar__tile--hover {
    background-color: #A1EEBD !important;
  }

  .dRvjkr .react-calendar__tile {
    font-size: 14px !important;
    text-align: center;
  }
`;

const CalendarTitle = styled.div`
  color: #4A5660;
  text-size: 25px;
  padding: 10px;
`;

const items = getItem('챌린지 참여 현황', <CheckCircleOutlined />);
  return (
    <CalendarUI>
      <CalendarTitle onClick={() => router.push('/admin/manage')} style={{cursor: 'pointer'}}>
        {items.icon}
        <span style={{ marginLeft: '8px' }}>{items.label}</span>
      </CalendarTitle>
      <Calendar
        onChange={setDate}
        value={date}
        locale="en-US" // 영어(미국) 로케일 설정
      />
    </CalendarUI>
  );
}

export default EnglishCalendar;

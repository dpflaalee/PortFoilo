import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import axios from 'axios';
import dayjs from 'dayjs';

//const HIGHLIGHT_COLOR = '#A1EEBD';

const CalendarUI = styled.div`
  background-color: #fff;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 10px;

  .react-calendar {
    border: none !important;
    box-shadow: none !important;
    width: 100%;
    aspect-ratio: 1 / 1;
    padding: 5px;
    min-width: 280px;
    max-height: 300px;
  }

  .react-calendar__month-view__weekdays,
  .react-calendar__navigation {
    display: none !important;
  }

  .react-calendar__tile {
    font-size: clamp(12px, 2vw, 16px);
    text-align: center;
    border-radius: 50%;
    padding: 0;
    position: relative;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    aspect-ratio: 1 / 1;
    color: black !important;
    transition: font-size 0.3s ease;
  }

  .react-calendar__month-view__days__day--neighboringMonth,
  .react-calendar__decade-view__years__year--neighboringDecade,
  .react-calendar__century-view__decades__decade--neighboringCentury {
    color: white !important;
    pointer-events: none;
  }

  .react-calendar__tile > abbr {
    position: relative;
    z-index: 2;
    line-height: 1;
    user-select: none;
  }

  .react-calendar__tile--now,
  .react-calendar__tile--active {
    color: black !important;
    background: none !important;
  }

  .react-calendar__tile--now::before,
  .react-calendar__tile--active::before {
    content: "";
    position: absolute;
    width: 70%;
    height: 70%;
    background-color: rgb(171, 231, 247);
    border-radius: 50%;
    z-index: 1;
    top: 15%;
    left: 15%;
    transition: background-color 0.3s ease;
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: transparent !important;
  }

  .react-calendar__tile:enabled:hover::after,
  .react-calendar__tile:enabled:focus::after {
    content: "";
    position: absolute;
    width: 70%;
    height: 70%;
    background-color: rgba(219, 219, 219, 0.7);
    border-radius: 50%;
    top: 15%;
    left: 15%;
    z-index: 0;
    transition: background-color 0.3s ease;
  }

  .react-calendar__tile:disabled {
    color: white !important;
    pointer-events: none;
  }

  .react-calendar__tile--highlight::before {
    content: "";
    position: absolute;
    width: 70%;
    height: 70%;
    border-radius: 50%;
    z-index: 1;
    top: 15%;
    left: 15%;
  }

  @media (max-width: 480px) {
    padding: 5px;

    .react-calendar {
      min-width: 240px;
      padding: 3px;
    }

    .react-calendar__tile {
      font-size: clamp(10px, 3vw, 14px);
    }
  }
`;

const ChallengeCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [highlightDates, setHighlightDates] = useState([]);

  const getDateRange = (start, end) => {
    const range = [];
    let current = dayjs(start);
    const last = dayjs(end);
    while (current.isSameOrBefore(last, 'day')) {
      range.push(current.format('YYYY-MM-DD'));
      current = current.add(1, 'day');
    }
    return range;
  };

  useEffect(() => {
    const fetchChallengeDates = async () => {
      try {
        const res = await axios.get('http://localhost:3065/calendar');
        const filtered = res.data.filter(item => item.title.includes('챌린지'));
        const allDates = filtered.flatMap(item =>
          getDateRange(item.startDate, item.endDate)
        );
        setHighlightDates(allDates);
      } catch (err) {      }
    };

    fetchChallengeDates();
  }, []);

  return (
    <CalendarUI>
      <Calendar
        onChange={setDate}
        value={date}
        locale="en-US"
        tileClassName={({ date }) => {
          const formatted = dayjs(date).format('YYYY-MM-DD');
          return highlightDates.includes(formatted) ? 'react-calendar__tile--highlight' : null;
        }}
      />
    </CalendarUI>
  );
};

export default ChallengeCalendar;

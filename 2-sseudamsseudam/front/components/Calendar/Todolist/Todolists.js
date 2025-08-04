import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { RightOutlined, CalendarOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

function getItem(label, icon) {
  return { label, icon };
}

const item = getItem('일정 더 찾아보기', <RightOutlined />);
const itemtwo = getItem(`${dayjs().month() + 1}월 일정`, <CalendarOutlined />);

const gridStyle = {
  padding: '10px',
  width: '100%',
  textAlign: 'left',
  cursor: 'pointer',
};

const gridbar = {
  color: '#364F6B',
  padding: '10px',
  width: '100%',
  textAlign: 'center',
  backgroundColor: '#ffffff',
  boxShadow: '0 0 0 0', //호버 섀도우 없애기
  cursor: 'pointer',
};

const dateView = {
  color: '#807E7E',
};

const CardTitle = styled.span`
  padding: 0px !important;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
`;

const EventLabel = styled.span`
  color: #FC5185;
  font-weight: bold;
  margin-right: 5px;
  display: inline;
`;

const Todolists = () => {
  const router = useRouter();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:3065/calendar');
        const currentMonth = dayjs().month() + 1;

        // 현재 월에 해당하는 일정만 표시
        const filtered = res.data
          .filter(event => dayjs(event.startDate).month() + 1 === currentMonth)
          .sort((a, b) => new Date(a.endDate) - new Date(b.endDate)) 
          .slice(0, 5); 

        setEvents(filtered);
      } catch (err) {
      }
    };

    fetchEvents();
  }, []);

  const formatRange = (start, end) => {
    return `${dayjs(start).format('YY.MM.DD(dd)')} ~ ${dayjs(end).format('YY.MM.DD(dd)')}`;
  };

  return (
    <>
      <div style={{ marginBottom: '25px' }}>
        <Card
          title={
            <CardTitle
              key="schedule"
              style={{ cursor: 'pointer' }}
              onClick={() => router.push('/schedule')}
            >
              {itemtwo.icon}&nbsp;{itemtwo.label}
            </CardTitle>
          }
        >
          {events.map(event => (
            <Card.Grid style={gridStyle} key={event.id}>
              <CardTitle>
                {/* '챌린지'라는 단어가 포함된 경우 'EVENT!' 표시 */}
                {event.title.includes('챌린지') && (
                  <EventLabel>EVENT!</EventLabel>
                )}
                {event.title}
              </CardTitle>
                <span style={dateView}><br />
                  {formatRange(event.startDate, event.endDate)}</span>
            </Card.Grid>
          ))}

          <Card.Grid
            style={gridbar}
            onClick={() => router.push('/schedule')}>{item.label} {item.icon}</Card.Grid>
        </Card>
      </div>
    </>
  );
};

export default Todolists;

import React, { useRef } from 'react';
import DayScheduleItem from './DayScheduleItem';
import ActionButtons from './ActionButtons';
import format from 'date-fns/format';

const DayScheduleList = ({ routeData, currentDay, onSelectDay, onPlaceClick, setFocusDay, startDate }) => {
    const dayRefs = useRef([]);

    const handleDayClick = (dayIndex) => {
        onSelectDay(dayIndex);
        dayRefs.current[dayIndex - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const addDaysToDate = (dateStr, daysToAdd) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            console.error("❌ Invalid date passed to addDaysToDate:", dateStr);
            return "Invalid Date";
        }
        date.setDate(date.getDate() + daysToAdd);
        return date.toISOString().slice(0, 10); // YYYY-MM-DD
    };

    return (
        <div>
            {Array.isArray(routeData) &&
                routeData.map((day, index) => (
                    <div key={day.day} ref={(el) => (dayRefs.current[index] = el)} style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'none' }}>{addDaysToDate(startDate, day.day - 1)}   </div>
                        <DayScheduleItem
                            day={day}
                            isActive={day.day === currentDay}
                            onClick={() => handleDayClick(day.day)}
                            onPlaceClick={(place) => { setFocusDay(day.day); onPlaceClick(place, day.day) }}
                        />
                    </div>
                ))}
        </div>
    );
};

export default DayScheduleList;

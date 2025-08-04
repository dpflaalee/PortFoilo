import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // 기본 스타일
import 'react-date-range/dist/theme/default.css'; // 테마 스타일
import { addDays } from 'date-fns';

const TripPlanToMyTrip = ({
    onClose,
    onSave,
    defaultStartDate,
    defaultEndDate,
    defaultCountPeople,
    defaultCountPet,
    onCaptureMap,
    disabledDates = [],
}) => {
    const [title, setTitle] = useState('');
    const [dateRange, setDateRange] = useState([
        {
            startDate: defaultStartDate ? new Date(defaultStartDate) : new Date(),
            endDate: defaultEndDate ? new Date(defaultEndDate) : addDays(new Date(), 1),
            key: 'selection',
        },
    ]);
    const [countPeople, setCountPeople] = useState(defaultCountPeople || 1);
    const [countPet, setCountPet] = useState(defaultCountPet || 0);

    const handleSave = async () => {
        if (!title.trim()) {
            alert('여행 제목을 입력해주세요.');
            return;
        }

        const { startDate, endDate } = dateRange[0];
        if (!startDate || !endDate) {
            alert('여행 일정을 선택해주세요.');
            return;
        }

        let mapImageBase64 = null;
        try {
            mapImageBase64 = await onCaptureMap?.();
        } catch (err) {
            console.warn('지도 캡처 실패:', err);
        }

        const travelData = {
            title,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            countPeople,
            countPet,
            mapImage: mapImageBase64,
        };

        const result = await onSave(travelData);
        if (result) onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'white',
                padding: '24px',
                width: '450px',
            }} onClick={(e) => e.stopPropagation()}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '30px' }}>내 여행으로 저장하기</h2>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}></label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="여행 제목을 입력해주세요"
                        style={{
                            width: '80%',
                            padding: '8px',
                            marginBottom: '16px',
                            border: 'none',
                        }}
                    />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}></label>
                    <DateRange
                        editableDateInputs={true}
                        onChange={(item) => setDateRange([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={dateRange}
                        disabledDates={disabledDates.map(d => new Date(d))}
                        minDate={new Date()}
                        rangeColors={['#0077ff']}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <label>동행 인원 : </label>
                        <input
                            type="number"
                            value={countPeople}
                            min={1}
                            onChange={(e) => setCountPeople(Number(e.target.value))}
                            style={{ width: '20%', marginBottom: '12px', padding: '6px', border: 'none', marginLeft: '10px' }}
                        />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <label>반려동물 수 : </label>
                        <input
                            type="number"
                            value={countPet}
                            min={0}
                            onChange={(e) => setCountPet(Number(e.target.value))}
                            style={{ width: '20%', marginBottom: '12px', padding: '6px', border: 'none', marginLeft: '10px' }}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: "center", marginTop: '30px' }}>
                    <button onClick={onClose}
                        style={{
                            backgroundColor: 'white',
                            width: '20%',
                            cursor: 'pointer',
                            borderRadius: '5px',
                            marginLeft: '10px',
                            marginRight: '20px',
                        }}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            backgroundColor: 'black',
                            color: 'white',
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            width: '20%',
                            marginLeft: '20px',
                            marginRight: '10px',
                        }}
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TripPlanToMyTrip;

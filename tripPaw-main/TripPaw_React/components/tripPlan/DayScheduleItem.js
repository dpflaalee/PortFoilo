import React, { useState, useRef } from 'react';
import PlaceDetailModal from '../TripPlanEdit/PlaceDetailModal';

const itemWrapper = {
    display: 'flex',
    padding: '10px',
    margin: '20px',
    cursor: 'pointer',
    alignItems: 'center'
};

const dayWrapper = {
    backgroundColor: 'rgba(189, 189, 189, 0.29)',
    width: '90px',
    padding: '20px',
    borderRadius: '30px',
    marginRight: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '15px',
    color: 'rgba(90, 90, 90, 0.65)',
};

const dividerLine = {
    width: '90%',
    border: '1px solid rgba(204, 204, 204, 0.9)',
    height: '1px',
    margin: 'auto',
};

const DayScheduleItem = ({ day, isActive, onPlaceClick }) => {
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMoreInfoClick = (place, event) => {
        event.stopPropagation();
        setSelectedPlace(place);
        setAnchorEl({ current: event.currentTarget });
    };

    const closeModal = () => {
        setSelectedPlace(null);
        setAnchorEl(null);
    };

    return (
        <div>
            {day.places.map((place) => (
                <div
                    key={place.placeId}
                    style={itemWrapper}
                    onClick={(e) => {
                        onPlaceClick(place);
                        e.stopPropagation();
                    }}
                >
                    {/* 일자 표시를 매 카드마다 */}
                    <div style={dayWrapper}>{day.day}일차</div>

                    {/* 장소 */}
                    <div style={{ width: '100%' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                        }}>
                            <div>{place.name}</div>
                            <img
                                src='/image/other/moreInfo.png'
                                alt='장소'
                                style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                                onClick={(e) => handleMoreInfoClick(place, e)}
                            />
                        </div>
                    </div>
                </div>
            ))}

            {/* 모달 렌더링 */}
            {selectedPlace && (
                <PlaceDetailModal
                    place={selectedPlace}
                    onClose={closeModal}
                    anchorRef={anchorEl}
                />
            )}

            <div style={dividerLine} />
        </div>
    );
};

export default DayScheduleItem;

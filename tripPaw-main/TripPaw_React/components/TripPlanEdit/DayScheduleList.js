import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PointerSensor } from '@dnd-kit/core';
import DayScheduleItem from './DayScheduleItem';

const SortablePlaceItem = ({ place, day, onDeletePlace }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: place.draggableId });

    const style = {
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition: 'transform 200ms ease',
    };

    return (
        <DayScheduleItem
            day={day}
            place={place}
            onDeletePlace={onDeletePlace}
            dragRef={setNodeRef}
            dragListeners={listeners}
            dragAttributes={attributes}
            itemStyle={style}
        />
    );
};

const DayScheduleList = ({ routeData, setRouteData, onDeletePlace }) => {
    const sensors = useSensors(useSensor(PointerSensor));

    const [activePlace, setActivePlace] = useState(null);
    const [activeDay, setActiveDay] = useState(null);

    const handleDragStart = (event) => {
        const { active } = event;
        const id = active.id;

        for (const day of routeData) {
            const found = day.places.find((p) => p.draggableId === id);
            if (found) {
                setActivePlace(found);
                setActiveDay(day.day);
                break;
            }
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActivePlace(null);
        setActiveDay(null);

        if (!active || !over || active.id === over.id) return;

        const updatedData = [...routeData];

        let fromDayObj = null, fromIdx = null;
        let toDayObj = null, toIdx = null;

        for (const day of updatedData) {
            const idx = day.places.findIndex(p => p.draggableId === active.id);
            if (idx !== -1) {
                fromDayObj = day;
                fromIdx = idx;
            }
        }

        for (const day of updatedData) {
            const idx = day.places.findIndex(p => p.draggableId === over.id);
            if (idx !== -1) {
                toDayObj = day;
                toIdx = idx;
            }
        }

        // 일정이 비는 것 막기
        if (fromDayObj?.places.length === 1) {
            alert('하루 일정에는 최소 1개 이상의 장소가 있어야 합니다.');
            return;
        }

        if (!fromDayObj || !toDayObj || fromIdx === null || toIdx === null) return;

        const [moved] = fromDayObj.places.splice(fromIdx, 1);
        toDayObj.places.splice(toIdx, 0, moved);

        setRouteData(updatedData);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {routeData.map((day) => (
                <div key={day.day} style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>
                        {day.day}일차 일정
                    </div>
                    <SortableContext
                        items={day.places.map((p) => p.draggableId)}
                        strategy={verticalListSortingStrategy}
                    >
                        {day.places.map((place) => (
                            <SortablePlaceItem
                                key={place.draggableId}
                                place={place}
                                day={day}
                                onDeletePlace={onDeletePlace}
                            />
                        ))}
                    </SortableContext>
                </div>
            ))}

            <DragOverlay>
                {activePlace && (
                    <DayScheduleItem
                        day={{ day: activeDay }}
                        place={activePlace}
                        onDeletePlace={() => { }} // 삭제는 드래그 중에는 비활성
                        itemStyle={{
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            backgroundColor: '#fff',
                            opacity: 0.9,
                        }}
                    />
                )}
            </DragOverlay>
        </DndContext>
    );
};

export default DayScheduleList;

import { PointerSensor } from '@dnd-kit/core';

export class SmartPointerSensor extends PointerSensor {
    static activators = [
        {
            eventName: 'onPointerDown',
            handler: ({ onActivation }) => {
                let timeoutId = null;
                let activated = false;

                return (event) => {
                    let startX = event.clientX;
                    let startY = event.clientY;
                    window.__wasClick__ = false; // 플래그 초기화

                    timeoutId = setTimeout(() => {
                        activated = true;
                        onActivation(event); //드래그 시작
                    }, 200);

                    const cancel = (e) => {
                        const dx = Math.abs(e.clientX - startX);
                        const dy = Math.abs(e.clientY - startY);

                        if (!activated && dx < 5 && dy < 5) {
                            window.__wasClick__ = true; // 클릭으로 간주
                        }

                        clearTimeout(timeoutId);
                        document.removeEventListener('pointerup', cancel);
                        document.removeEventListener('pointermove', cancel);
                    };

                    document.addEventListener('pointerup', cancel, { once: true });
                    document.addEventListener('pointermove', cancel, { once: true });
                };
            },
        },
    ];
}

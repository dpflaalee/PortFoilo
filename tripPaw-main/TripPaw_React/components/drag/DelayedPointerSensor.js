import { PointerSensor } from '@dnd-kit/core';

export class DelayedPointerSensor extends PointerSensor {
    static activators = [
        {
            eventName: 'onPointerDown',
            handler: ({ onActivation }) => {
                let timeoutId = null;
                let activated = false;

                return (event) => {
                    event.preventDefault();
                    timeoutId = setTimeout(() => {
                        onActivation(event);
                        activated = true;
                    }, 200);

                    const cancel = () => {
                        if (!activated) clearTimeout(timeoutId);
                    };

                    document.addEventListener('pointerup', cancel, { once: true });
                    document.addEventListener('pointermove', cancel, { once: true });
                };
            },
        },
    ];
}

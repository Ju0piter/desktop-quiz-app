import { useEffect, useRef } from 'react';
import './TimerBar.css';

interface TimerBarProps {
    endsAt: number | null | undefined;
    onComplete?: () => void;
}

export default function TimerBar({ endsAt}: TimerBarProps) {
    const barRef = useRef<HTMLDivElement | null>(null);
    const textRef = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        if (!endsAt) return;

        const startTime: number = Date.now();
        const totalDuration: number = endsAt - startTime;

        if (totalDuration <= 0) {
        if (barRef.current) barRef.current.style.transform = 'scaleX(0)';
        if (textRef.current) textRef.current.textContent = '0';
        return;
        }

        let animationFrameId: number;
        let lastSeconds: number = -1;

        const updateTimer = (): void => {
        const now: number = Date.now();
        const remaining: number = Math.max(0, endsAt - now);
        const progress: number = remaining / totalDuration;

        // 1. Плавно двигаем линию (60 fps)
        if (barRef.current) {
            barRef.current.style.transform = `scaleX(${progress})`;

            if (progress < 0.2) {
            barRef.current.classList.add('danger');
            } else {
            barRef.current.classList.remove('danger');
            }
        }

        // 2. Обновляем текст только когда изменилась целая секунда
        const currentSeconds: number = Math.ceil(remaining / 1000);
        if (currentSeconds !== lastSeconds) {
            lastSeconds = currentSeconds;
            if (textRef.current) {
            textRef.current.textContent = `${currentSeconds}`;
            
            if (progress < 0.2) {
                textRef.current.classList.add('danger');
            } else {
                textRef.current.classList.remove('danger');
            }
            }
        }

        if (remaining > 0) {
            animationFrameId = requestAnimationFrame(updateTimer);
        } else {
        }
        };

        animationFrameId = requestAnimationFrame(updateTimer);

        return () => cancelAnimationFrame(animationFrameId);
    }, [endsAt]);

    return (
        <div className="timer-container">
            <div className="timer-track">
                <div ref={barRef} className="timer-fill" />
            </div>
            <span ref={textRef} className="timer-text">
                0
            </span>
        </div>
    );
}

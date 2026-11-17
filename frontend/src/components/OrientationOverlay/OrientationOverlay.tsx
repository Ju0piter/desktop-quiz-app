import "./OrientationOverlay.css"
import { useState, useEffect } from 'react';
import { createPortal } from "react-dom"

export default function OrientationOverlay() {
    const [isPortraitMobile, setIsPortraitMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(orientation: portrait) and (max-width: 800px)');

        setIsPortraitMobile(mediaQuery.matches);

        const handleOrientationChange = (e: MediaQueryListEvent) => {
        setIsPortraitMobile(e.matches);
        };

        mediaQuery.addEventListener('change', handleOrientationChange);
        
        return () => mediaQuery.removeEventListener('change', handleOrientationChange);
    }, []);

    if (!isPortraitMobile) return null;

    return (
        createPortal(
            <div className="overlay-rotate">
                <div className="content-rotate">
                    <div className="icon-rotate">🔄</div>
                    <h2>Пожалуйста, переверните устройство</h2>
                    <p>Для корректного отображения интерфейса переведите экран в альбомный (горизонтальный) режим.</p>
                </div>
            </div>,document.body
        )    
    )
}




import React, { useMemo } from 'react';
import styles from './Snow.module.css';

const Snow = () => {
    // Generate snowflakes and their specific styles
    const snowflakes = useMemo(() => {
        const flakes = [];
        const total = 200;

        for (let i = 1; i <= total; i++) {
            const randomX = Math.random() * 100; // 0 to 100vw
            const randomOffset = (Math.random() * 20) - 10; // -10 to 10vw
            const randomXEnd = randomX + randomOffset;
            const randomXEndYoyo = randomX + (randomOffset / 2);
            const randomYoyoTime = 0.3 + (Math.random() * 0.5); // 0.3 to 0.8
            const randomScale = Math.random(); // 0 to 1
            const fallDuration = 10 + (Math.random() * 20); // 10s to 30s
            const fallDelay = Math.random() * -30; // -30s to 0s

            flakes.push({
                i,
                style: {
                    opacity: Math.random(),
                    transform: `translate(${randomX}vw, -10px) scale(${randomScale})`,
                    animation: `fall-${i} ${fallDuration}s ${fallDelay}s linear infinite`
                },
                keyframes: `
                    @keyframes fall-${i} {
                        ${randomYoyoTime * 100}% {
                            transform: translate(${randomXEnd}vw, ${randomYoyoTime * 100}vh) scale(${randomScale});
                        }
                        to {
                            transform: translate(${randomXEndYoyo}vw, 100vh) scale(${randomScale});
                        }
                    }
                `
            });
        }
        return flakes;
    }, []);

    return (
        <div className={styles.snowContainer}>
            <style>
                {snowflakes.map(f => f.keyframes).join('')}
            </style>
            {snowflakes.map(f => (
                <div key={f.i} className={styles.snowflake} style={f.style} />
            ))}
        </div>
    );
};

export default Snow;

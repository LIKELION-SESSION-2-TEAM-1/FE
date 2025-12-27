import React, { useEffect, useRef } from 'react';

const BouncingBalls = ({
    count = 50,
    colors = [
        "rgba(255, 10, 50, 0.5)",
        "rgba(10, 255, 50, 0.5)",
        "rgba(10, 50, 255, 0.5)",
        "rgba(0, 0, 0, 0.5)"
    ],
    speed = 20 // Lower is faster (interval ms)
}) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Balls state
        let balls = [];

        const resizeCanvas = () => {
            if (canvas && containerRef.current) {
                canvas.width = containerRef.current.clientWidth;
                canvas.height = containerRef.current.clientHeight;
                initBalls();
            }
        };

        const initBalls = () => {
            balls = [];
            for (let i = 0; i < count; i++) {
                const radius = Math.random() * 20 + 10; // 10 ~ 30
                balls.push({
                    x: Math.random() * (canvas.width - radius * 2) + radius,
                    y: Math.random() * (canvas.height - radius * 2) + radius,
                    dx: (Math.random() - 0.5) * 2, // -1 ~ 1
                    dy: (Math.random() - 0.5) * 2,
                    radius: radius,
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
            }
        };

        const update = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            balls.forEach(ball => {
                // Move
                ball.x += ball.dx;
                ball.y += ball.dy;

                // Bounce off walls
                if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
                    ball.dx = -ball.dx;
                }
                if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
                    ball.dy = -ball.dy;
                }

                // Draw
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                ctx.fillStyle = ball.color;
                ctx.fill();
                ctx.closePath();
            });

            animationFrameId = requestAnimationFrame(update);
        };

        // Init
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        update();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [count, colors]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0, // Behind content
                overflow: 'hidden',
                pointerEvents: 'none', // Allow clicks to pass through
                filter: 'blur(4px)' // requested "blur" effect
            }}
        >
            <canvas ref={canvasRef} style={{ display: 'block' }} />
        </div>
    );
};

export default BouncingBalls;


document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const missesEl = document.getElementById('misses');
    const gameOverModal = document.getElementById('gameOverModal');
    const finalScoreEl = document.getElementById('finalScore');
    const restartBtn = document.getElementById('restart-btn');

    let canvasWidth, canvasHeight;
    let score, misses, gameActive;
    let bubbles = [];
    let bubbleInterval;

    const badBubbleTexts = [
        "Coal Power", "Deforestation", "Landfills", "Diesel Trucks",
        "Air Travel", "Plastic Burning", "Factory Farming", "Industrial Smoke",
        "Single-Use Plastics", "Fast Fashion"
    ];
    const goodBubbleTexts = [
        "Solar Energy", "Wind Turbines", "Public Transport", "Reforestation",
        "Recycling", "Plant-Based Diets", "Electric Vehicles", "Efficient Appliances",
        "Green Buildings", "Water Conservation"
    ];

    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
    }

    class Bubble {
        constructor(x, y, radius, text, type) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.text = text;
            this.type = type;
            this.speedY = Math.random() * 1.5 + 1; // Random upward speed
            this.isPopped = false;
            this.fallSpeed = 5;
        }

        draw() {
            ctx.beginPath();
            if (this.type === 'good') {
                ctx.fillStyle = 'rgba(76, 175, 80, 0.7)'; // Greenish
            } else {
                ctx.fillStyle = 'rgba(211, 47, 47, 0.7)'; // Reddish
            }
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();

            // Draw text
            if (!this.isPopped) {
                ctx.fillStyle = 'white';
                ctx.font = `bold ${this.radius / 3.5}px Poppins`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.text, this.x, this.y);
            }
        }

        update() {
            if (this.isPopped) {
                // If popped, fall down
                this.y += this.fallSpeed;
            } else {
                // Otherwise, float up
                this.y -= this.speedY;
            }
            this.draw();
        }
    }

    function spawnBubble() {
        const radius = Math.random() * 30 + 50; // Radius between 50 and 80
        const x = Math.random() * (canvasWidth - radius * 2) + radius;
        const y = canvasHeight + radius;
        const type = Math.random() > 0.5 ? 'good' : 'bad';
        const text = type === 'good'
            ? goodBubbleTexts[Math.floor(Math.random() * goodBubbleTexts.length)]
            : badBubbleTexts[Math.floor(Math.random() * badBubbleTexts.length)];

        bubbles.push(new Bubble(x, y, radius, text, type));
    }

    function handleBubbles() {
        for (let i = bubbles.length - 1; i >= 0; i--) {
            bubbles[i].update();

            // Good bubble reaches the top
            if (!bubbles[i].isPopped && bubbles[i].type === 'good' && bubbles[i].y + bubbles[i].radius < 0) {
                score += 10;
                bubbles.splice(i, 1);
            }
            // Bad bubble reaches the top (a miss)
            else if (!bubbles[i].isPopped && bubbles[i].type === 'bad' && bubbles[i].y + bubbles[i].radius < 0) {
                misses++;
                bubbles.splice(i, 1);
                if (misses >= 3) {
                    endGame();
                }
            }
            // Popped bubble falls out of view
            else if (bubbles[i].isPopped && bubbles[i].y - bubbles[i].radius > canvasHeight) {
                bubbles.splice(i, 1);
            }
        }
    }

    function animate() {
        if (!gameActive) return;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        handleBubbles();
        updateStats();
        requestAnimationFrame(animate);
    }

    function updateStats() {
        scoreEl.textContent = `Score: ${score}`;
        missesEl.textContent = `Misses: ${misses}`;
    }

    function startGame() {
        score = 0;
        misses = 0;
        bubbles = [];
        gameActive = true;
        gameOverModal.style.display = 'none';

        resizeCanvas();
        animate();
        bubbleInterval = setInterval(spawnBubble, 2000);
    }

    function endGame() {
        gameActive = false;
        clearInterval(bubbleInterval);
        finalScoreEl.textContent = score;
        gameOverModal.style.display = 'block';
    }

    canvas.addEventListener('click', (event) => {
        if (!gameActive) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        for (let i = bubbles.length - 1; i >= 0; i--) {
            const bubble = bubbles[i];
            if (bubble.isPopped) continue;

            const distance = Math.sqrt((mouseX - bubble.x) ** 2 + (mouseY - bubble.y) ** 2);
            if (distance < bubble.radius) {
                if (bubble.type === 'bad') {
                    score += 5;
                    bubble.isPopped = true; // Make it fall
                } else {
                    score -= 10; // Penalty for popping a good bubble
                }
                break; // Only pop one bubble per click
            }
        }
    });

    window.addEventListener('resize', resizeCanvas);
    restartBtn.addEventListener('click', startGame);

    // Initial Start
    startGame();
});

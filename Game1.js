const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");

let score = 0;
let timeLeft = 60;
let bubbleInterval = 1500;
let bubbleSpawner;

const goodItems = [
  "Tree", "Solar Panel", "Bicycle", "Wind Turbine", "Reusable Bag",
  "Rainwater Harvesting", "Compost", "Electric Bus", "LED Bulb", "Recycling Bin",
  "Green Roof", "Public Transport", "Eco Brick", "Organic Farming", "Biodegradable Cup",
  "Cloth Diaper", "Paper Straw", "Community Garden", "Refill Station", "Eco-Friendly Soap"
];

const badItems = [
  "Plastic", "CO₂", "Oil Spill", "Smog", "Lead", "Pesticide",
  "Mercury", "E-Waste", "Microplastics", "Methane",
  "Styrofoam", "Diesel Car", "Single-use Cup", "Cigarette Butt", "Fast Fashion",
  "Battery Waste", "Chemical Fertilizer", "Toxic Paint", "Air Conditioner", "Landfill"
];

function createBubble() {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");

  const isGood = Math.random() < 0.5;
  const item = isGood
    ? goodItems[Math.floor(Math.random() * goodItems.length)]
    : badItems[Math.floor(Math.random() * badItems.length)];

  bubble.textContent = item;
  bubble.classList.add(isGood ? "good" : "bad");
  bubble.style.left = `${Math.random() * (window.innerWidth - 140)}px`;

  // Click to pop
  bubble.addEventListener("click", () => {
    bubble.style.animation = "pop 0.4s forwards";
    score += isGood ? -1 : 1;
    scoreDisplay.textContent = `Score: ${score}`;
    setTimeout(() => bubble.remove(), 400);
  });

  // Score impact if bubble reaches top
  bubble.addEventListener("animationend", () => {
    score += isGood ? 1 : -1;
    scoreDisplay.textContent = `Score: ${score}`;
    bubble.remove();
  });

  gameArea.appendChild(bubble);
}

function startGame() {
  bubbleSpawner = setInterval(createBubble, bubbleInterval);

  const timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;

    if (timeLeft % 10 === 0 && timeLeft !== 60) {
      clearInterval(bubbleSpawner);
      bubbleInterval = Math.max(400, bubbleInterval - 200);
      bubbleSpawner = setInterval(createBubble, bubbleInterval);
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      clearInterval(bubbleSpawner);
      alert(`Time's up! Final Score: ${score}`);
      window.location.href = "levels.html"; // Replace with your next page
    }
  }, 1000);
}

startGame();
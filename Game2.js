// =================================================================== //
// NAVIGATION FUNCTIONALITY                                            //
// =================================================================== //

// --- Topics Dropdown Toggle ---
const topicsDropdown = document.getElementById('topicsDropdown');

if (topicsDropdown) {
  topicsDropdown.addEventListener('click', (event) => {
    // Prevents the global click listener from firing immediately
    event.stopPropagation(); 
    topicsDropdown.classList.toggle('active');
  });
}

// --- Sidebar Toggle for Mobile/Tablet ---
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

if (sidebar && sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

// =================================================================== //
// GLOBAL CLICK HANDLERS                                               //
// =================================================================== //

// --- Close dropdown and sidebar when clicking outside ---
document.addEventListener('click', (event) => {
  // Handle dropdown closure
  if (topicsDropdown && !topicsDropdown.contains(event.target)) {
    topicsDropdown.classList.remove('active');
  }
  
  // Handle sidebar closure on mobile
  if (sidebar && sidebarToggle) {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnToggle = sidebarToggle.contains(event.target);
    
    if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('open')) {
      if (window.innerWidth < 768) { // Only on mobile view
        sidebar.classList.remove('open');
      }
    }
  }
});
/**
 * EcoSort - Interactive Waste Recycling Educational Game
 * A fun and educational game that teaches players about proper waste sorting
 * and recycling through interactive drag-and-drop gameplay.
 */

// Game State Management
const GameState = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver',
    BONUS: 'bonus'
};

// Game Configuration
const CONFIG = {
    INITIAL_LIVES: 3, // Reduced lives for more challenge
    INITIAL_TIME: 120, // 2 minutes base time
    POINTS_CORRECT: 10,
    POINTS_INCORRECT: -2, // Even smaller penalty
    LEVEL_UP_SCORE: 200, // Higher score needed for level up
    ITEM_FALL_SPEED: 4000, // Even slower initial speed (4 seconds)
    BONUS_MULTIPLIER: 2,
    MAX_ITEMS_ON_SCREEN: 3 // Even fewer items for easier gameplay
};

// Waste Item Types and Categories
const WASTE_ITEMS = {
    plastic: {
        category: 'recyclable',
        icon: '🥤',
        items: [
            { emoji: '🥤', name: 'Soda Cup' },
            { emoji: '🧴', name: 'Plastic Bottle' },
            { emoji: '🛍️', name: 'Shopping Bag' },
            { emoji: '🥡', name: 'Food Container' }
        ]
    },
    glass: {
        category: 'recyclable',
        icon: '🍷',
        items: [
            { emoji: '🍷', name: 'Wine Glass' },
            { emoji: '🍾', name: 'Glass Bottle' },
            { emoji: '🔬', name: 'Lab Glass' },
            { emoji: '💡', name: 'Light Bulb' }
        ]
    },
    metal: {
        category: 'recyclable',
        icon: '🥫',
        items: [
            { emoji: '🥫', name: 'Metal Can' },
            { emoji: '📎', name: 'Paper Clip' },
            { emoji: '🔑', name: 'Metal Key' },
            { emoji: '⚙️', name: 'Metal Gear' }
        ]
    },
    paper: {
        category: 'recyclable',
        icon: '📄',
        items: [
            { emoji: '📄', name: 'Paper Sheet' },
            { emoji: '📰', name: 'Newspaper' },
            { emoji: '📦', name: 'Cardboard Box' },
            { emoji: '📚', name: 'Books' }
        ]
    },
    organic: {
        category: 'organic',
        icon: '🍎',
        items: [
            { emoji: '🍎', name: 'Apple Core' },
            { emoji: '🍌', name: 'Banana Peel' },
            { emoji: '🥕', name: 'Carrot Scraps' },
            { emoji: '🍃', name: 'Leaves' },
            { emoji: '🌿', name: 'Plant Waste' },
            { emoji: '☘️', name: 'Organic Matter' }
        ]
    },
    trash: {
        category: 'trash',
        icon: '🗑️',
        items: [
            { emoji: '🗑️', name: 'Mixed Waste' },
            { emoji: '💊', name: 'Medicine' },
            { emoji: '🔋', name: 'Old Battery' },
            { emoji: '🧸', name: 'Stuffed Toy' },
            { emoji: '👟', name: 'Old Shoe' }
        ]
    }
};

// Eco-friendly Tips
const ECO_TIPS = [
    "Recycling one aluminum can saves enough energy to power a laptop for 11 hours!",
    "Glass bottles can be recycled endlessly without losing quality or purity.",
    "Composting organic waste reduces methane emissions and creates nutrient-rich soil.",
    "Recycling one ton of paper saves 17 trees, 7,000 gallons of water, and 3.3 cubic yards of landfill space.",
    "Plastic bottles can take up to 450 years to decompose in landfills.",
    "Electronic waste contains valuable materials like gold, silver, and copper that can be recovered.",
    "Reducing, reusing, and recycling can help decrease pollution and conserve natural resources.",
    "Every minute, about one garbage truck of plastic is dumped into our oceans.",
    "Recycling steel uses 60% less energy than making new steel from raw materials.",
    "Food waste in landfills produces methane, a greenhouse gas 25 times more potent than CO2."
];

// Game State Variables
let currentState = GameState.MENU;
let gameStats = {
    score: 0,
    level: 1,
    lives: CONFIG.INITIAL_LIVES,
    timer: CONFIG.INITIAL_TIME,
    highScore: 0
};

let gameElements = {
    fallingItems: [],
    gameInterval: null,
    timerInterval: null,
    itemSpawnInterval: null
};

let dragState = {
    isDragging: false,
    draggedElement: null,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0
};

// DOM Elements
const screens = {
    start: document.getElementById('startScreen'),
    game: document.getElementById('gameScreen'),
    pause: document.getElementById('pauseScreen'),
    gameOver: document.getElementById('gameOverScreen'),
    bonus: document.getElementById('bonusScreen')
};

const gameElements_DOM = {
    score: document.getElementById('score'),
    level: document.getElementById('level'),
    timer: document.getElementById('timer'),
    lives: document.getElementById('lives'),
    fallingItems: document.getElementById('fallingItems'),
    bins: document.querySelectorAll('.bin'),
    floatingScores: document.getElementById('floatingScores')
};

/**
 * Initialize the game when the page loads
 */
function initGame() {
    loadHighScore();
    updateHighScoreDisplay();
    setupEventListeners();
    showScreen(GameState.MENU);
    console.log('🎮 EcoSort Game Initialized!');
}

/**
 * Set up all event listeners for the game
 */
function setupEventListeners() {
    // Start screen buttons
    document.getElementById('startBtn').addEventListener('click', startGame);
    
    // Game screen buttons
    document.getElementById('pauseBtn').addEventListener('click', pauseGame);
    
    // Pause screen buttons
    document.getElementById('resumeBtn').addEventListener('click', resumeGame);
    document.getElementById('restartBtn').addEventListener('click', restartGame);
    document.getElementById('quitBtn').addEventListener('click', quitToMenu);
    
    // Game over screen buttons
    document.getElementById('playAgainBtn').addEventListener('click', startGame);
    document.getElementById('mainMenuBtn').addEventListener('click', quitToMenu);
    
    // Touch and mouse events for drag and drop
    setupDragAndDropEvents();
}

/**
 * Set up drag and drop event listeners
 */
function setupDragAndDropEvents() {
    // Mouse events
    document.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    
    // Touch events for mobile
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
}

/**
 * Show a specific screen and hide others
 */
function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    
    switch(screenName) {
        case GameState.MENU:
            screens.start.classList.add('active');
            break;
        case GameState.PLAYING:
            screens.game.classList.add('active');
            break;
        case GameState.PAUSED:
            screens.pause.classList.add('active');
            break;
        case GameState.GAME_OVER:
            screens.gameOver.classList.add('active');
            break;
        case GameState.BONUS:
            screens.bonus.classList.add('active');
            break;
    }
    
    currentState = screenName;
}

/**
 * Start a new game
 */
function startGame() {
    resetGameStats();
    clearGameElements();
    clearStuckItems(); // Clear any stuck items
    showScreen(GameState.PLAYING);
    startGameLoop();
    console.log('🎮 Game Started!');
}

/**
 * Reset game statistics to initial values
 */
function resetGameStats() {
    gameStats = {
        score: 0,
        level: 1,
        lives: CONFIG.INITIAL_LIVES,
        timer: CONFIG.INITIAL_TIME,
        highScore: gameStats.highScore
    };
    updateGameUI();
}

/**
 * Clear all game elements and intervals
 */
function clearGameElements() {
    // Clear intervals
    if (gameElements.gameInterval) {
        clearInterval(gameElements.gameInterval);
    }
    if (gameElements.timerInterval) {
        clearInterval(gameElements.timerInterval);
    }
    if (gameElements.itemSpawnInterval) {
        clearInterval(gameElements.itemSpawnInterval);
    }
    
    // Clear falling items
    gameElements.fallingItems.forEach(item => {
        if (item.element && item.element.parentNode) {
            item.element.parentNode.removeChild(item.element);
        }
    });
    gameElements.fallingItems = [];
    
    // Clear falling items container
    gameElements_DOM.fallingItems.innerHTML = '';
    
    // Remove any orphaned waste items that might be stuck
    const orphanedItems = document.querySelectorAll('.waste-item');
    orphanedItems.forEach(item => {
        if (item.parentNode) {
            item.parentNode.removeChild(item);
        }
    });
}

/**
 * Start the main game loop
 */
function startGameLoop() {
    // Start timer
    gameElements.timerInterval = setInterval(updateTimer, 1000);
    
    // Start spawning items
    spawnItem();
    startItemSpawning();
}

/**
 * Start spawning items at regular intervals
 */
function startItemSpawning() {
    const spawnDelay = Math.max(2500 - (gameStats.level * 100), 1200); // Much longer delay between spawns
    gameElements.itemSpawnInterval = setInterval(() => {
        if (gameElements.fallingItems.length < CONFIG.MAX_ITEMS_ON_SCREEN) {
            spawnItem();
        }
    }, spawnDelay);
}

/**
 * Spawn a new waste item
 */
function spawnItem() {
    const itemTypes = Object.keys(WASTE_ITEMS);
    const randomType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    const wasteType = WASTE_ITEMS[randomType];
    const randomItem = wasteType.items[Math.floor(Math.random() * wasteType.items.length)];
    
    const item = document.createElement('div');
    item.className = `waste-item ${randomType} falling`;
    item.dataset.category = wasteType.category;
    item.dataset.type = randomType;
    
    // Create item content with emoji and name
    const itemContent = document.createElement('div');
    itemContent.className = 'item-content';
    
    const emoji = document.createElement('div');
    emoji.className = 'item-emoji';
    emoji.textContent = randomItem.emoji;
    
    const name = document.createElement('div');
    name.className = 'item-name';
    name.textContent = randomItem.name;
    
    itemContent.appendChild(emoji);
    itemContent.appendChild(name);
    item.appendChild(itemContent);
    
    // Get the falling items container and game area dimensions
    const fallingItemsContainer = gameElements_DOM.fallingItems;
    const containerRect = fallingItemsContainer.getBoundingClientRect();
    
    // Center horizontally within the container
    const centerX = containerRect.width / 2;
    const randomOffsetX = (Math.random() - 0.5) * Math.min(200, containerRect.width * 0.3); // Small random offset within 30% of container width
    
    item.style.left = `${centerX + randomOffsetX - 60}px`; // Subtract half item width (60px) to center
    item.style.top = '-100px';
    item.style.zIndex = '15';
    
    gameElements_DOM.fallingItems.appendChild(item);
    
    // Add to falling items array
    const fallSpeed = Math.max(CONFIG.ITEM_FALL_SPEED - (gameStats.level * 100), 2000);
    const itemData = {
        element: item,
        speed: fallSpeed,
        category: wasteType.category
    };
    
    gameElements.fallingItems.push(itemData);
    
    // Animate falling
    animateItemFall(itemData);
}

/**
 * Animate item falling down
 */
function animateItemFall(itemData) {
    const item = itemData.element;
    const gameArea = document.querySelector('.game-area');
    const binsContainer = document.querySelector('.bins-container');
    
    // Calculate fall height to stop before bins
    const gameAreaHeight = gameArea.getBoundingClientRect().height;
    const binsHeight = binsContainer.getBoundingClientRect().height;
    const fallHeight = gameAreaHeight - binsHeight - 100; // Extra margin to avoid overlap
    
    item.style.transition = `transform ${itemData.speed}ms linear`;
    item.style.transform = `translateX(-50%) translateY(${fallHeight}px)`;
    
    // Remove item when it reaches bottom
    setTimeout(() => {
        if (item.parentNode && !dragState.isDragging) {
            removeItem(itemData);
            // Lose a life if item wasn't sorted
            loseLife();
        }
    }, itemData.speed);
}

/**
 * Remove an item from the game
 */
function removeItem(itemData) {
    const index = gameElements.fallingItems.indexOf(itemData);
    if (index > -1) {
        gameElements.fallingItems.splice(index, 1);
    }
    
    if (itemData.element && itemData.element.parentNode) {
        itemData.element.parentNode.removeChild(itemData.element);
    }
}

/**
 * Clear any stuck or orphaned items from the game area
 */
function clearStuckItems() {
    const allWasteItems = document.querySelectorAll('.waste-item');
    allWasteItems.forEach(item => {
        // Remove items that are positioned over bins or in unexpected locations
        const rect = item.getBoundingClientRect();
        const bins = document.querySelectorAll('.bin');
        
        bins.forEach(bin => {
            const binRect = bin.getBoundingClientRect();
            if (rect.left >= binRect.left && rect.right <= binRect.right &&
                rect.top >= binRect.top && rect.bottom <= binRect.bottom) {
                // Item is positioned over a bin, remove it
                if (item.parentNode) {
                    item.parentNode.removeChild(item);
                }
                // Also remove from gameElements array
                gameElements.fallingItems = gameElements.fallingItems.filter(
                    itemData => itemData.element !== item
                );
            }
        });
    });
}

/**
 * Handle drag start (mouse)
 */
function handleDragStart(e) {
    if (currentState !== GameState.PLAYING) return;
    
    const target = e.target;
    // Find the waste-item element (could be the target itself or a parent)
    const wasteItem = target.closest('.waste-item');
    if (!wasteItem) return;
    
    e.preventDefault();
    startDrag(wasteItem, e.clientX, e.clientY);
}

/**
 * Handle touch start (mobile)
 */
function handleTouchStart(e) {
    if (currentState !== GameState.PLAYING) return;
    
    const target = e.target;
    // Find the waste-item element (could be the target itself or a parent)
    const wasteItem = target.closest('.waste-item');
    if (!wasteItem) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    startDrag(wasteItem, touch.clientX, touch.clientY);
}

/**
 * Start dragging an item
 */
function startDrag(element, x, y) {
    dragState.isDragging = true;
    dragState.draggedElement = element;
    
    const rect = element.getBoundingClientRect();
    dragState.offsetX = x - rect.left;
    dragState.offsetY = y - rect.top;
    
    element.classList.add('dragging');
    element.classList.remove('falling');
    element.style.position = 'fixed';
    element.style.zIndex = '1000';
    element.style.transition = 'none';
    element.style.transform = 'scale(1.3)';
    
    // Position element at cursor
    element.style.left = `${x - dragState.offsetX}px`;
    element.style.top = `${y - dragState.offsetY}px`;
}

/**
 * Handle drag move (mouse)
 */
function handleDragMove(e) {
    if (!dragState.isDragging) return;
    e.preventDefault();
    updateDragPosition(e.clientX, e.clientY);
}

/**
 * Handle touch move (mobile)
 */
function handleTouchMove(e) {
    if (!dragState.isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    updateDragPosition(touch.clientX, touch.clientY);
}

/**
 * Update drag position
 */
function updateDragPosition(x, y) {
    if (!dragState.draggedElement) return;
    
    dragState.draggedElement.style.left = `${x - dragState.offsetX}px`;
    dragState.draggedElement.style.top = `${y - dragState.offsetY}px`;
    
    // Highlight bins when item is over them
    highlightBins(x, y);
}

/**
 * Highlight bins when item is dragged over them
 */
function highlightBins(x, y) {
    gameElements_DOM.bins.forEach(bin => {
        bin.classList.remove('highlight');
        
        const rect = bin.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            bin.classList.add('highlight');
        }
    });
}

/**
 * Handle drag end (mouse)
 */
function handleDragEnd(e) {
    if (!dragState.isDragging) return;
    e.preventDefault();
    endDrag(e.clientX, e.clientY);
}

/**
 * Handle touch end (mobile)
 */
function handleTouchEnd(e) {
    if (!dragState.isDragging) return;
    e.preventDefault();
    const touch = e.changedTouches[0];
    endDrag(touch.clientX, touch.clientY);
}

/**
 * End dragging and check if item was dropped in correct bin
 */
function endDrag(x, y) {
    if (!dragState.draggedElement) return;
    
    const element = dragState.draggedElement;
    const category = element.dataset.category;
    
    // Find which bin the item was dropped on
    let droppedBin = null;
    gameElements_DOM.bins.forEach(bin => {
        const rect = bin.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            droppedBin = bin;
        }
        bin.classList.remove('highlight');
    });
    
    // Check if item was sorted correctly
    if (droppedBin) {
        const binType = droppedBin.dataset.type;
        const isCorrect = category === binType;
        
        if (isCorrect) {
            handleCorrectSort(element, x, y);
        } else {
            handleIncorrectSort(element, x, y);
        }
    }
    
    // Clean up drag state
    resetDragState();
}

/**
 * Handle correct sorting
 */
function handleCorrectSort(element, x, y) {
    const points = CONFIG.POINTS_CORRECT * gameStats.level;
    gameStats.score += points;
    
    // Add small time bonus for correct sorting (every 5th correct item)
    if (gameStats.score % 50 === 0) {
        gameStats.timer += 5; // Bonus 5 seconds every 50 points
        showFloatingScore('+5s', x, y - 30, true);
    }
    
    // Play correct sound
    playSound('correct');
    
    // Show floating score
    showFloatingScore(points, x, y, true);
    
    // Remove item
    const itemData = gameElements.fallingItems.find(item => item.element === element);
    if (itemData) {
        removeItem(itemData);
    }
    
    // Check for level up
    checkLevelUp();
    
    // Update UI
    updateGameUI();
}

/**
 * Handle incorrect sorting
 */
function handleIncorrectSort(element, x, y) {
    const points = CONFIG.POINTS_INCORRECT;
    gameStats.score = Math.max(0, gameStats.score + points);
    
    // Play wrong sound
    playSound('wrong');
    
    // Show floating score
    showFloatingScore(points, x, y, false);
    
    // Remove item
    const itemData = gameElements.fallingItems.find(item => item.element === element);
    if (itemData) {
        removeItem(itemData);
    }
    
    // Lose a life
    loseLife();
    
    // Update UI
    updateGameUI();
}

/**
 * Reset drag state
 */
function resetDragState() {
    if (dragState.draggedElement) {
        dragState.draggedElement.classList.remove('dragging');
        // Reset positioning for items that weren't successfully sorted
        if (dragState.draggedElement.parentNode) {
            dragState.draggedElement.classList.add('falling');
            dragState.draggedElement.style.position = 'absolute';
            dragState.draggedElement.style.zIndex = '15';
        }
    }
    
    dragState.isDragging = false;
    dragState.draggedElement = null;
    dragState.offsetX = 0;
    dragState.offsetY = 0;
}

/**
 * Show floating score animation
 */
function showFloatingScore(points, x, y, isPositive) {
    const scoreElement = document.createElement('div');
    scoreElement.className = `floating-score ${isPositive ? 'positive' : 'negative'}`;
    scoreElement.textContent = `${points > 0 ? '+' : ''}${points}`;
    scoreElement.style.left = `${x}px`;
    scoreElement.style.top = `${y}px`;
    
    gameElements_DOM.floatingScores.appendChild(scoreElement);
    
    // Remove after animation
    setTimeout(() => {
        if (scoreElement.parentNode) {
            scoreElement.parentNode.removeChild(scoreElement);
        }
    }, 2000);
}

/**
 * Show level up notification
 */
function showLevelUpNotification() {
    const notification = document.createElement('div');
    notification.className = 'floating-score positive';
    notification.textContent = `Level ${gameStats.level}!`;
    notification.style.left = '50%';
    notification.style.top = '40%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.fontSize = '3.5rem';
    notification.style.fontWeight = '900';
    notification.style.zIndex = '2000';
    notification.style.textShadow = '3px 3px 6px rgba(0, 0, 0, 0.5)';
    notification.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    notification.style.webkitBackgroundClip = 'text';
    notification.style.webkitTextFillColor = 'transparent';
    notification.style.backgroundClip = 'text';
    
    gameElements_DOM.floatingScores.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 4000);
}

/**
 * Play sound effect
 */
function playSound(soundType) {
    try {
        // Create audio context for better browser support
        const audio = new Audio();
        
        if (soundType === 'correct') {
            // Correct sound - positive tone
            audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMZBjOL0fPAZSEEJIXI8N2QQAoUXrTp66hVFA==';
        } else if (soundType === 'wrong') {
            // Wrong sound - negative tone
            audio.src = 'data:audio/wav;base64,UklGRv4CAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YdoCAAC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4';
        }
        
        audio.volume = 0.3;
        audio.play().catch(e => {
            // Handle browsers that block autoplay
            console.log('Audio play blocked:', e);
        });
    } catch (e) {
        console.log('Sound not available:', e);
    }
}

/**
 * Check if player should level up
 */
function checkLevelUp() {
    const requiredScore = gameStats.level * CONFIG.LEVEL_UP_SCORE;
    if (gameStats.score >= requiredScore) {
        gameStats.level++;
        
        // Show level up notification
        showLevelUpNotification();
        
        // Add bonus time for leveling up (more bonus time)
        gameStats.timer += 30; // Bonus 30 seconds per level
        
        // Show bonus round every 5 levels (less frequent)
        if (gameStats.level % 5 === 0) {
            startBonusRound();
        } else {
            // Restart item spawning with new speed
            clearInterval(gameElements.itemSpawnInterval);
            startItemSpawning();
        }
    }
}

/**
 * Start bonus round
 */
function startBonusRound() {
    showScreen(GameState.BONUS);
    
    // Countdown
    let countdown = 3;
    const countdownElement = document.getElementById('bonusCountdown');
    
    const countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            
            // Start bonus round gameplay
            showScreen(GameState.PLAYING);
            
            // Spawn multiple items quickly
            for (let i = 0; i < 5; i++) {
                setTimeout(() => spawnItem(), i * 300);
            }
            
            // Resume normal spawning
            clearInterval(gameElements.itemSpawnInterval);
            startItemSpawning();
        }
    }, 1000);
}

/**
 * Lose a life
 */
function loseLife() {
    gameStats.lives--;
    
    if (gameStats.lives <= 0) {
        endGame();
    }
}

/**
 * Update timer
 */
function updateTimer() {
    gameStats.timer--;
    
    // Add visual warning when time is running low
    const timerElement = gameElements_DOM.timer;
    if (gameStats.timer <= 30) {
        timerElement.style.color = '#ef4444'; // Red warning
        timerElement.style.animation = 'pulse 1s infinite';
        
        // Show urgent warning at 10 seconds
        if (gameStats.timer === 10) {
            const warningElement = document.createElement('div');
            warningElement.className = 'floating-score negative';
            warningElement.textContent = 'TIME LOW!';
            warningElement.style.left = '50%';
            warningElement.style.top = '30%';
            warningElement.style.transform = 'translate(-50%, -50%)';
            warningElement.style.fontSize = '3rem';
            warningElement.style.fontWeight = '900';
            warningElement.style.zIndex = '2000';
            warningElement.style.animation = 'pulse 0.5s infinite';
            
            gameElements_DOM.floatingScores.appendChild(warningElement);
            
            setTimeout(() => {
                if (warningElement.parentNode) {
                    warningElement.parentNode.removeChild(warningElement);
                }
            }, 3000);
        }
    } else if (gameStats.timer <= 60) {
        timerElement.style.color = '#f59e0b'; // Orange warning
    } else {
        timerElement.style.color = ''; // Normal color
        timerElement.style.animation = '';
    }
    
    if (gameStats.timer <= 0) {
        endGame();
    }
    
    updateGameUI();
}

/**
 * Update game UI elements
 */
function updateGameUI() {
    gameElements_DOM.score.textContent = gameStats.score;
    gameElements_DOM.level.textContent = gameStats.level;
    gameElements_DOM.timer.textContent = gameStats.timer;
    gameElements_DOM.lives.textContent = gameStats.lives;
}

/**
 * End the game
 */
function endGame() {
    clearGameElements();
    
    // Update high score
    if (gameStats.score > gameStats.highScore) {
        gameStats.highScore = gameStats.score;
        saveHighScore();
        document.getElementById('newHighScore').style.display = 'block';
    } else {
        document.getElementById('newHighScore').style.display = 'none';
    }
    
    // Update final stats
    document.getElementById('finalScore').textContent = gameStats.score;
    document.getElementById('finalLevel').textContent = gameStats.level;
    document.getElementById('finalHighScore').textContent = gameStats.highScore;
    
    // Show random eco tip
    const randomTip = ECO_TIPS[Math.floor(Math.random() * ECO_TIPS.length)];
    document.getElementById('ecoTipText').textContent = randomTip;
    
    showScreen(GameState.GAME_OVER);
    console.log('🎮 Game Over!');
}

/**
 * Pause the game
 */
function pauseGame() {
    if (currentState !== GameState.PLAYING) return;
    
    // Pause all intervals
    clearInterval(gameElements.timerInterval);
    clearInterval(gameElements.itemSpawnInterval);
    
    // Pause falling animations
    gameElements.fallingItems.forEach(item => {
        if (item.element) {
            item.element.style.animationPlayState = 'paused';
        }
    });
    
    // Update pause screen stats
    document.getElementById('pauseScore').textContent = gameStats.score;
    document.getElementById('pauseLevel').textContent = gameStats.level;
    
    showScreen(GameState.PAUSED);
}

/**
 * Resume the game
 */
function resumeGame() {
    if (currentState !== GameState.PAUSED) return;
    
    // Resume intervals
    gameElements.timerInterval = setInterval(updateTimer, 1000);
    startItemSpawning();
    
    // Resume falling animations
    gameElements.fallingItems.forEach(item => {
        if (item.element) {
            item.element.style.animationPlayState = 'running';
        }
    });
    
    showScreen(GameState.PLAYING);
}

/**
 * Restart the game
 */
function restartGame() {
    clearGameElements();
    startGame();
}

/**
 * Quit to main menu
 */
function quitToMenu() {
    clearGameElements();
    showScreen(GameState.MENU);
}

/**
 * Load high score from localStorage
 */
function loadHighScore() {
    const savedHighScore = localStorage.getItem('ecoSortHighScore');
    if (savedHighScore) {
        gameStats.highScore = parseInt(savedHighScore, 10);
    }
}

/**
 * Save high score to localStorage
 */
function saveHighScore() {
    localStorage.setItem('ecoSortHighScore', gameStats.highScore.toString());
}

/**
 * Update high score display
 */
function updateHighScoreDisplay() {
    document.getElementById('displayHighScore').textContent = gameStats.highScore;
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);

// Prevent context menu on long press (mobile)
document.addEventListener('contextmenu', e => {
    const wasteItem = e.target.closest('.waste-item');
    if (wasteItem) {
        e.preventDefault();
    }
});

// Handle visibility change (pause when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && currentState === GameState.PLAYING) {
        pauseGame();
    }
});

console.log('🌱 EcoSort Game Loaded Successfully! 🌱');
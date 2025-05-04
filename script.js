// Game state
let gameState = {
    potatoes: 0,
    potatoesPerClick: 1,
    darkMode: true,
    upgrades: {
        goldenPotato: {
            owned: false,
            cost: 100,
            multiplier: 2,
            imageUrl: 'https://media.discordapp.net/attachments/1352514757097427037/1368493066289414185/image.png?ex=68186bfc&is=68171a7c&hm=11055cb4dda1b6d24cf1983fe9b7b60b00a0ebfc63e2ca167e0ffa9744b1a8d5'
        },
        rainbowPotato: {
            owned: false,
            cost: 500,
            multiplier: 5,
            imageUrl: 'https://cdn.discordapp.com/attachments/1352514757097427037/1368493624035250277/AJfQ9KTMeUOIPKBZyZrj8WnAe-5QjpTz2sWsS_O7owyvnLZ41NliPp4PGiveyfjaHFP-0wtCOrhejo-ygIeRPNVWkTQorJW9ZolAxueeYUEojyqZgbMsvJG8-sayD9eYPx4_8FOfuRlRkPbWr9Ci6ElsnfSV2UnKMrHH2P0sa8FIuoa0LNjaJQ.png'
        },
        spacePotato: {
            owned: false,
            cost: 2500,
            multiplier: 25,
            imageUrl: 'https://cdn.discordapp.com/attachments/1352514757097427037/1368493865920892969/AJfQ9KRw5D7I1UG4PQXq9H5j8PTSPvh-or3Aay8Kw6JlsguXvE2im7RybxCuG5a3_j4dfcOtdvQ6RbcgmuP-07PMwUdhHfmwbb1CX-AnDgP9CC_PX8qxJC5jhHsB8tPfdPK0pvP8uvncUiR2LoM3hJExRJ-5SZ8bfbD9ff9OLbR2ENA4UEV13w.png'
        },
        robotPotato: {
            owned: false,
            cost: 10000,
            multiplier: 100,
            imageUrl: 'https://cdn.discordapp.com/attachments/1352514757097427037/1368494183249346593/AJfQ9KQeAPi-olyEOgS5Uhuv8POCkDvqEmYIKT-0Hksb4AEhNk_A9_vH5boHm3GQbifLxWxh7mucLPlIpcFqMkz2NFYSaf0b9FqT4e4vz6_LI1inT65bFh_6uS7RwwuT7FVEyF-kbfX2hbdcppw_kSxdXjleRiZOmwBaT2RlU0qP2oCopcZTAQ.png'
        },
        quantumPotato: {
            owned: false,
            cost: 50000,
            multiplier: 500,
            imageUrl: 'https://cdn-icons-png.flaticon.com/512/9795/9795328.png'
        }
    },
    basePotatoImage: 'https://cdn.discordapp.com/attachments/1352514757097427037/1368492928607064064/image.png?ex=68186bdb&is=68171a5b&hm=958d4e783b5d3b33767d683934714a24f05e5e2608f5cce44229668a98388094&'
};

// DOM Elements
const potatoImage = document.getElementById('potato');
const potatoCount = document.getElementById('potato-count');
const potatoesPerClickEl = document.getElementById('potatoes-per-click');
const goldenPotatoCost = document.getElementById('golden-potato-cost');
const rainbowPotatoCost = document.getElementById('rainbow-potato-cost');
const spacePotatoCost = document.getElementById('space-potato-cost');
const robotPotatoCost = document.getElementById('robot-potato-cost');
const quantumPotatoCost = document.getElementById('quantum-potato-cost');
const buyGoldenPotatoBtn = document.getElementById('buy-golden-potato');
const buyRainbowPotatoBtn = document.getElementById('buy-rainbow-potato');
const buySpacePotatoBtn = document.getElementById('buy-space-potato');
const buyRobotPotatoBtn = document.getElementById('buy-robot-potato');
const buyQuantumPotatoBtn = document.getElementById('buy-quantum-potato');
const potatoContainer = document.querySelector('.potato-container');

// Update the display
function updateDisplay() {
    potatoCount.textContent = Math.floor(gameState.potatoes);
    potatoesPerClickEl.textContent = gameState.potatoesPerClick;
    
    // Update upgrade buttons
    updateUpgradeButtons();
}

// Update upgrade buttons (mark as owned or disable based on affordability)
function updateUpgradeButtons() {
    updateUpgradeButton('goldenPotato', buyGoldenPotatoBtn);
    updateUpgradeButton('rainbowPotato', buyRainbowPotatoBtn);
    updateUpgradeButton('spacePotato', buySpacePotatoBtn);
    updateUpgradeButton('robotPotato', buyRobotPotatoBtn);
    updateUpgradeButton('quantumPotato', buyQuantumPotatoBtn);
}

// Update a single upgrade button
function updateUpgradeButton(upgradeKey, button) {
    const upgrade = gameState.upgrades[upgradeKey];
    const upgradeElement = document.getElementById(upgradeKey);
    
    if (upgrade.owned) {
        // If owned, show "OWNED" and hide the cost
        button.textContent = "OWNED";
        button.disabled = true;
        button.classList.add('owned');
        upgradeElement.classList.add('owned-upgrade');
        // Hide the cost text when owned
        document.querySelector(`#${upgradeKey} p:last-of-type`).style.display = 'none';
    } else {
        // Not owned, check if affordable
        button.disabled = gameState.potatoes < upgrade.cost;
        button.textContent = "Buy";
        button.classList.remove('owned');
        upgradeElement.classList.remove('owned-upgrade');
        document.querySelector(`#${upgradeKey} p:last-of-type`).style.display = 'block';
    }
}

// Click the potato
function clickPotato() {
    gameState.potatoes += gameState.potatoesPerClick;
    
    // Add a pop animation
    potatoImage.classList.add('pop');
    setTimeout(() => {
        potatoImage.classList.remove('pop');
    }, 300);
    
    // Create a floating number
    createFloatingNumber(gameState.potatoesPerClick);
    
    updateDisplay();
}

// Create floating number animation when potato is clicked
function createFloatingNumber(value) {
    const floatingNum = document.createElement('div');
    floatingNum.textContent = `+${value}`;
    floatingNum.style.position = 'absolute';
    floatingNum.style.color = gameState.darkMode ? '#ffb74d' : '#8B4513';
    floatingNum.style.fontWeight = 'bold';
    floatingNum.style.fontSize = '1.5rem';
    floatingNum.style.pointerEvents = 'none';
    
    // Position near the potato
    const potatoRect = potatoImage.getBoundingClientRect();
    floatingNum.style.left = `${potatoRect.left + Math.random() * potatoRect.width}px`;
    floatingNum.style.top = `${potatoRect.top + Math.random() * 20}px`;
    
    // Add animation
    floatingNum.style.transition = 'top 1s ease-out, opacity 1s ease-out';
    
    document.body.appendChild(floatingNum);
    
    setTimeout(() => {
        floatingNum.style.top = `${parseFloat(floatingNum.style.top) - 100}px`;
        floatingNum.style.opacity = '0';
    }, 10);
    
    // Remove from DOM after animation
    setTimeout(() => {
        document.body.removeChild(floatingNum);
    }, 1000);
}

// Buy an upgrade
function buyUpgrade(upgradeKey) {
    const upgrade = gameState.upgrades[upgradeKey];
    
    if (!upgrade.owned && gameState.potatoes >= upgrade.cost) {
        gameState.potatoes -= upgrade.cost;
        upgrade.owned = true;
        gameState.potatoesPerClick *= upgrade.multiplier;
        
        // Update display
        updateDisplay();
        
        // Update potato image based on highest owned upgrade
        updatePotatoImage();
        
        // Show upgrade effect animation
        showUpgradeEffect(upgradeKey);
    }
}

// Update potato image based on highest owned upgrade
function updatePotatoImage() {
    // Remove all special classes
    potatoImage.className = '';
    
    // Reset the potato container background
    potatoContainer.style.backgroundImage = 'none';
    
    if (gameState.upgrades.quantumPotato.owned) {
        // Quantum potato
        potatoImage.src = gameState.upgrades.quantumPotato.imageUrl;
        potatoImage.classList.add('glow');
    } else if (gameState.upgrades.robotPotato.owned) {
        // Powertato
        potatoImage.src = gameState.upgrades.robotPotato.imageUrl;
        potatoImage.classList.add('spin');
    } else if (gameState.upgrades.spacePotato.owned) {
        // Megatato
        potatoImage.src = gameState.upgrades.spacePotato.imageUrl;
    } else if (gameState.upgrades.rainbowPotato.owned) {
        // Poketato
        potatoImage.src = gameState.upgrades.rainbowPotato.imageUrl;
    } else if (gameState.upgrades.goldenPotato.owned) {
        // Sky potato - apply the sky background
        potatoImage.src = gameState.basePotatoImage;
        potatoContainer.style.backgroundImage = `url(${gameState.upgrades.goldenPotato.imageUrl})`;
        potatoContainer.classList.add('sky-background');
    } else {
        // Base potato
        potatoImage.src = gameState.basePotatoImage;
    }
}

// Show upgrade effect animation
function showUpgradeEffect(upgradeKey) {
    const effect = document.createElement('div');
    effect.className = 'upgrade-effect';
    
    const message = document.createElement('div');
    
    // Customize message based on upgrade
    switch(upgradeKey) {
        case 'goldenPotato':
            message.textContent = 'SKY UPGRADE!';
            message.style.color = 'skyblue';
            break;
        case 'rainbowPotato':
            message.textContent = 'POKETATO UPGRADE!';
            message.style.background = 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)';
            message.style.webkitBackgroundClip = 'text';
            message.style.webkitTextFillColor = 'transparent';
            break;
        case 'spacePotato':
            message.textContent = 'MEGATATO UPGRADE!';
            message.style.color = 'blue';
            message.style.textShadow = '0 0 5px white, 0 0 10px white, 0 0 15px blue';
            break;
        case 'robotPotato':
            message.textContent = 'POWERTATO UPGRADE!';
            message.style.color = 'red';
            message.style.textShadow = '0 0 5px orange, 0 0 10px yellow';
            break;
        case 'quantumPotato':
            message.textContent = 'QUANTUM UPGRADE!';
            message.style.color = 'purple';
            message.style.textShadow = '0 0 10px purple, 0 0 20px white';
            break;
        default:
            message.textContent = 'UPGRADE!';
    }
    
    effect.appendChild(message);
    document.body.appendChild(effect);
    
    // Fade in
    setTimeout(() => {
        effect.style.opacity = '1';
    }, 10);
    
    // Fade out and remove
    setTimeout(() => {
        effect.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(effect);
        }, 500);
    }, 1000);
}

// Toggle dark mode
function toggleDarkMode() {
    gameState.darkMode = !gameState.darkMode;
    if (gameState.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    saveGame();
}

// Save game state to local storage
function saveGame() {
    localStorage.setItem('potatoClickerSave', JSON.stringify(gameState));
}

// Load game state from local storage
function loadGame() {
    const savedState = localStorage.getItem('potatoClickerSave');
    if (savedState) {
        gameState = JSON.parse(savedState);
        // Apply dark mode if it was enabled
        if (gameState.darkMode) {
            document.body.classList.add('dark-mode');
        }
        updateDisplay();
        updatePotatoImage();
    }
}

// Event listeners
potatoImage.addEventListener('click', clickPotato);
buyGoldenPotatoBtn.addEventListener('click', () => buyUpgrade('goldenPotato'));
buyRainbowPotatoBtn.addEventListener('click', () => buyUpgrade('rainbowPotato'));
buySpacePotatoBtn.addEventListener('click', () => buyUpgrade('spacePotato'));
buyRobotPotatoBtn.addEventListener('click', () => buyUpgrade('robotPotato'));
buyQuantumPotatoBtn.addEventListener('click', () => buyUpgrade('quantumPotato'));

// Add dark mode toggle listener
document.getElementById('dark-mode-toggle')?.addEventListener('click', toggleDarkMode);

// Auto-save every 30 seconds
setInterval(saveGame, 30000);

// Initialize the game
function initGame() {
    loadGame();
    
    // Apply dark mode by default if no saved state exists
    if (!localStorage.getItem('potatoClickerSave')) {
        document.body.classList.add('dark-mode');
    }
    
    updateDisplay();
}

// Initialize the game
initGame(); 
// Game state
let gameState = {
    potatoes: 0,
    potatoesPerClick: 1,
    potatoesPerSecond: 0,
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
            imageUrl: 'assets/poketato.png'
        },
        spacePotato: {
            owned: false,
            cost: 2500,
            multiplier: 25,
            imageUrl: 'assets/megatato.png'
        },
        robotPotato: {
            owned: false,
            cost: 10000,
            multiplier: 100,
            imageUrl: 'assets/powertato.png'
        },
        quantumPotato: {
            owned: false,
            cost: 50000,
            multiplier: 500,
            imageUrl: 'assets/quantumpotatoe.png'
        }
    },
    farms: {
        smallPlot: {
            owned: 0,
            cost: 50,
            baseCost: 50,
            production: 1
        },
        potatoField: {
            owned: 0,
            cost: 250,
            baseCost: 250,
            production: 5
        },
        potatoGreenhouse: {
            owned: 0,
            cost: 1000,
            baseCost: 1000,
            production: 20
        },
        potatoFactory: {
            owned: 0,
            cost: 5000,
            baseCost: 5000,
            production: 100
        },
        potatoLab: {
            owned: 0,
            cost: 25000,
            baseCost: 25000,
            production: 500
        }
    },
    events: {
        famine: {
            active: false,
            duration: 30,
            timeLeft: 0,
            productionModifier: 0.25 // 75% reduction
        }
    },
    basePotatoImage: 'https://cdn.discordapp.com/attachments/1352514757097427037/1368492928607064064/image.png?ex=68186bdb&is=68171a5b&hm=958d4e783b5d3b33767d683934714a24f05e5e2608f5cce44229668a98388094&'
};

// DOM Elements
const potatoImage = document.getElementById('potato');
const potatoCount = document.getElementById('potato-count');
const potatoesPerClickEl = document.getElementById('potatoes-per-click');
const potatoesPerSecondEl = document.getElementById('potatoes-per-second');
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
const smallPlotCost = document.getElementById('small-plot-cost');
const potatoFieldCost = document.getElementById('potato-field-cost');
const potatoGreenhouseCost = document.getElementById('potato-greenhouse-cost');
const potatoFactoryCost = document.getElementById('potato-factory-cost');
const potatoLabCost = document.getElementById('potato-lab-cost');
const smallPlotCount = document.getElementById('small-plot-count');
const potatoFieldCount = document.getElementById('potato-field-count');
const potatoGreenhouseCount = document.getElementById('potato-greenhouse-count');
const potatoFactoryCount = document.getElementById('potato-factory-count');
const potatoLabCount = document.getElementById('potato-lab-count');
const buySmallPlotBtn = document.getElementById('buy-small-plot');
const buyPotatoFieldBtn = document.getElementById('buy-potato-field');
const buyPotatoGreenhouseBtn = document.getElementById('buy-potato-greenhouse');
const buyPotatoFactoryBtn = document.getElementById('buy-potato-factory');
const buyPotatoLabBtn = document.getElementById('buy-potato-lab');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const famineAlert = document.getElementById('famine-alert');
const famineTimeLeft = document.getElementById('famine-time');

// Update the display
function updateDisplay() {
    potatoCount.textContent = Math.floor(gameState.potatoes);
    potatoesPerClickEl.textContent = gameState.potatoesPerClick;
    potatoesPerSecondEl.textContent = calculatePotatoesPerSecond();
    
    // Update upgrade buttons
    updateUpgradeButtons();
    
    // Update farm counts and costs
    smallPlotCount.textContent = gameState.farms.smallPlot.owned;
    potatoFieldCount.textContent = gameState.farms.potatoField.owned;
    potatoGreenhouseCount.textContent = gameState.farms.potatoGreenhouse.owned;
    potatoFactoryCount.textContent = gameState.farms.potatoFactory.owned;
    potatoLabCount.textContent = gameState.farms.potatoLab.owned;
    
    smallPlotCost.textContent = Math.floor(gameState.farms.smallPlot.cost);
    potatoFieldCost.textContent = Math.floor(gameState.farms.potatoField.cost);
    potatoGreenhouseCost.textContent = Math.floor(gameState.farms.potatoGreenhouse.cost);
    potatoFactoryCost.textContent = Math.floor(gameState.farms.potatoFactory.cost);
    potatoLabCost.textContent = Math.floor(gameState.farms.potatoLab.cost);
    
    // Update farm buttons
    updateFarmButtons();
    
    // Update famine UI
    updateFamineUI();
}

// Calculate total potatoes per second with modifiers
function calculatePotatoesPerSecond() {
    let total = 0;
    
    Object.keys(gameState.farms).forEach(farmKey => {
        const farm = gameState.farms[farmKey];
        total += farm.owned * farm.production;
    });
    
    // Apply famine modifier if active
    if (gameState.events.famine.active) {
        total *= gameState.events.famine.productionModifier;
    }
    
    return Math.floor(total);
}

// Update upgrade buttons (mark as owned or disable based on affordability)
function updateUpgradeButtons() {
    updateUpgradeButton('goldenPotato', buyGoldenPotatoBtn);
    updateUpgradeButton('rainbowPotato', buyRainbowPotatoBtn);
    updateUpgradeButton('spacePotato', buySpacePotatoBtn);
    updateUpgradeButton('robotPotato', buyRobotPotatoBtn);
    updateUpgradeButton('quantumPotato', buyQuantumPotatoBtn);
}

// Update farm buttons (disable based on affordability)
function updateFarmButtons() {
    buySmallPlotBtn.disabled = gameState.potatoes < gameState.farms.smallPlot.cost;
    buyPotatoFieldBtn.disabled = gameState.potatoes < gameState.farms.potatoField.cost;
    buyPotatoGreenhouseBtn.disabled = gameState.potatoes < gameState.farms.potatoGreenhouse.cost;
    buyPotatoFactoryBtn.disabled = gameState.potatoes < gameState.farms.potatoFactory.cost;
    buyPotatoLabBtn.disabled = gameState.potatoes < gameState.farms.potatoLab.cost;
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

// Update famine UI
function updateFamineUI() {
    if (gameState.events.famine.active) {
        famineAlert.classList.remove('hidden');
        famineTimeLeft.textContent = gameState.events.famine.timeLeft;
    } else {
        famineAlert.classList.add('hidden');
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

// Buy a farm
function buyFarm(farmKey) {
    const farm = gameState.farms[farmKey];
    
    if (gameState.potatoes >= farm.cost) {
        gameState.potatoes -= farm.cost;
        farm.owned++;
        
        // Increase cost for next purchase (15% increase)
        farm.cost = Math.floor(farm.baseCost * Math.pow(1.15, farm.owned));
        
        // Update potatoes per second
        gameState.potatoesPerSecond = calculatePotatoesPerSecond();
        
        // Update display
        updateDisplay();
    }
}

// Update potato image based on highest owned upgrade
function updatePotatoImage() {
    // Remove all special classes
    potatoImage.className = '';
    
    // Check if sky background should be visible
    if (gameState.upgrades.goldenPotato.owned) {
        // Always apply sky background if it's been unlocked
        potatoContainer.style.backgroundImage = `url(${gameState.upgrades.goldenPotato.imageUrl})`;
        potatoContainer.classList.add('sky-background');
    } else {
        // Reset the potato container background if not unlocked
        potatoContainer.style.backgroundImage = 'none';
    }
    
    // Apply highest owned potato image
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

// Start a potato famine event
function startFamine() {
    if (!gameState.events.famine.active) {
        gameState.events.famine.active = true;
        gameState.events.famine.timeLeft = gameState.events.famine.duration;
        
        // Show famine alert with shake animation
        famineAlert.classList.remove('hidden');
        famineAlert.classList.add('shake');
        setTimeout(() => {
            famineAlert.classList.remove('shake');
        }, 500);
        
        // Update display to show reduced production
        updateDisplay();
    }
}

// End the famine event
function endFamine() {
    gameState.events.famine.active = false;
    updateDisplay();
}

// Update famine timer
function updateFamineTimer() {
    if (gameState.events.famine.active) {
        gameState.events.famine.timeLeft--;
        
        if (gameState.events.famine.timeLeft <= 0) {
            endFamine();
        } else {
            famineTimeLeft.textContent = gameState.events.famine.timeLeft;
        }
    }
}

// Passive income from farms
function generatePassiveIncome() {
    if (calculatePotatoesPerSecond() > 0) {
        // Add potatoes based on production rate
        gameState.potatoes += calculatePotatoesPerSecond() / 10; // Divide by 10 because we update 10 times per second
        
        // Update the counter
        potatoCount.textContent = Math.floor(gameState.potatoes);
        
        // Enable/disable buttons based on new potato count
        updateUpgradeButtons();
        updateFarmButtons();
    }
}

// Random chance to trigger famine event
function checkForRandomEvents() {
    // Only trigger famine if player has at least one farm and no active famine
    const hasFarms = Object.values(gameState.farms).some(farm => farm.owned > 0);
    
    if (hasFarms && !gameState.events.famine.active) {
        // 0.5% chance per check (runs every 10 seconds)
        if (Math.random() < 0.005) {
            startFamine();
        }
    }
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

// Initialize tabs
function initializeTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and content
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Initialize the game
function initGame() {
    loadGame();
    
    // Apply dark mode by default if no saved state exists
    if (!localStorage.getItem('potatoClickerSave')) {
        document.body.classList.add('dark-mode');
    }
    
    // Initialize tabs
    initializeTabs();
    
    updateDisplay();
    
    // Set up game loops
    setInterval(generatePassiveIncome, 100); // 10 times per second for smoother updates
    setInterval(updateFamineTimer, 1000); // Update famine timer every second
    setInterval(checkForRandomEvents, 10000); // Check for random events every 10 seconds
    setInterval(saveGame, 30000); // Auto-save every 30 seconds
}

// Event listeners
potatoImage.addEventListener('click', clickPotato);
buyGoldenPotatoBtn.addEventListener('click', () => buyUpgrade('goldenPotato'));
buyRainbowPotatoBtn.addEventListener('click', () => buyUpgrade('rainbowPotato'));
buySpacePotatoBtn.addEventListener('click', () => buyUpgrade('spacePotato'));
buyRobotPotatoBtn.addEventListener('click', () => buyUpgrade('robotPotato'));
buyQuantumPotatoBtn.addEventListener('click', () => buyUpgrade('quantumPotato'));

// Farm button listeners
buySmallPlotBtn.addEventListener('click', () => buyFarm('smallPlot'));
buyPotatoFieldBtn.addEventListener('click', () => buyFarm('potatoField'));
buyPotatoGreenhouseBtn.addEventListener('click', () => buyFarm('potatoGreenhouse'));
buyPotatoFactoryBtn.addEventListener('click', () => buyFarm('potatoFactory'));
buyPotatoLabBtn.addEventListener('click', () => buyFarm('potatoLab'));

// Add dark mode toggle listener
document.getElementById('dark-mode-toggle')?.addEventListener('click', toggleDarkMode);

// Initialize the game
initGame(); 
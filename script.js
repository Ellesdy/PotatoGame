// Game Constants
const PRESTIGE_POINT_COST = 100000; // How many potatoes needed for 1 prestige point
const PRESTIGE_BONUS_PERCENT = 5; // How much % bonus per prestige point
const PLANETS = [
    "Earth", "Mars", "Venus", "Jupiter", "Saturn", 
    "Neptune", "Uranus", "Pluto", "Kepler-22b", "Proxima Centauri b",
    "TRAPPIST-1e", "HD 219134 b", "Gliese 667 Cc", "Wolf 1061c"
];

// Game state
let gameState = {
    potatoes: 0,
    potatoesPerClick: 1,
    potatoesPerSecond: 0,
    lifetimePotatoes: 0, // Total potatoes ever earned
    prestigePoints: 0,
    prestigeLevel: 0,
    planetIndex: 0,
    darkMode: true,
    soundEnabled: true,
    upgrades: {
        goldenPotato: {
            owned: false,
            cost: 100,
            multiplier: 2,
            imageUrl: 'assets/skypotato.png'
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
    basePotatoImage: 'assets/potato.png'
};

// Town visualization constants
const TILE_SIZE = 16; // Size of each tile in pixels
const GRID_WIDTH = 30; // Number of tiles horizontally
const GRID_HEIGHT = 20; // Number of tiles vertically
const COLORS = {
    GRASS: '#538d4e',
    DARK_GRASS: '#3e6e3c',
    ROAD: '#555555',
    ROAD_LINE: '#ffffff',
    BUILDING: '#8b4513',
    BUILDING_ROOF: '#a05a2c',
    FARM: '#8d6e63',
    FIELD: '#aed581',
    FACTORY: '#607d8b',
    FACTORY_ROOF: '#455a64',
    LAB: '#7986cb',
    WATER: '#64b5f6',
    CAR1: '#f44336',
    CAR2: '#2196f3',
    CAR3: '#ffeb3b',
    TREE: '#33691e',
    CLOUD: '#eceff1'
};

let canvas, ctx, pixelRatio;
let townGrid = [];
let vehicles = [];
let clouds = [];
let townDevelopmentLevel = 0; // 0: Empty, 1: First farm, 2: Small village, 3: Town, 4: Small city, 5: Metropolis
let lastUpdateTime = 0;
let hasSetupTown = false;

// Add these variables
let currentSlot = 1; // Default slot
let gameActive = false; // Whether the game is active or we're in the menu

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

// Add these DOM elements
const menuOverlay = document.getElementById('game-menu');
const menuButton = document.getElementById('menu-button');
const playButtons = document.querySelectorAll('.play-button');
const resetButtons = document.querySelectorAll('.reset-button');
const saveSlots = [
    {
        potatoesEl: document.getElementById('save1-potatoes'),
        prestigeEl: document.getElementById('save1-prestige')
    },
    {
        potatoesEl: document.getElementById('save2-potatoes'),
        prestigeEl: document.getElementById('save2-prestige')
    },
    {
        potatoesEl: document.getElementById('save3-potatoes'),
        prestigeEl: document.getElementById('save3-prestige')
    }
];
const prestigeLevel = document.getElementById('prestige-level');
const prestigeBonus = document.getElementById('prestige-bonus');
const planetName = document.getElementById('planet-name');
const currentPrestigeLevel = document.getElementById('current-prestige-level');
const currentProductionBonus = document.getElementById('current-production-bonus');
const prestigePointsAvailable = document.getElementById('prestige-points-available');
const nextProductionBonus = document.getElementById('next-production-bonus');
const prestigeButton = document.getElementById('prestige-button');
const prestigeModal = document.getElementById('prestige-modal');
const prestigePointsGain = document.getElementById('prestige-points-gain');
const prestigeConfirm = document.getElementById('prestige-confirm');
const prestigeCancel = document.getElementById('prestige-cancel');

// DOM Elements for audio
const clickSound = document.getElementById('click-sound');
const upgradeSound = document.getElementById('upgrade-sound');
const farmSound = document.getElementById('farm-sound');
const famineSound = document.getElementById('famine-sound');
const prestigeSound = document.getElementById('prestige-sound');

// Add audio mute toggle
let soundEnabled = true;

// Error logging system
let errorLog = [];
const MAX_LOG_ENTRIES = 50;

// GitHub Gist integration constants
const GITHUB_ENABLED = true; // Default to false until user sets up credentials
const GITHUB_USERNAME = 'Ellesdy'; // Your GitHub username
const GIST_ID = 'f3b651bdc0ee0cacc805e5c5a82f1279'; // ID of the Gist used for storage

// This function would be used if the token was injected at build time
function getGitHubToken() {
    // Check for token in window object (could be injected by build process using POTATO_GITHUB_TOKEN)
    if (window.POTATO_GITHUB_TOKEN) {
        return window.POTATO_GITHUB_TOKEN;
    }
    
    // Then check window.GITHUB_TOKEN which could be set via our own code
    if (window.GITHUB_TOKEN) {
        return window.GITHUB_TOKEN;
    }
    
    // Finally fallback to the constant (which should be empty in production)
    return GITHUB_TOKEN;
}

// Check if storage is available
function isStorageAvailable() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

// Load game state from GitHub Gist
async function loadFromGitHub(slotNumber) {
    // Use the credential from window object if available
    const token = getGitHubToken();
    const gistId = window.GIST_ID || GIST_ID;
    const isEnabled = window.GITHUB_ENABLED !== undefined ? window.GITHUB_ENABLED : GITHUB_ENABLED;
    
    if (!isEnabled || !token || !gistId) {
        logError('GitHub loading is not properly configured', null, 'GitHubLoad');
        return null;
    }
    
    try {
        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch Gist: ${response.status} ${response.statusText}`);
        }
        
        const gistData = await response.json();
        const fileName = `potatoClickerSave${slotNumber}.json`;
        
        if (!gistData.files[fileName]) {
            console.log(`No save found for slot ${slotNumber} in GitHub Gist`);
            return null;
        }
        
        const content = gistData.files[fileName].content;
        const gameData = JSON.parse(content);
        console.log(`Game loaded from GitHub Gist (Slot ${slotNumber})`);
        return gameData;
    } catch (error) {
        logError('Error loading from GitHub', error, 'GitHubLoad');
        return null;
    }
}

// Delete game state from GitHub Gist
async function deleteFromGitHub(slotNumber) {
    // Use the credential from window object if available
    const token = getGitHubToken();
    const gistId = window.GIST_ID || GIST_ID;
    const isEnabled = window.GITHUB_ENABLED !== undefined ? window.GITHUB_ENABLED : GITHUB_ENABLED;
    
    if (!isEnabled || !token || !gistId) {
        logError('GitHub deletion is not properly configured', null, 'GitHubDelete');
        return false;
    }
    
    try {
        // Get the current Gist first
        const getResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        
        if (!getResponse.ok) {
            throw new Error(`Failed to fetch Gist: ${getResponse.status} ${getResponse.statusText}`);
        }
        
        const gistData = await getResponse.json();
        const fileName = `potatoClickerSave${slotNumber}.json`;
        
        // Prepare updated files object with null to delete
        const files = {};
        files[fileName] = null;
        
        // Update the Gist
        const updateResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ files })
        });
        
        if (!updateResponse.ok) {
            throw new Error(`Failed to update Gist: ${updateResponse.status} ${updateResponse.statusText}`);
        }
        
        console.log(`Save deleted from GitHub Gist (Slot ${slotNumber})`);
        return true;
    } catch (error) {
        logError('Error deleting from GitHub', error, 'GitHubDelete');
        return false;
    }
}

// Helper function to apply game settings after loading
function applyGameSettings() {
    // Ensure prestige properties exist (for backwards compatibility)
    if (gameState.prestigeLevel === undefined) gameState.prestigeLevel = 0;
    if (gameState.lifetimePotatoes === undefined) gameState.lifetimePotatoes = gameState.potatoes;
    if (gameState.planetIndex === undefined) gameState.planetIndex = 0;
    if (gameState.soundEnabled === undefined) gameState.soundEnabled = true;
    
    // Apply dark mode if it was enabled
    if (gameState.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    // Apply sound setting
    soundEnabled = gameState.soundEnabled;
    const soundToggleIcon = document.getElementById('sound-toggle-icon');
    if (soundToggleIcon) {
        soundToggleIcon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    }
}

// Modified load game function to use GitHub if available
async function loadGame(slot) {
    // Try GitHub first if enabled
    const isEnabled = window.GITHUB_ENABLED !== undefined ? window.GITHUB_ENABLED : GITHUB_ENABLED;
    if (isEnabled) {
        try {
            const gameData = await loadFromGitHub(slot);
            if (gameData) {
                gameState = gameData;
                
                // Apply settings
                applyGameSettings();
                
                // Set current slot
                currentSlot = slot;
                
                // Update display
                updateDisplay();
                updatePotatoImage();
                
                return true;
            }
        } catch (error) {
            logError('GitHub load failed', error, 'GitHubLoad');
            // Continue to localStorage as fallback
        }
    }
    
    // Fallback to localStorage
    if (isStorageAvailable()) {
        const savedState = localStorage.getItem(`potatoClickerSave${slot}`);
        
        if (savedState) {
            // Parse saved game state
            gameState = JSON.parse(savedState);
            
            // Apply settings
            applyGameSettings();
            
            // Set current slot
            currentSlot = slot;
            
            // Update display
            updateDisplay();
            updatePotatoImage();
            
            return true;
        }
    } else {
        logError("Local storage not available - can't load saved games", null, 'Storage');
    }
    
    return false;
}

// Function to log errors with timestamp and additional info
function logError(message, error = null, componentName = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        message,
        error: error ? error.toString() : null,
        component: componentName,
        stack: error && error.stack ? error.stack : null
    };
    
    // Add to in-memory log
    errorLog.unshift(logEntry);
    
    // Keep log at a reasonable size
    if (errorLog.length > MAX_LOG_ENTRIES) {
        errorLog = errorLog.slice(0, MAX_LOG_ENTRIES);
    }
    
    // Log to console as well
    console.error(`[${timestamp}] ${componentName ? `[${componentName}] ` : ''}${message}`, error);
    
    // Update the error log display if it exists
    updateErrorLogDisplay();
    
    return logEntry;
}

// Function to update the error log display
function updateErrorLogDisplay() {
    const errorLogElement = document.getElementById('error-log');
    if (!errorLogElement) return;
    
    if (errorLog.length === 0) {
        errorLogElement.textContent = 'No errors logged';
        return;
    }
    
    // Format and display the log entries
    const formattedLog = errorLog.map(entry => {
        const time = new Date(entry.timestamp).toLocaleTimeString();
        return `[${time}] ${entry.component ? `[${entry.component}] ` : ''}${entry.message}${entry.error ? `\n  Error: ${entry.error}` : ''}`;
    }).join('\n\n');
    
    errorLogElement.textContent = formattedLog;
}

// Last sync time tracking
let lastSyncTime = null;

// Function to update the sync time
function updateLastSyncTime() {
    lastSyncTime = new Date();
    const lastSyncElement = document.getElementById('debug-last-sync');
    if (lastSyncElement) {
        lastSyncElement.textContent = lastSyncTime.toLocaleTimeString();
    }
}

// Function to update debug panel status displays
function updateDebugPanelStatus() {
    // GitHub Enabled status
    const isEnabled = window.GITHUB_ENABLED !== undefined ? window.GITHUB_ENABLED : GITHUB_ENABLED;
    const githubEnabledElement = document.getElementById('debug-github-enabled');
    if (githubEnabledElement) {
        githubEnabledElement.textContent = isEnabled ? 'Yes' : 'No';
        githubEnabledElement.className = isEnabled ? 'status-badge success' : 'status-badge warning';
    }
    
    // GitHub Token status
    const token = window.GITHUB_TOKEN || GITHUB_TOKEN;
    const tokenElement = document.getElementById('debug-github-token');
    if (tokenElement) {
        if (token) {
            tokenElement.textContent = token ? 'Set (Hidden)' : 'Not Set';
            tokenElement.className = token ? 'status-badge success' : 'status-badge error';
        } else {
            tokenElement.textContent = 'Not Set';
            tokenElement.className = 'status-badge error';
        }
    }
    
    // Last sync time
    const lastSyncElement = document.getElementById('debug-last-sync');
    if (lastSyncElement) {
        lastSyncElement.textContent = lastSyncTime ? lastSyncTime.toLocaleTimeString() : 'Never';
    }
}

// Test GitHub connection
async function testGitHubConnection() {
    // Use the credential from window object if available
    const token = getGitHubToken();
    const gistId = window.GIST_ID || GIST_ID;
    const isEnabled = window.GITHUB_ENABLED !== undefined ? window.GITHUB_ENABLED : GITHUB_ENABLED;
    
    if (!isEnabled || !token || !gistId) {
        logError('GitHub configuration incomplete', null, 'GitHubTest');
        return { success: false, message: 'GitHub configuration incomplete' };
    }
    
    try {
        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        
        if (!response.ok) {
            const error = await response.text();
            logError(`GitHub connection failed: ${response.status} ${response.statusText}`, new Error(error), 'GitHubTest');
            return { 
                success: false, 
                message: `Connection failed: ${response.status} ${response.statusText}`,
                details: error
            };
        }
        
        const data = await response.json();
        updateLastSyncTime();
        console.log('GitHub connection successful:', data);
        return { success: true, message: 'Connection successful', data };
    } catch (error) {
        logError('GitHub connection test error', error, 'GitHubTest');
        return { success: false, message: 'Connection error', error: error.toString() };
    }
}

// Force a sync to GitHub
async function forceSyncToGitHub() {
    // Use current slot or default to 1
    const slot = currentSlot || 1;
    
    try {
        const result = await saveToGitHub(slot, gameState);
        if (result) {
            updateLastSyncTime();
            return { success: true, message: 'Sync successful' };
        } else {
            logError('Force sync failed', null, 'GitHubSync');
            return { success: false, message: 'Sync failed' };
        }
    } catch (error) {
        logError('Force sync error', error, 'GitHubSync');
        return { success: false, message: 'Sync error', error: error.toString() };
    }
}

// Clear local storage
function clearLocalStorage() {
    try {
        if (isStorageAvailable()) {
            // Only clear Potato Clicker related items
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('potatoClicker')) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            
            console.log('Local storage cleared for Potato Clicker');
            return { success: true, message: 'Local storage cleared' };
        } else {
            return { success: false, message: 'Local storage not available' };
        }
    } catch (error) {
        logError('Clear local storage error', error, 'Storage');
        return { success: false, message: 'Error clearing storage', error: error.toString() };
    }
}

// Enhanced save with error logging
async function saveGame() {
    try {
        // Try GitHub first if enabled
        const isEnabled = window.GITHUB_ENABLED !== undefined ? window.GITHUB_ENABLED : GITHUB_ENABLED;
        if (isEnabled) {
            try {
                const savedToGitHub = await saveToGitHub(currentSlot, gameState);
                if (savedToGitHub) {
                    updateLastSyncTime();
                    await updateSaveSlots();
                    return;
                }
            } catch (error) {
                logError('GitHub save failed', error, 'GitHubSave');
                // Continue to localStorage as fallback
            }
        }
        
        // Fallback to localStorage
        if (isStorageAvailable()) {
            localStorage.setItem(`potatoClickerSave${currentSlot}`, JSON.stringify(gameState));
            await updateSaveSlots();
        } else {
            logError("Local storage not available - game progress won't be saved", null, 'Storage');
        }
    } catch (error) {
        logError('Save game error', error, 'SaveGame');
    }
}

// Enhanced saveToGitHub with error logging and POTATO_GITHUB_TOKEN support
async function saveToGitHub(slotNumber, gameData) {
    // Use the credential from window object if available, with new getGitHubToken helper
    const token = getGitHubToken();
    const gistId = window.GIST_ID || GIST_ID;
    const isEnabled = window.GITHUB_ENABLED !== undefined ? window.GITHUB_ENABLED : GITHUB_ENABLED;
    
    if (!isEnabled || !token || !gistId) {
        logError('GitHub saving is not properly configured', null, 'GitHubSave');
        return false;
    }
    
    try {
        // Get the current Gist first
        const getResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        
        if (!getResponse.ok) {
            throw new Error(`Failed to fetch Gist: ${getResponse.status} ${getResponse.statusText}`);
        }
        
        const gistData = await getResponse.json();
        const fileName = `potatoClickerSave${slotNumber}.json`;
        
        // Prepare updated files object
        const files = {};
        files[fileName] = {
            content: JSON.stringify(gameData)
        };
        
        // Update the Gist
        const updateResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ files })
        });
        
        if (!updateResponse.ok) {
            throw new Error(`Failed to update Gist: ${updateResponse.status} ${updateResponse.statusText}`);
        }
        
        console.log(`Game saved to GitHub Gist (Slot ${slotNumber})`);
        return true;
    } catch (error) {
        logError('Error saving to GitHub', error, 'GitHubSave');
        return false;
    }
}

// Update the display
function updateDisplay() {
    potatoCount.textContent = Math.floor(gameState.potatoes);
    potatoesPerClickEl.textContent = gameState.potatoesPerClick;
    potatoesPerSecondEl.textContent = calculatePotatoesPerSecond();
    
    // Update prestige info
    prestigeLevel.textContent = gameState.prestigeLevel;
    prestigeBonus.textContent = gameState.prestigeLevel * PRESTIGE_BONUS_PERCENT;
    planetName.textContent = PLANETS[gameState.planetIndex % PLANETS.length];
    currentPrestigeLevel.textContent = gameState.prestigeLevel;
    currentProductionBonus.textContent = gameState.prestigeLevel * PRESTIGE_BONUS_PERCENT;
    
    // Calculate available prestige points
    const prestigePointsCalc = calculatePrestigePoints();
    prestigePointsAvailable.textContent = prestigePointsCalc;
    nextProductionBonus.textContent = (gameState.prestigeLevel + prestigePointsCalc) * PRESTIGE_BONUS_PERCENT;
    
    // Enable prestige button if points available
    prestigeButton.disabled = prestigePointsCalc <= 0;
    
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
    
    // Apply prestige bonus
    const prestigeMultiplier = 1 + (gameState.prestigeLevel * PRESTIGE_BONUS_PERCENT / 100);
    total *= prestigeMultiplier;
    
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

// Function to play a sound
function playSound(sound) {
    if (soundEnabled) {
        // Reset the audio to start
        sound.currentTime = 0;
        sound.play().catch(error => {
            console.log("Audio play failed:", error);
        });
    }
}

// Click the potato
function clickPotato() {
    const potatoesGained = gameState.potatoesPerClick;
    gameState.potatoes += potatoesGained;
    gameState.lifetimePotatoes += potatoesGained;
    
    // Play click sound
    playSound(clickSound);
    
    // Add a pop animation
    potatoImage.classList.add('pop');
    setTimeout(() => {
        potatoImage.classList.remove('pop');
    }, 300);
    
    // Create a floating number
    createFloatingNumber(potatoesGained);
    
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
        
        // Play upgrade sound
        playSound(upgradeSound);
        
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
        
        // Play farm sound
        playSound(farmSound);
        
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
        
        // Play famine sound
        playSound(famineSound);
        
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
        const potatoesGained = calculatePotatoesPerSecond() / 10; // Divide by 10 because we update 10 times per second
        gameState.potatoes += potatoesGained;
        gameState.lifetimePotatoes += potatoesGained;
        
        // Update the counter
        potatoCount.textContent = Math.floor(gameState.potatoes);
        
        // Enable/disable buttons based on new potato count
        updateUpgradeButtons();
        updateFarmButtons();
        
        // Update prestige button state
        prestigeButton.disabled = calculatePrestigePoints() <= 0;
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

// Add function to calculate prestige points
function calculatePrestigePoints() {
    // Calculate based on lifetime potatoes and upgrades
    const basePoints = Math.floor(gameState.lifetimePotatoes / PRESTIGE_POINT_COST);
    
    // Count owned upgrades for bonus points
    const upgradeCount = Object.values(gameState.upgrades).filter(upgrade => upgrade.owned).length;
    const farmCount = Object.values(gameState.farms).reduce((total, farm) => total + farm.owned, 0);
    
    // Give 1 bonus point for every 5 upgrades/farms
    const bonusPoints = Math.floor((upgradeCount + farmCount) / 5);
    
    return basePoints + bonusPoints;
}

// Add function to prestige
function prestige() {
    const prestigePointsEarned = calculatePrestigePoints();
    
    // Only proceed if points are available
    if (prestigePointsEarned <= 0) return;
    
    // Setup confirmation modal
    prestigePointsGain.textContent = prestigePointsEarned;
    prestigeModal.classList.remove('hidden');
}

// Function to actually perform prestige after confirmation
function confirmPrestige() {
    const prestigePointsEarned = calculatePrestigePoints();
    
    // Play prestige sound
    playSound(prestigeSound);
    
    // Save current prestige level and points
    const newPrestigeLevel = gameState.prestigeLevel + prestigePointsEarned;
    
    // Reset game state but keep prestige info
    resetGameState();
    
    // Update prestige values
    gameState.prestigeLevel = newPrestigeLevel;
    gameState.planetIndex++; // Move to next planet
    
    // Save game
    saveGame();
    updateDisplay();
    
    // Hide modal
    prestigeModal.classList.add('hidden');
    
    // Show prestige effect
    showPrestigeEffect();
}

// Show prestige effect
function showPrestigeEffect() {
    const effect = document.createElement('div');
    effect.className = 'upgrade-effect';
    
    const message = document.createElement('div');
    message.textContent = 'NEW PLANET!';
    message.style.color = '#f06292';
    message.style.textShadow = '0 0 15px #f06292, 0 0 30px white';
    
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
    }, 2000);
}

// Function to reset game state for new game/prestige
function resetGameState() {
    // Save prestige level before reset
    const prestigeLevel = gameState.prestigeLevel;
    const planetIndex = gameState.planetIndex;
    const darkMode = gameState.darkMode;
    
    // Reset game state
    gameState = {
        potatoes: 0,
        potatoesPerClick: 1,
        potatoesPerSecond: 0,
        lifetimePotatoes: 0,
        prestigePoints: 0,
        prestigeLevel: prestigeLevel,
        planetIndex: planetIndex,
        darkMode: darkMode,
        soundEnabled: true,
        upgrades: {
            goldenPotato: {
                owned: false,
                cost: 100,
                multiplier: 2,
                imageUrl: 'assets/skypotato.png'
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
                productionModifier: 0.25
            }
        },
        basePotatoImage: 'assets/potato.png'
    };
    
    // Reset potato image
    updatePotatoImage();
}

// Function to start a new game in a slot
function startNewGame(slot) {
    // Reset game state
    resetGameState();
    
    // Set current slot
    currentSlot = slot;
    
    // Apply dark mode if it was enabled
    if (gameState.darkMode) {
        document.body.classList.add('dark-mode');
    }
    
    // Save and update display
    saveGame();
    updateDisplay();
    updatePotatoImage();
}

// Function to show the menu
function showMenu() {
    gameActive = false;
    menuOverlay.classList.remove('hidden');
    updateSaveSlots();
    
    // Force menu to be on top
    menuOverlay.style.zIndex = "2000";
    
    // Disable clicking on the game while menu is open
    document.querySelector('.game-container').style.pointerEvents = 'none';
}

// Function to hide the menu and start/resume the game
function hideMenuAndPlay(slot) {
    // Try to load the game from the slot
    const loaded = loadGame(slot);
    
    // If no save exists, start a new game
    if (!loaded) {
        startNewGame(slot);
    }
    
    gameActive = true;
    menuOverlay.classList.add('hidden');
    
    // Re-enable clicking on the game
    document.querySelector('.game-container').style.pointerEvents = 'auto';
}

// Modify the initGame function to check for existing saves and show menu
function initGame() {
    // Show the menu first
    showMenu();
    
    // Initialize tabs
    initializeTabs();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize town visualization
    initTownVisualization();
    
    // Set up game loops
    setInterval(generatePassiveIncome, 100); // 10 times per second for smoother updates
    setInterval(updateFamineTimer, 1000); // Update famine timer every second
    setInterval(checkForRandomEvents, 10000); // Check for random events every 10 seconds
    setInterval(saveGame, 30000); // Auto-save every 30 seconds
}

// Add function to set up event listeners
function setupEventListeners() {
    // Potato click
    potatoImage.addEventListener('click', clickPotato);
    
    // Upgrade buttons
    buyGoldenPotatoBtn.addEventListener('click', () => buyUpgrade('goldenPotato'));
    buyRainbowPotatoBtn.addEventListener('click', () => buyUpgrade('rainbowPotato'));
    buySpacePotatoBtn.addEventListener('click', () => buyUpgrade('spacePotato'));
    buyRobotPotatoBtn.addEventListener('click', () => buyUpgrade('robotPotato'));
    buyQuantumPotatoBtn.addEventListener('click', () => buyUpgrade('quantumPotato'));
    
    // Farm buttons
    buySmallPlotBtn.addEventListener('click', () => buyFarm('smallPlot'));
    buyPotatoFieldBtn.addEventListener('click', () => buyFarm('potatoField'));
    buyPotatoGreenhouseBtn.addEventListener('click', () => buyFarm('potatoGreenhouse'));
    buyPotatoFactoryBtn.addEventListener('click', () => buyFarm('potatoFactory'));
    buyPotatoLabBtn.addEventListener('click', () => buyFarm('potatoLab'));
    
    // Menu button
    menuButton.addEventListener('click', showMenu);
    
    // Sound toggle
    document.getElementById('sound-toggle')?.addEventListener('click', toggleSound);
    
    // Play buttons
    playButtons.forEach(button => {
        button.addEventListener('click', () => {
            const slot = button.getAttribute('data-slot');
            hideMenuAndPlay(Number(slot));
        });
    });
    
    // Reset buttons
    resetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const slot = button.getAttribute('data-slot');
            if (confirm(`Are you sure you want to delete save ${slot}?`)) {
                deleteSave(Number(slot));
            }
        });
    });
    
    // Dark mode toggle
    document.getElementById('dark-mode-toggle')?.addEventListener('click', toggleDarkMode);
    
    // Prestige button
    prestigeButton.addEventListener('click', prestige);
    
    // Prestige confirmation
    prestigeConfirm.addEventListener('click', confirmPrestige);
    prestigeCancel.addEventListener('click', () => {
        prestigeModal.classList.add('hidden');
    });
    
    // GitHub setup button
    document.getElementById('github-setup')?.addEventListener('click', () => {
        createGitHubSetupModal();
        document.getElementById('github-setup-modal').classList.remove('hidden');
        
        // Pre-fill with existing values if available
        if (isStorageAvailable()) {
            const token = localStorage.getItem('potatoClickerGitHubToken') || '';
            const username = localStorage.getItem('potatoClickerGitHubUsername') || '';
            const gistId = localStorage.getItem('potatoClickerGitHubGistId') || '';
            
            document.getElementById('github-token').value = token;
            document.getElementById('github-username').value = username;
            document.getElementById('github-gist-id').value = gistId;
        }
    });
    
    // Debug panel toggle button
    document.getElementById('debug-toggle')?.addEventListener('click', () => {
        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel) {
            debugPanel.classList.toggle('hidden');
            if (!debugPanel.classList.contains('hidden')) {
                updateDebugPanelStatus();
                updateErrorLogDisplay();
            }
        }
    });
    
    // Debug panel close button
    document.getElementById('debug-close')?.addEventListener('click', () => {
        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel) {
            debugPanel.classList.add('hidden');
        }
    });
    
    // Test GitHub connection button
    document.getElementById('test-github-connection')?.addEventListener('click', async () => {
        const result = await testGitHubConnection();
        alert(result.success ? 
            'GitHub connection successful!' : 
            `GitHub connection failed: ${result.message}`);
    });
    
    // Force sync button
    document.getElementById('force-sync')?.addEventListener('click', async () => {
        const result = await forceSyncToGitHub();
        alert(result.success ? 
            'Sync successful!' : 
            `Sync failed: ${result.message}`);
        if (result.success) {
            updateDebugPanelStatus();
        }
    });
    
    // Clear local storage button
    document.getElementById('clear-local-storage')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all local saves? This cannot be undone.')) {
            const result = clearLocalStorage();
            alert(result.success ? 
                'Local storage cleared!' : 
                `Failed to clear storage: ${result.message}`);
            // Refresh the page to reset the game state
            if (result.success) {
                window.location.reload();
            }
        }
    });
}

// Initialize the game
initGame();

// Check if POTATO_GITHUB_TOKEN is present as a global variable from build process
if (typeof POTATO_GITHUB_TOKEN !== 'undefined' && POTATO_GITHUB_TOKEN) {
    console.log('Using GitHub token from build environment');
    window.POTATO_GITHUB_TOKEN = POTATO_GITHUB_TOKEN;
    window.GITHUB_ENABLED = true;
}

function initTownVisualization() {
    canvas = document.getElementById('town-background');
    pixelRatio = window.devicePixelRatio || 1;
    
    // Set the canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Get the drawing context
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false; // Disable anti-aliasing for pixelated look
    
    // Initialize town grid
    initializeTownGrid();
    
    // Add some initial clouds
    for (let i = 0; i < 5; i++) {
        addCloud();
    }
    
    // Start animation loop
    requestAnimationFrame(updateTown);
}

function resizeCanvas() {
    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
}

function initializeTownGrid() {
    townGrid = [];
    
    // Initialize with grass
    for (let y = 0; y < GRID_HEIGHT; y++) {
        const row = [];
        for (let x = 0; x < GRID_WIDTH; x++) {
            // Random grass variation
            row.push({
                type: 'grass',
                variant: Math.random() > 0.7 ? 'dark' : 'normal'
            });
        }
        townGrid.push(row);
    }
    
    // Add initial road
    for (let x = 10; x < 20; x++) {
        townGrid[10][x] = { type: 'road', direction: 'horizontal' };
    }
}

function updateTownDevelopment() {
    const totalFarms = calculateTotalFarms();
    const potatoesPerSecond = calculatePotatoesPerSecond();
    
    // Determine town development level based on game progress
    if (potatoesPerSecond >= 2000) {
        setTownLevel(5); // Metropolis
    } else if (potatoesPerSecond >= 500) {
        setTownLevel(4); // Small city
    } else if (potatoesPerSecond >= 100) {
        setTownLevel(3); // Town
    } else if (potatoesPerSecond >= 20) {
        setTownLevel(2); // Small village
    } else if (totalFarms > 0) {
        setTownLevel(1); // First farm
    } else {
        setTownLevel(0); // Empty
    }
}

function calculateTotalFarms() {
    return Object.values(gameState.farms).reduce((total, farm) => total + farm.owned, 0);
}

function setTownLevel(level) {
    if (level !== townDevelopmentLevel) {
        townDevelopmentLevel = level;
        developTown();
    }
}

function developTown() {
    // Clear some of the existing buildings to make room for development
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            const tile = townGrid[y][x];
            if (tile.type !== 'road' && Math.random() > 0.7) {
                townGrid[y][x] = {
                    type: 'grass',
                    variant: Math.random() > 0.7 ? 'dark' : 'normal'
                };
            }
        }
    }
    
    // Add development based on level
    switch (townDevelopmentLevel) {
        case 1: // First farm
            addFarms(1);
            break;
        case 2: // Small village
            addFarms(3);
            addHouses(5);
            extendRoads(1);
            break;
        case 3: // Town
            addFarms(5);
            addHouses(10);
            addFactory(1);
            extendRoads(2);
            addVehicles(2);
            break;
        case 4: // Small city
            addFarms(8);
            addHouses(15);
            addFactory(3);
            extendRoads(3);
            addVehicles(5);
            break;
        case 5: // Metropolis
            addFarms(12);
            addHouses(20);
            addFactory(5);
            addLab(2);
            extendRoads(5);
            addVehicles(10);
            break;
    }
}

function addFarms(count) {
    for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * (GRID_WIDTH - 3));
        const y = Math.floor(Math.random() * (GRID_HEIGHT - 3));
        
        // Add farm building
        townGrid[y][x] = { type: 'farm' };
        
        // Add farm fields around it
        for (let fy = y; fy < y + 3; fy++) {
            for (let fx = x + 1; fx < x + 3; fx++) {
                if (fx < GRID_WIDTH && fy < GRID_HEIGHT) {
                    townGrid[fy][fx] = { type: 'field' };
                }
            }
        }
    }
}

function addHouses(count) {
    for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * (GRID_WIDTH - 1));
        const y = Math.floor(Math.random() * (GRID_HEIGHT - 1));
        
        // Don't place houses over roads
        if (townGrid[y][x].type !== 'road') {
            townGrid[y][x] = { type: 'house' };
        }
    }
}

function addFactory(count) {
    for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * (GRID_WIDTH - 2));
        const y = Math.floor(Math.random() * (GRID_HEIGHT - 2));
        
        // Don't place factory over roads
        if (townGrid[y][x].type !== 'road' && townGrid[y+1][x].type !== 'road' && 
            townGrid[y][x+1].type !== 'road' && townGrid[y+1][x+1].type !== 'road') {
            townGrid[y][x] = { type: 'factory', part: 'top-left' };
            townGrid[y][x+1] = { type: 'factory', part: 'top-right' };
            townGrid[y+1][x] = { type: 'factory', part: 'bottom-left' };
            townGrid[y+1][x+1] = { type: 'factory', part: 'bottom-right' };
        }
    }
}

function addLab(count) {
    for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * (GRID_WIDTH - 2));
        const y = Math.floor(Math.random() * (GRID_HEIGHT - 2));
        
        // Don't place lab over roads
        if (townGrid[y][x].type !== 'road' && townGrid[y+1][x].type !== 'road' && 
            townGrid[y][x+1].type !== 'road' && townGrid[y+1][x+1].type !== 'road') {
            townGrid[y][x] = { type: 'lab', part: 'top-left' };
            townGrid[y][x+1] = { type: 'lab', part: 'top-right' };
            townGrid[y+1][x] = { type: 'lab', part: 'bottom-left' };
            townGrid[y+1][x+1] = { type: 'lab', part: 'bottom-right' };
        }
    }
}

function extendRoads(segments) {
    // Find existing road endpoints
    const roadTiles = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (townGrid[y][x].type === 'road') {
                roadTiles.push({x, y});
            }
        }
    }
    
    // Add new road segments
    for (let i = 0; i < segments; i++) {
        if (roadTiles.length === 0) break;
        
        // Pick a random existing road tile
        const roadIndex = Math.floor(Math.random() * roadTiles.length);
        const startTile = roadTiles[roadIndex];
        
        // Choose a direction (0: up, 1: right, 2: down, 3: left)
        const direction = Math.floor(Math.random() * 4);
        let dx = 0, dy = 0;
        let roadDirection;
        
        switch (direction) {
            case 0: dy = -1; roadDirection = 'vertical'; break;
            case 1: dx = 1; roadDirection = 'horizontal'; break;
            case 2: dy = 1; roadDirection = 'vertical'; break;
            case 3: dx = -1; roadDirection = 'horizontal'; break;
        }
        
        // Create road segment
        const length = 3 + Math.floor(Math.random() * 5); // 3-7 tiles
        for (let j = 1; j <= length; j++) {
            const nx = startTile.x + (dx * j);
            const ny = startTile.y + (dy * j);
            
            // Check bounds
            if (nx >= 0 && nx < GRID_WIDTH && ny >= 0 && ny < GRID_HEIGHT) {
                townGrid[ny][nx] = { type: 'road', direction: roadDirection };
                roadTiles.push({x: nx, y: ny});
            } else {
                break;
            }
        }
    }
}

function addVehicles(count) {
    vehicles = [];
    const roadTiles = [];
    
    // Find all road tiles
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (townGrid[y][x].type === 'road') {
                roadTiles.push({x, y, direction: townGrid[y][x].direction});
            }
        }
    }
    
    if (roadTiles.length === 0) return;
    
    // Create vehicles
    for (let i = 0; i < count; i++) {
        const roadTile = roadTiles[Math.floor(Math.random() * roadTiles.length)];
        const colors = [COLORS.CAR1, COLORS.CAR2, COLORS.CAR3];
        
        vehicles.push({
            x: roadTile.x * TILE_SIZE + (Math.random() * TILE_SIZE / 2),
            y: roadTile.y * TILE_SIZE + (Math.random() * TILE_SIZE / 2),
            direction: roadTile.direction,
            speed: 0.5 + Math.random() * 1.5,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
}

function addCloud() {
    clouds.push({
        x: -100 - Math.random() * 200,
        y: Math.random() * (canvas.height / 3),
        width: 60 + Math.random() * 100,
        height: 30 + Math.random() * 40,
        speed: 0.2 + Math.random() * 0.3
    });
}

function updateTown(timestamp) {
    if (!hasSetupTown) {
        updateTownDevelopment();
        hasSetupTown = true;
    }
    
    // Calculate delta time
    const deltaTime = timestamp - lastUpdateTime;
    lastUpdateTime = timestamp;
    
    // Check for town development updates (every 5 seconds)
    if (timestamp % 5000 < 20) {
        updateTownDevelopment();
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Scale everything up to match the canvas size
    const scaleX = canvas.width / (GRID_WIDTH * TILE_SIZE);
    const scaleY = canvas.height / (GRID_HEIGHT * TILE_SIZE);
    ctx.save();
    ctx.scale(scaleX, scaleY);
    
    // Draw town grid
    drawTownGrid();
    
    // Update and draw vehicles
    updateVehicles(deltaTime);
    drawVehicles();
    
    // Update and draw clouds
    updateClouds(deltaTime);
    drawClouds();
    
    ctx.restore();
    
    // Continue animation loop
    requestAnimationFrame(updateTown);
}

function drawTownGrid() {
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            const tile = townGrid[y][x];
            const tileX = x * TILE_SIZE;
            const tileY = y * TILE_SIZE;
            
            // Draw the tile based on its type
            switch (tile.type) {
                case 'grass':
                    ctx.fillStyle = tile.variant === 'dark' ? COLORS.DARK_GRASS : COLORS.GRASS;
                    ctx.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
                    break;
                    
                case 'road':
                    // Draw road
                    ctx.fillStyle = COLORS.ROAD;
                    ctx.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
                    
                    // Draw center line
                    ctx.fillStyle = COLORS.ROAD_LINE;
                    if (tile.direction === 'horizontal') {
                        ctx.fillRect(tileX, tileY + TILE_SIZE / 2 - 1, TILE_SIZE, 2);
                    } else {
                        ctx.fillRect(tileX + TILE_SIZE / 2 - 1, tileY, 2, TILE_SIZE);
                    }
                    break;
                    
                case 'house':
                    // Draw house base
                    ctx.fillStyle = COLORS.BUILDING;
                    ctx.fillRect(tileX + 2, tileY + 6, TILE_SIZE - 4, TILE_SIZE - 6);
                    
                    // Draw roof
                    ctx.fillStyle = COLORS.BUILDING_ROOF;
                    ctx.beginPath();
                    ctx.moveTo(tileX, tileY + 6);
                    ctx.lineTo(tileX + TILE_SIZE / 2, tileY);
                    ctx.lineTo(tileX + TILE_SIZE, tileY + 6);
                    ctx.fill();
                    
                    // Draw door
                    ctx.fillStyle = '#8b4513';
                    ctx.fillRect(tileX + 6, tileY + 10, 4, 6);
                    break;
                    
                case 'farm':
                    // Draw farm building
                    ctx.fillStyle = COLORS.FARM;
                    ctx.fillRect(tileX + 2, tileY + 4, TILE_SIZE - 4, TILE_SIZE - 4);
                    
                    // Draw roof
                    ctx.fillStyle = COLORS.BUILDING_ROOF;
                    ctx.beginPath();
                    ctx.moveTo(tileX, tileY + 4);
                    ctx.lineTo(tileX + TILE_SIZE / 2, tileY);
                    ctx.lineTo(tileX + TILE_SIZE, tileY + 4);
                    ctx.fill();
                    break;
                    
                case 'field':
                    // Draw farm field
                    ctx.fillStyle = COLORS.FIELD;
                    ctx.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
                    
                    // Draw crop rows
                    ctx.fillStyle = COLORS.DARK_GRASS;
                    for (let i = 2; i < TILE_SIZE; i += 4) {
                        ctx.fillRect(tileX + i, tileY, 1, TILE_SIZE);
                    }
                    break;
                    
                case 'factory':
                    // Draw factory part
                    ctx.fillStyle = COLORS.FACTORY;
                    ctx.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
                    
                    // Draw factory details based on part
                    if (tile.part === 'top-left') {
                        // Draw chimney
                        ctx.fillStyle = COLORS.FACTORY_ROOF;
                        ctx.fillRect(tileX + 4, tileY - 6, 6, 10);
                    } else if (tile.part === 'top-right') {
                        // Draw roof details
                        ctx.fillStyle = COLORS.FACTORY_ROOF;
                        ctx.fillRect(tileX, tileY, TILE_SIZE, 4);
                    }
                    break;
                    
                case 'lab':
                    // Draw lab building
                    ctx.fillStyle = COLORS.LAB;
                    ctx.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
                    
                    // Draw windows
                    if (tile.part === 'top-left' || tile.part === 'top-right') {
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(tileX + 4, tileY + 4, TILE_SIZE - 8, 3);
                    }
                    break;
            }
        }
    }
}

function updateVehicles(deltaTime) {
    vehicles.forEach(vehicle => {
        if (vehicle.direction === 'horizontal') {
            vehicle.x += vehicle.speed * (deltaTime / 16);
            
            // Wrap around when reaching the edge
            if (vehicle.x > GRID_WIDTH * TILE_SIZE) {
                vehicle.x = -TILE_SIZE;
            }
        } else {
            vehicle.y += vehicle.speed * (deltaTime / 16);
            
            // Wrap around when reaching the edge
            if (vehicle.y > GRID_HEIGHT * TILE_SIZE) {
                vehicle.y = -TILE_SIZE;
            }
        }
    });
}

function drawVehicles() {
    vehicles.forEach(vehicle => {
        ctx.fillStyle = vehicle.color;
        
        if (vehicle.direction === 'horizontal') {
            // Draw horizontal car (rectangle with small wheels)
            ctx.fillRect(vehicle.x, vehicle.y, TILE_SIZE * 0.8, TILE_SIZE * 0.5);
            
            // Wheels
            ctx.fillStyle = '#000000';
            ctx.fillRect(vehicle.x + 2, vehicle.y - 1, 2, 1);
            ctx.fillRect(vehicle.x + 2, vehicle.y + TILE_SIZE * 0.5, 2, 1);
            ctx.fillRect(vehicle.x + TILE_SIZE * 0.8 - 4, vehicle.y - 1, 2, 1);
            ctx.fillRect(vehicle.x + TILE_SIZE * 0.8 - 4, vehicle.y + TILE_SIZE * 0.5, 2, 1);
        } else {
            // Draw vertical car (rectangle with small wheels)
            ctx.fillRect(vehicle.x, vehicle.y, TILE_SIZE * 0.5, TILE_SIZE * 0.8);
            
            // Wheels
            ctx.fillStyle = '#000000';
            ctx.fillRect(vehicle.x - 1, vehicle.y + 2, 1, 2);
            ctx.fillRect(vehicle.x + TILE_SIZE * 0.5, vehicle.y + 2, 1, 2);
            ctx.fillRect(vehicle.x - 1, vehicle.y + TILE_SIZE * 0.8 - 4, 1, 2);
            ctx.fillRect(vehicle.x + TILE_SIZE * 0.5, vehicle.y + TILE_SIZE * 0.8 - 4, 1, 2);
        }
    });
}

function updateClouds(deltaTime) {
    for (let i = 0; i < clouds.length; i++) {
        clouds[i].x += clouds[i].speed * (deltaTime / 16);
        
        // If cloud is off screen, remove it and add a new one
        if (clouds[i].x > GRID_WIDTH * TILE_SIZE + 200) {
            clouds.splice(i, 1);
            addCloud();
            i--;
        }
    }
}

function drawClouds() {
    ctx.fillStyle = COLORS.CLOUD;
    
    clouds.forEach(cloud => {
        // Draw cloud as a rounded rectangle
        ctx.beginPath();
        ctx.ellipse(cloud.x, cloud.y, cloud.width / 2, cloud.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Add sound toggle function
function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    soundEnabled = gameState.soundEnabled;
    
    // Update the sound toggle button icon
    const soundToggleIcon = document.getElementById('sound-toggle-icon');
    if (soundToggleIcon) {
        soundToggleIcon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    }
    
    // Save the setting
    saveGame();
}

// Function to set up GitHub credentials securely
function setupGitHubCredentials(token, username, gistId) {
    if (isStorageAvailable()) {
        // Store credentials in localStorage
        localStorage.setItem('potatoClickerGitHubToken', token);
        localStorage.setItem('potatoClickerGitHubUsername', username);
        localStorage.setItem('potatoClickerGitHubGistId', gistId);
        
        console.log('GitHub credentials saved to local storage');
        
        // Reload the page to apply settings
        window.location.reload();
    } else {
        console.error('Local storage is not available, cannot save GitHub credentials');
        alert('Cannot save GitHub credentials: browser storage is not available');
    }
}

// Check for stored GitHub credentials on load
function loadGitHubCredentials() {
    if (isStorageAvailable()) {
        const token = localStorage.getItem('potatoClickerGitHubToken');
        const username = localStorage.getItem('potatoClickerGitHubUsername');
        const gistId = localStorage.getItem('potatoClickerGitHubGistId');
        
        if (token && gistId) {
            // Set the constants (note: these will still be effectively constant after assignment)
            window.GITHUB_TOKEN = token;
            window.GITHUB_USERNAME = username || '';
            window.GIST_ID = gistId;
            window.GITHUB_ENABLED = true;
            
            console.log('GitHub credentials loaded from local storage');
            return true;
        }
    }
    
    return false;
}

// Call this function on startup
if (loadGitHubCredentials()) {
    console.log('GitHub integration enabled');
}

// Add GitHub setup modal HTML dynamically
function createGitHubSetupModal() {
    // Create modal elements if they don't exist
    if (!document.getElementById('github-setup-modal')) {
        const modal = document.createElement('div');
        modal.id = 'github-setup-modal';
        modal.className = 'modal hidden';
        
        modal.innerHTML = `
            <div class="modal-content">
                <h2>GitHub Integration Setup</h2>
                <p>Enter your GitHub credentials to enable saving to GitHub Gist.</p>
                <div class="github-setup-form">
                    <div class="form-group">
                        <label for="github-token">GitHub Token:</label>
                        <input type="password" id="github-token" placeholder="Personal Access Token with gist scope">
                    </div>
                    <div class="form-group">
                        <label for="github-username">GitHub Username:</label>
                        <input type="text" id="github-username" placeholder="Your GitHub username">
                    </div>
                    <div class="form-group">
                        <label for="github-gist-id">Gist ID:</label>
                        <input type="text" id="github-gist-id" placeholder="ID of your created Gist">
                    </div>
                </div>
                <div class="form-help">
                    <p><small>These credentials are stored in your browser only and never sent to our servers.</small></p>
                </div>
                <div class="modal-buttons">
                    <button id="github-setup-save">Save Credentials</button>
                    <button id="github-setup-cancel">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        document.getElementById('github-setup-save').addEventListener('click', () => {
            const token = document.getElementById('github-token').value;
            const username = document.getElementById('github-username').value;
            const gistId = document.getElementById('github-gist-id').value;
            
            if (token && gistId) {
                setupGitHubCredentials(token, username, gistId);
            } else {
                alert('GitHub token and Gist ID are required!');
            }
        });
        
        document.getElementById('github-setup-cancel').addEventListener('click', () => {
            document.getElementById('github-setup-modal').classList.add('hidden');
        });
    }
}

// Add a function to check GitHub saves for menu display
async function updateSaveSlots() {
    // Arrays to hold save data for display
    let saves = [{}, {}, {}];
    
    // Load all saves from localStorage
    if (isStorageAvailable()) {
        for (let slot = 1; slot <= 3; slot++) {
            const saveData = localStorage.getItem(`potatoClickerSave${slot}`);
            
            if (saveData) {
                const save = JSON.parse(saveData);
                saves[slot-1] = {
                    potatoes: Math.floor(save.potatoes),
                    prestigeLevel: save.prestigeLevel || 0
                };
            }
        }
    }
    
    // If GitHub is enabled, check for saves there too
    const isEnabled = window.GITHUB_ENABLED !== undefined ? window.GITHUB_ENABLED : GITHUB_ENABLED;
    if (isEnabled) {
        try {
            const token = getGitHubToken();
            const gistId = window.GIST_ID || GIST_ID;
            
            if (!token || !gistId) {
                // Skip GitHub check if credentials are missing
                console.log('Skipping GitHub save check - credentials missing');
                updateSaveUI(saves);
                return;
            }
            
            const response = await fetch(`https://api.github.com/gists/${gistId}`, {
                headers: {
                    'Authorization': `token ${token}`
                }
            });
            
            if (response.ok) {
                const gistData = await response.json();
                
                for (let slot = 1; slot <= 3; slot++) {
                    const fileName = `potatoClickerSave${slot}.json`;
                    
                    if (gistData.files[fileName]) {
                        const content = gistData.files[fileName].content;
                        const save = JSON.parse(content);
                        
                        // Update save slot if GitHub has newer data (higher potatoes or prestige)
                        if (!saves[slot-1].potatoes || 
                            save.potatoes > saves[slot-1].potatoes ||
                            save.prestigeLevel > saves[slot-1].prestigeLevel) {
                            
                            saves[slot-1] = {
                                potatoes: Math.floor(save.potatoes),
                                prestigeLevel: save.prestigeLevel || 0
                            };
                        }
                    }
                }
            } else {
                logError(`Failed to fetch Gist: ${response.status} ${response.statusText}`, null, 'SaveSlots');
            }
        } catch (error) {
            logError('Error checking GitHub saves', error, 'SaveSlots');
            // Continue with local saves only
        }
    }
    
    updateSaveUI(saves);
}

// Update the UI with save data
function updateSaveUI(saves) {
    // Update the UI with the save data
    for (let slot = 1; slot <= 3; slot++) {
        const save = saves[slot-1];
        saveSlots[slot-1].potatoesEl.textContent = save.potatoes || 0;
        saveSlots[slot-1].prestigeEl.textContent = save.prestigeLevel || 0;
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
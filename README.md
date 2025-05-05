# Potato Clicker v2.0

A fun and addictive idle clicker game where you click potatoes, build farms, and conquer the universe!

## How to Play

1. Click on the potato to earn potatoes
2. Purchase upgrades to increase potatoes per click
3. Build automated farms for passive income
4. Prestige to new planets for production bonuses when you're ready
5. Watch your potato empire grow with the evolving town visualization

## Features

- **Multiple Potato Upgrades**:
  - Sky Potato (2x)
  - Poketato (5x)
  - Megatato (25x)
  - Powertato (100x)
  - Quantum Potato (500x)

- **Automated Farms**:
  - Small Plot (1 potato/sec)
  - Potato Field (5 potatoes/sec)
  - Potato Greenhouse (20 potatoes/sec)
  - Potato Factory (100 potatoes/sec)
  - Potato Lab (500 potatoes/sec)

- **Game Events**:
  - Potato Famine (temporarily reduces farm production)
  - More events coming soon!

- **Prestige System**:
  - Reset your progress to gain permanent production bonuses
  - Travel to new planets as you prestige
  - Build an even larger potato empire!

- **User Experience**:
  - Multiple save slots (3 slots)
  - Dark mode toggle
  - Sound effects and mute option
  - Satisfying click animations and visual feedback
  - Retro-style evolving town background that reflects your progress
  - Responsive design (works on mobile devices)

## How to Run

There are two ways to run the game:

### 1. Open directly in browser
Simply open `index.html` in any modern web browser. Note that in this mode, you may encounter localStorage access restrictions in some browsers.

### 2. Run with local server (recommended)
This method ensures saves work properly by avoiding localStorage restrictions:

#### Windows:
1. Double-click `start-server.bat`
2. Open http://localhost:8000 in your browser

#### macOS/Linux:
1. Make the script executable: `chmod +x start-server.sh`
2. Run it: `./start-server.sh`
3. Open http://localhost:8000 in your browser

*Requires Python to be installed on your system.*

## GitHub Integration Setup

To enable saving game data to GitHub Gist:

1. Create a [GitHub Personal Access Token](https://github.com/settings/tokens) with the "gist" scope
2. Create a new Gist on your GitHub account by visiting [gist.github.com](https://gist.github.com/)
3. Open the `script.js` file and update these values:
   ```javascript
   const GITHUB_ENABLED = true; // Change to true
   const GITHUB_TOKEN = 'your-token-here';
   const GITHUB_USERNAME = 'your-username';
   const GIST_ID = 'your-gist-id'; // Get this from the URL of your Gist
   ```
4. Deploy the game to GitHub Pages

⚠️ **Security Note:** For public GitHub Pages deployment, do not include your real GitHub token in the pushed code. Instead, set up the token directly in the browser's local storage or use a more secure backend solution for production use.

## Development

This game was originally built for a one-hour game development competition and has evolved since then.

Enjoy becoming a potato tycoon! 
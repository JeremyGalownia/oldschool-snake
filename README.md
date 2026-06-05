# Oldschool Snake

A classic Snake game implemented in modern web technologies with customizable gameplay options and persistent high score tracking.

## Overview

Oldschool Snake is a fully functional implementation of the classic Snake arcade game, designed with retro aesthetics and built entirely with HTML, CSS, and JavaScript. The game runs directly in the browser with no external dependencies.

## Features

### Core Gameplay
- Classic snake mechanics with smooth movement and collision detection
- Multiple board configurations: square and rectangular layouts
- Three board size options (small, medium, large) to adjust difficulty
- Three speed settings (slow, medium, fast) for varied gameplay challenges
- Win condition when the snake fills the entire board
- Game over on collision with walls or self-collision

### Controls
- Movement: Arrow keys or WASD keys
- Start Game: Play button from the main menu
- Access Settings: Settings button to customize gameplay

### Customization
- **Board Shape**: Choose between square or rectangular layouts
- **Board Size**: Select from small (9x9), medium (13x13 or 19x11), or large (17x17 or 21x13) configurations
- **Game Speed**: Adjust game pace with three speed presets
- **Theme**: Switch between grayscale and colorful visual themes

### Data Persistence
- High scores are automatically saved to browser local storage
- Settings preferences are retained between sessions
- Score tracking displays current game score and personal high score

## Technical Details

### Architecture
- Responsive grid-based rendering system
- State management for game settings and game state
- Input buffering to handle rapid directional changes
- Efficient board and snake position tracking

### Styling
- Retro-inspired design using Press Start 2P bitmap font
- Responsive layout that adapts to different screen sizes
- Smooth animations for game over state
- Theme system with CSS custom properties for easy customization

### Browser Compatibility
Works in all modern browsers that support ES6 JavaScript, CSS Grid, and localStorage.

## Getting Started

1. Open `index.html` in a web browser
2. Click the play button to start a new game
3. Use arrow keys or WASD to control the snake
4. Consume fruits to grow and increase your score
5. Access the settings menu to customize your gameplay experience

## File Structure

- `index.html` - Game markup and UI structure
- `script.js` - Game logic and state management
- `style.css` - Visual styling and layout

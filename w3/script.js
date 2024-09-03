const playerSprite = document.getElementById('player-sprite');
const container = document.getElementById('safari-container');
let steps = 0;
let currentFrame = 0;
const frameWidth = 32;  // Width of each frame
const frameHeight = 48; // Height of each frame
const containerWidth = container.offsetWidth;
const containerHeight = container.offsetHeight;
const spriteWidth = playerSprite.offsetWidth;
const spriteHeight = playerSprite.offsetHeight;

const directions = {
    'down': 0,
    'left': 1,
    'right': 2,
    'up': 3,
};

let stepSize = 3;  // Slower movement (reduced step size)
let animationSpeed = 15;  // Slower animation (increased animation speed)

// State to track key presses
let isMoving = false;
let moveDirection = null;

// Set initial top and left values as integers
playerSprite.style.top = "200px";
playerSprite.style.left = "200px";

document.addEventListener('keydown', (event) => {
    let key = event.key;
    let direction;

    // Get current positions (ensure they are parsed as integers)
    let currentTop = parseInt(playerSprite.style.top) || 0;
    let currentLeft = parseInt(playerSprite.style.left) || 0;

    switch(key) {
        case 'ArrowUp':
            direction = 'up';
            if (currentTop - stepSize >= 0) {
                playerSprite.style.top = `${currentTop - stepSize}px`;
            }
            break;
        case 'ArrowDown':
            direction = 'down';
            if (currentTop + stepSize + spriteHeight <= containerHeight) {
                playerSprite.style.top = `${currentTop + stepSize}px`;
            }
            break;
        case 'ArrowLeft':
            direction = 'left';
            if (currentLeft - stepSize >= 0) {
                playerSprite.style.left = `${currentLeft - stepSize}px`;
            }
            break;
        case 'ArrowRight':
            direction = 'right';
            if (currentLeft + stepSize + spriteWidth <= containerWidth) {
                playerSprite.style.left = `${currentLeft + stepSize}px`;
            }
            break;
        default:
            return;  // Exit if it's not an arrow key
    }

    if (direction) {
        moveDirection = direction;
        isMoving = true;
        updateSprite(direction, true);  // Update sprite direction immediately
    }
});

document.addEventListener('keyup', (event) => {
    isMoving = false;
});

function animate() {
    if (isMoving) {
        steps++;
        if (steps % animationSpeed === 0) {
            updateSprite(moveDirection, false);
        }
    }
    requestAnimationFrame(animate);
}

function updateSprite(direction, isTurning) {
    if (isTurning) {
        currentFrame = 0;  // Set to the first frame when turning
    } else {
        currentFrame = (currentFrame + 1) % 3;  // Cycle through 3 frames for walking
    }

    const yPos = directions[direction] * frameHeight;
    const xPos = currentFrame * frameWidth;

    playerSprite.style.backgroundPosition = `-${xPos}px -${yPos}px`;
}

// Start the animation loop
animate();
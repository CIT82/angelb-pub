const playerSprite = document.getElementById('player-sprite');
const container = document.getElementById('safari-container');
let steps = 0;
let currentFrame = 0;
const frameWidth = 32;  // Width of each frame in the sprite sheet
const frameHeight = 48; // Height of each frame in the sprite sheet
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

// Set initial top and left values as integers
playerSprite.style.top = "200px";
playerSprite.style.left = "200px";

let isMoving = false;
let moveDirection = null;
let animationInterval = null;

const stepSize = 1.5;  // Smaller step size for smoother motion
const animationSpeed = 10;  // Frame change every 10 animation cycles

// Create and scatter grass patches randomly
const patchSize = 32;  // Size of each grass patch
const numPatches = 20; // Number of grass patches to scatter

for (let i = 0; i < numPatches; i++) {
    const patch = document.createElement('div');
    patch.classList.add('grass-patch');

    // Randomize position
    const randomLeft = Math.random() * (containerWidth - patchSize);
    const randomTop = Math.random() * (containerHeight - patchSize);

    patch.style.left = `${randomLeft}px`;
    patch.style.top = `${randomTop}px`;

    container.appendChild(patch);
}

const grassPatches = document.querySelectorAll('.grass-patch');

// Handle key press to start movement and animation
document.addEventListener('keydown', (event) => {
    if (isMoving) return;  // Prevent starting another movement cycle
    let key = event.key;
    let direction;

    // Get current positions (ensure they are parsed as integers)
    let currentTop = parseInt(playerSprite.style.top) || 0;
    let currentLeft = parseInt(playerSprite.style.left) || 0;

    switch(key) {
        case 'ArrowUp':
            direction = 'up';
            break;
        case 'ArrowDown':
            direction = 'down';
            break;
        case 'ArrowLeft':
            direction = 'left';
            break;
        case 'ArrowRight':
            direction = 'right';
            break;
        default:
            return;  // Exit if it's not an arrow key
    }

    if (direction) {
        moveDirection = direction;
        isMoving = true;
        startMovement(direction, currentTop, currentLeft);
    }
});

// Handle key release to stop movement and animation
document.addEventListener('keyup', () => {
    isMoving = false;
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
    }
});

function startMovement(direction, currentTop, currentLeft) {
    // Start animation loop
    animationInterval = setInterval(() => {
        updateSprite(direction, false);
    }, 1000 / animationSpeed);

    // Continue moving in the specified direction until key is released
    function move() {
        if (!isMoving) return;  // Stop movement if key is released

        switch(direction) {
            case 'up':
                if (currentTop - stepSize >= 0) {
                    currentTop -= stepSize;
                    playerSprite.style.top = `${currentTop}px`;
                }
                break;
            case 'down':
                if (currentTop + stepSize + spriteHeight <= containerHeight) {
                    currentTop += stepSize;
                    playerSprite.style.top = `${currentTop}px`;
                }
                break;
            case 'left':
                if (currentLeft - stepSize >= 0) {
                    currentLeft -= stepSize;
                    playerSprite.style.left = `${currentLeft}px`;
                }
                break;
            case 'right':
                if (currentLeft + stepSize + spriteWidth <= containerWidth) {
                    currentLeft += stepSize;
                    playerSprite.style.left = `${currentLeft}px`;
                }
                break;
        }

        checkCollision();  // Check for collisions with grass patches
        requestAnimationFrame(move);
    }

    move();  // Start moving
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

function checkCollision() {
    const playerRect = playerSprite.getBoundingClientRect();

    grassPatches.forEach(patch => {
        const patchRect = patch.getBoundingClientRect();

        if (playerRect.left < patchRect.left + patchRect.width &&
            playerRect.left + playerRect.width > patchRect.left &&
            playerRect.top < patchRect.top + patchRect.height &&
            playerRect.top + playerRect.height > patchRect.top) {
            
            patch.classList.add('shiny-grass');  // Apply the shiny grass effect

            // Set a timeout to revert to regular grass after 10 seconds
            setTimeout(() => {
                patch.classList.remove('shiny-grass');  // Revert to regular grass
            }, 1000); 
        }
    });
}
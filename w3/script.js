const playerSprite = document.getElementById('player-sprite');
const container = document.getElementById('safari-container');
let pokemonAppeared = false;
let stepsInGrass = 0;  // Track how many steps the player has taken in the grass
let isMoving = false;
let moveDirection = null;
let animationInterval = null;
let currentFrame = 0;

const flashOverlay = document.getElementById('flash-overlay');
const encounterScreen = document.getElementById('encounter-screen');
const encounterPokemon = document.getElementById('encounter-pokemon');
const textBubble = document.getElementById('text-bubble');
const textBubbleContent = textBubble.querySelector('p');

const directions = {
    'down': 0,
    'left': 1,
    'right': 2,
    'up': 3
};

let playerTop = 200;  // Initial top position
let playerLeft = 200; // Initial left position
playerSprite.style.top = `${playerTop}px`;
playerSprite.style.left = `${playerLeft}px`;
const stepSize = 5;  // Smaller step size for smoother motion
const animationSpeed = 10;  // Frame change every 10 animation cycles

const frameWidth = 32;  // Assuming each sprite frame is 32px wide
const frameHeight = 48;  // Assuming each sprite frame is 48px tall
const containerWidth = container.offsetWidth;
const containerHeight = container.offsetHeight;
const spriteWidth = playerSprite.offsetWidth;
const spriteHeight = playerSprite.offsetHeight;

const grassPatches = [];  // To store grass patches for interaction
let pressedKeys = new Set();  // To track which keys are being pressed
let pokemonSpawnedInPatch = null; // Variable to store which grass patch has the Pokémon
const encounterChance = 0.3; // 30% chance of encountering a Pokémon

// Scatter grass patches
const patchSize = 32;  // Size of each grass patch
const numPatches = 20; // Number of grass patches to scatter
for (let i = 0; i < numPatches; i++) {
    const patch = document.createElement('div');
    patch.classList.add('grass-patch');
    patch.style.backgroundImage = "url('images/grass.png')";  // Default grass image

    // Randomize position
    const randomLeft = Math.random() * (containerWidth - patchSize);
    const randomTop = Math.random() * (containerHeight - patchSize);

    patch.style.left = `${randomLeft}px`;
    patch.style.top = `${randomTop}px`;
    patch.style.width = `${patchSize}px`;
    patch.style.height = `${patchSize}px`;
    patch.style.position = "absolute";

    container.appendChild(patch);
    grassPatches.push(patch);
}

// Function to handle Pokémon spawn in a random grass patch
function placePokemonInRandomTile() {
    // Reset any previous spawn
    if (pokemonSpawnedInPatch) {
        pokemonSpawnedInPatch.classList.remove('pokemon-here');
        pokemonSpawnedInPatch = null;
    }

    // Randomly choose a grass patch
    const randomPatchIndex = Math.floor(Math.random() * grassPatches.length);
    pokemonSpawnedInPatch = grassPatches[randomPatchIndex];

    // Mark the chosen grass patch (optional: add a visual indicator)
    pokemonSpawnedInPatch.classList.add('pokemon-here');
}

// Handle key press to start movement and animation
document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        pressedKeys.add(key);

        let direction = getDirectionFromKeys(pressedKeys);
        if (direction && !isMoving) {
            moveDirection = direction;
            isMoving = true;
            startMovement(direction);
        }
    }
});

// Handle key press to start movement and animation
document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        pressedKeys.add(key);

        if (!isMoving) {
            let direction = getDirectionFromKeys();
            if (direction) {
                moveDirection = direction;
                isMoving = true;
                startMovement(moveDirection);
            }
        }
    }
});

// Handle key release to stop movement and animation
document.addEventListener('keyup', (event) => {
    const key = event.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        pressedKeys.delete(key);

        if (pressedKeys.size === 0) {
            isMoving = false;
            if (animationInterval) {
                clearInterval(animationInterval);
                animationInterval = null;
            }
        } else {
            let direction = getDirectionFromKeys();
            if (direction) {
                moveDirection = direction;
            }
        }
    }
});

// Get direction based on the currently pressed keys
function getDirectionFromKeys() {
    if (pressedKeys.has('ArrowUp')) return 'up';
    if (pressedKeys.has('ArrowDown')) return 'down';
    if (pressedKeys.has('ArrowLeft')) return 'left';
    if (pressedKeys.has('ArrowRight')) return 'right';
    return null;
}

// Function to handle movement and animation
function startMovement(direction) {
    if (animationInterval) {
        clearInterval(animationInterval); // Clear previous animation interval
    }

    updateSprite(direction, true); // Immediately update sprite direction when movement starts

    // Start movement loop
    animationInterval = setInterval(() => {
        if (!isMoving) return; // Stop if movement key is released
        updateSprite(direction, false); // Animate walking

        let moved = false;

        // Handle movement in the specified direction
        switch (direction) {
            case 'up':
                if (playerTop - stepSize >= 0) {
                    playerTop -= stepSize;
                    playerSprite.style.top = `${playerTop}px`;
                    moved = true;
                }
                break;
            case 'down':
                if (playerTop + stepSize + spriteHeight <= containerHeight) {
                    playerTop += stepSize;
                    playerSprite.style.top = `${playerTop}px`;
                    moved = true;
                }
                break;
            case 'left':
                if (playerLeft - stepSize >= 0) {
                    playerLeft -= stepSize;
                    playerSprite.style.left = `${playerLeft}px`;
                    moved = true;
                }
                break;
            case 'right':
                if (playerLeft + stepSize + spriteWidth <= containerWidth) {
                    playerLeft += stepSize;
                    playerSprite.style.left = `${playerLeft}px`;
                    moved = true;
                }
                break;
        }

        if (moved) {
            handleGrassAnimation();
            if (isPlayerInGrass()) {
                stepsInGrass++;
                if (!pokemonAppeared && stepsInGrass >= 5 && Math.random() < encounterChance) {
                    triggerPokemonEncounter('images/Inky.gif');
                    pokemonAppeared = true;
                }
            } else {
                stepsInGrass = 0;
            }
        }

    }, 500 / animationSpeed);
}

// Function to update sprite animation
function updateSprite(direction, isTurning) {
    if (isTurning) {
        currentFrame = 0; // Reset to standing frame when changing direction
    } else {
        currentFrame = (currentFrame + 1) % 3; // Cycle through 3 frames for walking
    }

    const yPos = directions[direction] * frameHeight;
    const xPos = currentFrame * frameWidth;

    playerSprite.style.backgroundPosition = `-${xPos}px -${yPos}px`;
}

// Grass animation logic and probability of encounter
function handleGrassAnimation() {
    const playerRect = playerSprite.getBoundingClientRect();
    for (const patch of grassPatches) {
        const patchRect = patch.getBoundingClientRect();
        if (
            playerRect.right > patchRect.left &&
            playerRect.left < patchRect.right &&
            playerRect.bottom > patchRect.top &&
            playerRect.top < patchRect.bottom
        ) {
            // Only have a chance of encountering a Pokémon if we're in the "spawned" patch
            if (patch === pokemonSpawnedInPatch && Math.random() < encounterChance) {
                if (!pokemonAppeared) {
                    triggerPokemonEncounter('images/Inky.gif');
                    pokemonAppeared = true;
                }
            } else {
                // Normal grass animation if no Pokémon encountered
                patch.style.backgroundImage = "url('images/shinygrass.png')";
                setTimeout(() => {
                    patch.style.backgroundImage = "url('images/grass.png')";
                }, 1000);
            }
        }
    }
}

// Pokémon encounter logic
function triggerPokemonEncounter(pokemonImage) {
    flashOverlay.classList.remove('hidden');
    flashOverlay.style.animation = 'flash 0.5s ease-in-out 4 alternate';

    setTimeout(() => {
        flashOverlay.classList.add('hidden');
        flashOverlay.style.animation = '';
        encounterScreen.style.display = 'block';
        encounterPokemon.style.backgroundImage = `url('${pokemonImage}')`;

        // Set Pokémon size dynamically
        encounterPokemon.style.width = '450px';  // Adjust width as needed
        encounterPokemon.style.height = '400px'; // Adjust height as needed

        textBubble.style.display = 'block';
        textBubbleContent.textContent = 'Wild Pokémon appeared!';
        textBubble.classList.add('shown');

        textBubble.addEventListener('click', showOptions, { once: true });
    }, 2000);
}

// Function to show options after first message
function showOptions() {
    textBubbleContent.style.opacity = 0;
    setTimeout(() => {
        textBubbleContent.innerHTML = `
            <div class="option-row">
                <button id="catch-btn">Catch</button>
                <button id="run-away-btn">Run Away</button>
            </div>
            <div class="option-row">
                <button id="feed-btn">Feed</button>
                <button id="bag-btn">Bag</button>
            </div>
        `;
        textBubbleContent.style.opacity = 1;

        const runAwayBtn = document.getElementById('run-away-btn');
        const catchBtn = document.getElementById('catch-btn');

        runAwayBtn.addEventListener('click', runAway);
        catchBtn.addEventListener('click', handleCatch);
    }, 500);
}

// Function to handle 'Run Away' logic
function runAway() {
    encounterScreen.style.display = 'none';
    textBubble.style.display = 'none';
    pokemonAppeared = false;

    // Respawn Pokémon in another random grass patch
    placePokemonInRandomTile();
}

// Function to handle Pokémon catch
function handleCatch() {
    textBubble.style.display = 'none';

    let existingPokeball = document.getElementById('pokeball');
    if (existingPokeball) {
        existingPokeball.remove();
    }

    const pokeball = document.createElement('div');
    pokeball.id = 'pokeball';
    pokeball.style.position = 'absolute';
    pokeball.style.left = '50%';
    pokeball.style.top = '85%';
    pokeball.style.width = '50px';
    pokeball.style.height = '50px';
    pokeball.style.backgroundImage = "url('images/Pokeball.png')";
    pokeball.style.backgroundSize = 'contain';
    pokeball.style.backgroundRepeat = 'no-repeat';
    pokeball.style.cursor = 'pointer';
    pokeball.style.zIndex = 1000;
    pokeball.style.display = 'block';
    document.body.appendChild(pokeball);

    pokeball.addEventListener('click', () => throwPokeball(pokeball));
}

function throwPokeball(pokeball) {
    const pokemonRect = encounterPokemon.getBoundingClientRect();
    const pokeballRect = pokeball.getBoundingClientRect();

    const finalTop = pokemonRect.top - pokeballRect.height / 2;
    const finalLeft = pokemonRect.left + (pokemonRect.width / 2) - (pokeballRect.width / 2);

    pokeball.style.transition = 'top 1.2s ease-in-out, left 1.2s ease-in-out';
    pokeball.style.top = `${finalTop}px`;
    pokeball.style.left = `${finalLeft}px`;

    setTimeout(() => {
        encounterPokemon.style.display = 'none';
        pokeballFallAndShake(pokeball);
    }, 1200);
}

function pokeballFallAndShake(pokeball) {
    pokeball.style.transition = 'top 1s ease';
    pokeball.style.top = '75%';

    setTimeout(() => {
        let shakeCount = 0;
        const shakeInterval = setInterval(() => {
            pokeball.style.transform = shakeCount % 2 === 0 ? 'rotate(-15deg)' : 'rotate(15deg)';
            shakeCount++;
            if (shakeCount > 6) {
                clearInterval(shakeInterval);
                pokeball.style.transform = 'rotate(0deg)';
                alert("You caught the Pokémon!");
                resetEncounter();
            }
        }, 200);
    }, 1000);
}

function resetEncounter() {
    const pokeball = document.getElementById('pokeball');
    if (pokeball) {
        pokeball.remove(); // Remove the Pokéball from the screen
    }
    textBubble.style.display = 'none';
    encounterScreen.style.display = 'none';
    pokemonAppeared = false; // Reset encounter status

    // Place the Pokémon in a new random grass patch after the encounter is finished
    placePokemonInRandomTile();
    
    // Allow new encounters to happen
    stepsInGrass = 0;
}
// Call this function when the Pokémon is caught or the player runs away
function placePokemonInRandomTile() {
    if (pokemonSpawnedInPatch) {
        pokemonSpawnedInPatch.classList.remove('pokemon-here'); // Clear old Pokémon position
        pokemonSpawnedInPatch = null;
    }

    // Randomly choose a grass patch for the new Pokémon encounter
    const randomPatchIndex = Math.floor(Math.random() * grassPatches.length);
    pokemonSpawnedInPatch = grassPatches[randomPatchIndex];

    // Mark the chosen grass patch (you can add a visual indicator here if needed)
    pokemonSpawnedInPatch.classList.add('pokemon-here');
}

// Initial Pokémon spawn
placePokemonInRandomTile();
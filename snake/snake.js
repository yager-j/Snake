// Access DOM elements
const canvas = document.getElementById("gameCanvas")
const canvasCtx = canvas.getContext("2d")

const playButton = document.getElementById('playButton')

const playControlsDiv = document.getElementById('playControlsDiv')

const upButton = document.getElementById('upButton')
const leftButton = document.getElementById('leftButton')
const rightButton = document.getElementById('rightButton')
const downButton = document.getElementById('downButton')

const scoreText = document.getElementById('scoreText')

// Set onclick functions for all buttons
playButton.onclick = startNewGame

upButton.onclick = changeDirection
leftButton.onclick = changeDirection
rightButton.onclick = changeDirection
downButton.onclick = changeDirection

document.addEventListener('keydown', changeDirection)

let score = 0

let snake = [
    { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }
]

let applePosition = { x: 0, y: 0 }

let directionOfMovement = 'right'

let gameEnded = false

/**
 * Determines touch device true or false
 * @returns true if current device is a touch device
 */
function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0))
}

/**
 * Sets game canvas width and height: 
 * if touch device, canvas covers full screen width and play controls are displayed
 * if not touch device, canvas is 600px wide and high
 */
function renderGame() {
    if (isTouchDevice()) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight * 0.7
        playControlsDiv.style.display = "flex"
    } else {
        canvas.width = 600
        canvas.height = 600
    }
}

/**
 * Clears game canvas
 */
function clearCanvas() {
    canvasCtx.fillStyle = '#FFDFD3'
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height)
}

/**
 * Draws one section of the snake
 */
function drawSnakePart(snakePart) {
    canvasCtx.fillStyle = '#A2E4B8'
    canvasCtx.strokestyle = 'darkblue'
    canvasCtx.fillRect(snakePart.x, snakePart.y, 10, 10)
    canvasCtx.strokeRect(snakePart.x, snakePart.y, 10, 10)
}

/**
 * Draws entire snake
 */
function drawSnake() {
    snake.forEach(drawSnakePart)
}

/**
 * Draws apple
 */
function drawApple() {
    canvasCtx.fillStyle = 'red'
    canvasCtx.strokestyle = 'black'
    canvasCtx.fillRect(applePosition.x, applePosition.y, 10, 10)
    canvasCtx.strokeRect(applePosition.x, applePosition.y, 10, 10)
}

/**
 * Moves snake in current direction by adding new head in new position and removing tail
 * If snake head position is same as apple position, adds +10 to score & 2 sections to snake,
 * draws a new apple
 */
function moveSnake() {
    if (directionOfMovement == 'right') {
        dx = 10
        dy = 0
    } else if (directionOfMovement == 'down') {
        dx = 0
        dy = 10
    } else if (directionOfMovement == 'left') {
        dx = -10
        dy = 0
    } else if (directionOfMovement == 'up') {
        dx = 0
        dy = -10
    }
    const head = { x: snake[0].x + dx, y: snake[0].y + dy }
    snake.unshift(head)

    if (snake[0].x == applePosition.x && snake[0].y == applePosition.y) {
        score += 10
        snake.unshift(head)
        startNewApple()
    } else {
        snake.pop()
    }
}

/**
 * Generates a random coordinate between specified min and max values
 */
function generateRandomCoordinate(min, max) {
    return 10 * Math.floor(Math.random() * (max - min) / 10)
}

/**
 * Draws a new apple: generates random coordinates, checks whether new coordinates are within snake bounds,
 * generates new random coordinates if needed, draws apple.
 */
function startNewApple() {
    applePosition = { x: generateRandomCoordinate(0, canvas.width - 10), y: generateRandomCoordinate(0, canvas.height - 10) }
    snake.forEach(part => {
        // if apple is within snake bounds, generate new random coordinates for apple
        if (part.x == applePosition.x && part.y == applePosition.y) {
            applePosition = { x: generateRandomCoordinate(0, canvas.width - 10), y: generateRandomCoordinate(0, canvas.height - 10) }
            startNewApple()
        }
    })
    drawApple()
}

/**
 * Draws a new snake: generates random coordinates, draws 3-part snake in new position.
 */
function startNewSnake() {
    let snakeHeadInitialPosition = { x: generateRandomCoordinate(0, canvas.width * 0.9), y: generateRandomCoordinate(0, canvas.height * 0.9) }
    snake = [
        { x: snakeHeadInitialPosition.x, y: snakeHeadInitialPosition.y }, 
        { x: snakeHeadInitialPosition.x - 10, y: snakeHeadInitialPosition.y }, 
        { x: snakeHeadInitialPosition.x - 20, y: snakeHeadInitialPosition.y }
    ]
    drawSnake()
}

/**
 * The main game function:
 * Checks if game is ended, displays play button if true
 * If game not ended, every 100 milliseconds: reduce score by 0.1,
 * clear game canvas, draw apple and snake in correct position,
 * continue in a loop until game is ended.
 */
function main() {
    if (gameEnded) {
        buttonDiv.style.display = "block"
        return
    }
    checkEndGame()

    setTimeout(function onTick() {
        score -= 0.1
        scoreText.innerText = Math.floor(score)
        clearCanvas()
        drawApple()
        moveSnake()
        drawSnake()
        main()
    }, 100)
}

/**
 * Changes direction of snake movement according to user key/button touch event
 * @param event user touch event from keyboard/play control buttons
 */
function changeDirection(event) {
    const LEFT_KEY = 37
    const RIGHT_KEY = 39
    const UP_KEY = 38
    const DOWN_KEY = 40

    // Changes snake direction only if direction pressed is not opposite of current direction of movement
    if ((event.keyCode == LEFT_KEY || event.target == leftButton) && !(directionOfMovement == 'right')) {
        directionOfMovement = 'left'
    } else if ((event.keyCode == RIGHT_KEY || event.target == rightButton) && !(directionOfMovement == 'left')) {
        directionOfMovement = 'right'
    } else if ((event.keyCode == UP_KEY || event.target == upButton) && !(directionOfMovement == 'down')) {
        directionOfMovement = 'up'
    } else if ((event.keyCode == DOWN_KEY || event.target == downButton) && !(directionOfMovement == 'up')) {
        directionOfMovement = 'down'
    }
}

/**
 * Checks whether game should end.
 * Game ends if:
 * 1. Snake runs into itself
 * 2. Snake hits game canvas edge
 */
function checkEndGame() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            gameEnded = true
            return
        }
    }

    let hitLeftWall = snake[0].x < 0
    let hitRightWall = snake[0].x > canvas.width - 10
    let hitTopWall = snake[0].y < 0
    let hitBottomWall = snake[0].y > canvas.height - 10

    gameEnded = hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
    return
}

/**
 * Starts a new game of snake:
 * Removes play button, resets score, draws a new snake and apple, and runs main game function
 */
function startNewGame() {
    buttonDiv.style.display = "none"
    gameEnded = false
    score = 0
    scoreText.innerText = Math.floor(score)
    directionOfMovement = 'right'
    startNewSnake()
    startNewApple()
    main()
}

// Draw the game canvas
renderGame()

// Draw starting apple
startNewApple()

// Draw starting snake
startNewSnake()
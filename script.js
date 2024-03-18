const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');

const cellSize = 20;
const gridSize = canvas.width / cellSize;
let snake = [{ x: gridSize / 2, y: gridSize / 2 }];
let apple = { x: 0, y: 0 };
let score = 0;
let direction = 'right';
let gameOver = false;

document.addEventListener('keydown', (event) => {
    const newDirection = event.key.replace('Arrow', '').toLowerCase();

    if (gameOver) {
        if (event.key === 'Enter') {
            resetGame();
        }
        return;
    }

    if (
        (direction === 'right' && newDirection === 'left') ||
        (direction === 'left' && newDirection === 'right') ||
        (direction === 'up' && newDirection === 'down') ||
        (direction === 'down' && newDirection === 'up')
    ) {
        return;
    }

    direction = newDirection;
});

function resetGame() {
    snake = [{ x: gridSize / 2, y: gridSize / 2 }];
    score = 0;
    direction = 'right';
    gameOver = false;
    generateApple();
    update();
}

function generateApple() {
    apple.x = Math.floor(Math.random() * gridSize);
    apple.y = Math.floor(Math.random() * gridSize);
}

function update() {
    if (gameOver) return;

    const head = { ...snake[0] };

    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver = true;
        draw();
        return;
    }

    snake.unshift(head);

    if (head.x === apple.x && head.y === apple.y) {
        score++;
        generateApple();
    } else {
        snake.pop();
    }

    draw();
    document.getElementById('score').innerText = `Score: ${score}`;

    setTimeout(update, 100);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    snake.forEach(segment => ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize));

    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x * cellSize, apple.y * cellSize, cellSize, cellSize);

    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Press Enter to restart', canvas.width / 2, canvas.height / 2 + 30);
    }
}

generateApple();
update();

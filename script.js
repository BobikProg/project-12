const map = document.querySelector("#game");
const canvas = map.getContext('2d');
canvas.fillStyle = 'rgb(228, 164, 87)';

const LeftCounter = document.getElementById("leftCounter");
const RightCounter = document.getElementById("rightCounter");

const grid = 15;
const paddleHeight = grid * 5;
const maxPaddleY = map.height - grid - paddleHeight;

let leftScore = 0;
let rightScore = 0;

let ballSpeed = 5;
let paddleSpeed = 7;

const leftPaddle = {
    x: grid * 2,
    y: map.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight,
    dy: 0,
};

const rightPaddle = {
    x: map.width - grid * 3,
    y: map.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight,
    dy: 0,
};

const ball = {
    x: map.width / 2,
    y: map.height / 2,
    width: grid,
    height: grid,
    dx: ballSpeed,
    dy: -ballSpeed,
    isResetted: false,
};

function renderMap() {
    canvas.fillRect(0, 0, map.width, grid); // Верхняя граница
    canvas.fillRect(0, map.height - grid, map.width, grid); // Нижняя граница

    for (let i = grid; i < map.height - grid; i += grid * 2) {
        canvas.fillRect(map.width / 2, i, grid, grid); // Разделительная линия
    }
}

function renderLeftPaddle() {
    canvas.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
}

function renderRightPaddle() {
    canvas.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
}

function movePaddles() {
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;
}

function clearMap() {
    canvas.clearRect(0, 0, map.width, map.height);
}

function renderBall() {
    canvas.fillRect(ball.x, ball.y, ball.width, ball.height);
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function resetGame() {
    if ((ball.x < 0 || ball.x > map.width) && !ball.isResetted) {
        ball.isResetted = true;
        ball.dx = 0;
        ball.dy = 0;

        // Обнуляем счет того, кто не словил мяч
        if (ball.x < 0) {
            leftScore = 0; // Мяч ушел влево — обнуляем счет левого игрока
        } else if (ball.x > map.width) {
            rightScore = 0; // Мяч ушел вправо — обнуляем счет правого игрока
        }
        updateScore();

        setTimeout(() => {
            ball.x = map.width / 2;
            ball.y = map.height / 2;
            ball.dx = ballSpeed * (ball.x < 0 ? 1 : -1);
            ball.dy = -ballSpeed;
            ball.isResetted = false;
        }, 1000);
    }
}

function collideWallsWithPaddle(paddle) {
    if (paddle.y < grid) {
        paddle.y = grid;
    } else if (paddle.y > maxPaddleY) {
        paddle.y = maxPaddleY;
    }
}

function collideWallsWithPaddles() {
    collideWallsWithPaddle(leftPaddle);
    collideWallsWithPaddle(rightPaddle);
}

function collideWallsWithBall() {
    if (ball.y < grid) {
        ball.y = grid;
        ball.dy = -ball.dy;
    } else if (ball.y > map.height - grid) {
        ball.y = map.height - grid;
        ball.dy = -ball.dy;
    }
}

function isCollides(object1, object2) {
    return object1.x < object2.x + object2.width &&
           object1.x + object1.width > object2.x &&
           object1.y < object2.y + object2.height &&
           object1.y + object1.height > object2.y;
}

function collidePaddlesWithBall() {
    if (isCollides(ball, rightPaddle)) {
        ball.dx = -ball.dx;
        ball.x = rightPaddle.x - ball.width;
        ball.dy += (Math.random() - 0.5) * 2;
        rightScore++; // Увеличиваем счет правого игрока
        updateScore(); // Обновляем счет
    } else if (isCollides(ball, leftPaddle)) {
        ball.dx = -ball.dx;
        ball.x = leftPaddle.x + leftPaddle.width;
        ball.dy += (Math.random() - 0.5) * 2;
        leftScore++; // Увеличиваем счет левого игрока
        updateScore(); // Обновляем счет
    }
}

function aiControl() {
    let direction = 0;

    if (ball.y < rightPaddle.y) {
        direction = -1;
    } else if (ball.y > rightPaddle.y + paddleHeight) {
        direction = 1;
    }

    rightPaddle.y += paddleSpeed * direction;
}

function updateScore() {
    LeftCounter.textContent = leftScore;
    RightCounter.textContent = rightScore;
}

function loop() {
    clearMap();
    renderLeftPaddle();
    renderRightPaddle();
    aiControl();
    movePaddles();
    collideWallsWithPaddles();
    renderBall();
    moveBall();
    collideWallsWithBall();
    collidePaddlesWithBall();
    resetGame();
    renderMap();
    requestAnimationFrame(loop);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'w' || event.key === 'ц') {
        leftPaddle.dy = -paddleSpeed;
    } else if (event.key === 's' || event.key === 'ы') {
        leftPaddle.dy = paddleSpeed;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'w' || event.key === 's' || event.key === 'ы' || event.key === 'ц') {
        leftPaddle.dy = 0;
    }
});

requestAnimationFrame(loop);
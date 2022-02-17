function init() {
    canvas = document.getElementById('myCanvas');
    W = H = canvas.width = canvas.height = 520; // Width and Height of the canvas

    pen = canvas.getContext('2d');
    cellSize = 25;
    intervalSpeed = 100;

    food = getRandomFood();

    gameOver = false;

    score = 0; // initial score

    // Image Object for food
    foodImg = new Image();
    foodImg.src = "Assets/fruit.png";

    // Score Image - Trophy
    trophyImg = new Image()
    trophyImg.src = "Assets/trophy.png"

    // JSON object for snake
    snake = {
        init_len: 5, // initial length of the snake
        color: "blue", // color of the snake
        cells: [], // array o contain snake
        direction: "right",
        createSnake: function () {
            for (var i = this.init_len; i > 0; i--) {
                this.cells.push({ x: i, y: 10 });
            }
        },
        drawSnake: function () {
            for (var i = 0; i < this.cells.length; i++) {
                pen.fillStyle = this.color;
                pen.fillRect(this.cells[i].x * cellSize, this.cells[i].y * cellSize, cellSize - 1, cellSize - 1);
            }
        },
        // To Update the movement of the snake periodically
        updateSnake: function () {
            var headX = this.cells[0].x; // previous head x cordinate
            var headY = this.cells[0].y; // previous head y cordinate

            if (headX == food.x && headY == food.y) {
                food = getRandomFood();
                score++;
                if (intervalSpeed > 50 && score % 10 == 0) {
                    intervalSpeed -= 5;
                }
            }
            else {
                // Pop the last cell and put it in the front
                this.cells.pop();
            }

            var nextX, nextY;
            if (this.direction == "right") {
                nextX = headX + 1; // new head x cordinate
                nextY = headY; // new head y cordinate
            }
            else if (this.direction == "left") {
                nextX = headX - 1;
                nextY = headY;
            }
            else if (this.direction == "down") {
                nextX = headX;
                nextY = headY + 1;
            }
            else if (this.direction == "up") {
                nextX = headX;
                nextY = headY - 1;
            }

            // Add new block in front
            this.cells.unshift({ x: nextX, y: nextY });

            var lastX = Math.round(W / cellSize);
            var lastY = Math.round(H / cellSize);
            // GameOver condition
            // If snake out of bounds
            if (this.cells[0].y < 0 || this.cells[0].x < 0 || this.cells[0].x > lastX || this.cells[0].y > lastY) {
                gameOver = true;
            }
            // If snake its itself
            else {
                for (var i = 1; i < this.cells.length; i++) {
                    if (this.cells[0].x == this.cells[i].x && this.cells[0].y == this.cells[i].y) {
                        gameOver = true;
                        break;
                    }
                }
            }
        }
    };
    // Calling the create function to initially create snake
    snake.createSnake();

    // Add a Event Listener on the Document Object to update snake direction
    function keyPressed(e) {
        if (snake.direction != "left" && e.key == "ArrowRight") {
            snake.direction = "right";
        }
        else if (snake.direction != "right" && e.key == "ArrowLeft") {
            snake.direction = "left";
        }
        else if (snake.direction != "up" && e.key == "ArrowDown") {
            snake.direction = "down";
        }
        else if (snake.direction != "down" && e.key == "ArrowUp") {
            snake.direction = "up";
        }
    }
    document.addEventListener('keydown', keyPressed);
}

// To draw and update the canvas again and again
function draw() {
    // erase old frame
    pen.clearRect(0, 0, W, H);

    snake.drawSnake();

    // To draw food
    pen.drawImage(foodImg, food.x * cellSize, food.y * cellSize, cellSize - 1, cellSize - 1);

    // Display Score
    pen.drawImage(trophyImg, 9, 8, 43, 43);
    pen.font = "20px Roboto"
    pen.fillText(score, 25, 25);
}

function update() {
    snake.updateSnake();
}

// To get random position for the food
function getRandomFood() {
    var foodX = Math.round(Math.random() * (W - cellSize) / cellSize);
    var foodY = Math.round(Math.random() * (H - cellSize) / cellSize);
    var food = {
        x: foodX,
        y: foodY,
        color: "red"
    };
    return food;
}

function gameloop() {
    if (gameOver == true) {
        clearInterval(f);
        alert("Game Over");
    }
    draw();
    update();
}

init();
var f = setInterval(gameloop, intervalSpeed);
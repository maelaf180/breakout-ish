const boxHolder = document.querySelector(".boxholder");
const movableDiv = document.getElementById("pad");

let muliplierx = 1;
let mulipliery = 1;

let gameObjects = {
    ball: document.getElementById("ball"),
    boxBorder: document.getElementById("grid"),
    boxholder: document.querySelector(".boxholder"),
    props: {
        boxBorder_X: document.getElementById("grid").getBoundingClientRect().x,
        boxBorder_Y: document.getElementById("grid").getBoundingClientRect().y,
        boxBorder_Width: document.getElementById("grid").getBoundingClientRect()
            .width,
        boxBorder_Height: document
            .getElementById("grid")
            .getBoundingClientRect().height,
    },
};
let collusionHandler = {
    checkBallPadCollision: function () {
        let ballRect = gameObjects.ball.getBoundingClientRect();
        let padRect = movableDiv.getBoundingClientRect();

        if (
            ballRect.x < padRect.x + padRect.width &&
            ballRect.x + ballRect.width > padRect.x &&
            ballRect.y < padRect.y + padRect.height &&
            ballRect.y + ballRect.height > padRect.y
        ) {
            // Collision detected, reverse the ball's direction
            mulipliery *= -1;
        }
    },
    checkcircleinbox: function (box) {
        if (box) {
            if (
                gameObjects.ball.getBoundingClientRect().x >=
                    box.getBoundingClientRect().x &&
                gameObjects.ball.getBoundingClientRect().x <=
                    box.getBoundingClientRect().x +
                        box.getBoundingClientRect().width
            ) {
                if (
                    gameObjects.ball.getBoundingClientRect().y >=
                        box.getBoundingClientRect().y &&
                    gameObjects.ball.getBoundingClientRect().y <=
                        box.getBoundingClientRect().y +
                            box.getBoundingClientRect().height
                ) {
                    muliplierx *= -1;
                    mulipliery *= -1;
                    box.remove();
                    return true;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
};

let boxWidth = 50; // Width of each box
let boxHeight = 50; // Height of each box
let numCols = 12; // Number of columns
let numRows = 6; // Number of rows
let horizontalGap = 0; // Gap between boxes horizontally
let verticalGap = 0; // Gap between boxes vertically

const colorPalette = [
    "#005577",
    "#663399",
    "#008800",
    "#009988",
    "#993366",
    "#990000",
    "#994400",
    "#CCCC00",
    "#001122",
    "#662200",
];

function positionBoxes() {
    let containerWidth = boxWidth * numCols + horizontalGap * (numCols - 1);
    let containerHeight = boxHeight * numRows + verticalGap * (numRows - 1);

    let leftOffset = (boxHolder.offsetWidth - containerWidth) / 2; // Center the boxes horizontally within the container
    let topOffset = (boxHolder.offsetHeight - containerHeight) / 2; // Center the boxes vertically within the container

    let currentLeft = leftOffset;
    let currentTop = topOffset;

    let index = 0;

    // Clear the container before adding new boxes
    boxHolder.innerHTML = "";

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            let randomColor =
                colorPalette[Math.floor(Math.random() * colorPalette.length)];
            let box = document.createElement("div");
            box.classList.add("box");
            box.style.position = "absolute";
            box.style.background = randomColor;
            box.style.width = boxWidth + "px";
            box.style.height = boxHeight + "px";
            box.style.left = currentLeft + "px";
            box.style.top = currentTop + "px";
            boxHolder.appendChild(box);

            index++;
            if (index % numCols === 0) {
                // Move to the next row
                currentLeft = leftOffset;
                currentTop += boxHeight + verticalGap;
            } else {
                // Move to the next column
                currentLeft += boxWidth + horizontalGap;
            }
        }
    }
}

// Call positionBoxes when the page loads and whenever it's resized
window.addEventListener("load", positionBoxes);
window.addEventListener("resize", positionBoxes);

positionBoxes();
let audioController = {
    audioPlayer: document.getElementById("myAudio"),
    level: 1,
    levelAudioPath: "audios/level1.mp3",
    audiobox: document.getElementById("audioFile"),
    setAudio: function () {
        this.audiobox.removeAttribute("src");
        this.audiobox.setAttribute("src", this.levelAudioPath);
    },
    playAudio: function () {
        this.audioPlayer.play();
    },
};

let levelSettings = {
    boxCount: 48,
};

let gamePopulate = {
    populateboxes: function () {
        for (let i = 0; i < levelSettings.boxCount; i++) {
            let randomColor =
                colorPalette[Math.floor(Math.random() * colorPalette.length)];
            let box = document.createElement("div");
            box.classList.add("box");
            box.style.backgroundColor = randomColor;
            boxHolder.appendChild(box);
        }
    },
};

// ...

let physicsController = {
    changeX: 7,
    changeY: 7,
    constantMovement: function (chac) {
        let currentTop = gameObjects.ball.getBoundingClientRect().y;
        let currentLeft = 100;
        let changex = this.changeX;
        let changey = this.changeY;

        function moveBall() {
            currentTop -= changey * mulipliery;
            currentLeft += changex * muliplierx;
            gameObjects.ball.style.top = currentTop + "px";
            gameObjects.ball.style.left = currentLeft + "px";
            let boxes = Array.from(
                gameObjects.boxholder.getElementsByTagName("div")
            );
            boxes.forEach((box) => {
                collusionHandler.checkcircleinbox(box);
            });
            collusionHandler.checkcircleinbox();
            collusionHandler.checkBallPadCollision();
            console.log(gameObjects.ball.getBoundingClientRect().x);
            if (
                gameObjects.ball.getBoundingClientRect().x >=
                gameObjects.props.boxBorder_X +
                    gameObjects.props.boxBorder_Width -
                    gameObjects.ball.getBoundingClientRect().width
            ) {
                muliplierx *= -1;
            } else if (
                gameObjects.ball.getBoundingClientRect().y <=
                gameObjects.props.boxBorder_Y
            ) {
                mulipliery *= -1;
            } else if (
                gameObjects.ball.getBoundingClientRect().x <=
                gameObjects.props.boxBorder_X
            ) {
                muliplierx *= -1;
            } else if (
                gameObjects.ball.getBoundingClientRect().y >=
                gameObjects.props.boxBorder_Y +
                    gameObjects.props.boxBorder_Height -
                    gameObjects.ball.getBoundingClientRect().width
            ) {
                mulipliery *= -1;
            }
            requestAnimationFrame(moveBall);
        }

        moveBall(this);
    },
};

// ...

let gameController = {
    gameStart: function () {
        audioController.setAudio();

        audioController.audioPlayer.addEventListener("canplaythrough", () => {
            audioController.playAudio();
        });
        physicsController.constantMovement();
    },
};
gameController.gameStart();

// Get the movable div element

// Function to move the div
function moveDiv(direction) {
    const step = 10; // Step size for each move

    // Parse the current left style to a number
    let currentX = parseFloat(movableDiv.style.left) || 0;

    if (direction === "left") {
        currentX -= step;
    } else if (direction === "right") {
        currentX += step;
    }

    movableDiv.style.left = currentX + "px";
}

// Event listener for keydown event
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        moveDiv("left");
    } else if (event.key === "ArrowRight") {
        moveDiv("right");
    }
});

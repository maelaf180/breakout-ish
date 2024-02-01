const boxHolder = document.querySelector(".boxholder");

let gameObjects = {
  ball: document.getElementById("ball"),
  boxBorder: document.getElementById("grid"),
  props: {
    boxBorder_X: document.getElementById("grid").getBoundingClientRect().x,
    boxBorder_Y: document.getElementById("grid").getBoundingClientRect().y,
    boxBorder_Width: document.getElementById("grid").getBoundingClientRect()
      .width,
    boxBorder_Height: document.getElementById("grid").getBoundingClientRect()
      .height,
  },
};
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
  changeX: 3,
  changeY: 3,
  constantMovement: function (chac) {
    let currentTop = gameObjects.ball.getBoundingClientRect().y;
    let currentLeft = 100;
    let changex = this.changeX;
    let changey = this.changeY;

    function moveBall() {
      currentTop -= changex;
      currentLeft += changey;
      gameObjects.ball.style.top = currentTop + "px";
      gameObjects.ball.style.left = currentLeft + "px";
      if (parseFloat(gameObjects.ball.style.left) >= 300) {
        physicsController.changeX = -3;
      }
      requestAnimationFrame(moveBall);
    }

    moveBall(this);
  },
};

// ...

let gameController = {
  gameStart: function () {
    gamePopulate.populateboxes();
    audioController.setAudio();

    audioController.audioPlayer.addEventListener("canplaythrough", () => {
      audioController.playAudio();
    });
    physicsController.constantMovement();
  },
};
gameController.gameStart();

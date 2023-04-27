var canvas, canvasBg;
var audioCtx;
var ctx;
var dir;
var posx;
var posy;
var unit, cu; //1unit=100cu
var buffx = [];
var buffy = [];
var i;
var play, restart, isMobile;
var length;
var foodIndex,
  food = [],
  speedIndex,
  speedIcon = [],
  delay;
var intervalId;
var fact = [],
  factSpan;
var foodx, foody;
var liveScore, highScore;
var endScore, endHighScore;
var score, maxScore;
var overlay, overlay2, info, control, controlImg;
var nH, nW; //no.of units that can fit in  canvas height & width
var numFactor;


window.onload = start;

function start() {
  initializer();
  if (!restart) {
    eventSetter();
    startOverlay();
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    factIndex = Math.round(Math.random() * (fact.length - 1));
  }
  updateScore();
  generateFood();
  intervalId = setInterval(main, delay);
}

function main() {
  if (!play) return;
  //clears tail
  ctx.clearRect(buffx[i], buffy[i], unit, unit);
  //clears head
  ctx.clearRect(posx, posy, unit, unit);
  //draws new tail
  ctx.fillStyle = "green";
  ctx.fillRect(posx + 10 * cu, posy + 10 * cu, unit - 20 * cu, unit - 20 * cu);
  buffx[i] = posx;
  buffy[i] = posy;
  switch (dir) {
    case 1:
      posy -= unit;
      break;
    case 2:
      posx -= unit;
      break;
    case 3:
      posy += unit;
      break;
    case 4:
      posx += unit;
      break;
  }
  play = false;
  checkFoodCapture();
  if (checkCollision()) {
    gameOver();
    playSound("crash");
    ctx.fillStyle = "brown";
    ctx.fillRect((buffx[i] + posx) / 2, (buffy[i] + posy) / 2, unit, unit);
    return;
  } else play = true;
  //draws head
  ctx.fillStyle = "brown";
  ctx.fillRect(posx + cu, posy + cu, unit - 2 * cu, unit - 2 * cu);
  i = ++i % length;
}

function initializer() {
  if (typeof canvas == "undefined") {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      isMobile = true;
    }
    canvas = document.getElementById("canvas");
    canvasBg = document.getElementById("canvas-bg");
    fixDpi();
    ctx = canvas.getContext("2d");
    if (isMobile) numFactor = 33;
    else numFactor = 38;
    /*decrease numFactor's value to  increase no.of boxes horizontally and vice versa
       num of boxes vertically is determined by no.of boxes horizontally*/
    nW = Math.floor(window.innerWidth / numFactor);
    unit = Math.floor(canvas.width / nW);
    cu = 0.01 * unit;
    nH = Math.floor(canvas.height / unit);
    //making canvas dimension multiple of unit
    canvas.width = unit * nW;
    canvas.height = unit * nH;
    canvasBg.width = canvas.width;
    canvasBg.height = canvas.height;
    drawCanvasBg();
    liveScore = document.getElementById("info-live-score");
    highScore = document.getElementById("info-high-score");
    if (isMobile) {
      overlay = document.getElementById("mobileoverlay-start");
      overlay2 = document.getElementById("mobileoverlay-end");
      endScore = document.getElementById("mo-e-live-score");
      endHighScore = document.getElementById("mo-e-high-score");
      factSpan = document.getElementById("mo-e-fact");
    } else {
      overlay = document.getElementById("pcoverlay-start");
      overlay2 = document.getElementById("pcoverlay-end");
      endScore = document.getElementById("pco-e-live-score");
      endHighScore = document.getElementById("pco-e-high-score");
      factSpan = document.getElementById("pco-e-fact");
    }

    overlay.tabIndex = -1;
    canvas.tabIndex = -1;
    overlay2.tabIndex = -1;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    restart = 0;
    maxScore = 0;
    fact = [
      "You can change food and speed from gameover screen by tapping on the food and trophie.",
      "Snakes do have ear.",
      "Snake are human shy.",
      "Snakes can explode after eating too much.",
      "The game has theme very similar to google's snake game.Try out that too.",
    ];
    factIndex = 0;
    food = ["🍎", "🍇", "🍒", "🍔", "🍕", "🌮", "🐁"];
    foodIndex = 0;
    speedIcon = ["🏆", "🐇", "✈", "🐢"];
    speedIndex = 0;
    delay = 150;
  }
  (posx = 4 * unit), (posy = 4 * unit);
  buffx = [];
  buffy = [];
  (length = 4), (dir = 4), (i = 0), (score = 0), (play = true);
}

function eventSetter() {
  if (isMobile) {
    document.addEventListener('touchmove', function(e) {
      e.preventDefault();
    }, { passive: false });
    canvas.addEventListener("swiped-up", () => {
      if (dir != 3 && dir != 1) {
        dir = 1;
        playSound("dirChange1");
      }
    });
    canvas.addEventListener("swiped-left", () => {
      if (dir != 4 && dir != 2) {
        dir = 2;
        playSound("dirChange2");
      }
    });
    canvas.addEventListener("swiped-down", () => {
      if (dir != 1 && dir != 3) {
        dir = 3;
        playSound("dirChange3");
      }
    });
    canvas.addEventListener("swiped-right", () => {
      if (dir != 2 && dir != 4) {
        dir = 4;
        playSound("dirChange4");
      }
    });
    overlay.addEventListener("click", () => {
      overlay.style.display = "none";
      play = true;
    });
    overlay2.addEventListener("click", () => {
      overlay2.style.display = "none";
      restart = 1;
      start();
    });
  } else {
    canvas.addEventListener("keydown", (e) => {
      e = e || window.event;
      switch (e.key) {
        case "ArrowUp":
          if (dir != 3 && dir != 1) {
            dir = 1;
           playSound("dirChange1");
          }
          break;
        case "ArrowLeft":
          if (dir != 4 && dir != 2) {
            dir = 2;
           playSound("dirChange2");
          }
          break;
        case "ArrowDown":
          if (dir != 1 && dir != 3) {
            dir = 3;
           playSound("dirChange3");
          }
          break;
        case "ArrowRight":
          if (dir != 2 && dir != 4) {
            dir = 4;
           playSound("dirChange4");
          }
          break;
      }
    });

    overlay.addEventListener("keydown", (e) => {
      if (e.key != "Enter") return;
      overlay.style.display = "none";
      play = true;
      overlay.blur();
      canvas.focus();
    });
    overlay2.addEventListener("keydown", (e) => {
      if (e.key != "Enter") return;
      overlay2.style.display = "none";
      restart = 1;
      overlay2.blur();
      canvas.focus();
      start();
    });
  }
  endScore.addEventListener("click", (e) => {
    e.stopPropagation();
    foodChange();
  });
  endHighScore.addEventListener("click", (e) => {
    e.stopPropagation();
    speedChange();
  });
  window.addEventListener('resize', () => {
    window.location.reload();
  });
}

function checkCollision() {
  for (let k = 0; k < length; k++) {
    if (posx == buffx[k] && posy == buffy[k]) return true;
  }
  if (dir == 1 || dir == 2) {
    if (posx < 0 || posy < 0 || posx > canvas.width || posy > canvas.height)
      return true;
  }
  if (dir == 3 || dir == 4) {
    if (posx == canvas.width || posy == canvas.height) return true;
  }

  return false;
}

function gameOver() {
  clearInterval(intervalId);
  endOverlay();
}

function checkFoodCapture() {
  if (posx == foodx && posy == foody) {
    playSound("eat");
    length++;
    score++;
    updateScore();
    generateFood();
  }
}

function generateFood() {
  var valid;
  do {
    valid = true;
    foodx = Math.floor(Math.random() * nW) * unit;
    foody = Math.floor(Math.random() * nH) * unit;
    for (let k = 0; k < length; k++) {
      if (
        (foodx == buffx[k] && foody == buffy[k]) ||
        (foodx == posx && foody == posy)
      ) {
        valid = false;
        break;
      }
    }
  } while (!valid);
  ctx.font = `${unit - 20 * cu}px sans arial`;
  ctx.textBaseline = "top";
  ctx.fillText(food[foodIndex], foodx + 1, foody + 20 * cu, unit - 2);
}

function updateScore() {
  liveScore.innerHTML = `<big>${food[foodIndex]}</big>` + score;
  highScore.innerHTML = `<big>${speedIcon[speedIndex]}</big>` + maxScore;
  if (score > maxScore) {
    maxScore = score;
    updateScore();
  }
}

function foodChange() {
  foodIndex = ++foodIndex % food.length;
  updateScore();
  endOverlay();
}

function speedChange() {
  speedIndex = ++speedIndex % speedIcon.length;
  switch (speedIndex) {
    default:
    case 0:
      delay = 150;
      break;
    case 1:
      delay = 100;
      break;
    case 2:
      delay = 60;
      break;
    case 3:
      delay = 200;
      break;
  }
  updateScore();
  endOverlay();
}

function drawCanvasBg() {
  let bgCtx = canvasBg.getContext("2d");
  bgCtx.fillStyle = "#A2D149";
  for (let i = 0; i < nH; i++) {
    for (let j = 0; j < nW; j++) {
      if ((i % 2 != 0 && j % 2 == 0) || (i % 2 == 0 && j % 2 != 0))
        bgCtx.fillRect(j * unit, i * unit, unit, unit);
    }
  }
}

class Sound {
  constructor(freqValue, duration, delay = 0, type = "sine") {
    this.o = audioCtx.createOscillator();
    this.o.type = type;
    this.o.frequency.value = freqValue;
    this.o.connect(audioCtx.destination);
    this.duration = duration;
    this.delay = delay;
  }
  play() {
    this.o.start(audioCtx.currentTime + this.delay);
    this.o.stop(audioCtx.currentTime + this.delay + this.duration);
  }
}

function playSound(action) {
  switch (action) {
    case "eat":
      let eatSound = new Sound(610, 0.08,0,"square");
      eatSound.play();
      break;
    case "crash":
      let crashSound = new Sound(250, 0.3);
      crashSound.play();
      break;
    case "dirChange1":
    case "dirChange3":
      let moveSound1 = new Sound(400, 0.08,0,"square");
      moveSound1.play();
      break;
    case "dirChange2":
    case "dirChange4":
      let moveSound2 = new Sound(450, 0.08,0,"square");
      moveSound2.play();
      break;
  }
}

function startOverlay() {
  play = false;
  overlay.style.display = "flex";
  if (!isMobile) {
    overlay.focus();
    canvas.blur();
  }
}

function endOverlay() {
  overlay2.style.display = "flex";
  factSpan.innerHTML = fact[factIndex];
  endScore.innerHTML = `<big>${food[foodIndex]}</big>` + score;
  endHighScore.innerHTML = `<big>${speedIcon[speedIndex]}</big>` + maxScore;
  if (!isMobile) {
    overlay2.focus();
    canvas.blur();
  }
}

function fixDpi() {
  let dpi = window.devicePixelRatio;
  let style_height = +getComputedStyle(canvas)
    .getPropertyValue("height")
    .slice(0, -2);
  let style_width = +getComputedStyle(canvas)
    .getPropertyValue("width")
    .slice(0, -2);
  canvas.setAttribute("height", style_height * dpi);
  canvas.setAttribute("width", style_width * dpi);
}

function clearDefault(){
  
}
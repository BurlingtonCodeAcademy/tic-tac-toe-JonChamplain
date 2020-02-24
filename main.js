//Hello, if you are reading this, I'm sorry. This code is a hot mess. Most of these functions are unnececarily long,
// and could be split up to be much more concise and readable. But this is what I have as of 1am Monday morning,
// and it works (mostly). I will take some time when I have it to make sure no one else has stress-dreams about it, I promise!


/////// Start, Single Player, and Two Player Buttons, Status Bar///////

let startButton = document.getElementById("start");
startButton.addEventListener("click", startGame);

let singlePlayer = document.getElementById("single-player");
singlePlayer.checked = true;
singlePlayer.addEventListener("click", check);

let twoPlayer = document.getElementById("two-player");
twoPlayer.addEventListener("click", check);

let statusBar = document.getElementById("status-bar");


//////Global variable initializations////////////

let timer = setInterval(countTimer, 1000);
let totalSeconds = 0;
let gameOver = true;
let turnNumber = 0;
let playerOne = "";
let playerTwo = "";
let xSquares = [];
let oSquares = [];
let emptySquares = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let winCombos = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7]
];

//////Initializing game-board squares, should probably have made some loops but oh-well...////////

let cell1 = document.getElementById("cell-1");
let cell2 = document.getElementById("cell-2");
let cell3 = document.getElementById("cell-3");
let cell4 = document.getElementById("cell-4");
let cell5 = document.getElementById("cell-5");
let cell6 = document.getElementById("cell-6");
let cell7 = document.getElementById("cell-7");
let cell8 = document.getElementById("cell-8");
let cell9 = document.getElementById("cell-9");

cell1.squareNumber = 1;
cell2.squareNumber = 2;
cell3.squareNumber = 3;
cell4.squareNumber = 4;
cell5.squareNumber = 5;
cell6.squareNumber = 6;
cell7.squareNumber = 7;
cell8.squareNumber = 8;
cell9.squareNumber = 9;

cell1.addEventListener("click", drawCell);
cell2.addEventListener("click", drawCell);
cell3.addEventListener("click", drawCell);
cell4.addEventListener("click", drawCell);
cell5.addEventListener("click", drawCell);
cell6.addEventListener("click", drawCell);
cell7.addEventListener("click", drawCell);
cell8.addEventListener("click", drawCell);
cell9.addEventListener("click", drawCell);

let cellLookup = {
  1: cell1,
  2: cell2,
  3: cell3,
  4: cell4,
  5: cell5,
  6: cell6,
  7: cell7,
  8: cell8,
  9: cell9
};

//////Defining functions used in the game/////////

function randomInt(max, min) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

///////Game timer//////////////////////////////////////

function countTimer() {
  if (gameOver === false) {
    ++totalSeconds;
    let hour = Math.floor(totalSeconds / 3600);
    let minute = Math.floor((totalSeconds - hour * 3600) / 60);
    let seconds = totalSeconds - (hour * 3600 + minute * 60);
    if (hour < 10) hour = "0" + hour;
    if (minute < 10) minute = "0" + minute;
    if (seconds < 10) seconds = "0" + seconds;
    document.getElementById("timer").innerHTML =
      "Time Elapsed: " + hour + ":" + minute + ":" + seconds;
  }
}

////////Forces either Single Player or Two Player to be selected//////////

function check(event) {
  if (gameOver === true) {
    if (event.target === singlePlayer) {
      singlePlayer.checked = true;
      twoPlayer.checked = false;
    }
    if (event.target === twoPlayer) {
      twoPlayer.checked = true;
      singlePlayer.checked = false;
    }
  }
}

/////////Remove a square from Empty Squares//////////

function removeSquare(item, list) {
  for (let index = list.length - 1; index >= 0; index--) {
    if (list[index] === item) list.splice(index, 1);
  }
}

//////////Checks who's turn it is//////////////

function whosTurn(turnNumber) {
  if (gameOver === false) {
    if (turnNumber % 2 === 0) {
      statusBar.textContent = playerTwo + "'s Turn";
      return "o";
    } else {
      statusBar.textContent = "Player One's Turn";
      return "x";
    }
  }
}

//////////Resets all needed variables for new game///////////

function startGame(event) {
  cell1.innerHTML = "";
  cell2.innerHTML = "";
  cell3.innerHTML = "";
  cell4.innerHTML = "";
  cell5.innerHTML = "";
  cell6.innerHTML = "";
  cell7.innerHTML = "";
  cell8.innerHTML = "";
  cell9.innerHTML = "";

  cell1.classList = "square";
  cell2.classList = "square";
  cell3.classList = "square";
  cell4.classList = "square";
  cell5.classList = "square";
  cell6.classList = "square";
  cell7.classList = "square";
  cell8.classList = "square";
  cell9.classList = "square";

  xImage =
    "<img class='character-image fade-in' src='images/x/" +
    randomInt(7, 1) +
    ".gif' height=90% width=90% />";
  oImage =
    "<img class='character-image fade-in' src='images/o/" +
    randomInt(13, 1) +
    ".gif' height=90% width=90% />";

  if (singlePlayer.checked === true) {
    twoPlayer.disabled = true;
    playerTwo = "Computer";
  } else {
    singlePlayer.disabled = true;
    playerTwo = "Player Two";
  }

  xSquares = [];
  oSquares = [];
  emptySquares = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  event.target.disabled = true;
  gameOver = false;
  totalSeconds = 0;
  countTimer();
  turnNumber = 1;
  statusBar.textContent = "Player One's Turn";
}

/////////////Logic for making a move/////////////////

function drawCell(event) {
  if (gameOver === false) {
    if (
      event.target.innerHTML === "" &&
      event.target.className != "character-image fade-in"
    ) {
      if (twoPlayer.checked === true || whosTurn(turnNumber) === "x") {
        if (whosTurn(turnNumber) === "o") {
          event.target.innerHTML = oImage;
          oSquares.push(event.target.squareNumber);
          removeSquare(event.target.squareNumber, emptySquares);
        }
        if (whosTurn(turnNumber) === "x") {
          event.target.innerHTML = xImage;
          xSquares.push(event.target.squareNumber);
          removeSquare(event.target.squareNumber, emptySquares);
        }
        anybodyWonYet(xSquares, oSquares);

        turnNumber += 1;

        whosTurn(turnNumber);

        if (gameOver === false && singlePlayer.checked) {
          setTimeout(cpuMove, 750);
        } 
      }
    } else {
      statusBar.textContent =
        "That cell is full, but there's plenty to go around!";
    }
  }
}

/////////////Logic for CPU move////////////////

function cpuMove() {
  let randomSquare = Math.floor(Math.random() * emptySquares.length);
  cpuSquare = document.getElementById("cell-" + emptySquares[randomSquare]);
  cpuSquare.innerHTML = oImage;
  oSquares.push(cpuSquare.squareNumber);
  removeSquare(cpuSquare.squareNumber, emptySquares);
  anybodyWonYet(xSquares, oSquares);
  turnNumber += 1;
  whosTurn(turnNumber);
}

////////////Checks if anybody has three in a row, and ends the game, this could definately be broken up into several functions, I'm sorry!!!//////////////

function anybodyWonYet(xSquares, oSquares) {
  for (let win of winCombos) {
    let inARow = 0;
    let squares = [];
    for (let square of win) {
      if (xSquares.includes(square)) {
        inARow += 1;
        squares.push(square);
        if (inARow === 3) {
          statusBar.textContent = "Player One Wins! Right on, man!";
          gameOver = true;
          for (let toHighlight of squares) {
            let cells = cellLookup[toHighlight];
            cells.classList.add("bgcolor");
            cells.style.opacity = 1;
          }
        }
      }
    }
  }
  for (let win of winCombos) {
    let inARow = 0;
    let squares = [];
    for (let square of win) {
      if (oSquares.includes(square)) {
        inARow += 1;
        squares.push(square);
        if (inARow === 3) {
          statusBar.textContent = playerTwo + " Wins! Bummer, dude.";
          gameOver = true;
          for (let toHighlight of squares) {
            let cells = cellLookup[toHighlight];
            cells.classList.add("bgcolor");
            cells.style.opacity = 1;
          }
        }
      }
    }
  }
  if (gameOver === false && turnNumber === 9) {
    statusBar.textContent = "It's a tie! I can dig it.";
    gameOver = true;
  }
  if (gameOver === true) {
    startButton.disabled = false;
    singlePlayer.disabled = false;
    twoPlayer.disabled = false;
  }
}


//////////////Rainbow Text Function, I stole this from the internet!///////////////////
/////////////From www.htmlbestcodes.com-Coded by: Krishna Eydat///////////////////////

var text = ""; // YOUR TEXT
var speed = 75; // SPEED OF FADE

if (document.all || document.getElementById) {
  document.write('<span id="highlight">' + text + "</span>");
  var storetext = document.getElementById
    ? document.getElementById("highlight")
    : document.all.highlight;
} else document.write(text);
var hex = new Array(
  "00",
  "14",
  "28",
  "3C",
  "50",
  "64",
  "78",
  "8C",
  "A0",
  "B4",
  "C8",
  "DC",
  "F0"
);
var r = 1;
var g = 1;
var b = 1;
var seq = 1;
function changetext() {
  rainbow = "#" + hex[r] + hex[g] + hex[b];
  storetext.style.color = rainbow;
}
function change() {
  if (seq == 6) {
    b--;
    if (b == 0) seq = 1;
  }
  if (seq == 5) {
    r++;
    if (r == 12) seq = 6;
  }
  if (seq == 4) {
    g--;
    if (g == 0) seq = 5;
  }
  if (seq == 3) {
    b++;
    if (b == 12) seq = 4;
  }
  if (seq == 2) {
    r--;
    if (r == 0) seq = 3;
  }
  if (seq == 1) {
    g++;
    if (g == 12) seq = 2;
  }
  changetext();
}
function starteffect() {
  if (document.all || document.getElementById)
    flash = setInterval("change()", speed);
}
starteffect();

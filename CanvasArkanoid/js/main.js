
// ============== BEGIN LIBRARY CODE ==============
// Ball
var x = 450; // positon x of the ball
var y = 485; // position y of the ball
var dx = -2; // speed at x axcis
var dy = -3; // speed at x axcis
var ballr = 8; // ball radius
// Canvas
var WIDTH; // width of canvas
var HEIGHT; // height of canvas
var ctx; // context
// Paddle
var paddlex; // paddle x position
var paddleh; // paddle height
var paddlew; // paddle width
// Key control
var rightDown = false; // pressed right arrow
var leftDown = false; // pressed left arrow
// Bricks
var bricks;
var NROWS; // n rows
var NCOLS; // n columns
var BRICKWIDTH; // brick width
var BRICKHEIGHT; // brick height
var PADDING; // padding between blocks
// Colors
var rowcolors = ["#FF1C0A", "#FFFD0A", "#00A308", "#EB0093"];
var paddlecolor = "#FFFFFF";
var ballcolor = "#FFFFFF";
// variable to interval
var intervalId;
var interval2; // interval2
var readyStadyGo = 0;
var toEnd = 20;

window.onload = init;
 
function init() { // start the game
  ctx = $('#canvas')[0].getContext("2d");
  WIDTH = $("#canvas").width();
  HEIGHT = $("#canvas").height();
  // Welcome pulpit
  ctx.font = 'italic 70pt Calibri';
  ctx.fillStyle = 'white';
  ctx.fillText('Canvas Arcanoid', 80, 200);
}

// Start game
$('button').click(function(){
  clear();
  interval2 = setInterval(function(){ firstDraw() }, 1000);
  //startGame();
  $(this).css('display', 'none');
});

function startGame() {
  init_paddle();
  initbricks();
  intervalId = setInterval(function(){ draw() }, 10);
  //return setInterval(draw, 10);
}

 
function circle(x,y,r) { // ball
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}

function init_paddle() { // paddle
  paddlex = WIDTH / 2; // half of canvas width
  paddleh = 10;
  paddlew = 75;
}
 
function rect(x,y,w,h) { //
  ctx.beginPath();
  ctx.rect(x,y,w,h);
  ctx.closePath();
  ctx.fill();
}

function initbricks() { // create bricks
  NROWS = 4;
  NCOLS = 5;
  BRICKWIDTH = (WIDTH/NCOLS) - 5;
  BRICKHEIGHT = 20;
  PADDING = 4;

  bricks = new Array(NROWS);
  for (i=0; i < NROWS; i++) {
    bricks[i] = new Array(NCOLS);
    for (j=0; j < NCOLS; j++) {
      bricks[i][j] = 1;
    }
  }
}
 
function clear() { // clear the canvas during the game
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// ============== Color the bricks ==============
function drawbricks() {
  for (i=0; i < NROWS; i++) {
    ctx.fillStyle = rowcolors[i];
    for (j=0; j < NCOLS; j++) {
      if (bricks[i][j] == 1) {
        rect((j * (BRICKWIDTH + PADDING)) + PADDING, 
             (i * (BRICKHEIGHT + PADDING)) + PADDING,
             BRICKWIDTH, BRICKHEIGHT);
      }
    }
  }
}


// ============== Control by keys ==============

//set rightDown or leftDown if the right or left keys are down
function onKeyDown(evt) {
  if (evt.keyCode == 39) rightDown = true;
  else if (evt.keyCode == 37) leftDown = true;
}

//and unset them when the right or left key is released
function onKeyUp(evt) {
  if (evt.keyCode == 39) rightDown = false;
  else if (evt.keyCode == 37) leftDown = false;
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

// ============== Show Game for a moment ==============
function firstDraw() {
  //clear();
  init_paddle();
  initbricks();
  ctx.fillStyle = ballcolor;
  circle(x, y, ballr); // draw ball
  drawbricks();
  rect(paddlex, HEIGHT-paddleh, paddlew, paddleh); // draw paddle
  ctx.fillStyle = 'lightblue';
  ctx.fill();
  readyStadyGo++;
  if(readyStadyGo===2){
    startGame();
    clearInterval(interval2);
    clear();
  }
}

// ============== GAME ============== 
function draw() {
  clear();
  ctx.fillStyle = ballcolor;
  circle(x, y, ballr); // draw ball
  drawbricks();
  rect(paddlex, HEIGHT-paddleh, paddlew, paddleh); // draw paddle
  ctx.fillStyle = 'lightblue';
  ctx.fill();

  //have we hit a brick?
  rowheight = BRICKHEIGHT + PADDING;
  colwidth = BRICKWIDTH + PADDING;
  row = Math.floor(y/rowheight);
  col = Math.floor(x/colwidth);
  // if so, reverse the ball and mark the brick as broken
  if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
    dy = -dy;
    bricks[row][col] = 0;
    toEnd--;
    if(toEnd<1){
      clearInterval(intervalId);
      win();
    }
  }

  // changing ball direction at x
  if (x + dx > WIDTH || x + dx < 0)
    dx = -dx;

  //move the paddle if left or right is currently pressed
  if (rightDown && paddlex < WIDTH-paddlew) paddlex += 5;
  else if (leftDown && paddlex > 0) paddlex -= 5;
    rect(paddlex, HEIGHT-paddleh, paddlew, paddleh);

  // changing ball direction at y or GameOver
  if (y + dy < 0)
    dy = -dy;
  else if (y + dy > HEIGHT) {
    if (x > paddlex && x < paddlex + paddlew) // reflection (odbicie)
      //move the ball differently based on where it hit the paddle
      //dx = 8 * ((x-(paddlex+paddlew/2))/paddlew);
      dy = -dy;
    else  {
      //game over, so stop the animation
      clearInterval(intervalId);
      loose();
    }
  }

  x += dx;
  y += dy;


} // draw

function loose() {
  //clear();
  ctx.font = 'bold 70pt Calibri';
  ctx.fillStyle = 'red';
  ctx.fillText('Game Over', 170, 200);
  $('button').css('display', 'block').text('Play again');
  readyStadyGo = 0;
  x = 450; // positon x of the ball
  y = 480; // position y of the ball
  toEnd = 20;
} 

function win() {
  clear();
  ctx.font = 'bold 70pt Calibri';
  ctx.fillStyle = 'white';
  ctx.fillText('You win!!! :)', 170, 200);
  $('button').css('display', 'block').text('Play again');
  readyStadyGo = 0;
  toEnd = 20;
  x = 450; // positon x of the ball
  y = 485; // position y of the ball
}
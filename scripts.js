// Hide the selectLevelFooter and show the selectModeFooter after the user selects a level/puzzle size; gameLevel stores the level the user chose.
var gameLevel = null;
$('.levelSelector').each(function(){
  $(this).click(function(){
    if (this === $('#select3By3')[0]) {
      gameLevel = "3By3"
    }
    else {
      gameLevel = "4By4"
    }
  $('#selectLevelFooter').css('display','none');
  $('#selectModeFooter').fadeIn('slow');
  })
});

//Record and display the time it takes for (1) either of the player to win or (2) both of the player to win. updateTime will later be used to call a setiterval function to update the timer display every 1 second. It is also used to clearInterval when player/players win.
var elapsedTime = 0;
var timeNShuffle = function() {
  elapsedTime++;
  $('.timer').text('Elapsed Time: ' + elapsedTime + ' sec.');
  if (gameMode === "time" && gameLevel === "3By3") {
    if (elapsedTime % 30 === 0) {
      generateBoard();
      elapsedTime = 0;
    }
  }
  else if (gameMode === "time" && gameLevel === "4By4") {
    if (elapsedTime % 60 === 0) {
      generateBoard();
      elapsedTime = 0;
    }
  }
  if (elapsedTime === 0) {
    $('.timer').text('Elapsed Time: ' + elapsedTime + ' sec.');
  }
}
var startTimer = function() {
  updateTime = setInterval(timeNShuffle, 1000);
};

//Create a temporary variable that is used to hold temporary values
var temp = null;

//Create arrays holding the contents that will be randomly assigned onto a 3 by 3 or 4 by 4 game bord when a game starts
var boxContent3By3 = ['1','2','3','4','5','6','7','8',''];
var boxContent4By4 = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15',''];

//Check the number of inversions in a puzzle board
var inversions = 0;
var isInversionsEven = function(randomArrangement) {
  inversions = 0;
  for (var i = 0; i < randomArrangement.length - 1; i++) {
    for (var j = i + 1; j < randomArrangement.length; j++) {
      if (parseInt(randomArrangement[i]) > parseInt(randomArrangement[j])) {
        inversions++
      };
    }
  }
  return (inversions % 2 === 0);
};

//Randomly generate a 4 by 4 puzzle board and store it into randomArrangement. The variable emptyBox holds the index of where the empty box would be at the beginning of the game.
var randomArrangement = [];
var emptyBox = null;
var generate4By4 = function() {
  randomArrangement = [];
  $(boxContent4By4).each(function(index){
    temp = Math.floor(Math.random()*boxContent4By4.length);
    randomArrangement.push(boxContent4By4[temp]);
    if (randomArrangement[index] === "") {
      emptyBox = index;
    }
    boxContent4By4.splice(temp,1);
  });
  boxContent4By4 = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15',''];
  return randomArrangement;
};

//Hide the gameInfoHeader and the selectModeFooter after the user selects a game mode. Depending on which puzzle size the user chose, show the corresponding game play page. gameMode stores the game mode the user chose.
var gameMode = null;
$('.modeSelector').each(function() {
  $(this).click(function() {
    if (this === $('#selectSpeed')[0]) {
      gameMode = "time";
    }
    else {
      gameMode = "step";
    }
    $('#selectModeFooter').css('display','none');
    $('#gameInfoHeader').css('display','none');
    if (gameLevel === "3By3") {
      $('#gamePlayPage3By3').fadeIn('slow');
    }
    else {
      $('#gamePlayPage4By4').fadeIn('slow');
  }
  generateBoard();
  if (gameMode === "time") {
      startTimer();
  }
})
});

//Create a constructor for the players
var Players = function(Board3By3, Board4By4){
  this.emptyIndex = null,
  this.moveTillNow = 0,
  this.finishState = null;
  this.gameBoard3By3 = $(Board3By3),
  this.gameBoard4By4 = $(Board4By4)
};

//Create the 2 players using the Players constructor
var player1 = new Players('.player1Board3By3','.player1Board4By4');
var player2 = new Players('.player2Board3By3','.player2Board4By4');
var players = [player1, player2];

//Create 3 by 3 tables showing how the sliding board should be arranged in order to win (select from existing html elements). Randomly select either of the winning condition when a game starts
var goalIsLastBoxEmpty3By3 = $('#goalIsLastBoxEmpty3By3');
var goalIsMiddleBoxEmpty3By3 = $('#goalIsMiddleBoxEmpty3By3');

//Check to see does the emptyBox starts on an even row counting from the bottom
var isEmptyBoxOnEvenRow = function(emptyBox) {
    return (emptyBox < 4 || (emptyBox > 7 && emptyBox <12));
}

//Randomly generate a puzzle board that fits the following criteria
//1. For a 3x3, if the inversions are odd, then make the winning pattern "middleBoxEmpty"; if the inversions are even, then make the winning pattern "lastBoxEmpty".
//2. For a 4x4, if the inversions are odd, then check to see if the empty box lies on an even row counting from the bottom. If the inversions are even, then check to see if the empty box lies on an odd row counting from the bottom. If the randomly generated puzzle do not meet these 2 criteria, then generate until it matches.
var goal = null;
var generateBoard = function() {
  $(players).each(function(){
    this.gameBoard4By4.removeClass('emptyBlock');
    this.gameBoard3By3.removeClass('emptyBlock');
  });
  if (gameLevel === "3By3") {
    $(boxContent3By3).each(function(){
      temp = Math.floor(Math.random()*boxContent3By3.length);
      randomArrangement.push(boxContent3By3[temp]);
      boxContent3By3.splice(temp,1);
    });
    if (isInversionsEven(randomArrangement) === true ) {
      goalIsMiddleBoxEmpty3By3.css('display', 'none');
      goalIsLastBoxEmpty3By3.fadeIn('slow');
      goal = "lastBoxEmpty";
    }
    else if (isInversionsEven(randomArrangement) !== true) {
      goalIsLastBoxEmpty3By3.css('display','none');
      goalIsMiddleBoxEmpty3By3.fadeIn('slow');
      goal = "middleBoxEmpty";
    }

    player1.gameBoard3By3.each(function(index){
      $(this).text(randomArrangement[index]);
      $(player2.gameBoard3By3[index]).text(randomArrangement[index]);
      if (randomArrangement[index] === "") {
        player1.emptyIndex = index;
        player2.emptyIndex = index;
        $(this).addClass('emptyBlock');
        $(player2.gameBoard3By3[index]).addClass('emptyBlock');
      }

    });
    boxContent3By3 = ['1','2','3','4','5','6','7','8',''];
    randomArrangement = [];
  };
  if (gameLevel === "4By4") {
    generate4By4();
    while (isInversionsEven(randomArrangement) === isEmptyBoxOnEvenRow(emptyBox)) {
      inversions = 0;
      generate4By4();
    }
    goal = "lastBoxEmpty";
    player1.gameBoard4By4.each(function(index){
      $(this).text(randomArrangement[index]);
      $(player2.gameBoard4By4[index]).text(randomArrangement[index]);
      if (randomArrangement[index] === "") {
        player1.emptyIndex = index;
        player2.emptyIndex = index;
        $(this).addClass('emptyBlock');
        $(player2.gameBoard4By4[index]).addClass('emptyBlock');
      }
    });
    boxContent4By4 = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15',''];
    randomArrangement = [];
  }
  if (gameMode === "time") {
    $('.gameModeDisplay').text('Time');
    $('.timer').text('Elapsed Time: 0 sec.')
  }
  else {
    $('.gameModeDisplay').text('Step');
  }
};

//Create a function to calculate if the difference between the value of the text in any two boxes is equal to 1.
Players.prototype.subtract2Blocks = function(currentGameBoard,thisBlock,anotherBlock) {
      return (parseInt($(this[currentGameBoard][anotherBlock]).text()) - parseInt($(this[currentGameBoard][thisBlock]).text()) === 1);
  };

//Create a function to check whether the table cell value matches with its text content.
Players.prototype.compareBlockValueNText = function(thisBlock) {
    return ($(this.gameBoard3By3[thisBlock]).text() === $(this.gameBoard3By3[thisBlock]).attr('value'));
}

//Compare the total steps each player takes to arranging the puzzle. Determine the winner and loser.
var compareMoveCount = function() {
  if (player1.moveTillNow > player2.moveTillNow) {
    $('.player1FinishMessage').text('You lost');
    $('.player2FinishMessage').text('You won!');
  }
  else if (player1.moveTillNow < player2.moveTillNow) {
    $('.player1FinishMessage').text('You won');
    $('.player2FinishMessage').text('You lost!');
  }
  else {
    $('.player1FinishMessage').text('Tied!');
    $('.player2FinishMessage').text('Tied!');
  }
};

//Check if the player has finished arranging their board into the same as the shown in the example where (a)block 0 to block 7 or (b)block 0 to block 15 are arranged from smallest to bigger with the last box left empty.
Players.prototype.completeLastBoxEmpty = function(currentGameBoard,thisBlock,nextBlock,lastBlock) {
    while (this.subtract2Blocks(currentGameBoard,thisBlock,nextBlock) === true) {
      thisBlock = thisBlock + 1;
      nextBlock = nextBlock + 1;
      this.subtract2Blocks(currentGameBoard,thisBlock,nextBlock);
    }
    if (thisBlock === lastBlock-1 && $(this[currentGameBoard][lastBlock]).text() === "") {
      if (gameMode === "time") {
        if (this === player1 && player2.finishState !== true) {
          this.finishState = true;
          player2.finishState = false;
          $('.player1FinishMessage').text('You won!');
          $('.player2FinishMessage').text('You lost!');
          }
        else if (this === player2 && player1.finishState !== true) {
          this.finishState = true;
          player1.finishState = false;
          $('.player2FinishMessage').text('You won!');
          $('.player1FinishMessage').text('You lost!');
        }
          clearInterval(updateTime);
      }
      else if (gameMode === "step") {
        if (this === player1) {
          this.finishState = true;
          $('.player1FinishMessage').text('You finished arranging in ' + this.moveTillNow + " steps!");
        }
        else if (this === player2) {
          this.finishState = true;
          $('.player2FinishMessage').text('You finished arranging in ' + this.moveTillNow + " steps!");
        }
        if (player1.finishState === true && player2.finishState === true) {
          compareMoveCount();
        }
      }
    }
};

//Check if the player has finished arrange their game in clockwise increasing order with the middle block left empty
Players.prototype.completeMiddleBoxEmpty = function(thisBlock) {
  while (this.compareBlockValueNText(thisBlock) === true && thisBlock < 8) {
    thisBlock = thisBlock + 1;
    this.compareBlockValueNText(thisBlock);
  }
  if (thisBlock === 8) {
    if (gameMode === "time") {
      if (this === player1 && player2.finishState !== true) {
        this.finishState = true;
        player2.finishState = false;
        $('.player1FinishMessage').text('You won!');
        $('.player2FinishMessage').text('You lost!');
        }
      else if (this === player2 && player1.finishState !== true) {
        this.finishState = true;
        player1.finishState = false;
        $('.player2FinishMessage').text('You won!');
        $('.player1FinishMessage').text('You lost!');
      }
        clearInterval(updateTime);
    }
    else if (gameMode === "step") {
      if (this === player1) {
        this.finishState = true;
        $('.player1FinishMessage').text('You finished arranging in ' + this.moveTillNow + " steps!");
      }
      else if (this === player2) {
        this.finishState = true;
        $('.player2FinishMessage').text('You finished arranging in ' + this.moveTillNow + " steps!");
      }
      if (player1.finishState === true && player2.finishState === true) {
        compareMoveCount();
      }
    }
  }
};

//Check if the player has finished arranging
Players.prototype.didPlayerWin = function() {
  if (gameLevel === "3By3" && goal === "lastBoxEmpty") {
    this.completeLastBoxEmpty('gameBoard3By3',0,1,8);
  }
  else if (gameLevel === "3By3" && goal === "middleBoxEmpty"){
    this.completeMiddleBoxEmpty(0);
  }
  else if (gameLevel === "4By4" && goal === "lastBoxEmpty") {
    this.completeLastBoxEmpty('gameBoard4By4',0,1,15)
  }
};

//Update the movecount everytime a player moves
Players.prototype.updateMoveCount = function() {
  if (this === player1) {
    $('.player1CurrentMoveCount').text('Move Count: ' + this.moveTillNow);
  }
  else if (this === player2) {
    $('.player2CurrentMoveCount').text('Move Count: ' + this.moveTillNow);
  }
};

//Create functions which allows the players to move the numbered blocks to the left, right, up, or down. Note: the numbered block being moved will exchange positions with the empty block.
Players.prototype.moveLeft = function(currentGameBoard, gridWidth) {
  if(this.finishState === null) {
    if ((this.emptyIndex+1) % gridWidth !== 0) {
      temp = $(this[currentGameBoard][this.emptyIndex+1]).text();
      $(this[currentGameBoard][this.emptyIndex]).text(temp);
      $(this[currentGameBoard][this.emptyIndex+1]).text('');
      $(this[currentGameBoard][this.emptyIndex]).removeClass('emptyBlock');
      $(this[currentGameBoard][this.emptyIndex+1]).addClass('emptyBlock');
      this.emptyIndex = this.emptyIndex+1;
      this.moveTillNow++;
      this.updateMoveCount();
      this.didPlayerWin();
    }
  }
};

Players.prototype.moveUp = function(currentGameBoard, gridWidth, LRFC) {
  if(this.finishState === null) {
    if (this.emptyIndex < LRFC) {
      temp = $(this[currentGameBoard][this.emptyIndex+gridWidth]).text();
      $(this[currentGameBoard][this.emptyIndex]).text(temp);
      $(this[currentGameBoard][this.emptyIndex+gridWidth]).text('');
      $(this[currentGameBoard][this.emptyIndex]).removeClass('emptyBlock');
      $(this[currentGameBoard][this.emptyIndex+gridWidth]).addClass('emptyBlock');
      this.emptyIndex = this.emptyIndex+gridWidth;
      this.moveTillNow++;
      this.updateMoveCount();
      this.didPlayerWin();

  }
  }
};

Players.prototype.moveRight = function(currentGameBoard, gridWidth) {
  if (this.finishState === null) {
    if (this.emptyIndex % gridWidth !== 0) {
        temp = $(this[currentGameBoard][this.emptyIndex-1]).text();
        $(this[currentGameBoard][this.emptyIndex]).text(temp);
        $(this[currentGameBoard][this.emptyIndex-1]).text('');
        $(this[currentGameBoard][this.emptyIndex]).removeClass('emptyBlock');
        $(this[currentGameBoard][this.emptyIndex-1]).addClass('emptyBlock');
        this.emptyIndex = this.emptyIndex-1;
        this.moveTillNow++;
        this.updateMoveCount();
        this.didPlayerWin();
    }
  }
};

Players.prototype.moveDown = function(currentGameBoard, gridWidth, FRLC) {
  if (this.finishState === null) {
    if (this.emptyIndex > FRLC) {
      temp = $(this[currentGameBoard][this.emptyIndex-gridWidth]).text();
      $(this[currentGameBoard][this.emptyIndex]).text(temp);
      $(this[currentGameBoard][this.emptyIndex-gridWidth]).text('');
      $(this[currentGameBoard][this.emptyIndex]).removeClass('emptyBlock');
      $(this[currentGameBoard][this.emptyIndex-gridWidth]).addClass('emptyBlock');
      this.emptyIndex = this.emptyIndex-gridWidth;
      this.moveTillNow++;
      this.updateMoveCount();
      this.didPlayerWin();
    }
  }
};

//add an event listener to the document. The control keys for player 1 are a,s,d, and w whereas the control keys for player 2 are left, right, up and down arrows.
$(document).keydown(function(e) {
    switch(e.which) {
        case 37: //left arrow
          if (gameLevel === "4By4") {
            player2.moveLeft('gameBoard4By4',4);
          }
          else if (gameLevel === "3By3") {
            player2.moveLeft('gameBoard3By3',3);
          }
          break;

        case 38: //Up arrow
          if (gameLevel === "4By4") {
            player2.moveUp('gameBoard4By4',4, 12);
          }
          else if (gameLevel === "3By3") {
            player2.moveUp('gameBoard3By3',3, 6);
          }
          break;

        case 39: //Right arrow
          if (gameLevel === "4By4") {
            player2.moveRight('gameBoard4By4',4);
          }
          else if (gameLevel === "3By3") {
            player2.moveRight('gameBoard3By3',3);
          }
          break;

        case 40: //Down arrow
          if (gameLevel === "4By4") {
            player2.moveDown('gameBoard4By4',4, 3);
          }
          else if (gameLevel === "3By3") {
            player2.moveDown('gameBoard3By3',3, 2);
          }
          break;

        case 65: //A or left
          if (gameLevel === "4By4") {
            player1.moveLeft('gameBoard4By4',4);
          }
          else if (gameLevel === "3By3") {
            player1.moveLeft('gameBoard3By3',3);
          }
          break;

        case 68: //D or right
          if (gameLevel === "4By4") {
            player1.moveRight('gameBoard4By4',4);
          }
          else if (gameLevel === "3By3") {
            player1.moveRight('gameBoard3By3',3);
          }
          break;

        case 83: //S or Down
          if (gameLevel === "4By4") {
            player1.moveDown('gameBoard4By4',4, 3);
          }
          else if (gameLevel === "3By3") {
            player1.moveDown('gameBoard3By3',3, 2);
          }
          break;

        case 87: //W or up
          if (gameLevel === "4By4") {
            player1.moveUp('gameBoard4By4',4, 12);
          }
          else if (gameLevel === "3By3") {
            player1.moveUp('gameBoard3By3',3, 6);
          }
          break;

        default: return;
      }
    }
  );

//Clear all the move counts, elapsed time and any displays
var clearGame = function() {
  elapsedTime = 0;
  $(players).each(function() {
    this.moveTillNow = 0;
    this.finishState = null;
    this.emptyIndex = null;
    $(this.gameBoard3By3).removeClass('emptyBlock');
    $(this.gameBoard4By4).removeClass('emptyBlock');
  });
  if (gameMode === "time") {
    clearInterval(updateTime);
  }
  $('.player1CurrentMoveCount').text('Move Count: 0');
  $('.player2CurrentMoveCount').text('Move Count: 0');
  $('.player1FinishMessage').text('');
  $('.player2FinishMessage').text('');
  $('.timer').text('');
}


//restart the game when user clicks on the button
$('.restartGame').each(function() {
  $(this).click(function(){
    clearGame();
    generateBoard();
    if (gameMode === "time") {
          startTimer();
    }
  })
});

//clear the game and navigate back to main menu
$('.mainMenu').each(function(){
  $(this).click(function(){
    clearGame();
    $('.gamePlayPage').css('display','none');
    $('#gameInfoHeader').fadeIn('fast');
    $('#selectLevelFooter').fadeIn('fast');
  })
});

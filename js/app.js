/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/*
 * The game was completed with the assistance of the walkthrough by https://matthewcranford.com/
 */

//global variables
let switchedCards = [];
let moves = 0;
let stars = 3;
let matchedCards = 0;
let clockStatus = true;
let clockId;
let time = 0;
const deck = document.querySelector('.deck');


//shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//function that starts the game by shuffling the cards
function initGame() {
  mixCards();
}
initGame();

//this shuffles the cards in the deck
function mixCards() {
  const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(cardsToShuffle);

  for (card of shuffledCards) {
    deck.appendChild(card);
  }
}

//event listener that checks clicked targets
deck.addEventListener('click', event => {
  const clickTarget = event.target;
  if (clockStatus) {
    clockStatus = false;
    startTimer();
  }
  checkCard(clickTarget);
});

//function to start the clock
function startTimer() {
  clockId = setInterval(() => {
    time++;
    displayTime();
  }, 1000);
}

//action to retrieve the clock and display it
function displayTime() {
  const clock = document.querySelector('.clock');
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  if (seconds < 10) {
    clock.innerHTML = `${minutes}:0${seconds}`;
  } else {
    clock.innerHTML = `${minutes}:${seconds}`;
  }
}

//function to stop the clock
function stopTimer() {
  clearInterval(clockId);
  clockStatus = true;
  time = 0;
  const clock = document.querySelector('.clock');
  clock.textContent = '0:00';
}

//check if the cards match and while timeout other cards cannot be checked
function checkCard(clickTarget) {
  const MAX_OPEN_CARDS = 2;
  if (switchedCards.length !== MAX_OPEN_CARDS) {
    if (exactCard(clickTarget)) {
      switchCard(clickTarget);
    }
    if (switchedCards.length === MAX_OPEN_CARDS) {
      moveUpdate();
      checkMatch();
    }
  }
}

//two cards match
function exactCard(clickTarget) {
  return (
    clickTarget.classList.contains('card') &&
    !switchedCards.includes(clickTarget)
  );
}

//function that toggles the cards
function switchCard(clickTarget) {
  clickTarget.classList.toggle('open');
  clickTarget.classList.toggle('show');
  switchedCards.push(clickTarget);
}

//function that confirms the matched cards
function checkMatch() {
  if (
    switchedCards[0].firstElementChild.className ===
    switchedCards[1].firstElementChild.className
  ) {
    addMatch();
  } else {
    resetswitchedCards();
  }
}

//function to check if the cards in the array match
function addMatch() {
  const TOTAL__PAIRS = 8;
  matchedCards++;

  for (let card of switchedCards) {
    card.classList.toggle('match');
  }
  if (matchedCards === TOTAL__PAIRS) {
    endGame();
  } else {
    setTimeout(function() {
      switchedCards = [];
    }, 900);
  }
}

//game over function and prompts modal
function endGame() {
  clearTimeout(clockId);
  resultsModal();
  winModal();
}

//function which pulls the game stats
function resultsModal() {
  const timeStat = document.querySelector('.modal__time');
  const clockTime = document.querySelector('.clock').innerHTML;
  const movesStat = document.querySelector('.modal__moves');
  const starsStat = document.querySelector('.modal__stars');

  timeStat.innerText = `Time = ${clockTime}`;
  movesStat.innerText = `moves = ${moves}`;
  starsStat.innerText = `stars = ${stars}`;
}

//function to activate the modal
function winModal() {
  const modal = document.querySelector('.modal__background');
  modal.classList.toggle('hide');
}

//function to toggle the cards
function resetswitchedCards() {
  setTimeout(() => {
    for (let card of switchedCards) {
      card.classList.toggle('open');
      card.classList.toggle('show');
    }
    switchedCards = [];
  }, 900);
}

//function that adds the moves
function moveUpdate() {
  moves++;
  document.querySelector('.moves').innerHTML = `Moves ${moves}`;
  updateScore();
}

//function with conditional that checks the score and hides a star
function updateScore() {
  const twoStars = 15;
  const oneStar = 25;

  if (moves === twoStars || moves === oneStar) {
    stars--;
    removeStars();
  }
}

//function to reset the stars back to default
function removeStars() {
  const starsList = document.querySelectorAll('.stars li');
  const TOTAL_STARS = 3;
  const hideStars = TOTAL_STARS - stars;

  for (let star = 0; star < hideStars; star++) {
    starsList[star].style.display = 'none';
  }
}

//functionalities to the "quit", "retry" buttons and the restart button
document.querySelector('.restart').addEventListener('click', gameRestart);
document.getElementById('quit__modal').addEventListener('click', winModal);
document.getElementById('retry__modal').addEventListener('click', function() {
  winModal();
  gameRestart();
});

//function to reset the game and reset all other functions
function gameRestart() {
  resetCards();
  resetMoves();
  resetStars();
  stopTimer();
  initGame();
}

//function to reset the cards back to default
function resetCards() {
  switchedCards = [];
  matchedCards = 0;
  const cards = document.querySelectorAll('.deck li');
  for (card of cards) {
    card.classList = 'card';
  }
}

//function to restart the moves
function resetMoves() {
  moves = 0;
  document.querySelector('.moves').innerHTML = moves;
}

//function to reset the stars back to default
function resetStars() {
  stars = 3;
  const starsList = document.querySelectorAll('.stars li');
  for (let star of starsList) {
    star.style.display = 'inline';
  }
}

/*
 * extra fun functionalities
 */

//alert box in case the user has taken too much to finish the game
setTimeout(function() {
  alert("it looks like you are taking ages...");
}, 580000);


//mixCards keyboard shortcut "S"
document.addEventListener('keydown', function(event) {
  if (event.code == 'KeyS') {
    mixCards();
  }
});


//reset game keyboard shortcut "E"
document.addEventListener('keydown', function(event) {
  if (event.code == 'KeyE') {
    winModal();
    resultsModal();
  }
});

//send user to another website  keyboard shortcut "w"
document.addEventListener('keydown', function(event) {
  if (event.code == 'KeyW') {
    window.location.href = 'http://en.bcdn.biz/Images/2018/6/12/49c138bc-9393-4dfe-919e-beeb1aaa01ae.jpg'
  }
});

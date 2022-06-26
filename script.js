const gameContainer = document.getElementById("game");
const highScore = document.querySelector('#highScore');
highScore.innerText = localStorage.getItem('hs'); //obtains the local highscore
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];
let randColors = COLORS;

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}
// TODO: Implement this function!
/*set the background color to class list 0
  add a class to the div to say if it is clicked
  every other div click, check if they matched.
  if they match, add a matched class and remove clicked
  otherwise remove clicked and reset color
  */
let clicked = 0; //total number of cards that are currently 'clicked'
let score = 0; //the score of the current game
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  //console.log("you just clicked", event.target.classList[0]);
  const classes = event.target.classList;
  if (!classes.contains('clicked') && !classes.contains('matched')) { //if the div isnt already clicked or matched
    clicked++;
    console.log(clicked);
    if (clicked <= 2) { //to prevent spam clicking
      classes.add('clicked');
      event.target.style.backgroundColor = classes[0];
      if (clicked === 2) { //if it is the second unmatched div you have clicked
        const clickedDivs = gameContainer.querySelectorAll('.clicked');
        //console.log(clickedDivs[0].className);
        if (clickedDivs[0].classList[0] === clickedDivs[1].classList[0]) { //if the colors are the same
          for (let div of clickedDivs) {
            div.classList.replace('clicked', 'matched'); //replace clicked with matched
          }
          clicked = 0;
        } else { //otherwise remove clicked and the color
          for (let div of clickedDivs) {
            div.classList.remove('clicked');
            setTimeout(function () {
              div.style.backgroundColor = '';
              clicked = 0;
            }, 1000);
          }
        }
        score++;
        document.querySelector('#score').innerText = score; //update the visable score
        if (gameContainer.querySelectorAll('.matched').length === gameContainer.children.length) { //if everything has been matched
          //alert('Congrats!');
          if (highScore.innerText === '' || score < highScore.innerText) { //set new highscore if it is lower or uninitiated
            highScore.innerText = score; //displays new high score
            localStorage.setItem('hs', score); //saves the high score to local storage
          }
        }
      }
    }
  }
}

//generate a set of setLength random colors to match
function randomizeColors(setLength) {
  const colorSet = new Set(); // using a set to ensure that colors will not be duplicates
  let r = 0;
  let g = 0;
  let b = 0;
  for (let i = 0; i < setLength; i++) { //iterate through and create random colors
    r = Math.floor(Math.random() * 256);
    g = Math.floor(Math.random() * 256);
    b = Math.floor(Math.random() * 256);
    colorSet.add(`rgb(${r},${g},${b})`);
  }
  return colorSet;
}
function startGame(numColors) { //starts a new game
  gameContainer.innerText = '';
  score = 0;
  document.querySelector('#score').innerText = score
  if (numColors !== '') { //if they have specified how many colors to match
    randColors = [...randomizeColors(numColors)]; //randomizes the selected number of colors and puts them into an array
    randColors.push(...randColors); //adds the matching colors to the array
    randColors = shuffle(randColors); //shuffles
    createDivsForColors(randColors); //and finally creates the divs
  } else { //defaults to the base game
    createDivsForColors(shuffle(COLORS));
  }
}
function resetGame() { //resets the game, maintaining the same colors but shuffling them
  randColors = shuffle(randColors);
  //console.log('the game has been reset');
  gameContainer.innerText = '';
  score = 0;
  createDivsForColors(randColors);
}
document.querySelector('#startGame').addEventListener('submit', function (e) { //the start game button
  e.preventDefault();
  console.log(e.target['cardNum'].value === '');
  startGame(e.target['cardNum'].value);
});
document.querySelector('#reset').addEventListener('click', resetGame);
// when the DOM loads
createDivsForColors(shuffledColors);

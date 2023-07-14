import { WORDS, KEYWORD_LETTERS } from "./consts";

const gameDiv = document.getElementById("game");
const logoH1 = document.getElementById("logo");

let triesLeft;
let winCount;

const createplaceholdersHTML = () => {
  const word = sessionStorage.getItem("word");

  const wordArray = Array.from(word);
  const placeholderTHML = wordArray.reduce(
    (acc, curr, i) => acc + `<h1 id="letter_${i}" class="letter">_</h1>`,
    ""
  );
  return `<div id="placeholders" class="placeholders-wrapper">${placeholderTHML}</div>`;
};

const createKeyboard = () => {
  const keyboard = document.createElement("div");
  keyboard.classList.add("keyboard");
  keyboard.id = "keyboard";

  const keyboardHTML = KEYWORD_LETTERS.reduce((acc, curr) => {
    return (
      acc +
      `<button class="button-primary keyboard-button" id="${curr}">${curr}</button>`
    );
  }, "");

  keyboard.innerHTML = keyboardHTML;
  return keyboard;
};

const createHangmanImg = () => {
  const image = document.createElement("img");
  image.src = "images/hg-0.png";
  image.alt = "hangman image";
  image.classList.add("hangman-img");
  image.id = "hangman-img";

  return image;
};

const createDeveloperPhoto = () => {
  const image = document.createElement("img");
  image.src = "images/developer-photo.JPG";
  image.alt = "developer photo";
  image.classList.add("developer-photo");
  image.id = "developer-photo";

  return image;
};

const checkLetter = (letter) => {
  const word = sessionStorage.getItem("word");
  const inputLetter = letter.toLowerCase();
  if (!word.includes(inputLetter)) {
    const triesCounter = document.getElementById("tries-left");
    triesLeft -= 1;
    triesCounter.innerText = triesLeft;

    const hangmanImg = document.getElementById("hangman-img");
    hangmanImg.src = `images/hg-${10 - triesLeft}.png`;

    if (triesLeft === 0) {
      stopGame("lose");
    }
  } else {
    const wordArray = Array.from(word);
    wordArray.forEach((currentLetter, i) => {
      if (currentLetter === inputLetter) {
        winCount += 1;
        if (winCount === word.length) {
          stopGame("win");
          return;
        }
        document.getElementById(`letter_${i}`).innerText =
          inputLetter.toUpperCase();
      }
    });
  }
};

const credits = () => {
  const developerPhoto = createDeveloperPhoto();
  logoH1.classList.add("logo-sm");

  gameDiv.innerHTML = '<h1 class="uppercase mt-2">Nikitina Ksenia</h1>';
  gameDiv.innerHTML += '<p class="font-medium">Frontend developer</p>';
  gameDiv.innerHTML += "<p>https://github.com/ksenafiy</p>";
  gameDiv.innerHTML +=
    '<button id="return-to-start" class="button-primary button-return mt-6">Return to start</button>';

  gameDiv.prepend(developerPhoto);
  document.getElementById("return-to-start").onclick = startScreen;
};

const stopGame = (status) => {
  document.getElementById("placeholders").remove();
  document.getElementById("tries").remove();
  document.getElementById("keyboard").remove();
  document.getElementById("quit").remove();

  const word = sessionStorage.getItem("word");

  if (status === "win") {
    document.getElementById("hangman-img").src = "images/hg-win.png";
    document.getElementById("game").innerHTML +=
      '<h2 class="result-header win">You win!</h2>';
  } else if (status === "lose") {
    document.getElementById("game").innerHTML +=
      '<h2 class="result-header lose">You lost :(</h2>';
  } else if (status === "quit") {
    document.getElementById("hangman-img").remove();
    logoH1.classList.remove("logo-sm");
  }

  document.getElementById(
    "game"
  ).innerHTML += `<p>The word was: <span class="result-word">${word}</span></p><button id="play-again" class="button-primary px-5 py-2 mt-5">Play again</button>`;
  document.getElementById("play-again").onclick = startGame;
  document.getElementById(
    "game"
  ).innerHTML += `<button id="developer" class="button-developer px-5 py-2 mt-5">Click to see the developer :)</button>`;
  document.getElementById("developer").onclick = credits;
  document.getElementById("play-again").onclick = startGame;
};

const startScreen = () => {
  logoH1.classList.remove("logo-sm");
  gameDiv.innerHTML =
    '<button id="startGame" class="button-primary">Start game</button>';
  document.getElementById("startGame").addEventListener("click", startGame);
};

export const startGame = () => {
  triesLeft = 10;
  winCount = 0;

  logoH1.classList.add("logo-sm");
  const randomIndex = Math.floor(Math.random() * WORDS.length);
  const wordToGuess = WORDS[randomIndex];

  sessionStorage.setItem("word", wordToGuess);

  gameDiv.innerHTML = createplaceholdersHTML();

  gameDiv.innerHTML +=
    '<p id="tries" class="mt-2">TRIES LEFT: <span id="tries-left" class="font-medium text-red-600">10<span/></p>';

  const keyboardDiv = createKeyboard();
  keyboardDiv.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() === "button") {
      event.target.disabled = true;
      checkLetter(event.target.id);
    }
  });

  const hangmanImg = createHangmanImg();
  gameDiv.prepend(hangmanImg);

  gameDiv.appendChild(keyboardDiv);

  gameDiv.insertAdjacentHTML(
    "beforeend",
    '<button id="quit" class="button-secondary px-2 py-1 mt-4">Quit</button>'
  );

  document.getElementById("quit").onclick = () => {
    const isSure = confirm("Are you sure to quit and lose the progress?");
    if (isSure) {
      stopGame("quit");
    }
  };
};

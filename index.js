let cards = [];
let sum = 0;
let hasBlackJack = false;
let isAlive = false;
let chips = 100;

//Get a Random Card
function getRandomCard() {
  const value = Math.floor(Math.random() * 13) + 1;
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const suit = suits[Math.floor(Math.random() * suits.length)];
  return { value, suit };
}

//Get the card name
function getCardFilename(card) {
  const names = {
    1: "ace",
    11: "jack",
    12: "queen",
    13: "king",
  };
  const valueName = names[card.value] || card.value;
  return `images/cards/${valueName}_of_${card.suit}.png`;
}

//Start the game
function startGame() {
  isAlive = true;
  hasBlackJack = false;
  cards = [getRandomCard(), getRandomCard()];
  sum = cards[0].value + cards[1].value;
  renderGame();
}

//Get another card
function drawCard() {
  if (isAlive && !hasBlackJack) {
    const card = getRandomCard();
    cards.push(card);
    sum += card.value;
    renderGame();
  }
}

//Start a new game
function resetGame() {
  cards = [];
  sum = 0;
  hasBlackJack = false;
  isAlive = false;
  document.getElementById("message-el").textContent = "Want to play a round?";
  document.getElementById("cards-el").textContent = "Cards:";
  document.getElementById("sum-el").textContent = "Sum:";
  document.getElementById("card-container").innerHTML = "";
}

function updateChips(amount) {
  chips += amount;
  document.getElementById("chip-counter").textContent = "Chips: " + chips;
}

function renderGame() {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";

  cards.forEach((card) => {
    const img = document.createElement("img");
    img.src = getCardFilename(card);
    img.classList.add("card-img");
    cardContainer.appendChild(img);
    setTimeout(() => img.classList.add("show"), 50);
  });
  //Confetti Delay
  setTimeout(() => {
    if (sum === 21) {
      launchConfetti();
    }
  }, 500);

  const suitSymbols = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  };

  const cardText = cards
    .map((c) => {
      const name =
        c.value === 1
          ? "A"
          : c.value === 11
          ? "J"
          : c.value === 12
          ? "Q"
          : c.value === 13
          ? "K"
          : c.value;
      return `${name}${suitSymbols[c.suit]}`;
    })
    .join(" ");

  document.getElementById("cards-el").textContent = "Cards: " + cardText;
  document.getElementById("sum-el").textContent = "Sum: " + sum;

  let message = "";
  if (sum < 21) {
    message = "Do you want to draw a new card? 🙂";
  } else if (sum === 21) {
    message = "Wohoo! You've got Blackjack! 🥳";
    hasBlackJack = true;
    updateChips(50);
  } else {
    message = "You're out of the game! 😭";
    isAlive = false;
    updateChips(-25);
  }

  document.getElementById("message-el").textContent = message;
}

//WIN CONFETTI

function launchConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#ff4c4c", "#ffd700", "#ffffff"],
  });
}

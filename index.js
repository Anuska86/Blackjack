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

//ACES
function calculateSum(cards) {
  let total = 0;
  let aceCount = 0;

  cards.forEach((card) => {
    let value = card.value;
    if (value > 10) value = 10;
    if (value === 1) {
      aceCount++;
      value = 11;
    }
    total += value;
  });

  while (total > 21 && aceCount > 0) {
    total -= 10; // downgrade an Ace from 11 to 1
    aceCount--;
  }

  return total;
}

//Start the game
function startGame() {
  isAlive = true;
  hasBlackJack = false;
  cards = [getRandomCard(), getRandomCard()];
  sum = calculateSum(cards);

  // Enable action buttons
  document.getElementById("draw-btn").disabled = false;
  document.getElementById("hold-btn").disabled = false;

  renderGame();
}

//Get another card
function drawCard() {
  if (isAlive && !hasBlackJack) {
    const card = getRandomCard();
    cards.push(card);
    sum = calculateSum(cards);
    renderGame();
  }
}

//Dealer

function dealerTurn(playerSum) {
  let dealerCards = [getRandomCard(), getRandomCard()];
  let dealerSum = calculateSum(dealerCards);

  const dealerContainer = document.getElementById("dealer-container");
  dealerContainer.innerHTML = "";

  dealerCards.forEach((card) => {
    const img = document.createElement("img");
    img.src = getCardFilename(card);
    img.classList.add("card-img");
    dealerContainer.appendChild(img);
    setTimeout(() => img.classList.add("show"), 50);
  });

  const suitSymbols = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  };

  const cardText = dealerCards
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

  document.getElementById("dealer-cards-el").textContent = "Cards: " + cardText;
  document.getElementById("dealer-sum-el").textContent = "Sum: " + dealerSum;

  while (dealerSum < 17) {
    const card = getRandomCard();
    dealerCards.push(card);
    dealerSum = calculateSum(dealerCards);

    const img = document.createElement("img");
    img.src = getCardFilename(card);
    img.classList.add("card-img");
    dealerContainer.appendChild(img);
    setTimeout(() => img.classList.add("show"), 50);

    document.getElementById("dealer-cards-el").textContent =
      "Cards: " +
      dealerCards
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
    document.getElementById("dealer-sum-el").textContent = "Sum: " + dealerSum;
  }

  let message = "";
  if (dealerSum > 21 || playerSum > dealerSum) {
    message = "You win! Dealer busted or had lower score 🎉";
    updateChips(20);
    launchConfetti();
  } else if (dealerSum === playerSum) {
    message = "It's a tie! 🤝";
  } else {
    message = "Dealer wins! 😤";
    updateChips(-20);
    handleLoss();
  }

  document.getElementById("message-el").textContent = message;
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

  document.getElementById("draw-btn").disabled = true;
  document.getElementById("hold-btn").disabled = true;

  document.getElementById("dealer-cards-el").textContent = "Cards:";
  document.getElementById("dealer-sum-el").textContent = "Sum:";
  document.getElementById("dealer-container").innerHTML = "";

  const overlay = document.getElementById("lose-overlay");
  overlay.style.opacity = "0";
  setTimeout(() => {
    overlay.style.display = "none";
  }, 500);
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
    handleLoss();

    const table = document.getElementById("table-strip");
    table.classList.add("shake");
    setTimeout(() => table.classList.remove("shake"), 500);
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

//LOSE

function handleLoss() {
  // Show the overlay
  const overlay = document.getElementById("lose-overlay");
  overlay.style.display = "block";
  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
  });
}

//HOLD GAME
function holdGame() {
  if (isAlive && !hasBlackJack) {
    isAlive = false;

    let message = "";
    if (sum >= 17 && sum < 21) {
      message = "You chose to hold. Let's see how it plays out... 🤞";
      document.getElementById("message-el").textContent = message;
      setTimeout(() => dealerTurn(sum), 1000);
    } else if (sum < 17) {
      message = "You held early. Risky move! 😬";
      updateChips(-10);
      document.getElementById("message-el").textContent = message;
    }
  }
}

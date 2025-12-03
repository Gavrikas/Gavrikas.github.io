document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const resultBlock = document.getElementById("formResult");
  const popup = document.getElementById("popupMessage");
  const fnameInput = document.getElementById("fname");
  const lnameInput = document.getElementById("lname");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const addressInput = document.getElementById("address");
  const q1Input = document.getElementById("q1");
  const q2Input = document.getElementById("q2");
  const q3Input = document.getElementById("q3");
  const submitBtn = document.getElementById("submitButton");

  if (!form) return;

  // Iš pradžių mygtukas neaktyvus
  if (submitBtn) {
    submitBtn.disabled = true;
  }

  // Pagalbinė: surandam konteinerį, kur dėti klaidos tekstą
  function getFieldContainer(input) {
    return input.closest(".col-md-4, .col-md-6, .col-md-12") || input.parentElement;
  }

  // Nustatyti klaidą
  function setError(input, message) {
    const container = getFieldContainer(input);
    if (!container) return;

    input.classList.add("is-invalid");

    let errorEl = container.querySelector(".error-message");
    if (!errorEl) {
      errorEl = document.createElement("small");
      errorEl.className = "error-message";
      container.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  // Išvalyti klaidą
  function clearError(input) {
    const container = getFieldContainer(input);
    if (!container) return;
    input.classList.remove("is-invalid");

    const errorEl = container.querySelector(".error-message");
    if (errorEl) {
      errorEl.textContent = "";
    }
  }

  // Vardas – tik raidės, negali būti tuščias
  function validateName() {
    const value = fnameInput.value.trim();
    if (!value) {
      setError(fnameInput, "Vardas negali būti tuščias.");
      return false;
    }
    const nameRegex = /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž\s'-]+$/;
    if (!nameRegex.test(value)) {
      setError(fnameInput, "Varde gali būti tik raidės.");
      return false;
    }
    clearError(fnameInput);
    return true;
  }

  // Pavardė – tik raidės, negali būti tuščia
  function validateSurname() {
    const value = lnameInput.value.trim();
    if (!value) {
      setError(lnameInput, "Pavardė negali būti tuščia.");
      return false;
    }
    const nameRegex = /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž\s'-]+$/;
    if (!nameRegex.test(value)) {
      setError(lnameInput, "Pavardėje gali būti tik raidės.");
      return false;
    }
    clearError(lnameInput);
    return true;
  }

  // El. paštas – formatas
  function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) {
      setError(emailInput, "El. paštas negali būti tuščias.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setError(emailInput, "Neteisingas el. pašto formatas.");
      return false;
    }
    clearError(emailInput);
    return true;
  }

  // Adresas – tiesiog ne tuščias ir ne per trumpas
  function validateAddress() {
    const value = addressInput.value.trim();
    if (!value) {
      setError(addressInput, "Adresas negali būti tuščias.");
      return false;
    }
    if (value.length < 4) {
      setError(addressInput, "Adresas per trumpas.");
      return false;
    }
    clearError(addressInput);
    return true;
  }

  // Vienas vertinimo laukas (1–10)
  function validateRating(input) {
    const value = input.value.trim();
    if (!value) {
      setError(input, "Laukas negali būti tuščias.");
      return false;
    }
    const num = Number(value);
    if (!Number.isFinite(num) || num < 1 || num > 10) {
      setError(input, "Reikšmė turi būti tarp 1 ir 10.");
      return false;
    }
    clearError(input);
    return true;
  }

  // Tik skaičiai, normalizavimas į 3706...
  function normalizePhoneDigits(digits) {
    if (digits.startsWith("86")) {
      // 86xxxxxxx -> 3706xxxxxxx
      digits = "3706" + digits.slice(2);
    } else if (digits.startsWith("6")) {
      // 6xxxxxxx -> 3706xxxxxxx
      digits = "370" + digits;
    }
    return digits;
  }

  // Suformatuojam į +370 6xx xxxxx
  function formatPhone() {
    let digits = phoneInput.value.replace(/\D/g, ""); // tik skaičiai
    digits = normalizePhoneDigits(digits);
    digits = digits.slice(0, 11); // 3706 + 7 skaitmenys = 11

    if (!digits) {
      phoneInput.value = "";
      return "";
    }

    // Jei dar nepasiekė teisingo pradžios formato, rodom tiesiog +skaičiai
    if (!digits.startsWith("3706")) {
      phoneInput.value = "+" + digits;
      return digits;
    }

    // Formatas: +370 6xx xxxxx
    let formatted = "+370";

    if (digits.length > 3) {
      formatted += " " + digits[3];      // 6
    }
    if (digits.length > 4) {
      formatted += digits[4];            // x
    }
    if (digits.length > 5) {
      formatted += digits[5];            // x
    }
    if (digits.length > 6) {
      formatted += " " + digits.slice(6); // xxxxx
    }

    phoneInput.value = formatted;
    return digits;
  }

  // Telefono validacija
  function validatePhone() {
    const digits = formatPhone();
    if (!digits) {
      setError(phoneInput, "Telefono numeris negali būti tuščias.");
      return false;
    }
    if (!/^3706\d{7}$/.test(digits)) {
      setError(phoneInput, "Numeris turi būti formato +370 6xx xxxxx.");
      return false;
    }
    clearError(phoneInput);
    return true;
  }

  // Patikrinam visus laukus
  function validateAll() {
    const v1 = validateName();
    const v2 = validateSurname();
    const v3 = validateEmail();
    const v4 = validateAddress();
    const v5 = validatePhone();
    const v6 = validateRating(q1Input);
    const v7 = validateRating(q2Input);
    const v8 = validateRating(q3Input);
    return v1 && v2 && v3 && v4 && v5 && v6 && v7 && v8;
  }

  // Mygtukas aktyvus tik kai visi laukai geri
  function updateSubmitState() {
    if (!submitBtn) return;
    const allValid = validateAll();
    submitBtn.disabled = !allValid;
  }

  // Real-time validacija – visi "input" eventai
  fnameInput.addEventListener("input", () => {
    validateName();
    updateSubmitState();
  });

  lnameInput.addEventListener("input", () => {
    validateSurname();
    updateSubmitState();
  });

  emailInput.addEventListener("input", () => {
    validateEmail();
    updateSubmitState();
  });

  addressInput.addEventListener("input", () => {
    validateAddress();
    updateSubmitState();
  });

  q1Input.addEventListener("input", () => {
    validateRating(q1Input);
    updateSubmitState();
  });

  q2Input.addEventListener("input", () => {
    validateRating(q2Input);
    updateSubmitState();
  });

  q3Input.addEventListener("input", () => {
    validateRating(q3Input);
    updateSubmitState();
  });

  phoneInput.addEventListener("input", () => {
    validatePhone();
    updateSubmitState();
  });

  // Galutinis Submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateAll()) {
      updateSubmitState();
      return;
    }

    const data = {
      fname: fnameInput.value.trim(),
      lname: lnameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      address: addressInput.value.trim(),
      q1: Number(q1Input.value),
      q2: Number(q2Input.value),
      q3: Number(q3Input.value),
    };

    console.log("Kontaktų formos duomenys:", data);

    const average = ((data.q1 + data.q2 + data.q3) / 3).toFixed(1);

    resultBlock.innerHTML = `
      <p><strong>Vardas:</strong> ${data.fname}</p>
      <p><strong>Pavardė:</strong> ${data.lname}</p>
      <p><strong>El. paštas:</strong> ${data.email}</p>
      <p><strong>Tel. numeris:</strong> ${data.phone}</p>
      <p><strong>Adresas:</strong> ${data.address}</p>
      <p><strong>Vertinimų vidurkis:</strong> ${data.fname} ${data.lname}: ${average}</p>
    `;

    if (popup) {
      popup.classList.remove("d-none");
      popup.classList.add("show");

      setTimeout(() => {
        popup.classList.remove("show");
        popup.classList.add("d-none");
      }, 3000);
    }
  });

});
// ===========================
// LD12 – Atminties žaidimas (su localStorage + laikmačiu)
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("memoryGameBoard");
  const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
  const startBtn = document.getElementById("gameStartBtn");
  const resetBtn = document.getElementById("gameResetBtn");
  const movesCountEl = document.getElementById("movesCount");
  const matchedPairsEl = document.getElementById("matchedPairs");
  const winMessageEl = document.getElementById("gameWinMessage");
  const timerEl = document.getElementById("gameTimer");
  const bestEasyEl = document.getElementById("bestEasy");
  const bestHardEl = document.getElementById("bestHard");

  if (!board || !startBtn || !resetBtn) return;

  // LocalStorage raktai
  const BEST_EASY_KEY = "memoryBestEasyMoves";
  const BEST_HARD_KEY = "memoryBestHardMoves";

  // mažiausiai 6 unikalūs elementai, dedam 12, kad užtektų abiems lygiams
  const icons = ["🔥", "⚙️", "🚗", "💻", "🎧", "📚", "🚀", "🧠", "🎮", "🛠️", "📷", "🏎️"];

  let cards = [];
  let flippedCards = [];
  let moves = 0;
  let matchedPairs = 0;
  let totalPairs = 0;
  let isBoardLocked = false;

  // laikmatis
  let timerSeconds = 0;
  let timerInterval = null;

  function getDifficulty() {
    const checked = document.querySelector('input[name="difficulty"]:checked');
    return checked ? checked.value : "easy";
  }

  function resetStats() {
    moves = 0;
    matchedPairs = 0;
    winMessageEl.textContent = "";
    updateStatsUI();
  }

  function updateStatsUI() {
    movesCountEl.textContent = moves;
    matchedPairsEl.textContent = `${matchedPairs} / ${totalPairs}`;
  }

  function formatTime(sec) {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  }

  function updateTimerUI() {
    if (timerEl) {
      timerEl.textContent = formatTime(timerSeconds);
    }
  }

  function resetTimer() {
    timerSeconds = 0;
    updateTimerUI();
  }

  function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
      timerSeconds++;
      updateTimerUI();
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function loadBestResults() {
    const easy = localStorage.getItem(BEST_EASY_KEY);
    const hard = localStorage.getItem(BEST_HARD_KEY);

    if (bestEasyEl) {
      bestEasyEl.textContent = easy ? `${easy} ėjimai` : "-";
    }
    if (bestHardEl) {
      bestHardEl.textContent = hard ? `${hard} ėjimai` : "-";
    }
  }

  function updateBestResult() {
    const difficulty = getDifficulty();
    const key = difficulty === "easy" ? BEST_EASY_KEY : BEST_HARD_KEY;
    const bestEl = difficulty === "easy" ? bestEasyEl : bestHardEl;

    const stored = localStorage.getItem(key);
    if (stored === null || moves < Number(stored)) {
      localStorage.setItem(key, String(moves));
      if (bestEl) {
        bestEl.textContent = `${moves} ėjimai`;
      }
    }
  }

  function createCards() {
    const difficulty = getDifficulty();
    const pairsNeeded = difficulty === "easy" ? 6 : 12;
    totalPairs = pairsNeeded;

    const iconsToUse = icons.slice(0, pairsNeeded);
    cards = [];

    iconsToUse.forEach((icon, index) => {
      cards.push({ id: `${index}-a`, icon, matched: false });
      cards.push({ id: `${index}-b`, icon, matched: false });
    });

    // permaišom
    cards.sort(() => Math.random() - 0.5);
  }

  function renderBoard() {
    board.innerHTML = "";

    const difficulty = getDifficulty();
    board.classList.remove("easy", "hard");
    board.classList.add(difficulty === "easy" ? "easy" : "hard");

    cards.forEach((cardData) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "memory-card";
      card.dataset.id = cardData.id;
      card.dataset.icon = cardData.icon;

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front"></div>
          <div class="card-back">${cardData.icon}</div>
        </div>
      `;

      card.addEventListener("click", handleCardClick);
      board.appendChild(card);
    });
  }

  function handleCardClick(e) {
    const card = e.currentTarget;

    if (isBoardLocked) return;
    if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      isBoardLocked = true;
      moves++;
      updateStatsUI();
      checkMatch();
    }
  }

  function checkMatch() {
    const [card1, card2] = flippedCards;
    const icon1 = card1.dataset.icon;
    const icon2 = card2.dataset.icon;

    if (icon1 === icon2) {
      card1.classList.add("matched");
      card2.classList.add("matched");
      matchedPairs++;
      updateStatsUI();
      flippedCards = [];
      isBoardLocked = false;

      if (matchedPairs === totalPairs) {
        winMessageEl.textContent = "Laimėjote! 🎉";
        stopTimer();
        updateBestResult();
      }
    } else {
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        flippedCards = [];
        isBoardLocked = false;
      }, 1000);
    }
  }

  function startNewGame() {
    resetStats();
    flippedCards = [];
    isBoardLocked = false;
    createCards();
    renderBoard();
  }

  // Sudėtingumo keitimas – perstartuoja žaidimą, bet laikmatis nestartuojamas
  difficultyRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      stopTimer();
      resetTimer();
      startNewGame();
    });
  });

  // Start – naujas žaidimas + laikmatis startuoja
  startBtn.addEventListener("click", () => {
    stopTimer();
    resetTimer();
    startNewGame();
    startTimer();
  });

  // Atnaujinti – naujas žaidimas, laikmatis reset, bet nestartuojamas kol vėl nepaspaustas Start
  resetBtn.addEventListener("click", () => {
    stopTimer();
    resetTimer();
    startNewGame();
  });

  // inicializacija
  loadBestResults();
  resetStats();
  resetTimer();
  board.innerHTML = '<p class="text-center text-light">Paspauskite „Start“, kad pradėtumėte žaidimą.</p>';
});


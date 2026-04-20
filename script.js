const TOTAL_WEEKS = 8;

const STAT_META = {
  health: { label: "health", color: "#58a86e" },
  water: { label: "water", color: "#4eaad8" },
  nutrition: { label: "nutrition", color: "#9e8ce8" },
  stress: { label: "stress", color: "#f08e45" },
  light: { label: "light", color: "#f1c648" },
  yield: { label: "yield", color: "#ef5a4c" },
};

const VARIETIES = {
  cherry: {
    id: "cherry",
    name: "Черри",
    short: "Быстрый и живучий",
    traits: [
      "быстрый",
      "живучий",
      "иногда ощущение, что он сам всё решит",
    ],
    stats: { health: 64, water: 52, nutrition: 49, stress: 32, light: 56, yield: 14 },
    modifiers: { resilience: 1.2, stressGain: 0.85, yieldScale: 1.12, slow: 0.95 },
    persona: "Ты выбираешь темп и не драматизируешь по мелочам.",
  },
  big: {
    id: "big",
    name: "Крупноплодный",
    short: "Вкусно, эффектно, капризно",
    traits: ["вкусный", "эффектный", "требует внимания"],
    stats: { health: 58, water: 50, nutrition: 46, stress: 38, light: 53, yield: 12 },
    modifiers: { resilience: 0.95, stressGain: 1.1, yieldScale: 1.25, slow: 1.03 },
    persona: "Ты любишь результат, который хочется показывать всем.",
  },
  stable: {
    id: "stable",
    name: "Надёжный дачный",
    short: "Стабильность и без сюрпризов",
    traits: ["сбалансированный", "стабильный", "без сюрпризов"],
    stats: { health: 62, water: 50, nutrition: 52, stress: 30, light: 55, yield: 13 },
    modifiers: { resilience: 1.05, stressGain: 0.95, yieldScale: 1.03, slow: 1 },
    persona: "Ты строишь систему, а не надеешься на случай.",
  },
  giant: {
    id: "giant",
    name: "Гигантский томат",
    short: "Амбиции и риск",
    traits: [
      "амбициозный",
      "даёт огромные плоды",
      "медленно развивается",
      "чувствителен к стрессу и ошибкам",
      "при хорошем уходе даёт «легендарный» результат",
    ],
    stats: { health: 56, water: 49, nutrition: 45, stress: 42, light: 54, yield: 8 },
    modifiers: { resilience: 0.85, stressGain: 1.24, yieldScale: 1.55, slow: 1.16 },
    persona: "Ты человек высокой планки: либо легенда, либо урок.",
  },
};

const WEEK_EVENTS = [
  {
    title: "Первые листочки и первая паника",
    text: "Куст ожил, и ты уже хочешь сделать всё идеально. Что в приоритете?",
    choices: [
      {
        text: "Полить по-человечески и оставить в покое",
        effects: { water: +12, stress: -6, health: +4 },
        comment: "Зрелая стратегия: иногда «не мешать» — лучший уход.",
      },
      {
        text: "Сразу устроить интенсив: полив + подкормка",
        effects: { water: +10, nutrition: +14, stress: +5, health: +1 },
        comment: "Ты включил режим «ускорить рост любой ценой».",
      },
      {
        text: "Покрутить горшок на солнце ради идеального света",
        effects: { light: +14, stress: +6, health: -2 },
        comment: "Томат оценил энтузиазм, но вестибулярка у него слабая.",
      },
    ],
  },
  {
    title: "Неделя переменчивой погоды",
    text: "То облака, то жарко, то ветер. Куст ждёт, как ты отреагируешь.",
    choices: [
      {
        text: "Оставить на стабильном месте и наблюдать",
        effects: { stress: -4, light: +4, health: +3 },
        comment: "Стабильность тоже действие, а не бездействие.",
      },
      {
        text: "Переставлять его весь день за солнцем",
        effects: { light: +16, stress: +8, water: -5 },
        comment: "Поймали максимум фотонов и немного вымотались.",
      },
      {
        text: "Притенить и умеренно полить",
        effects: { light: -8, water: +9, stress: -2, health: +2 },
        comment: "Аккуратно. Иногда «чуть меньше света» — это спасение.",
      },
    ],
  },
  {
    title: "Пора кормить",
    text: "Куст явно намекает: «Мне бы ресурсов, пожалуйста».",
    choices: [
      {
        text: "Дать мягкую подкормку по инструкции",
        effects: { nutrition: +12, health: +5, stress: -2 },
        comment: "Инструкция впервые в жизни действительно сработала.",
      },
      {
        text: "Дать двойную дозу — пусть растёт быстрее",
        effects: { nutrition: +20, stress: +10, health: -6 },
        comment: "Сделал «премиум-апгрейд», но куст не подписывался.",
      },
      {
        text: "Отложить подкормку на потом",
        effects: { nutrition: -8, stress: +4, health: -3 },
        comment: "Потом наступило слишком быстро, как обычно.",
      },
    ],
  },
  {
    title: "Сосед с советами",
    text: "Человек с опытом в 1987-м уверяет, что надо «по-другому».",
    choices: [
      {
        text: "Вежливо кивнуть и оставить свою схему",
        effects: { stress: -3, health: +3, light: +2 },
        comment: "Уверенность в себе +100. Социальная дипломатия тоже +100.",
      },
      {
        text: "Применить совет полностью",
        effects: { water: +12, nutrition: -6, stress: +7 },
        comment: "Эксперимент ради уважения к старшим поколениям.",
      },
      {
        text: "Смешать совет соседа и свои заметки",
        effects: { water: +4, nutrition: +4, stress: +3, health: +1 },
        comment: "Компромисс: не идеально, но жизненно.",
      },
    ],
  },
  {
    title: "Жаркая неделя",
    text: "Солнце шпарит серьёзно. Растению может стать некомфортно.",
    choices: [
      {
        text: "Усилить полив и поставить лёгкое притенение",
        effects: { water: +10, light: -10, stress: -3, health: +4 },
        comment: "Куст выдохнул. Ты тоже.",
      },
      {
        text: "Оставить как есть: пусть закаляется",
        effects: { light: +10, stress: +10, health: -5 },
        comment: "Закалка полезна, когда она не похожа на испытание.",
      },
      {
        text: "Перенести в полутень на неделю",
        effects: { light: -15, stress: -2, health: -1, nutrition: -3 },
        comment: "Безопасно, но рост слегка притормозил.",
      },
    ],
  },
  {
    title: "Первый намёк на плоды",
    text: "Появились завязи. Самое время не суетиться и не испортить момент.",
    choices: [
      {
        text: "Поддержать питание и режим воды",
        effects: { nutrition: +10, water: +8, yield: +8, stress: -2 },
        comment: "Очень взрослая неделя. В хорошем смысле.",
      },
      {
        text: "Сконцентрироваться только на урожае",
        effects: { yield: +13, stress: +8, health: -4, water: -4 },
        comment: "Риск ради результата. Узнаю этот стиль.",
      },
      {
        text: "Ничего не менять, чтобы не сглазить",
        effects: { stress: -1, yield: +2, nutrition: -5 },
        comment: "Осторожность норм, но ресурсам всё равно нужна подпитка.",
      },
    ],
  },
  {
    title: "Силы на исходе?",
    text: "Листья чуть поникли. Это может быть усталость или дисбаланс.",
    choices: [
      {
        text: "Проверить баланс и вернуть середину",
        effects: { water: +6, nutrition: +6, light: -2, stress: -5, health: +4 },
        comment: "Ты не лечишь симптом, ты правишь систему.",
      },
      {
        text: "Экстренно залить водой и ждать чуда",
        effects: { water: +18, stress: +5, health: -3 },
        comment: "Чудо в этот раз решило остаться дома.",
      },
      {
        text: "Дать отдых без вмешательств",
        effects: { stress: -3, water: -4, nutrition: -4, health: +1 },
        comment: "Нежно, но запасов стало меньше.",
      },
    ],
  },
  {
    title: "Финальная неделя",
    text: "Перед сбором урожая хочется сделать последний идеальный ход.",
    choices: [
      {
        text: "Сохранить баланс и аккуратно довести сезон",
        effects: { health: +6, yield: +7, stress: -4 },
        comment: "Финиш как у профессионала: спокойно и точно.",
      },
      {
        text: "Рискнуть ради максимума",
        effects: { yield: +14, stress: +10, health: -8, water: -6 },
        comment: "Если выгорит, это будет красиво. Если нет — тоже урок.",
      },
      {
        text: "Сделать шаг назад и не мешать",
        effects: { stress: -2, yield: +4, nutrition: -3 },
        comment: "Консервативно, но иногда именно это спасает сезон.",
      },
    ],
  },
];

const STATE = {
  selectedVarietyId: null,
  variety: null,
  week: 0,
  stats: null,
  history: [],
  name: "",
};

const screens = {
  start: document.getElementById("screen-start"),
  variety: document.getElementById("screen-variety"),
  game: document.getElementById("screen-game"),
  end: document.getElementById("screen-end"),
};

const nodes = {
  startBtn: document.getElementById("start-btn"),
  varietyList: document.getElementById("variety-list"),
  confirmVarietyBtn: document.getElementById("confirm-variety-btn"),
  weekLabel: document.getElementById("week-label"),
  plantName: document.getElementById("plant-name"),
  vibeBadge: document.getElementById("vibe-badge"),
  statsList: document.getElementById("stats-list"),
  eventTitle: document.getElementById("event-title"),
  eventText: document.getElementById("event-text"),
  choicesList: document.getElementById("choices-list"),
  liveComment: document.getElementById("live-comment"),
  finalTitle: document.getElementById("final-title"),
  finalSubtitle: document.getElementById("final-subtitle"),
  finalMetrics: document.getElementById("final-metrics"),
  saveCardBtn: document.getElementById("save-card-btn"),
  restartBtn: document.getElementById("restart-btn"),
  shareCard: document.getElementById("share-card"),
  shareVariety: document.getElementById("share-variety"),
  shareHeadline: document.getElementById("share-headline"),
  shareSummary: document.getElementById("share-summary"),
  shareHealth: document.getElementById("share-health"),
  shareBalance: document.getElementById("share-balance"),
  shareYield: document.getElementById("share-yield"),
  shareStress: document.getElementById("share-stress"),
  shareStyle: document.getElementById("share-style"),
};

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function showScreen(screenName) {
  Object.values(screens).forEach((section) => section.classList.remove("screen--active"));
  screens[screenName].classList.add("screen--active");
}

function renderVarieties() {
  const cards = Object.values(VARIETIES)
    .map((variety) => {
      const selected = STATE.selectedVarietyId === variety.id ? "variety-card--selected" : "";
      const traits = variety.traits.map((trait) => `<li>${trait}</li>`).join("");
      return `
        <article class="variety-card ${selected}" data-variety-id="${variety.id}">
          <h3>${variety.name}</h3>
          <ul>${traits}</ul>
        </article>
      `;
    })
    .join("");

  nodes.varietyList.innerHTML = cards;
}

function getBalance(stats) {
  const { water, nutrition, light } = stats;
  const balance = 100 - (Math.abs(water - 50) + Math.abs(nutrition - 50) + Math.abs(light - 55)) / 3;
  return clamp(balance);
}

function applyChoice(choice) {
  const effects = choice.effects || {};
  const m = STATE.variety.modifiers;
  const s = STATE.stats;

  if (effects.health) s.health += effects.health * m.resilience;
  if (effects.water) s.water += effects.water;
  if (effects.nutrition) s.nutrition += effects.nutrition;
  if (effects.stress) s.stress += effects.stress * m.stressGain;
  if (effects.light) s.light += effects.light;
  if (effects.yield) s.yield += effects.yield * m.yieldScale;

  applyAmbientLogic();

  Object.keys(s).forEach((key) => {
    s[key] = clamp(s[key]);
  });

  STATE.history.push({
    week: STATE.week + 1,
    choice: choice.text,
    comment: choice.comment,
  });

  nodes.liveComment.textContent = choice.comment;
}

function applyAmbientLogic() {
  const s = STATE.stats;
  const m = STATE.variety.modifiers;
  const balance = getBalance(s);

  if (s.light < 35) {
    s.health -= 5;
    s.yield -= 4;
    s.stress += 3;
  } else if (s.light <= 72) {
    s.health += 4;
    s.yield += 6 * m.yieldScale;
  } else if (s.light > 72 && s.stress > 58) {
    s.health -= 9;
    s.stress += 8 * m.stressGain;
    s.yield -= 5;
  } else {
    s.yield += 2;
    s.stress += 1;
  }

  if (s.water < 25 || s.water > 82) {
    s.health -= 6;
    s.stress += 5 * m.stressGain;
  }

  if (s.nutrition < 28) {
    s.yield -= 5;
    s.health -= 3;
  } else if (s.nutrition > 78) {
    s.stress += 4 * m.stressGain;
  }

  if (balance > 72) {
    s.health += 5;
    s.yield += 6 * m.yieldScale;
    s.stress -= 5;
  } else if (balance < 40) {
    s.health -= 7;
    s.stress += 6 * m.stressGain;
  }

  s.yield += (TOTAL_WEEKS / 10) * (1 / m.slow);
}

function getVibeText() {
  const s = STATE.stats;
  const balance = getBalance(s);
  if (s.health >= 80 && s.stress <= 32 && balance >= 70) return "Суперрежим: куст в форме";
  if (s.health <= 35 || s.stress >= 80) return "Критично: куст на грани";
  if (balance < 45) return "Сильный дисбаланс, выравнивай";
  if (s.light > 74 && s.stress > 60) return "Риск перегрева";
  return "Нормально держитесь";
}

function renderStats() {
  nodes.vibeBadge.textContent = getVibeText();
  const s = STATE.stats;
  const statsMarkup = Object.keys(STAT_META)
    .map((key) => {
      const meta = STAT_META[key];
      const value = clamp(s[key]);
      return `
        <div class="stat">
          <div class="stat__top">
            <span class="stat__name">${meta.label}</span>
            <strong>${value}</strong>
          </div>
          <div class="bar"><span style="width: ${value}%; background: ${meta.color};"></span></div>
        </div>
      `;
    })
    .join("");
  nodes.statsList.innerHTML = statsMarkup;
}

function renderCurrentWeek() {
  const event = WEEK_EVENTS[STATE.week];
  nodes.weekLabel.textContent = String(STATE.week + 1);
  nodes.eventTitle.textContent = event.title;
  nodes.eventText.textContent = event.text;

  const choicesMarkup = event.choices
    .map((choice, idx) => `<button class="choice-btn" data-choice-index="${idx}">${choice.text}</button>`)
    .join("");

  nodes.choicesList.innerHTML = choicesMarkup;
  renderStats();
}

function nextWeek(choiceIndex) {
  const event = WEEK_EVENTS[STATE.week];
  const choice = event.choices[choiceIndex];
  if (!choice) return;

  applyChoice(choice);
  STATE.week += 1;

  if (STATE.week >= TOTAL_WEEKS) {
    finishGame();
    return;
  }

  renderCurrentWeek();
}

function detectStyleTag() {
  const s = STATE.stats;
  const balance = getBalance(s);

  if (s.yield >= 82 && s.health >= 70 && s.stress <= 45) return "Легендарный фермер";
  if (balance >= 72 && s.stress <= 50) return "Мастер баланса";
  if (s.yield >= 75 && s.stress >= 62) return "Рисковый продюсер урожая";
  if (s.health < 45) return "Выживальщик на минималках";
  return "Упрямый сезонный герой";
}

function getEndingData() {
  const s = STATE.stats;
  const balance = getBalance(s);
  const styleTag = detectStyleTag();

  let title = "Сезон окончен: достойная история";
  let subtitle = "Куст выжил, ты тоже. В этом сезоне вы явно узнали характер друг друга.";

  if (s.yield >= 88 && s.health >= 72 && s.stress <= 44) {
    title = "Легенда грядки";
    subtitle = "Ты выжал максимум и не сломал систему. Такой сезон пересказывают знакомым.";
  } else if (s.health <= 35 || s.stress >= 86) {
    title = "Драма на подоконнике";
    subtitle = "Сезон был нервный, но ты дошёл до конца. Это тоже опыт, и очень честный.";
  } else if (balance >= 74) {
    title = "Мастер спокойного роста";
    subtitle = "Ты держал баланс даже когда хотелось паниковать. Куст это запомнил.";
  } else if (s.yield >= 76) {
    title = "Охотник за урожаем";
    subtitle = "Иногда на грани, но с хорошим финалом. Красиво и дерзко.";
  }

  if (STATE.variety.id === "giant" && s.yield >= 84 && s.stress <= 58) {
    title = "Гигантский триумф";
    subtitle = "Ты приручил самый сложный сорт и вывел его в легенду. Да, это редкость.";
  }

  return { title, subtitle, balance, styleTag };
}

function renderFinal() {
  const s = STATE.stats;
  const ending = getEndingData();
  const bestWeek = STATE.history[Math.floor(Math.random() * STATE.history.length)];

  nodes.finalTitle.textContent = ending.title;
  nodes.finalSubtitle.textContent = `${ending.subtitle} ${STATE.variety.persona}`;

  nodes.finalMetrics.innerHTML = `
    <div class="metric-card"><span>Сорт</span><strong>${STATE.variety.name}</strong></div>
    <div class="metric-card"><span>Итоговый урожай</span><strong>${clamp(s.yield)} / 100</strong></div>
    <div class="metric-card"><span>Баланс ухода</span><strong>${ending.balance} / 100</strong></div>
    <div class="metric-card"><span>Твой стиль</span><strong>${ending.styleTag}</strong></div>
  `;

  nodes.shareVariety.textContent = STATE.variety.name;
  nodes.shareHeadline.textContent = ending.title;
  nodes.shareSummary.textContent = `8 недель позади. ${ending.subtitle} Самый вайбовый момент: «${bestWeek.choice}».`;
  nodes.shareHealth.textContent = `${clamp(s.health)}`;
  nodes.shareBalance.textContent = `${ending.balance}`;
  nodes.shareYield.textContent = `${clamp(s.yield)}`;
  nodes.shareStress.textContent = `${clamp(s.stress)}`;
  nodes.shareStyle.textContent = ending.styleTag;
}

function finishGame() {
  showScreen("end");
  renderFinal();
}

function startGameWithSelectedVariety() {
  STATE.variety = VARIETIES[STATE.selectedVarietyId];
  STATE.week = 0;
  STATE.stats = { ...STATE.variety.stats };
  STATE.history = [];
  STATE.name = `Куст сорта "${STATE.variety.name}"`;

  nodes.plantName.textContent = STATE.name;
  nodes.liveComment.textContent = "Сезон стартовал. Дышим, смотрим на баланс и не паникуем.";

  showScreen("game");
  renderCurrentWeek();
}

function bindEvents() {
  nodes.startBtn.addEventListener("click", () => {
    showScreen("variety");
  });

  nodes.varietyList.addEventListener("click", (event) => {
    const card = event.target.closest(".variety-card");
    if (!card) return;

    STATE.selectedVarietyId = card.dataset.varietyId;
    nodes.confirmVarietyBtn.disabled = false;
    renderVarieties();
  });

  nodes.confirmVarietyBtn.addEventListener("click", () => {
    if (!STATE.selectedVarietyId) return;
    startGameWithSelectedVariety();
  });

  nodes.choicesList.addEventListener("click", (event) => {
    const button = event.target.closest(".choice-btn");
    if (!button) return;
    const choiceIndex = Number(button.dataset.choiceIndex);
    nextWeek(choiceIndex);
  });

  nodes.restartBtn.addEventListener("click", () => {
    STATE.selectedVarietyId = null;
    STATE.variety = null;
    STATE.stats = null;
    STATE.week = 0;
    STATE.history = [];
    nodes.confirmVarietyBtn.disabled = true;
    renderVarieties();
    showScreen("start");
  });

  nodes.saveCardBtn.addEventListener("click", async () => {
    const target = nodes.shareCard;
    if (!window.html2canvas) {
      alert("Не получилось подключить html2canvas.");
      return;
    }

    nodes.saveCardBtn.disabled = true;
    nodes.saveCardBtn.textContent = "Готовим карточку...";

    try {
      const canvas = await html2canvas(target, {
        scale: Math.max(2, window.devicePixelRatio || 1),
        backgroundColor: null,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `tomato-season-${Date.now()}.png`;
      link.click();
    } catch (error) {
      alert("Не удалось сохранить карточку. Попробуй ещё раз.");
      console.error(error);
    } finally {
      nodes.saveCardBtn.disabled = false;
      nodes.saveCardBtn.textContent = "Скачать карточку результата";
    }
  });
}

function init() {
  renderVarieties();
  bindEvents();
  showScreen("start");
}

init();

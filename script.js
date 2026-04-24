const STAGE_NAMES = ["Рассада после высадки", "Прижился", "Рост", "Цветение", "Завязь", "Налив плодов", "Спелые томаты"];
const PLANT_FRAMES = {
  loved: Array.from({ length: 12 }, (_, i) => `assets/plants/loved/${String(i + 1).padStart(2, "0")}.webp`),
  giant: Array.from({ length: 12 }, (_, i) => `assets/plants/giant/${String(i + 1).padStart(2, "0")}.webp`),
};
const UI_ASSETS = {
  basket: "assets/ui/basket.webp",
  flyTomato: "assets/ui/fly-tomato.webp",
};
const PREPARED = {
  frames: {},
  ui: {},
};

const VARIETIES = {
  loved: { name: "Любимые томаты", desc: "Для души и урожая" },
  giant: { name: "Гигантский томат", desc: "Для рекорда и супер результата" },
};

const STEP_EVENTS_LOVED = [
  { state: "Томаты высажены. Листья немного поникли.", advice: "Снизь стресс после высадки.", options: ["Притенить", "Подкормить", "Оставить в покое, дать прижиться", "Оборвать нижние листья"], correct: 0 },
  { state: "Почва подсохла, куст выглядит нормально.", advice: "Держи полив ровным.", options: ["Полить как следует", "Полить умеренно", "Опрыскать листья", "Не поливать"], correct: 1 },
  { state: "Куст пошёл в рост.", advice: "Сейчас нужен мягкий толчок роста.", options: ["Подкормить азотом", "Полить сильнее", "Удалить нижние листья", "Понаблюдать"], correct: 0 },
  { state: "Ночью ожидается похолодание/заморозки.", advice: "Сейчас важнее защита.", options: ["Не так уж и холодно, выдержат", "Полить на ночь", "Укрыть растения", "Подвязать куст"], correct: 2 },
  { state: "Днём стало очень жарко.", advice: "Сними перегрев.", options: ["Оставить как есть", "Хорошо проветрить / притенить", "Полить днём", "Подкормить"], correct: 1 },
  { state: "Куст быстро растёт и загущается.", advice: "Убери лишнюю нагрузку.", options: ["Удалить нижние листья", "Удалить лишние пасынки", "Полить больше", "Чем больше зелени - тем лучше"], correct: 1 },
  { state: "Появились цветы.", advice: "Помоги опылению.", options: ["Обильно полить", "Помочь опылению (лёгкое встряхивание)", "Удалить цветы", "Подкормить азотом"], correct: 1 },
  { state: "Появились маленькие плоды.", advice: "Поддержи налив плодов.", options: ["Увеличить полив", "Дать калийно-фосфорную подкормку", "Удалить плоды", "Решить, что дальше само пойдёт"], correct: 1 },
  { state: "Плоды тяжелеют, кусту сложно держать нагрузку.", advice: "Поддержи ветви.", options: ["Подвязать куст", "Полить сильнее", "Удалить листья", "Подкормить азотом"], correct: 0 },
  { state: "Снова жара: плоды наливаются, верхний слой почвы быстро сохнет.", advice: "Сними водный стресс до того, как завязь начнет осыпаться.", options: ["Притенить и не поливать", "Хорошо полить", "Оборвать часть листьев", "Подкормить азотом"], correct: 1 },
  { state: "Нижние листья отработали своё и начали желтеть.", advice: "Освежи куст.", options: ["Удалить нижние листья", "Полить больше", "Замульчировать почву", "Подкормить"], correct: 0 },
  { state: "Плоды почти спелые.", advice: "Дай кусту закончить цикл.", options: ["Сорвать сразу всё", "Дать дозреть на кусте", "Полить больше", "Подкормить"], correct: 1 },
];

const STEP_EVENTS_GIANT = [
  { state: "Высадка гигантского томата: лист слегка поник.", advice: "Сначала защити от стресса пересадки.", options: ["Притенить", "Подкормить сразу мощно", "Удалить листья", "Оставить под прямым солнцем"], correct: 0 },
  { state: "Почва подсыхает, корни начинают осваиваться.", advice: "Дай ровный старт по влаге.", options: ["Полить как следует", "Полить умеренно", "Не поливать", "Опрыскать листья"], correct: 1 },
  { state: "Пошел активный рост побегов.", advice: "Для рекордного плода задай правильную формировку.", options: ["Вести куст в 2-3 ствола", "Оставить все пасынки", "Удалить все боковые побеги", "Срезать верхушку"], correct: 0 },
  { state: "Ночью ожидается похолодание.", advice: "Сохрани стабильность роста.", options: ["Не укрывать", "Полить на ночь", "Укрыть растения", "Подкормить азотом"], correct: 2 },
  { state: "Жаркий день, куст под нагрузкой.", advice: "Сними перегрев, не допусти стресса.", options: ["Оставить как есть", "Хорошо проветрить / притенить", "Полить днём", "Подкормить"], correct: 1 },
  { state: "Появилось несколько крупных цветков в кисти.", advice: "Выбери будущий рекордный плод.", options: ["Опылить все крупные цветки", "Выбрать самый крупный цветок и аккуратно опылить", "Удалить все кривые, сросшиеся цветки", "Подкормить азотом"], correct: [0, 1] },
  { state: "Завязи достигли размера с крыжовник.", advice: "Сейчас нужно обратить внимание на деление клеток.", options: ["Дать кальций", "Дать азот", "Дать фосфор", "Дать калий"], correct: 0 },
  { state: "Прошло две недели после первой кальциевой подкормки.", advice: "Поддержи налив и корневую систему.", options: ["Дать калий и фосфор", "Дать только калий", "Ничего не делать", "Сильно обрезать куст"], correct: 0 },
  { state: "В кисти несколько завязей разного размера.", advice: "Сконцентрируй питание на лучшей завязи.", options: ["Оставить 1-2 лучших завязи, лишние удалить", "Оставить все завязи", "Удалить самую крупную завязь", "Хорошо полить"], correct: 0 },
  { state: "Плод тяжелеет, ветви проседают.", advice: "Укрепи конструкцию под вес плода.", options: ["Подвязать куст и кисть", "Полить сильнее", "Удалить листья", "Подкормить азотом"], correct: 0 },
  { state: "Нижние листья начали стареть.", advice: "Освободи питание и вентиляцию.", options: ["Удалить нижние листья", "Полить больше", "Замульчировать почву", "Подкормить"], correct: 0 },
  { state: "Финальный набор массы перед созреванием.", advice: "Дай плоду спокойно завершить цикл.", options: ["Сорвать рано", "Дать дозреть на кусте", "Поливать ежедневно без меры", "Притенить плод"], correct: [1, 3] },
];

const screens = {
  start: document.getElementById("screen-start"),
  setup: document.getElementById("screen-setup"),
  game: document.getElementById("screen-game"),
};

const nodes = {
  startBtn: document.getElementById("start-btn"),
  varietyList: document.getElementById("variety-list"),
  scenarioList: document.getElementById("scenario-list"),
  goGameBtn: document.getElementById("go-game-btn"),
  stageTitle: document.getElementById("stage-title"),
  stateLine: document.getElementById("state-line"),
  adviceLine: document.getElementById("advice-line"),
  progressValue: document.getElementById("progress-value"),
  stateLabel: document.getElementById("state-label"),
  reactionLine: document.getElementById("reaction-line"),
  actionReactionLine: document.getElementById("action-reaction-line"),
  scene: document.getElementById("scene"),
  plant: document.getElementById("plant"),
  plantSprite: document.getElementById("plant-sprite"),
  giantFruit: document.getElementById("giant-fruit"),
  liveBasket: document.getElementById("live-basket"),
  liveCount: document.getElementById("live-count"),
  timerValue: document.getElementById("timer-value"),
  quickActions: document.getElementById("quick-actions"),
  nextStepBtn: document.getElementById("next-step-btn"),
  archType: document.getElementById("arch-type"),
  storyMeta: document.getElementById("story-meta"),
  storyResult: document.getElementById("story-result"),
  shareBtn: document.getElementById("share-btn"),
  shareStatus: document.getElementById("share-status"),
  adminOpenBtn: document.getElementById("admin-open-btn"),
  adminPanel: document.getElementById("admin-panel"),
  adminPassword: document.getElementById("admin-password"),
  adminLoginBtn: document.getElementById("admin-login-btn"),
  adminLock: document.getElementById("admin-lock"),
  adminEditorWrap: document.getElementById("admin-editor-wrap"),
  adminStartTitle: document.getElementById("admin-start-title"),
  adminStartHint: document.getElementById("admin-start-hint"),
  adminStartButton: document.getElementById("admin-start-button"),
  adminRulesTitle: document.getElementById("admin-rules-title"),
  adminRulesItem0: document.getElementById("admin-rules-item-0"),
  adminRulesItem1: document.getElementById("admin-rules-item-1"),
  adminRulesItem2: document.getElementById("admin-rules-item-2"),
  adminRulesTip: document.getElementById("admin-rules-tip"),
  adminTimerSeconds: document.getElementById("admin-timer-seconds"),
  adminStepOptions: document.getElementById("admin-step-options"),
  adminStepTabs: document.getElementById("admin-step-tabs"),
  adminVariety: document.getElementById("admin-variety"),
  adminStep: document.getElementById("admin-step"),
  adminStepState: document.getElementById("admin-step-state"),
  adminStepAdvice: document.getElementById("admin-step-advice"),
  adminOpt0: document.getElementById("admin-opt-0"),
  adminOpt1: document.getElementById("admin-opt-1"),
  adminOpt2: document.getElementById("admin-opt-2"),
  adminOpt3: document.getElementById("admin-opt-3"),
  adminCorrect: document.getElementById("admin-correct"),
  adminPrevStepBtn: document.getElementById("admin-prev-step-btn"),
  adminNextStepBtn: document.getElementById("admin-next-step-btn"),
  adminUnsavedBadge: document.getElementById("admin-unsaved-badge"),
  adminMsgChoose: document.getElementById("admin-msg-choose"),
  adminMsgGood: document.getElementById("admin-msg-good"),
  adminMsgBad: document.getElementById("admin-msg-bad"),
  adminNextBtn: document.getElementById("admin-next-btn"),
  adminRestartBtn: document.getElementById("admin-restart-btn"),
  adminShareBtn: document.getElementById("admin-share-btn"),
  adminFinalTitle: document.getElementById("admin-final-title"),
  adminFinalMetaTemplate: document.getElementById("admin-final-meta-template"),
  adminArch0Title: document.getElementById("admin-arch-0-title"),
  adminArch0Phrase: document.getElementById("admin-arch-0-phrase"),
  adminArch1Title: document.getElementById("admin-arch-1-title"),
  adminArch1Phrase: document.getElementById("admin-arch-1-phrase"),
  adminArch2Title: document.getElementById("admin-arch-2-title"),
  adminArch2Phrase: document.getElementById("admin-arch-2-phrase"),
  adminArch3Title: document.getElementById("admin-arch-3-title"),
  adminArch3Phrase: document.getElementById("admin-arch-3-phrase"),
  adminLevelWeak: document.getElementById("admin-level-weak"),
  adminLevelGood: document.getElementById("admin-level-good"),
  adminLevelTopLoved: document.getElementById("admin-level-top-loved"),
  adminLevelTopGiant: document.getElementById("admin-level-top-giant"),
  adminFinalResultTemplate: document.getElementById("admin-final-result-template"),
  adminFinalTimeoutTemplate: document.getElementById("admin-final-timeout-template"),
  adminSaveDraftBtn: document.getElementById("admin-save-draft-btn"),
  adminPublishBtn: document.getElementById("admin-publish-btn"),
  adminExportBtn: document.getElementById("admin-export-btn"),
  adminImportBtn: document.getElementById("admin-import-btn"),
  adminImportFile: document.getElementById("admin-import-file"),
  adminGhOwner: document.getElementById("admin-gh-owner"),
  adminGhRepo: document.getElementById("admin-gh-repo"),
  adminGhBranch: document.getElementById("admin-gh-branch"),
  adminGhPath: document.getElementById("admin-gh-path"),
  adminGhToken: document.getElementById("admin-gh-token"),
  adminPublishGhBtn: document.getElementById("admin-publish-gh-btn"),
  adminCloseBtn: document.getElementById("admin-close-btn"),
  adminStatus: document.getElementById("admin-status"),
  seasonOverlay: document.getElementById("season-overlay"),
  victoryBurst: document.getElementById("victory-burst"),
  restartBtn: document.getElementById("restart-btn"),
};

const STATE = {
  variety: null,
  scenario: null,
  step: 0,
  health: 70,
  stress: 26,
  water: 55,
  heat: 48,
  growth: 0,
  tomatoes: 0,
  timeLeft: 60,
  timedOut: false,
  selectedActionId: null,
  mood: "healthy",
  finalText: "",
  preloaded: {},
};
let timerIntervalId = null;
const ADMIN_PASSWORD = "Tomato-Admin-2026";
const STORAGE_DRAFT_KEY = "tomatoGame.contentDraft.v1";
const STORAGE_PUBLISHED_KEY = "tomatoGame.contentPublished.v1";
const STORAGE_GH_SETTINGS_KEY = "tomatoGame.githubPublish.v1";
const STATIC_CONTENT_FILE = "content.json";
const BUILD_VERSION = "2026-04-24-8";
let CONTENT = null;
let adminAutosaveTimerId = null;
let adminHasUnsavedChanges = false;

function clamp(v, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(v)));
}

function preventOrphans(text) {
  if (!text) return text;
  return text.replace(/(^|\s)([а-яёa-z]{1,2})\s(?=[а-яёa-z])/giu, "$1$2\u00A0");
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function deepMerge(base, patch) {
  if (Array.isArray(base) || Array.isArray(patch)) {
    return patch === undefined ? deepClone(base) : deepClone(patch);
  }
  if (!base || typeof base !== "object") {
    return patch === undefined ? base : patch;
  }
  if (!patch || typeof patch !== "object") {
    return deepClone(base);
  }
  const out = { ...base };
  Object.keys(patch).forEach((key) => {
    const b = base[key];
    const p = patch[key];
    if (b && p && typeof b === "object" && typeof p === "object" && !Array.isArray(b) && !Array.isArray(p)) {
      out[key] = deepMerge(b, p);
    } else {
      out[key] = deepClone(p);
    }
  });
  return out;
}

function buildDefaultContent() {
  return {
    start: {
      tag: "Визуальная мини-игра",
      titleHtml: "Выживи сезон<br>с томатом 🍅",
      hint: "Просто смотри на куст и помогай ему.",
      rulesTitle: "Как играть",
      rulesItems: [
        "Выбери, где растёт томат: теплица или открытый грунт.",
        "На каждом этапе смотри на состояние куста и выбирай ОДНО главное действие.",
        "Доведи растение до урожая и собери как можно больше томатов или вырасти самый гигантский плод.",
      ],
      tip: "Подсказка: если куст вянет — он ждёт не мотивационную речь, а полив.",
      startButton: "Старт сезона",
    },
    setup: {
      tag: "Подготовка",
      title: "Выбери сценарий",
      varietyTitle: "Сорт",
      scenarioTitle: "Где растим",
      goGameButton: "Высадить рассаду",
      varieties: deepClone(VARIETIES),
      scenarios: [
        { id: "greenhouse", name: "Теплица", desc: "Жара и духота" },
        { id: "ground", name: "Открытый грунт", desc: "Ветер и холод" },
      ],
    },
    game: {
      timerSeconds: 60,
      stageNames: deepClone(STAGE_NAMES),
      steps: {
        loved: deepClone(STEP_EVENTS_LOVED),
        giant: deepClone(STEP_EVENTS_GIANT),
      },
      labels: {
        season: "Сезон",
        step: "Этап",
        state: "Состояние",
        harvest: "Урожай",
        timer: "Таймер",
      },
      messages: {
        chooseAction: "Выбери действие для этого этапа.",
        chooseFirst: "Сначала выбери 1 вариант.",
        goodMove: "Хороший ход",
        borderline: "Пока терпимо, но на грани",
        seasonDone: "Сезон завершён. Отличная работа!",
        timeOut: "Время вышло. Сезон завершён.",
      },
      buttons: {
        nextStep: "Пройти этап",
      },
    },
    final: {
      title: "Сезон завершён",
      restartButton: "Сыграть снова",
      shareButton: "Поделиться игрой",
      shareSuccess: "Ссылка на игру получена.",
      metaLead: "",
      archetypes: [
        { title: "Контролёр теплицы", phrase: "Ты держал сезон под контролем." },
        { title: "Рисковый экспериментатор", phrase: "Смело играл и собрал щедрый урожай." },
        { title: "Спокойный садовод", phrase: "Ровный подход дал хороший результат." },
        { title: "Упрямый выживальщик", phrase: "Сезон был непростым, но ты дошёл до финала." },
      ],
      levels: {
        weak: "Слабый урожай",
        good: "Хороший урожай",
        topLoved: "Супер-урожай!",
        topGiant: "Гигантский урожай!",
      },
      resultText: "Итог",
      timeoutText: "Время вышло, куст завял. Итог",
      timeoutResult: "Время вышло, куст завял. Итог: {{level}}.",
      resultTemplate: "{{phrase}} Итог: {{level}}.",
    },
  };
}

function loadPublishedContent(defaultContent) {
  try {
    const raw = localStorage.getItem(STORAGE_PUBLISHED_KEY);
    if (!raw) return deepClone(defaultContent);
    return JSON.parse(raw);
  } catch {
    return deepClone(defaultContent);
  }
}

function getPublishedPatch() {
  try {
    const raw = localStorage.getItem(STORAGE_PUBLISHED_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function loadStaticContent(defaultContent) {
  try {
    const response = await fetch(`${STATIC_CONTENT_FILE}?v=${BUILD_VERSION}`, { cache: "no-store" });
    if (!response.ok) return deepClone(defaultContent);
    const parsed = await response.json();
    const merged = deepMerge(defaultContent, parsed);
    validateAdminContentShape(merged);
    return merged;
  } catch {
    return deepClone(defaultContent);
  }
}

function getDraftContent(defaultContent) {
  try {
    const raw = localStorage.getItem(STORAGE_DRAFT_KEY);
    if (!raw) return deepClone(defaultContent);
    return JSON.parse(raw);
  } catch {
    return deepClone(defaultContent);
  }
}

function setAdminStatus(text) {
  if (!nodes.adminStatus) return;
  nodes.adminStatus.textContent = text || "";
}

function setAdminUnsaved(flag) {
  adminHasUnsavedChanges = !!flag;
  if (!nodes.adminUnsavedBadge) return;
  nodes.adminUnsavedBadge.classList.toggle("admin-unsaved-badge--show", adminHasUnsavedChanges);
}

function inferGithubTargetFromUrl() {
  const host = window.location.hostname || "";
  if (!host.endsWith(".github.io")) return null;
  const owner = host.replace(".github.io", "");
  const seg = window.location.pathname.split("/").filter(Boolean);
  const repo = seg.length > 0 ? seg[0] : `${owner}.github.io`;
  return { owner, repo };
}

function loadGitHubSettings() {
  const inferred = inferGithubTargetFromUrl() || {};
  const fallback = {
    owner: inferred.owner || "",
    repo: inferred.repo || "",
    branch: "main",
    path: STATIC_CONTENT_FILE,
    token: "",
  };
  try {
    const raw = localStorage.getItem(STORAGE_GH_SETTINGS_KEY);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

function saveGitHubSettings(settings) {
  try {
    localStorage.setItem(STORAGE_GH_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore storage errors
  }
}

function applyGitHubSettingsToForm() {
  const s = loadGitHubSettings();
  if (nodes.adminGhOwner) nodes.adminGhOwner.value = s.owner || "";
  if (nodes.adminGhRepo) nodes.adminGhRepo.value = s.repo || "";
  if (nodes.adminGhBranch) nodes.adminGhBranch.value = s.branch || "main";
  if (nodes.adminGhPath) nodes.adminGhPath.value = s.path || STATIC_CONTENT_FILE;
  if (nodes.adminGhToken) nodes.adminGhToken.value = s.token || "";
}

function getGitHubSettingsFromForm() {
  return {
    owner: (nodes.adminGhOwner?.value || "").trim(),
    repo: (nodes.adminGhRepo?.value || "").trim(),
    branch: (nodes.adminGhBranch?.value || "main").trim() || "main",
    path: (nodes.adminGhPath?.value || STATIC_CONTENT_FILE).trim() || STATIC_CONTENT_FILE,
    token: (nodes.adminGhToken?.value || "").trim(),
  };
}

function bindGitHubSettingsInputs() {
  [nodes.adminGhOwner, nodes.adminGhRepo, nodes.adminGhBranch, nodes.adminGhPath, nodes.adminGhToken].forEach((el) => {
    if (!el) return;
    el.addEventListener("input", () => {
      saveGitHubSettings(getGitHubSettingsFromForm());
    });
  });
}

function toBase64Unicode(value) {
  return btoa(unescape(encodeURIComponent(value)));
}

async function githubFetchJson(url, token, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || `GitHub API error ${response.status}`);
  }
  return data;
}

async function publishContentToGitHub() {
  try {
    readAdminFormToContent();
    const settings = getGitHubSettingsFromForm();
    if (!settings.owner || !settings.repo || !settings.branch || !settings.path || !settings.token) {
      throw new Error("Заполни owner/repo/branch/path/token для GitHub публикации.");
    }
    saveGitHubSettings(settings);
    const url = `https://api.github.com/repos/${settings.owner}/${settings.repo}/contents/${settings.path}`;
    let sha = null;
    try {
      const current = await githubFetchJson(`${url}?ref=${encodeURIComponent(settings.branch)}`, settings.token);
      sha = current?.sha || null;
    } catch (error) {
      if (!String(error.message || "").includes("404")) throw error;
    }

    const jsonText = JSON.stringify(ADMIN_CONTENT, null, 2);
    await githubFetchJson(url, settings.token, {
      method: "PUT",
      body: JSON.stringify({
        message: `chore: update content via admin (${new Date().toISOString()})`,
        content: toBase64Unicode(jsonText),
        branch: settings.branch,
        ...(sha ? { sha } : {}),
      }),
    });

    localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(ADMIN_CONTENT));
    localStorage.setItem(STORAGE_PUBLISHED_KEY, JSON.stringify(ADMIN_CONTENT));
    applyContent(ADMIN_CONTENT);
    renderSetup();
    if (screens.game.classList.contains("screen--active")) {
      renderStepContext();
      renderActions();
      updatePlantVisual(false);
    }
    setAdminUnsaved(false);
    setAdminStatus("Опубликовано в GitHub: content.json обновлён.");
  } catch (error) {
    setAdminStatus(`Ошибка GitHub публикации: ${error.message}`);
  }
}

function scheduleAdminAutosave() {
  if (!ADMIN_CONTENT) return;
  if (adminAutosaveTimerId) clearTimeout(adminAutosaveTimerId);
  adminAutosaveTimerId = setTimeout(() => {
    saveDraftFromEditor("autosave");
  }, 2000);
}

function applyContent(content) {
  CONTENT = deepClone(content);
  STAGE_NAMES.splice(0, STAGE_NAMES.length, ...CONTENT.game.stageNames);
  STEP_EVENTS_LOVED.splice(0, STEP_EVENTS_LOVED.length, ...CONTENT.game.steps.loved);
  STEP_EVENTS_GIANT.splice(0, STEP_EVENTS_GIANT.length, ...CONTENT.game.steps.giant);
  VARIETIES.loved = deepClone(CONTENT.setup.varieties.loved);
  VARIETIES.giant = deepClone(CONTENT.setup.varieties.giant);

  const startTag = document.getElementById("start-tag");
  const startTitle = document.getElementById("start-title");
  const startHint = document.getElementById("start-hint");
  const rulesTitle = document.getElementById("rules-title");
  const rulesTip = document.getElementById("rules-tip");
  const rulesItems = document.querySelectorAll(".rules-item");
  const setupTag = document.getElementById("setup-tag");
  const setupTitle = document.getElementById("setup-title");
  const setupVarietyTitle = document.getElementById("setup-variety-title");
  const setupScenarioTitle = document.getElementById("setup-scenario-title");
  const storyTitle = document.getElementById("story-title");

  if (startTag) startTag.textContent = CONTENT.start.tag;
  if (startTitle) startTitle.innerHTML = CONTENT.start.titleHtml;
  if (startHint) startHint.textContent = CONTENT.start.hint;
  if (rulesTitle) rulesTitle.textContent = CONTENT.start.rulesTitle;
  rulesItems.forEach((el, idx) => {
    el.textContent = CONTENT.start.rulesItems[idx] || "";
  });
  if (rulesTip) rulesTip.textContent = CONTENT.start.tip;
  if (nodes.startBtn) nodes.startBtn.textContent = CONTENT.start.startButton;
  if (setupTag) setupTag.textContent = CONTENT.setup.tag;
  if (setupTitle) setupTitle.textContent = CONTENT.setup.title;
  if (setupVarietyTitle) setupVarietyTitle.textContent = CONTENT.setup.varietyTitle;
  if (setupScenarioTitle) setupScenarioTitle.textContent = CONTENT.setup.scenarioTitle;
  if (nodes.goGameBtn) nodes.goGameBtn.textContent = CONTENT.setup.goGameButton;
  if (nodes.nextStepBtn) nodes.nextStepBtn.textContent = CONTENT.game.buttons.nextStep;
  if (storyTitle) storyTitle.textContent = CONTENT.final.title;
  if (nodes.restartBtn) nodes.restartBtn.textContent = CONTENT.final.restartButton;
  if (nodes.shareBtn) nodes.shareBtn.textContent = CONTENT.final.shareButton;

  const miniLabels = document.querySelectorAll(".mini-stats span");
  const sceneHarvestLabel = document.getElementById("scene-harvest-label");
  const sceneTimerLabel = document.getElementById("scene-timer-label");
  if (miniLabels[0]) miniLabels[0].textContent = CONTENT.game.labels.step;
  if (miniLabels[1]) miniLabels[1].textContent = CONTENT.game.labels.state;
  if (sceneHarvestLabel) sceneHarvestLabel.textContent = CONTENT.game.labels.harvest;
  if (sceneTimerLabel) sceneTimerLabel.textContent = CONTENT.game.labels.timer;
}

function formatTime(totalSeconds) {
  const s = Math.max(0, totalSeconds);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function renderTimer() {
  if (!nodes.timerValue) return;
  nodes.timerValue.textContent = formatTime(STATE.timeLeft);
}

function stopTimer() {
  if (!timerIntervalId) return;
  clearInterval(timerIntervalId);
  timerIntervalId = null;
}

function setShareStatus(text) {
  if (!nodes.shareStatus) return;
  nodes.shareStatus.textContent = text || "";
}

function setReactionMessage(text, options = {}) {
  const { alert = false, pulse = true, color = "" } = options;
  const lines = [nodes.reactionLine, nodes.actionReactionLine].filter(Boolean);
  lines.forEach((line) => {
    line.textContent = text;
    line.classList.toggle("reaction-line--alert", alert);
    line.classList.toggle("reaction-line--pulse", pulse);
    line.style.color = color || "";
  });
}

async function shareGame() {
  const url = window.location.href;
  const title = "Выживи сезон с томатом";
  const text = "Попробуй мини-игру про выращивание томатов 🍅";

  try {
    if (navigator.share) {
      await navigator.share({ title, text, url });
      setShareStatus(CONTENT?.final?.shareSuccess || "Ссылка на игру получена.");
      return;
    }
  } catch {
    // ignore and fallback to clipboard
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      setShareStatus(CONTENT?.final?.shareSuccess || "Ссылка на игру получена.");
      return;
    }
  } catch {
    // ignore and show success text fallback below
  }

  setShareStatus(CONTENT?.final?.shareSuccess || "Ссылка на игру получена.");
}

function startTimer() {
  stopTimer();
  setReactionMessage(
    nodes.reactionLine?.textContent || preventOrphans(CONTENT?.game?.messages?.chooseAction || "Выбери действие для этого этапа."),
    { alert: false, pulse: true, color: "#c7ffd8" },
  );
  renderTimer();
  timerIntervalId = setInterval(() => {
    STATE.timeLeft -= 1;
    renderTimer();
    if (STATE.timeLeft > 0) return;
    stopTimer();
    STATE.timedOut = true;
    STATE.health = 0;
    STATE.stress = 100;
    STATE.water = 0;
    clampStats();
    updatePlantVisual(true);
    setReactionMessage(
      preventOrphans(CONTENT?.game?.messages?.timeOut || "Время вышло. Сезон завершён."),
      { alert: true, pulse: true, color: "#ffd86b" },
    );
    finishGame({ noBurst: true, timeout: true });
  }, 1000);
}

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("screen--active"));
  screens[name].classList.add("screen--active");
  if (screens.setup) {
    screens.setup.style.display = name === "game" ? "none" : "";
  }
}

function getMood() {
  if (STATE.health <= 8) return "dead";
  if (STATE.health < 22 || STATE.stress > 86) return "critical";
  if (STATE.heat > 83) return "overheat";
  if (STATE.water < 30) return "waterlow";
  if (STATE.stress > 62) return "stressed";
  if (STATE.health < 44) return "tired";
  return "healthy";
}

function moodLabel(mood) {
  return {
    healthy: "Здоровый",
    tired: "Уставший",
    stressed: "Стресс",
    waterlow: "Нехватка воды",
    overheat: "Перегрев",
    critical: "Критическое",
    dead: "Погиб",
  }[mood] || "Состояние";
}

function getStepEvents() {
  return STATE.variety === "giant" ? STEP_EVENTS_GIANT : STEP_EVENTS_LOVED;
}

function getTotalSteps() {
  return getStepEvents().length;
}

function preloadImages(urls) {
  return Promise.all(urls.map((url) => new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = url;
  })));
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function toDataUrlFromImageData(imageData, width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

function trimTransparentImageData(imageData, width, height, pad = 2, alphaThreshold = 16) {
  const d = imageData.data;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      if (d[i + 3] < alphaThreshold) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < 0 || maxY < 0) {
    return toDataUrlFromImageData(imageData, width, height);
  }

  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);

  const cw = maxX - minX + 1;
  const ch = maxY - minY + 1;
  const srcCanvas = document.createElement("canvas");
  srcCanvas.width = width;
  srcCanvas.height = height;
  const srcCtx = srcCanvas.getContext("2d");
  srcCtx.putImageData(imageData, 0, 0);

  const outCanvas = document.createElement("canvas");
  outCanvas.width = cw;
  outCanvas.height = ch;
  const outCtx = outCanvas.getContext("2d");
  outCtx.drawImage(srcCanvas, minX, minY, cw, ch, 0, 0, cw, ch);
  return outCanvas.toDataURL("image/png");
}

async function preparePlantFrame(url) {
  if (PREPARED.frames[url]) return PREPARED.frames[url];
  PREPARED.frames[url] = url;
  return url;
}

async function prepareFlyTomato(url) {
  if (PREPARED.ui.flyTomato) return PREPARED.ui.flyTomato;
  try {
    const img = await loadImage(url);
    const w = img.naturalWidth || 600;
    const h = img.naturalHeight || 600;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, w, h);
    const imageData = ctx.getImageData(0, 0, w, h);
    const d = imageData.data;
    let minX = w;
    let minY = h;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const i = (y * w + x) * 4;
        if (d[i + 3] < 20) continue;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }

    if (maxX < 0 || maxY < 0) {
      PREPARED.ui.flyTomato = url;
      return url;
    }

    const pad = 2;
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    maxX = Math.min(w - 1, maxX + pad);
    maxY = Math.min(h - 1, maxY + pad);
    const cw = maxX - minX + 1;
    const ch = maxY - minY + 1;
    const out = document.createElement("canvas");
    out.width = cw;
    out.height = ch;
    const outCtx = out.getContext("2d");
    outCtx.drawImage(canvas, minX, minY, cw, ch, 0, 0, cw, ch);
    const trimmed = out.toDataURL("image/png");
    PREPARED.ui.flyTomato = trimmed;
    return trimmed;
  } catch {
    PREPARED.ui.flyTomato = url;
    return url;
  }
}

async function prepareBasket(url) {
  if (PREPARED.ui.basket) return PREPARED.ui.basket;
  try {
    const img = await loadImage(url);
    const w = img.naturalWidth || 800;
    const h = img.naturalHeight || 800;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, w, h);
    const imageData = ctx.getImageData(0, 0, w, h);
    const d = imageData.data;
    let minX = w;
    let minY = h;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const i = (y * w + x) * 4;
        if (d[i + 3] < 16) continue;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }

    if (maxX < 0 || maxY < 0) {
      PREPARED.ui.basket = url;
      return url;
    }

    const pad = 2;
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    maxX = Math.min(w - 1, maxX + pad);
    maxY = Math.min(h - 1, maxY + pad);
    const cw = maxX - minX + 1;
    const ch = maxY - minY + 1;
    const out = document.createElement("canvas");
    out.width = cw;
    out.height = ch;
    const outCtx = out.getContext("2d");
    outCtx.drawImage(canvas, minX, minY, cw, ch, 0, 0, cw, ch);
    const trimmed = out.toDataURL("image/png");
    PREPARED.ui.basket = trimmed;
    return trimmed;
  } catch {
    PREPARED.ui.basket = url;
    return url;
  }
}

async function preloadVarietyAssets(variety) {
  if (!variety || STATE.preloaded[variety]) return;
  const urls = [...PLANT_FRAMES[variety], UI_ASSETS.basket, UI_ASSETS.flyTomato];
  await preloadImages(urls);
  await prepareFlyTomato(UI_ASSETS.flyTomato);
  await prepareBasket(UI_ASSETS.basket);
  STATE.preloaded[variety] = true;
}

function renderSetup() {
  nodes.varietyList.innerHTML = Object.entries(VARIETIES).map(([id, item]) => {
    const active = STATE.variety === id ? "chip--active" : "";
    return `<button class="chip ${active}" data-kind="variety" data-id="${id}">${item.name}<small>${item.desc}</small></button>`;
  }).join("");

  const scenarios = CONTENT?.setup?.scenarios || [
    { id: "greenhouse", name: "Теплица", desc: "Жара и духота" },
    { id: "ground", name: "Открытый грунт", desc: "Ветер и холод" },
  ];
  nodes.scenarioList.innerHTML = scenarios.map((item) => {
    const active = STATE.scenario === item.id ? "chip--active" : "";
    return `<button class="chip ${active}" data-kind="scenario" data-id="${item.id}">${item.name}<small>${item.desc}</small></button>`;
  }).join("");

  nodes.goGameBtn.disabled = !(STATE.variety && STATE.scenario);
}

function renderActions() {
  const stepEvent = getStepEvents()[STATE.step];
  nodes.quickActions.innerHTML = stepEvent.options.map((option, idx) => {
    const active = STATE.selectedActionId === idx ? "quick--active" : "";
    return `<button class="quick ${active}" data-action-id="${idx}">${option}</button>`;
  }).join("");
}

function renderStepContext() {
  const stepEvent = getStepEvents()[STATE.step];
  nodes.stateLine.textContent = preventOrphans(stepEvent.state);
  nodes.adviceLine.textContent = preventOrphans(`Совет: ${stepEvent.advice}`);
}

function calibrateSceneLayout() {
  const scene = nodes.scene;
  if (!scene) return;
  // Keep a single source of truth for geometry in CSS media rules.
  [
    "--plant-left",
    "--plant-shift",
    "--plant-width",
    "--plant-height",
    "--plant-bottom",
    "--plant-grow-w",
    "--plant-grow-h",
    "--basket-left",
    "--basket-width",
    "--basket-height",
    "--basket-bottom",
  ].forEach((name) => scene.style.removeProperty(name));
}

function collapseMobileBrowserBar() {
  if (!window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
  const run = () => {
    window.scrollTo(0, 1);
  };
  setTimeout(run, 60);
  setTimeout(run, 240);
  setTimeout(run, 520);
}

function isActionCorrect(stepEvent, selectedId) {
  if (Array.isArray(stepEvent.correct)) return stepEvent.correct.includes(selectedId);
  return selectedId === stepEvent.correct;
}

function getBasketSlot(index) {
  const desktopPile = [
    { x: 0.31, y: 0.56, s: 1.08, a: -8 },
    { x: 0.40, y: 0.53, s: 1.14, a: -4 },
    { x: 0.49, y: 0.51, s: 1.18, a: 0 },
    { x: 0.58, y: 0.53, s: 1.14, a: 4 },
    { x: 0.67, y: 0.56, s: 1.08, a: 8 },
    { x: 0.35, y: 0.46, s: 1.00, a: -7 },
    { x: 0.44, y: 0.42, s: 1.06, a: -3 },
    { x: 0.53, y: 0.41, s: 1.08, a: 2 },
    { x: 0.62, y: 0.44, s: 1.02, a: 6 },
    { x: 0.41, y: 0.35, s: 0.94, a: -5 },
    { x: 0.50, y: 0.32, s: 0.98, a: 0 },
    { x: 0.59, y: 0.35, s: 0.94, a: 5 },
  ];
  const mobilePile = [
    { x: 0.31, y: 0.58, s: 1.05, a: -8 },
    { x: 0.40, y: 0.55, s: 1.10, a: -4 },
    { x: 0.49, y: 0.54, s: 1.12, a: 0 },
    { x: 0.58, y: 0.55, s: 1.10, a: 4 },
    { x: 0.67, y: 0.58, s: 1.05, a: 8 },
    { x: 0.35, y: 0.50, s: 0.98, a: -7 },
    { x: 0.44, y: 0.47, s: 1.02, a: -3 },
    { x: 0.53, y: 0.46, s: 1.03, a: 2 },
    { x: 0.62, y: 0.49, s: 0.99, a: 6 },
    { x: 0.41, y: 0.42, s: 0.92, a: -5 },
    { x: 0.50, y: 0.40, s: 0.95, a: 0 },
    { x: 0.59, y: 0.42, s: 0.92, a: 5 },
  ];
  const isMobile = window.matchMedia("(max-width: 900px)").matches || window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const pile = isMobile ? mobilePile : desktopPile;
  const p = pile[index % pile.length];
  const w = nodes.liveBasket.clientWidth || 300;
  const h = nodes.liveBasket.clientHeight || 220;
  return {
    x: w * p.x,
    y: h * p.y,
    scale: p.s,
    angle: p.a,
    z: 80 + (index % pile.length),
  };
}

function addTomatoToBasket(index) {
  const basketTomato = document.createElement("span");
  basketTomato.className = "basket-tomato";
  const slot = getBasketSlot(index);
  basketTomato.style.left = `${slot.x}px`;
  basketTomato.style.top = `${slot.y}px`;
  basketTomato.style.zIndex = `${slot.z + Math.floor(index / 12)}`;
  basketTomato.style.transform = `translate(-50%, -50%) rotate(${slot.angle}deg) scale(${slot.scale})`;
  nodes.liveBasket.appendChild(basketTomato);
}

function updatePlantVisual(withReaction = false) {
  const prevMood = STATE.mood;
  const mood = getMood();
  STATE.mood = mood;
  const progress = STATE.step / Math.max(getTotalSteps() - 1, 1);
  const stage = clamp(Math.floor(progress * 6), 0, 6);
  nodes.plant.className = `plant stage-${stage} mood-${mood} variety-${STATE.variety || "loved"} fruiting use-sprite`;
  nodes.plant.style.setProperty("--growth", progress.toFixed(3));
  const variety = STATE.variety || "loved";
  const frames = PLANT_FRAMES[variety];
  const frameIndex = clamp(STATE.step, 0, frames.length - 1);
  if (nodes.plantSprite) {
    nodes.plantSprite.src = PREPARED.frames[frames[frameIndex]] || frames[frameIndex];
  }
  const isMobileLayout = window.matchMedia("(max-width: 900px)").matches || window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const spriteLiftDesktop = [14, 6, 5, 4, 5, 6, 5, 3, 10, 13, 12, 14];
  const spriteLiftMobile = [20, 19, 17, 20, 21, 22, 20, 9, 16, 19, 18, 14];
  let spriteLift = (isMobileLayout ? spriteLiftMobile : spriteLiftDesktop)[frameIndex] || 0;
  if (STATE.variety === "giant" && frameIndex >= 10) spriteLift -= 4;
  nodes.plant.style.setProperty("--sprite-lift", `${spriteLift}px`);
  nodes.stageTitle.textContent = STAGE_NAMES[stage];
  nodes.progressValue.textContent = `${Math.min(STATE.step + 1, getTotalSteps())}/${getTotalSteps()}`;
  nodes.stateLabel.textContent = moodLabel(mood);
  nodes.scene.classList.toggle("scene--greenhouse", STATE.scenario === "greenhouse");
  nodes.scene.classList.toggle("scene--ground", STATE.scenario === "ground");

  nodes.giantFruit.style.opacity = "0";

  if (withReaction && prevMood !== mood && mood !== "dead") {
    nodes.plant.classList.add("revive");
    setTimeout(() => nodes.plant.classList.remove("revive"), 400);
  }
}

function applyEnvironmentPressure() {
  if (STATE.scenario === "greenhouse") {
    STATE.heat += 5;
    STATE.water -= 4;
  } else {
    STATE.heat -= 2;
    STATE.water -= 2;
  }
}

function applyCorrectStep() {
  STATE.health += 4;
  STATE.stress -= 5;
  STATE.growth += 10;
  if (STATE.scenario === "greenhouse") STATE.heat -= 3;
}

function applyWrongStep() {
  STATE.health -= 5;
  STATE.stress += 6;
  STATE.growth += 3;
  if (STATE.scenario === "greenhouse") STATE.heat += 2;
}

function clampStats() {
  STATE.health = clamp(STATE.health);
  STATE.stress = clamp(STATE.stress);
  STATE.water = clamp(STATE.water);
  STATE.heat = clamp(STATE.heat);
  STATE.growth = clamp(STATE.growth);
}

function animateTomatoToBasket() {
  const plantRect = nodes.plant.getBoundingClientRect();
  const basketRect = nodes.liveBasket.getBoundingClientRect();
  const slot = getBasketSlot(Math.max(STATE.tomatoes - 1, 0));
  const tomato = document.createElement("span");
  tomato.className = "basket-tomato fly-tomato-dot";
  const tomatoW = 40;
  const tomatoH = 43;
  const tomatoHalfW = tomatoW / 2;
  const tomatoHalfH = tomatoH / 2;
  const startX = plantRect.left + (plantRect.width * 0.56) - tomatoHalfW;
  const startY = plantRect.top + (plantRect.height * 0.45) - tomatoHalfH;
  tomato.style.left = `${startX}px`;
  tomato.style.top = `${startY}px`;
  document.body.appendChild(tomato);

  requestAnimationFrame(() => {
    const targetX = basketRect.left + slot.x;
    const targetY = basketRect.top + slot.y;
    const dx = targetX - (startX + tomatoHalfW);
    const dy = targetY - (startY + tomatoHalfH);
    tomato.style.transform = `translate(${dx}px, ${dy}px) scale(0.95)`;
  });

  setTimeout(() => {
    tomato.remove();
    addTomatoToBasket(Math.max(STATE.tomatoes - 1, 0));
    nodes.liveBasket.classList.add("bounce");
    setTimeout(() => nodes.liveBasket.classList.remove("bounce"), 320);
  }, 1300);
}

function playStep() {
  if (STATE.selectedActionId === null) {
    setReactionMessage(
      preventOrphans(CONTENT?.game?.messages?.chooseFirst || "Сначала выбери 1 вариант."),
      { alert: false, pulse: true, color: "#c7ffd8" },
    );
    return;
  }

  applyEnvironmentPressure();
  const stepEvent = getStepEvents()[STATE.step];
  const correct = isActionCorrect(stepEvent, STATE.selectedActionId);

  if (correct) {
    applyCorrectStep();
    STATE.tomatoes += 1;
    nodes.liveCount.textContent = `🍅 ${STATE.tomatoes}`;
    animateTomatoToBasket();
    setReactionMessage(
      preventOrphans(CONTENT?.game?.messages?.goodMove || "Хороший ход"),
      { alert: false, pulse: true, color: "#1d6f41" },
    );
  } else {
    applyWrongStep();
    setReactionMessage(
      preventOrphans(CONTENT?.game?.messages?.borderline || "Пока терпимо, но на грани"),
      { alert: false, pulse: true, color: "#a53a36" },
    );
  }

  clampStats();
  updatePlantVisual(true);

  if (STATE.mood === "dead") return finishGame();

  STATE.step += 1;
  STATE.selectedActionId = null;
  if (STATE.step >= getTotalSteps()) return finishGame();

  renderStepContext();
  renderActions();
  updatePlantVisual(false);
}

function getArchetype() {
  const arch = CONTENT?.final?.archetypes || [];
  if (STATE.scenario === "greenhouse" && STATE.tomatoes >= 8) return arch[0] || { title: "Контролёр теплицы", phrase: "Ты держал сезон под контролем." };
  if (STATE.tomatoes >= 9) return arch[1] || { title: "Рисковый экспериментатор", phrase: "Смело играл и собрал щедрый урожай." };
  if (STATE.tomatoes >= 6) return arch[2] || { title: "Спокойный садовод", phrase: "Ровный подход дал хороший результат." };
  return arch[3] || { title: "Упрямый выживальщик", phrase: "Сезон был непростым, но ты дошёл до финала." };
}

function getFinalLevel() {
  const levels = CONTENT?.final?.levels || {};
  if (STATE.tomatoes <= 5) return levels.weak || "Слабый урожай";
  if (STATE.tomatoes <= 9) return levels.good || "Хороший урожай";
  return STATE.variety === "giant" ? (levels.topGiant || "Гигантский урожай!") : (levels.topLoved || "Супер-урожай!");
}

function finishGame(options = {}) {
  const { noBurst = false, timeout = false } = options;
  stopTimer();
  showScreen("game");
  const archetype = getArchetype();
  const level = getFinalLevel();
  const variety = VARIETIES[STATE.variety];
  const scenario = STATE.scenario === "greenhouse" ? "теплица" : "грунт";

  nodes.archType.textContent = archetype.title;
  const metaLead = (CONTENT?.final?.metaLead || "").trim();
  const metaBody = `${variety.name} • ${scenario} • 🍅 ${STATE.tomatoes}/${getTotalSteps()}`;
  nodes.storyMeta.textContent = preventOrphans(metaLead ? `${metaLead} ${metaBody}` : metaBody);
  if (timeout) {
    const lead = CONTENT?.final?.timeoutText || "Время вышло, куст завял. Итог";
    nodes.storyResult.textContent = preventOrphans(`${lead}: ${level}.`);
  } else {
    const lead = CONTENT?.final?.resultText || "Итог";
    nodes.storyResult.textContent = preventOrphans(`${archetype.phrase} ${lead}: ${level}.`);
  }

  STATE.finalText =
`Я прошёл(ла) "Выживи сезон с томатом" 🍅
Результат: ${archetype.title}
Сценарий: ${scenario}
Сорт: ${variety.name}
Урожай: ${level}
Попробуй тоже`;

  nodes.nextStepBtn.disabled = true;
  if (!timeout) {
    setReactionMessage(
      preventOrphans(CONTENT?.game?.messages?.seasonDone || "Сезон завершён. Отличная работа!"),
      { alert: false, pulse: true, color: "#c7ffd8" },
    );
  }
  setShareStatus("");
  if (nodes.seasonOverlay) nodes.seasonOverlay.classList.add("season-overlay--show");
  if (noBurst) {
    if (nodes.victoryBurst) nodes.victoryBurst.innerHTML = "";
  } else {
    playVictoryBurst(level);
  }
}

function playVictoryBurst(level) {
  if (!nodes.victoryBurst) return;
  nodes.victoryBurst.innerHTML = "";
  const isTop = level === "Супер-урожай!" || level === "Гигантский урожай!";
  const count = isTop ? 110 : level === "Хороший урожай" ? 78 : 48;

  // Короткий "взрыв" от центра экрана, чтобы финал ощущался наградой.
  const popCount = isTop ? 24 : level === "Хороший урожай" ? 16 : 10;
  for (let i = 0; i < popCount; i += 1) {
    const tomato = document.createElement("span");
    tomato.className = "victory-tomato victory-tomato--pop";
    tomato.style.left = "50%";
    tomato.style.top = "62%";
    const angle = (Math.PI * 2 * i) / popCount;
    const dist = 120 + Math.random() * 180;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist - 220;
    tomato.style.setProperty("--tx", `${tx}px`);
    tomato.style.setProperty("--ty", `${ty}px`);
    nodes.victoryBurst.appendChild(tomato);
  }

  // Затем массовый "дождь" томатов сверху.
  for (let i = 0; i < count; i += 1) {
    const tomato = document.createElement("span");
    tomato.className = "victory-tomato";
    tomato.style.left = `${Math.random() * 100}%`;
    tomato.style.top = `${-20 - Math.random() * 120}px`;
    tomato.style.animationDelay = `${Math.random() * 1.1}s`;
    tomato.style.setProperty("--drift-x", `${(Math.random() - .5) * 120}px`);
    nodes.victoryBurst.appendChild(tomato);
  }
}

async function startGame() {
  STATE.step = 0;
  STATE.health = 70;
  STATE.stress = 26;
  STATE.water = 55;
  STATE.heat = STATE.scenario === "greenhouse" ? 54 : 44;
  STATE.growth = 0;
  STATE.tomatoes = 0;
  STATE.timeLeft = Math.max(20, Math.min(600, Number(CONTENT?.game?.timerSeconds || 60)));
  STATE.timedOut = false;
  STATE.selectedActionId = null;
  STATE.mood = "healthy";
  await preloadVarietyAssets(STATE.variety);
  nodes.liveCount.textContent = "🍅 0";
  nodes.liveBasket.innerHTML = "";
  nodes.liveBasket.style.backgroundImage = `url("${PREPARED.ui.basket || UI_ASSETS.basket}")`;
  calibrateSceneLayout();
  nodes.nextStepBtn.disabled = false;
  if (nodes.seasonOverlay) nodes.seasonOverlay.classList.remove("season-overlay--show");
  if (nodes.victoryBurst) nodes.victoryBurst.innerHTML = "";
  setShareStatus("");

  showScreen("game");
  setReactionMessage(
    preventOrphans(CONTENT?.game?.messages?.chooseAction || "Выбери действие для этого этапа."),
    { alert: false, pulse: true, color: "#c7ffd8" },
  );
  renderTimer();
  startTimer();
  renderStepContext();
  renderActions();
  updatePlantVisual(false);
}

function openAdminPanel() {
  if (!nodes.adminPanel) return;
  nodes.adminPanel.classList.add("admin-panel--show");
}

function closeAdminPanel() {
  if (!nodes.adminPanel) return;
  nodes.adminPanel.classList.remove("admin-panel--show");
}

function unlockAdmin() {
  if (!nodes.adminLock || !nodes.adminEditorWrap) return;
  nodes.adminLock.style.display = "none";
  nodes.adminEditorWrap.classList.add("admin-editor-wrap--show");
}

function lockAdmin() {
  if (!nodes.adminLock || !nodes.adminEditorWrap) return;
  nodes.adminLock.style.display = "";
  nodes.adminEditorWrap.classList.remove("admin-editor-wrap--show");
}

function switchAdminSection(sectionId = "start") {
  const tabs = document.querySelectorAll("[data-admin-tab]");
  const sections = document.querySelectorAll("[data-admin-section]");
  tabs.forEach((btn) => {
    const active = btn.getAttribute("data-admin-tab") === sectionId;
    btn.classList.toggle("admin-tab--active", active);
  });
  sections.forEach((el) => {
    const active = el.getAttribute("data-admin-section") === sectionId;
    el.classList.toggle("admin-section--active", active);
  });
}

function initAdminOptionDnD() {
  if (!nodes.adminStepOptions) return;
  const rows = Array.from(nodes.adminStepOptions.querySelectorAll(".admin-option-row"));
  let dragIndex = null;

  const getInputByIndex = (idx) => document.getElementById(`admin-opt-${idx}`);

  const moveOptionValue = (from, to) => {
    if (from === to) return;
    const values = [0, 1, 2, 3].map((i) => getInputByIndex(i)?.value || "");
    const moved = values.splice(from, 1)[0];
    values.splice(to, 0, moved);
    values.forEach((v, i) => {
      const input = getInputByIndex(i);
      if (input) input.value = v;
    });
    readAdminFormToContent();
    setAdminUnsaved(true);
    scheduleAdminAutosave();
  };

  rows.forEach((row) => {
    row.addEventListener("dragstart", () => {
      dragIndex = Number(row.dataset.optIndex || -1);
      row.classList.add("dragging");
    });
    row.addEventListener("dragend", () => {
      row.classList.remove("dragging");
    });
    row.addEventListener("dragover", (event) => {
      event.preventDefault();
    });
    row.addEventListener("drop", (event) => {
      event.preventDefault();
      const dropIndex = Number(row.dataset.optIndex || -1);
      if (dragIndex < 0 || dropIndex < 0) return;
      moveOptionValue(dragIndex, dropIndex);
      dragIndex = null;
    });
  });
}

let ADMIN_CONTENT = null;

function getSelectedAdminStep() {
  const variety = nodes.adminVariety?.value || "loved";
  const index = Number(nodes.adminStep?.value || 0);
  const steps = ADMIN_CONTENT?.game?.steps?.[variety];
  if (!steps || !steps[index]) return null;
  return { variety, index, step: steps[index] };
}

function fillAdminStepSelect() {
  if (!nodes.adminStep || !ADMIN_CONTENT) return;
  const variety = nodes.adminVariety?.value || "loved";
  const steps = ADMIN_CONTENT.game.steps[variety] || [];
  nodes.adminStep.innerHTML = steps.map((_, idx) => `<option value="${idx}">Этап ${idx + 1}</option>`).join("");
  renderAdminStepTabs();
}

function renderAdminStepTabs() {
  if (!nodes.adminStepTabs || !nodes.adminStep) return;
  const current = Number(nodes.adminStep.value || 0);
  const total = nodes.adminStep.options?.length || 0;
  nodes.adminStepTabs.innerHTML = Array.from({ length: total }, (_, idx) => {
    const active = idx === current ? "admin-step-tab--active" : "";
    return `<button type="button" class="admin-step-tab ${active}" data-step-tab="${idx}">${idx + 1}</button>`;
  }).join("");
  nodes.adminStepTabs.querySelectorAll("[data-step-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-step-tab") || 0);
      nodes.adminStep.value = String(idx);
      fillAdminStepFields();
      renderAdminStepTabs();
    });
  });
}

function fillAdminStepFields() {
  const selected = getSelectedAdminStep();
  if (!selected) return;
  const { step } = selected;
  nodes.adminStepState.value = step.state || "";
  nodes.adminStepAdvice.value = step.advice || "";
  nodes.adminOpt0.value = step.options?.[0] || "";
  nodes.adminOpt1.value = step.options?.[1] || "";
  nodes.adminOpt2.value = step.options?.[2] || "";
  nodes.adminOpt3.value = step.options?.[3] || "";
  const correct = Array.isArray(step.correct) ? Number(step.correct[0] ?? 0) : Number(step.correct ?? 0);
  nodes.adminCorrect.value = String(Math.max(0, Math.min(3, correct)));
  renderAdminStepTabs();
}

function fillAdminGeneralFields() {
  if (!ADMIN_CONTENT) return;
  nodes.adminStartTitle.value = ADMIN_CONTENT.start.titleHtml || "";
  nodes.adminStartHint.value = ADMIN_CONTENT.start.hint || "";
  nodes.adminStartButton.value = ADMIN_CONTENT.start.startButton || "";
  nodes.adminRulesTitle.value = ADMIN_CONTENT.start.rulesTitle || "";
  nodes.adminRulesItem0.value = ADMIN_CONTENT.start.rulesItems?.[0] || "";
  nodes.adminRulesItem1.value = ADMIN_CONTENT.start.rulesItems?.[1] || "";
  nodes.adminRulesItem2.value = ADMIN_CONTENT.start.rulesItems?.[2] || "";
  nodes.adminRulesTip.value = ADMIN_CONTENT.start.tip || "";
  nodes.adminTimerSeconds.value = String(Number(ADMIN_CONTENT.game.timerSeconds || 60));
  nodes.adminMsgChoose.value = ADMIN_CONTENT.game.messages.chooseAction || "";
  nodes.adminMsgGood.value = ADMIN_CONTENT.game.messages.goodMove || "";
  nodes.adminMsgBad.value = ADMIN_CONTENT.game.messages.borderline || "";
  nodes.adminNextBtn.value = ADMIN_CONTENT.game.buttons.nextStep || "";
  nodes.adminFinalTitle.value = ADMIN_CONTENT.final.title || "";
  nodes.adminRestartBtn.value = ADMIN_CONTENT.final.restartButton || "";
  nodes.adminShareBtn.value = ADMIN_CONTENT.final.shareButton || "";
  nodes.adminFinalMetaTemplate.value = ADMIN_CONTENT.final.metaLead || "";
  const arches = ADMIN_CONTENT.final.archetypes || [];
  nodes.adminArch0Title.value = arches[0]?.title || "";
  nodes.adminArch0Phrase.value = arches[0]?.phrase || "";
  nodes.adminArch1Title.value = arches[1]?.title || "";
  nodes.adminArch1Phrase.value = arches[1]?.phrase || "";
  nodes.adminArch2Title.value = arches[2]?.title || "";
  nodes.adminArch2Phrase.value = arches[2]?.phrase || "";
  nodes.adminArch3Title.value = arches[3]?.title || "";
  nodes.adminArch3Phrase.value = arches[3]?.phrase || "";
  nodes.adminLevelWeak.value = ADMIN_CONTENT.final.levels?.weak || "";
  nodes.adminLevelGood.value = ADMIN_CONTENT.final.levels?.good || "";
  nodes.adminLevelTopLoved.value = ADMIN_CONTENT.final.levels?.topLoved || "";
  nodes.adminLevelTopGiant.value = ADMIN_CONTENT.final.levels?.topGiant || "";
  nodes.adminFinalResultTemplate.value = ADMIN_CONTENT.final.resultText || "Итог";
  nodes.adminFinalTimeoutTemplate.value = ADMIN_CONTENT.final.timeoutText || "Время вышло, куст завял. Итог";
}

function readAdminFormToContent() {
  if (!ADMIN_CONTENT) throw new Error("Контент не загружен.");
  ADMIN_CONTENT.start.titleHtml = nodes.adminStartTitle.value;
  ADMIN_CONTENT.start.hint = nodes.adminStartHint.value;
  ADMIN_CONTENT.start.startButton = nodes.adminStartButton.value;
  ADMIN_CONTENT.start.rulesTitle = nodes.adminRulesTitle.value;
  ADMIN_CONTENT.start.rulesItems = [
    nodes.adminRulesItem0.value,
    nodes.adminRulesItem1.value,
    nodes.adminRulesItem2.value,
  ];
  ADMIN_CONTENT.start.tip = nodes.adminRulesTip.value;
  ADMIN_CONTENT.game.timerSeconds = Math.max(20, Math.min(600, Number(nodes.adminTimerSeconds.value || 60)));
  ADMIN_CONTENT.game.messages.chooseAction = nodes.adminMsgChoose.value;
  ADMIN_CONTENT.game.messages.goodMove = nodes.adminMsgGood.value;
  ADMIN_CONTENT.game.messages.borderline = nodes.adminMsgBad.value;
  ADMIN_CONTENT.game.buttons.nextStep = nodes.adminNextBtn.value;
  ADMIN_CONTENT.final.title = nodes.adminFinalTitle.value;
  ADMIN_CONTENT.final.restartButton = nodes.adminRestartBtn.value;
  ADMIN_CONTENT.final.shareButton = nodes.adminShareBtn.value;
  ADMIN_CONTENT.final.metaLead = nodes.adminFinalMetaTemplate.value;
  ADMIN_CONTENT.final.archetypes = [
    { title: nodes.adminArch0Title.value, phrase: nodes.adminArch0Phrase.value },
    { title: nodes.adminArch1Title.value, phrase: nodes.adminArch1Phrase.value },
    { title: nodes.adminArch2Title.value, phrase: nodes.adminArch2Phrase.value },
    { title: nodes.adminArch3Title.value, phrase: nodes.adminArch3Phrase.value },
  ];
  ADMIN_CONTENT.final.levels = {
    weak: nodes.adminLevelWeak.value,
    good: nodes.adminLevelGood.value,
    topLoved: nodes.adminLevelTopLoved.value,
    topGiant: nodes.adminLevelTopGiant.value,
  };
  ADMIN_CONTENT.final.resultText = nodes.adminFinalResultTemplate.value;
  ADMIN_CONTENT.final.timeoutText = nodes.adminFinalTimeoutTemplate.value;

  const selected = getSelectedAdminStep();
  if (selected) {
    const { step } = selected;
    step.state = nodes.adminStepState.value;
    step.advice = nodes.adminStepAdvice.value;
    step.options = [nodes.adminOpt0.value, nodes.adminOpt1.value, nodes.adminOpt2.value, nodes.adminOpt3.value];
    step.correct = Number(nodes.adminCorrect.value || 0);
  }
}

function fillAdminEditorWithDraft(defaultContent) {
  ADMIN_CONTENT = getDraftContent(defaultContent);
  applyGitHubSettingsToForm();
  fillAdminGeneralFields();
  fillAdminStepSelect();
  fillAdminStepFields();
  switchAdminSection("start");
  setAdminUnsaved(false);
}

function validateAdminContentShape(content) {
  if (!content?.game?.steps?.loved || !content?.game?.steps?.giant) {
    throw new Error("Неверный формат JSON: отсутствуют этапы.");
  }
}

function saveDraftFromEditor(source = "manual") {
  try {
    readAdminFormToContent();
    localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(ADMIN_CONTENT));
    setAdminUnsaved(false);
    if (source === "autosave") {
      setAdminStatus("Черновик автосохранён.");
    } else {
      setAdminStatus("Черновик сохранён.");
    }
  } catch (error) {
    setAdminStatus(`Ошибка сохранения: ${error.message}`);
  }
}

function publishFromEditor() {
  try {
    readAdminFormToContent();
    localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(ADMIN_CONTENT));
    localStorage.setItem(STORAGE_PUBLISHED_KEY, JSON.stringify(ADMIN_CONTENT));
    setAdminUnsaved(false);
    applyContent(ADMIN_CONTENT);
    renderSetup();
    if (screens.game.classList.contains("screen--active")) {
      renderStepContext();
      renderActions();
      updatePlantVisual(false);
    }
    setAdminStatus("Опубликовано. Игра обновлена.");
  } catch (error) {
    setAdminStatus(`Ошибка публикации: ${error.message}`);
  }
}

function exportAdminJson() {
  try {
    readAdminFormToContent();
    const blob = new Blob([JSON.stringify(ADMIN_CONTENT, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tomato-content-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setAdminStatus("JSON экспортирован.");
  } catch (error) {
    setAdminStatus(`Ошибка экспорта: ${error.message}`);
  }
}

function importAdminJsonFromFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || ""));
      validateAdminContentShape(parsed);
      ADMIN_CONTENT = parsed;
      fillAdminGeneralFields();
      fillAdminStepSelect();
      fillAdminStepFields();
      setAdminUnsaved(false);
      setAdminStatus("JSON импортирован в формы.");
    } catch (error) {
      setAdminStatus(`Ошибка импорта: ${error.message}`);
    }
  };
  reader.readAsText(file, "utf-8");
}

function bindEvents() {
  nodes.startBtn.addEventListener("click", () => {
    if (screens.setup) {
      screens.setup.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  [nodes.varietyList, nodes.scenarioList].forEach((root) => {
    root.addEventListener("click", (event) => {
      const chip = event.target.closest(".chip");
      if (!chip) return;
      if (chip.dataset.kind === "variety") STATE.variety = chip.dataset.id;
      if (chip.dataset.kind === "scenario") STATE.scenario = chip.dataset.id;
      if (chip.dataset.kind === "variety") preloadVarietyAssets(STATE.variety);
      renderSetup();
    });
  });

  nodes.goGameBtn.addEventListener("click", startGame);

  nodes.quickActions.addEventListener("click", (event) => {
    const btn = event.target.closest(".quick");
    if (!btn) return;
    STATE.selectedActionId = Number(btn.dataset.actionId);
    renderActions();
  });

  nodes.nextStepBtn.addEventListener("click", playStep);

  if (nodes.shareBtn) {
    nodes.shareBtn.addEventListener("click", shareGame);
  }

  if (nodes.adminOpenBtn) {
    nodes.adminOpenBtn.addEventListener("click", () => {
      const defaults = buildDefaultContent();
      fillAdminEditorWithDraft(defaults);
      nodes.adminPassword.value = "";
      lockAdmin();
      setAdminStatus("");
      openAdminPanel();
    });
  }
  document.querySelectorAll("[data-admin-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchAdminSection(btn.getAttribute("data-admin-tab") || "start");
    });
  });
  if (nodes.adminCloseBtn) {
    nodes.adminCloseBtn.addEventListener("click", closeAdminPanel);
  }
  if (nodes.adminPanel) {
    nodes.adminPanel.addEventListener("click", (event) => {
      if (event.target === nodes.adminPanel) closeAdminPanel();
    });
  }
  if (nodes.adminLoginBtn) {
    nodes.adminLoginBtn.addEventListener("click", () => {
      if ((nodes.adminPassword.value || "") !== ADMIN_PASSWORD) {
        setAdminStatus("Неверный пароль.");
        return;
      }
      unlockAdmin();
      setAdminStatus("Доступ открыт.");
    });
  }
  if (nodes.adminSaveDraftBtn) nodes.adminSaveDraftBtn.addEventListener("click", saveDraftFromEditor);
  if (nodes.adminPublishBtn) nodes.adminPublishBtn.addEventListener("click", publishFromEditor);
  if (nodes.adminPublishGhBtn) nodes.adminPublishGhBtn.addEventListener("click", publishContentToGitHub);
  if (nodes.adminExportBtn) nodes.adminExportBtn.addEventListener("click", exportAdminJson);
  if (nodes.adminImportBtn && nodes.adminImportFile) {
    nodes.adminImportBtn.addEventListener("click", () => nodes.adminImportFile.click());
    nodes.adminImportFile.addEventListener("change", () => {
      const file = nodes.adminImportFile.files?.[0];
      if (file) importAdminJsonFromFile(file);
      nodes.adminImportFile.value = "";
    });
  }
  if (nodes.adminVariety) {
    nodes.adminVariety.addEventListener("change", () => {
      fillAdminStepSelect();
      fillAdminStepFields();
    });
  }
  if (nodes.adminStep) {
    nodes.adminStep.addEventListener("change", () => {
      fillAdminStepFields();
    });
  }
  if (nodes.adminPrevStepBtn && nodes.adminStep) {
    nodes.adminPrevStepBtn.addEventListener("click", () => {
      const current = Number(nodes.adminStep.value || 0);
      if (current <= 0) return;
      nodes.adminStep.value = String(current - 1);
      fillAdminStepFields();
    });
  }
  if (nodes.adminNextStepBtn && nodes.adminStep) {
    nodes.adminNextStepBtn.addEventListener("click", () => {
      const current = Number(nodes.adminStep.value || 0);
      const max = Math.max(0, (nodes.adminStep.options?.length || 1) - 1);
      if (current >= max) return;
      nodes.adminStep.value = String(current + 1);
      fillAdminStepFields();
    });
  }
  [nodes.adminStepState, nodes.adminStepAdvice, nodes.adminOpt0, nodes.adminOpt1, nodes.adminOpt2, nodes.adminOpt3, nodes.adminCorrect].forEach((el) => {
    if (!el) return;
    el.addEventListener("input", () => {
      readAdminFormToContent();
      setAdminUnsaved(true);
      scheduleAdminAutosave();
    });
    el.addEventListener("change", () => {
      readAdminFormToContent();
      setAdminUnsaved(true);
      scheduleAdminAutosave();
    });
  });
  [nodes.adminStartTitle, nodes.adminStartHint, nodes.adminStartButton, nodes.adminRulesTitle, nodes.adminRulesItem0, nodes.adminRulesItem1, nodes.adminRulesItem2, nodes.adminRulesTip, nodes.adminTimerSeconds, nodes.adminMsgChoose, nodes.adminMsgGood, nodes.adminMsgBad, nodes.adminNextBtn, nodes.adminRestartBtn, nodes.adminShareBtn, nodes.adminFinalTitle, nodes.adminFinalMetaTemplate, nodes.adminArch0Title, nodes.adminArch0Phrase, nodes.adminArch1Title, nodes.adminArch1Phrase, nodes.adminArch2Title, nodes.adminArch2Phrase, nodes.adminArch3Title, nodes.adminArch3Phrase, nodes.adminLevelWeak, nodes.adminLevelGood, nodes.adminLevelTopLoved, nodes.adminLevelTopGiant, nodes.adminFinalResultTemplate, nodes.adminFinalTimeoutTemplate].forEach((el) => {
    if (!el) return;
    el.addEventListener("input", () => {
      readAdminFormToContent();
      setAdminUnsaved(true);
      scheduleAdminAutosave();
    });
  });
  bindGitHubSettingsInputs();
  initAdminOptionDnD();

  nodes.restartBtn.addEventListener("click", () => {
    stopTimer();
    STATE.variety = null;
    STATE.scenario = null;
    nodes.liveBasket.innerHTML = "";
    if (nodes.victoryBurst) nodes.victoryBurst.innerHTML = "";
    if (nodes.seasonOverlay) nodes.seasonOverlay.classList.remove("season-overlay--show");
    setShareStatus("");
    setReactionMessage(
      preventOrphans(CONTENT?.game?.messages?.chooseAction || "Выбери действие для этого этапа."),
      { alert: false, pulse: false, color: "#c7ffd8" },
    );
    renderSetup();
    showScreen("start");
  });

  let resizeRaf = null;
  const onViewportChange = () => {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      calibrateSceneLayout();
    });
  };
  window.addEventListener("resize", onViewportChange, { passive: true });
  window.addEventListener("orientationchange", onViewportChange, { passive: true });
  window.addEventListener("load", collapseMobileBrowserBar, { passive: true });
}

function init() {
  const defaultContent = buildDefaultContent();
  loadStaticContent(defaultContent).then((staticContent) => {
    const publishedPatch = getPublishedPatch();
    const effectiveContent = publishedPatch ? deepMerge(staticContent, publishedPatch) : staticContent;
    applyContent(effectiveContent);
    renderSetup();
    renderTimer();
    calibrateSceneLayout();
    collapseMobileBrowserBar();
    bindEvents();
    showScreen("start");
  }).catch(() => {
    const published = loadPublishedContent(defaultContent);
    applyContent(published);
    renderSetup();
    renderTimer();
    calibrateSceneLayout();
    collapseMobileBrowserBar();
    bindEvents();
    showScreen("start");
  });
}

init();

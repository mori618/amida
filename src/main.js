/**
 * main.js - Amida Drop エントリーポイント（ステージ＋エンドレスモード対応版）
 */
import './style.css';
import { Game } from './game.js';
import { StageGame } from './stageGame.js';
import { STAGES } from './stages.js';
import { QuizGame } from './quizGame.js';
import { QUIZ_STAGES } from './quizStages.js';

// ===== localStorage 進捗管理 =====
const SAVE_KEY = 'amidaDrop_v2_progress';
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY) || '{}'); } catch { return {}; }
}
function saveStage(stageId, stars) {
  const p = loadProgress();
  if (!p[stageId] || p[stageId] < stars) {
    p[stageId] = stars;
    localStorage.setItem(SAVE_KEY, JSON.stringify(p));
  }
}

// クイズ専用の localStorage 進捗管理
const QUIZ_SAVE_KEY = 'amidaDrop_v2_quiz_progress';
function loadQuizProgress() {
  try { return JSON.parse(localStorage.getItem(QUIZ_SAVE_KEY) || '{}'); } catch { return {}; }
}
function saveQuizStage(stageId, stars) {
  const p = loadQuizProgress();
  if (!p[stageId] || p[stageId] < stars) {
    p[stageId] = stars;
    localStorage.setItem(QUIZ_SAVE_KEY, JSON.stringify(p));
  }
}

// ===== DOM 取得 =====
const titleScreen    = document.getElementById('title-screen');
const modeScreen     = document.getElementById('mode-screen');
const stageSelect    = document.getElementById('stage-select');
const gameUI         = document.getElementById('game-ui');
const gameOverScreen = document.getElementById('game-over-screen');
const stageClearScr  = document.getElementById('stage-clear-screen');
const stageInfoScr   = document.getElementById('stage-info-screen');
const pauseScreen    = document.getElementById('pause-screen');
const quizStageSelect = document.getElementById('quiz-stage-select');

const startBtn       = document.getElementById('start-btn');
const modeStageBtn   = document.getElementById('mode-stage-btn');
const modeEndlessBtn = document.getElementById('mode-endless-btn');
const stageBackBtn   = document.getElementById('stage-back-btn');
const stageGrid      = document.getElementById('stage-grid');

// 追加：未定義によるエラーを防ぐためのDOM要素宣言
const levelDisplay   = document.getElementById('level-display');
const gaugeBar       = document.getElementById('gauge-bar-inner');
const flashOverlay   = document.getElementById('flash-overlay');

const restartBtn     = document.getElementById('restart-btn');
const titleBtn       = document.getElementById('title-btn');

const clearStars     = document.getElementById('clear-stars');
const clearNextBtn   = document.getElementById('clear-next-btn');
const clearRetryBtn  = document.getElementById('clear-retry-btn');
const clearTitleBtn  = document.getElementById('clear-title-btn');

const pauseBtn       = document.getElementById('pause-btn');
const resumeBtn      = document.getElementById('resume-btn');
const pauseTitleBtn  = document.getElementById('pause-title-btn');

const stageInfoTitle = document.getElementById('stage-info-title');
const stageInfoDesc  = document.getElementById('stage-info-desc');
const stageInfoGoal  = document.getElementById('stage-info-goal');
const stageInfoMiss  = document.getElementById('stage-info-miss');
const stageInfoGimmick = document.getElementById('stage-info-gimmick');
const stageStartBtn  = document.getElementById('stage-start-btn');
const stageInfoBackBtn = document.getElementById('stage-info-back-btn');
const canvas         = document.getElementById('gameCanvas');

// ===== クイズ用のDOM取得 =====
const quizGameUI         = document.getElementById('quiz-game-ui');
const quizCanvas         = document.getElementById('quizCanvas');
const quizBackBtn        = document.getElementById('quiz-back-btn');
const quizFastForwardBtn = document.getElementById('quiz-fast-forward-btn');
const quizLevelDisplay   = document.getElementById('quiz-level-display');
const quizQuestionName   = document.getElementById('quiz-question-name');
const quizQuestionText   = document.getElementById('quiz-question-text');
const quizDecideBtn      = document.getElementById('quiz-decide-btn');
const quizChoiceContainer = document.getElementById('quiz-choice-container');
const quizChoiceBtns     = document.querySelectorAll('.quiz-choice-btn');

// クイズ結果画面のDOM取得
const quizResultScr      = document.getElementById('quiz-result-screen');
const quizResultTitle    = document.getElementById('quiz-result-title');
const quizResultMessage  = document.getElementById('quiz-result-message');
const quizNextBtn        = document.getElementById('quiz-next-btn');
const quizRetryBtn       = document.getElementById('quiz-retry-btn');
const quizTitleBtn       = document.getElementById('quiz-title-btn');
const modeQuizBtn        = document.getElementById('mode-quiz-btn');

// ===== Canvasリサイズ =====
function resizeCanvas() {
  const aspect = 360 / 640;
  
  // 通常ゲーム用のリサイズ
  const wrapper = document.getElementById('canvas-wrapper');
  if (wrapper && canvas) {
    const rect = wrapper.getBoundingClientRect();
    const avW = rect.width;
    const avH = rect.height;
    if (avW > 0 && avH > 0) {
      let w = avW;
      let h = w / aspect;
      if (h > avH) { h = avH; w = h * aspect; }
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
    }
  }

  // クイズ用のリサイズ
  const quizWrapper = document.getElementById('quiz-canvas-wrapper');
  if (quizWrapper && quizCanvas) {
    const rect = quizWrapper.getBoundingClientRect();
    const avW = rect.width;
    const avH = rect.height;
    if (avW > 0 && avH > 0) {
      let w = avW;
      let h = w / aspect;
      if (h > avH) { h = avH; w = h * aspect; }
      quizCanvas.style.width  = `${w}px`;
      quizCanvas.style.height = `${h}px`;
    }
  }
}
resizeCanvas();
// ページの読み込み完了直後や、少しディレイを設けて再度リサイズを実行し、親要素が完全に配置された後に正確なサイズに合わせる
window.addEventListener('load', () => setTimeout(resizeCanvas, 100));
window.addEventListener('resize', resizeCanvas);

// ===== 状態管理 =====
let currentMode    = 'endless'; // 'endless' | 'stage' | 'quiz'
let currentStageId = 1;
let currentQuizStageId = 1;
let comboTimer     = null;

// ===== ゲームインスタンス =====
const endlessGame = new Game(canvas);
const stageGame   = new StageGame(canvas);
const quizGame    = new QuizGame(quizCanvas);

// ===== ゲージ共通更新関数 =====
function updateGaugeBar(r, damage = 0) {
  if (!gaugeBar) return;
  gaugeBar.style.width = `${Math.floor(r * 100)}%`;
  // ダメージ数に応じてゲージ色を動的に変更
  if (damage === 0) {
    gaugeBar.style.backgroundColor = '#4ade80'; // 緑
  } else if (damage === 1) {
    gaugeBar.style.backgroundColor = '#fbbf24'; // 黄
  } else {
    gaugeBar.style.backgroundColor = '#ef4444'; // 赤
  }
}

// ===== 画面フラッシュ演出制御 =====
function triggerFlash(type) {
  if (!flashOverlay) return;
  flashOverlay.className = '';
  // リフローを発生させてアニメーションを最初から実行させる
  void flashOverlay.offsetWidth;
  if (type === 'target') {
    flashOverlay.classList.add('flash-green');
  } else if (type === 'danger') {
    flashOverlay.classList.add('flash-red');
  }
}

// ===== エンドレスモード コールバック =====
endlessGame.onLevelChange = (l) => { if (levelDisplay) levelDisplay.textContent = `LV ${l}`; };
endlessGame.onGaugeChange = (r) => {
  updateGaugeBar(r, endlessGame.dangerDamage);
};
endlessGame.onGoalEffect = (type) => {
  triggerFlash(type);
};
endlessGame.onGameOver = () => {
  gameOverScreen.style.display = 'flex';
};

// ===== ステージモード コールバック =====
stageGame.onGaugeChange = (r) => {
  updateGaugeBar(r, stageGame.dangerDamage);
};
stageGame.onGoalEffect = (type) => {
  triggerFlash(type);
};
stageGame.onStageClear  = (stars) => {
  showStageClear(stars);
};
stageGame.onStageOver   = () => {
  gameOverScreen.style.display = 'flex';
};

// ===== UI 表示関数 =====
function hideAll() {
  [
    titleScreen, modeScreen, stageSelect, gameUI, gameOverScreen, 
    stageClearScr, stageInfoScr, pauseScreen, quizGameUI, quizResultScr,
    quizStageSelect
  ].forEach(el => { if (el) el.style.display = 'none'; });
}

function showQuiz(stageId) {
  const stage = QUIZ_STAGES.find(s => s.id === stageId);
  if (!stage) return;
  currentQuizStageId = stageId;

  // HUDやテキストの設定
  if (quizLevelDisplay) quizLevelDisplay.textContent = `QUIZ ${stage.id} / ${QUIZ_STAGES.length}`;
  if (quizQuestionName) quizQuestionName.textContent = stage.name;
  if (quizQuestionText) quizQuestionText.textContent = stage.description;

  // 選択ボタンの初期化と、choicesデータに基づくラベルの動的設定
  if (quizChoiceBtns) {
    quizChoiceBtns.forEach(btn => {
      btn.classList.remove('active');
      const choice = btn.dataset.choice;
      if (stage.choices && stage.choices[choice]) {
        btn.textContent = `${choice}: ${stage.choices[choice]}`;
      } else {
        btn.textContent = choice;
      }
    });
  }
  if (quizDecideBtn) quizDecideBtn.style.display = 'none';

  // 早送りトグルボタンのアクティブ状態を同期
  if (quizFastForwardBtn) {
    if (quizGame.isFastForwardToggled) {
      quizFastForwardBtn.classList.add('active');
    } else {
      quizFastForwardBtn.classList.remove('active');
    }
  }

  // UIを表示してゲームを初期化
  hideAll();
  if (quizGameUI) quizGameUI.style.display = 'flex';
  
  // QuizGame の読み込み
  quizGame.loadQuiz(stage);
}

function showTitle() {
  hideAll();
  titleScreen.style.display = 'flex';
}
function showModeSelect() {
  hideAll();
  modeScreen.style.display = 'flex';
}
function showStageSelect() {
  hideAll();
  buildStageGrid();
  stageSelect.style.display = 'flex';
}
function showQuizStageSelect() {
  hideAll();
  buildQuizStageGrid();
  if (quizStageSelect) {
    quizStageSelect.style.display = 'flex';
  }
}
function showStageInfo(stage) {
  currentStageId = stage.id;
  stageInfoTitle.textContent  = `STAGE ${stage.id}: ${stage.name}`;
  stageInfoDesc.textContent   = stage.description;
  stageInfoGoal.textContent   = `クリア条件: ゲージをMAXまで貯める`;
  stageInfoMiss.textContent   = `罰ゴール(✕)に入るとダメージを受けます`;
  const g = stage.gimmicks.length > 0 ? stage.gimmicks.join(', ') : 'なし';
  stageInfoGimmick.textContent = `ギミック: ${g}`;
  hideAll();
  stageInfoScr.style.display = 'flex';
}
function showGame() {
  hideAll();
  gameUI.style.display = 'flex';
}
function showStageClear(stars) {
  hideAll();
  // 星表示
  clearStars.innerHTML = '';
  for (let i = 1; i <= 3; i++) {
    const s = document.createElement('span');
    s.className = 'clear-star ' + (i <= stars ? 'filled' : 'empty');
    s.textContent = '★';
    clearStars.appendChild(s);
  }
  // 進捗保存
  saveStage(currentStageId, stars);
  // 次ステージボタン
  const nextId = currentStageId + 1;
  if (nextId <= 200) {
    clearNextBtn.style.display = 'block';
    clearNextBtn.dataset.nextId = nextId;
  } else {
    clearNextBtn.style.display = 'none';
  }
  stageClearScr.style.display = 'flex';
}

// ===== ステージグリッド構築 =====
function buildStageGrid() {
  const progress = loadProgress();
  stageGrid.innerHTML = '';
  for (const stage of STAGES) {
    const stars = progress[stage.id] || 0;
    const btn = document.createElement('button');
    btn.className = 'stage-cell';
    btn.dataset.id = stage.id;

    // 番号
    const numEl = document.createElement('div');
    numEl.className = 'stage-num';
    numEl.textContent = stage.id;

    // 星（クリア済みは金色、未クリアは薄い木椰色）
    const starsEl = document.createElement('div');
    starsEl.className = 'stage-stars';
    if (stars > 0) {
      // クリア済み：金の実星 + 灰色の空星
      const filled = '<span style="color:#f0c040;">★</span>'.repeat(stars);
      const empty  = '<span style="color:rgba(180,140,80,0.4);">☆</span>'.repeat(3 - stars);
      starsEl.innerHTML = filled + empty;
      btn.classList.add('cleared');
    } else {
      // 未クリア：薄い未クリア星
      starsEl.innerHTML = '<span style="color:rgba(160,110,60,0.45);">☆☆☆</span>';
    }

    btn.appendChild(numEl);
    btn.appendChild(starsEl);
    btn.addEventListener('click', () => showStageInfo(stage));
    stageGrid.appendChild(btn);
  }
}

// ===== クイズステージグリッド構築 =====
function buildQuizStageGrid() {
  const progress = loadQuizProgress();
  const quizStageGrid = document.getElementById('quiz-stage-grid');
  if (!quizStageGrid) return;
  quizStageGrid.innerHTML = '';
  for (const stage of QUIZ_STAGES) {
    const stars = progress[stage.id] || 0;
    const btn = document.createElement('button');
    btn.className = 'stage-cell';
    btn.dataset.id = stage.id;

    // 番号
    const numEl = document.createElement('div');
    numEl.className = 'stage-num';
    numEl.textContent = stage.id;

    // 星
    const starsEl = document.createElement('div');
    starsEl.className = 'stage-stars';
    if (stars > 0) {
      const filled = '<span style="color:#f0c040;">★</span>'.repeat(stars);
      const empty  = '<span style="color:rgba(180,140,80,0.4);">☆</span>'.repeat(3 - stars);
      starsEl.innerHTML = filled + empty;
      btn.classList.add('cleared');
    } else {
      starsEl.innerHTML = '<span style="color:rgba(160,110,60,0.45);">☆☆☆</span>';
    }

    btn.appendChild(numEl);
    btn.appendChild(starsEl);
    btn.addEventListener('click', () => showQuiz(stage.id));
    quizStageGrid.appendChild(btn);
  }
}

// ===== ゲームUI表示設定（モード別） =====
function setupHudForMode(mode) {
  const gaugeRow = document.getElementById('hud-gauge-row');
  if (gaugeRow) gaugeRow.style.display = 'flex';
  if (levelDisplay) {
    levelDisplay.textContent = mode === 'stage' ? `STAGE ${currentStageId}` : `LV 1`;
  }
}

// ===== ボタンイベント =====
startBtn.addEventListener('click', showModeSelect);
modeStageBtn.addEventListener('click', () => { currentMode = 'stage'; showStageSelect(); });
modeEndlessBtn.addEventListener('click', () => {
  currentMode = 'endless';
  setupHudForMode('endless');
  showGame();
  endlessGame.start();
});
stageBackBtn.addEventListener('click', showModeSelect);
stageInfoBackBtn.addEventListener('click', showStageSelect);

stageStartBtn.addEventListener('click', () => {
  const stage = STAGES.find(s => s.id === currentStageId);
  if (!stage) return;
  setupHudForMode('stage');
  showGame();
  stageGame.startStage(stage);
});

restartBtn.addEventListener('click', () => {
  gameOverScreen.style.display = 'none';
  if (currentMode === 'stage') {
    const stage = STAGES.find(s => s.id === currentStageId);
    if (stage) { setupHudForMode('stage'); showGame(); stageGame.startStage(stage); }
  } else {
    setupHudForMode('endless');
    showGame();
    endlessGame.restart();
  }
});

titleBtn.addEventListener('click', () => {
  endlessGame.stop();
  stageGame.stop();
  quizGame.stop();
  showTitle();
});

clearNextBtn.addEventListener('click', () => {
  const nextId = parseInt(clearNextBtn.dataset.nextId);
  const stage = STAGES.find(s => s.id === nextId);
  if (stage) { currentStageId = nextId; showStageInfo(stage); }
});
clearRetryBtn.addEventListener('click', () => {
  const stage = STAGES.find(s => s.id === currentStageId);
  if (stage) { setupHudForMode('stage'); showGame(); stageGame.startStage(stage); }
});
clearTitleBtn.addEventListener('click', () => {
  endlessGame.stop();
  stageGame.stop();
  quizGame.stop();
  showTitle();
});

// ===== ポーズ機能 =====
let isPaused = false;
function togglePause() {
  if (gameOverScreen.style.display === 'flex' || stageClearScr.style.display === 'flex' || titleScreen.style.display === 'flex') return;
  isPaused = !isPaused;
  if (currentMode === 'stage') {
    stageGame.setPause(isPaused);
  } else {
    endlessGame.setPause(isPaused);
  }
  pauseScreen.style.display = isPaused ? 'flex' : 'none';
}

pauseBtn.addEventListener('click', togglePause);
resumeBtn.addEventListener('click', togglePause);
pauseTitleBtn.addEventListener('click', () => {
  endlessGame.stop();
  stageGame.stop();
  quizGame.stop();
  isPaused = false;
  pauseScreen.style.display = 'none';
  showTitle();
});

// ===== クイズモード イベント =====
if (modeQuizBtn) {
  modeQuizBtn.addEventListener('click', () => {
    currentMode = 'quiz';
    showQuizStageSelect();
  });
}

if (quizBackBtn) {
  quizBackBtn.addEventListener('click', () => {
    quizGame.stop();
    showQuizStageSelect();
  });
}

// 早送りトグルボタンのクリックイベント
if (quizFastForwardBtn) {
  quizFastForwardBtn.addEventListener('click', () => {
    quizGame.isFastForwardToggled = !quizGame.isFastForwardToggled;
    quizGame.isFastForward = quizGame.isFastForwardToggled;
    
    if (quizGame.isFastForwardToggled) {
      quizFastForwardBtn.classList.add('active');
    } else {
      quizFastForwardBtn.classList.remove('active');
    }
    
    // 静止状態でもインジケータを即時表示・非表示にする
    quizGame._draw();
  });
}

// クイズステージ選択画面の戻るボタン
const quizStageBackBtn = document.getElementById('quiz-stage-back-btn');
if (quizStageBackBtn) {
  quizStageBackBtn.addEventListener('click', showModeSelect);
}

// クイズ結果画面のタイトルへボタン
const quizTitleBtnActual = document.getElementById('quiz-title-btn');
if (quizTitleBtnActual) {
  quizTitleBtnActual.addEventListener('click', () => {
    quizGame.stop();
    showTitle();
  });
}

// A, B, C の選択肢ボタン押下時
if (quizChoiceBtns) {
  quizChoiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (quizGame.isRunning || quizGame.hasFinished) return;
      
      quizChoiceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const choice = btn.dataset.choice;
      quizGame.selectChoice(choice);
      
      if (quizDecideBtn) {
        quizDecideBtn.style.display = 'block';
      }
    });
  });
}

// 「決定」ボタン押下時
if (quizDecideBtn) {
  quizDecideBtn.addEventListener('click', () => {
    if (quizGame.isRunning || quizGame.hasFinished) return;
    
    quizDecideBtn.style.display = 'none';
    
    quizGame.runBall((success) => {
      hideAll();
      if (quizResultScr) quizResultScr.style.display = 'flex';
      
      if (success) {
        // 進捗を保存（星3つ）
        saveQuizStage(currentQuizStageId, 3);

        if (quizResultTitle) {
          quizResultTitle.textContent = '正解！';
          quizResultTitle.style.color = '#4ade80';
        }
        if (quizResultMessage) {
          quizResultMessage.textContent = '素晴らしい！予測が見事に的中しました！';
        }
        
        const nextId = currentQuizStageId + 1;
        const nextStage = QUIZ_STAGES.find(s => s.id === nextId);
        if (quizNextBtn) {
          quizNextBtn.style.display = 'block';
          if (nextStage) {
            quizNextBtn.textContent = '次のステージへ';
          } else {
            quizNextBtn.textContent = '全問クリア！選択画面へ';
          }
        }
        if (quizRetryBtn) quizRetryBtn.style.display = 'none';
      } else {
        if (quizResultTitle) {
          quizResultTitle.textContent = '不正解...';
          quizResultTitle.style.color = '#ef4444';
        }
        if (quizResultMessage) {
          quizResultMessage.textContent = '違うゴールに入ってしまいました。もう一度考え直してみましょう！';
        }
        if (quizNextBtn) quizNextBtn.style.display = 'none';
        if (quizRetryBtn) quizRetryBtn.style.display = 'block';
      }
    });
  });
}

// 結果画面「次のステージへ」
if (quizNextBtn) {
  quizNextBtn.addEventListener('click', () => {
    const nextId = currentQuizStageId + 1;
    const nextStage = QUIZ_STAGES.find(s => s.id === nextId);
    if (nextStage) {
      showQuiz(nextId);
    } else {
      quizGame.stop();
      showQuizStageSelect();
    }
  });
}

// 結果画面「リトライ」
if (quizRetryBtn) {
  quizRetryBtn.addEventListener('click', () => {
    showQuiz(currentQuizStageId);
  });
}

// ===== 初期表示 =====
showTitle();

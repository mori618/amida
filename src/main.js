/**
 * main.js - Amida Drop エントリーポイント
 * 画面遷移・UIの制御を担当
 */
import './style.css';
import { Game } from './game.js';

// ===== DOM要素の取得 =====
const titleScreen    = document.getElementById('title-screen');
const gameUI         = document.getElementById('game-ui');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn       = document.getElementById('start-btn');
const restartBtn     = document.getElementById('restart-btn');
const titleBtn       = document.getElementById('title-btn');
const scoreDisplay   = document.getElementById('score-display');
const livesDisplay   = document.getElementById('lives-display');
const comboDisplay   = document.getElementById('combo-display');
const finalScore     = document.getElementById('final-score');
const finalCombo     = document.getElementById('final-combo');
const canvas         = document.getElementById('gameCanvas');

const MAX_LIVES = 3;

// ===== Canvasサイズの調整 =====
function resizeCanvas() {
  const maxH = window.innerHeight - 80; // HUD分を引く
  const maxW = window.innerWidth;
  const aspect = 400 / 600;
  let w = Math.min(maxW, maxH * aspect);
  let h = w / aspect;

  // 最大サイズ制限
  if (h > maxH) {
    h = maxH;
    w = h * aspect;
  }

  canvas.style.width  = `${Math.floor(w)}px`;
  canvas.style.height = `${Math.floor(h)}px`;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ===== ライフハート表示 =====
function renderLives(lives) {
  livesDisplay.innerHTML = '';
  for (let i = 0; i < MAX_LIVES; i++) {
    const span = document.createElement('span');
    span.className = `life-heart${i >= lives ? ' lost' : ''}`;
    span.textContent = '❤️';
    livesDisplay.appendChild(span);
  }
}

// ===== コンボ表示 =====
let comboTimer = null;
function renderCombo(combo) {
  if (combo > 1) {
    comboDisplay.textContent = `COMBO x${combo}`;
    comboDisplay.style.opacity = '1';
    comboDisplay.style.transform = 'scale(1.2)';
    setTimeout(() => {
      comboDisplay.style.transform = 'scale(1)';
    }, 150);

    // 一定時間で非表示
    clearTimeout(comboTimer);
    comboTimer = setTimeout(() => {
      comboDisplay.style.opacity = '0';
    }, 2000);
  } else {
    comboDisplay.style.opacity = '0';
    clearTimeout(comboTimer);
  }
}

// ===== スコア表示 =====
function renderScore(score) {
  scoreDisplay.textContent = score;
  scoreDisplay.style.transform = 'scale(1.3)';
  setTimeout(() => {
    scoreDisplay.style.transform = 'scale(1)';
  }, 100);
}

// ===== ゲームインスタンス生成 =====
const game = new Game(canvas);

game.onScoreChange = (score) => renderScore(score);
game.onLivesChange = (lives) => renderLives(lives);
game.onComboChange = (combo) => renderCombo(combo);
game.onGameOver   = (score, maxCombo) => {
  finalScore.textContent  = score;
  finalCombo.textContent  = maxCombo;
  gameOverScreen.style.display = 'flex';
};

// ===== 画面遷移 =====
function showTitle() {
  titleScreen.style.display    = 'flex';
  gameUI.style.display         = 'none';
  gameOverScreen.style.display = 'none';
}

function showGame() {
  titleScreen.style.display    = 'none';
  gameUI.style.display         = 'flex';
  gameOverScreen.style.display = 'none';

  // 初期UI
  renderScore(0);
  renderLives(MAX_LIVES);
  renderCombo(0);
}

// ===== ボタンイベント =====
startBtn.addEventListener('click', () => {
  showGame();
  game.start();
});

restartBtn.addEventListener('click', () => {
  gameOverScreen.style.display = 'none';
  renderScore(0);
  renderLives(MAX_LIVES);
  renderCombo(0);
  game.restart();
});

titleBtn.addEventListener('click', () => {
  showTitle();
});

// ===== 初期状態 =====
showTitle();

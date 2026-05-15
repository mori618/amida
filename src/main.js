/**
 * main.js - Amida Drop エントリーポイント（スマホ前提版）
 */
import './style.css';
import { Game } from './game.js';

const titleScreen    = document.getElementById('title-screen');
const gameUI         = document.getElementById('game-ui');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn       = document.getElementById('start-btn');
const restartBtn     = document.getElementById('restart-btn');
const titleBtn       = document.getElementById('title-btn');
const scoreDisplay   = document.getElementById('score-display');
const comboDisplay   = document.getElementById('combo-display');
const levelDisplay   = document.getElementById('level-display');
const finalScore     = document.getElementById('final-score');
const finalCombo     = document.getElementById('final-combo');
const canvas         = document.getElementById('gameCanvas');




// ===== Canvasサイズ：スマホ縦画面に最適化 =====
function resizeCanvas() {
  const hudH = 64; // HUDの高さ
  const avH = window.innerHeight - hudH;
  const avW = window.innerWidth;
  const aspect = 360 / 640; // キャンバスの縦横比

  let w = avW;
  let h = w / aspect;
  if (h > avH) { h = avH; w = h * aspect; }

  canvas.style.width  = `${Math.floor(w)}px`;
  canvas.style.height = `${Math.floor(h)}px`;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);


// ===== コンボ表示 =====
let comboTimer = null;
function renderCombo(combo) {
  if (combo > 1) {
    comboDisplay.textContent = `COMBO ×${combo}`;
    comboDisplay.style.opacity = '1';
    comboDisplay.style.transform = 'scale(1.2)';
    setTimeout(() => { comboDisplay.style.transform = 'scale(1)'; }, 150);
    clearTimeout(comboTimer);
    comboTimer = setTimeout(() => { comboDisplay.style.opacity = '0'; }, 2200);
  } else {
    comboDisplay.style.opacity = '0';
    clearTimeout(comboTimer);
  }
}

// ===== スコア表示 =====
function renderScore(score) {
  scoreDisplay.textContent = score.toLocaleString();
  scoreDisplay.style.transform = 'scale(1.25)';
  setTimeout(() => { scoreDisplay.style.transform = 'scale(1)'; }, 100);
}

// ===== レベル表示 =====
function renderLevel(level) {
  if (levelDisplay) levelDisplay.textContent = `LV ${level + 1}`;
}

// ===== ゲームインスタンス =====
const game = new Game(canvas);
game.onScoreChange = renderScore;
game.onComboChange = renderCombo;
game.onLevelChange = renderLevel;
game.onGameOver = (score, maxCombo) => {
  finalScore.textContent = score.toLocaleString();
  finalCombo.textContent = maxCombo;
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
  renderScore(0);
  renderCombo(0);
  renderLevel(0);
}

startBtn.addEventListener('click', () => { showGame(); game.start(); });
restartBtn.addEventListener('click', () => {
  gameOverScreen.style.display = 'none';
  renderScore(0); renderCombo(0); renderLevel(0);
  game.restart();
});
titleBtn.addEventListener('click', showTitle);

showTitle();

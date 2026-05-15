/**
 * game.js - Amida Drop ゲームロジック
 * Canvas描画・物理・入力処理・スコア管理を担当
 */

// ===== ゲーム定数 =====
const CANVAS_W = 400;
const CANVAS_H = 600;
const LANE_COUNT = 5;
const LANE_W = CANVAS_W / LANE_COUNT;
const GOAL_H = 70;          // ゴールエリアの高さ
const PLAY_H = CANVAS_H - GOAL_H; // プレイエリアの高さ

const MIN_LINE_Y_GAP = 40;  // 横線の縦方向の最小間隔
const LINE_HIT_TOL = 30;    // 横線削除のタッチ許容範囲

// ゴール設定（5レーン）
const GOALS = [
  { type: 'danger', color: '#f87171', label: '✕', score: 0 },  // レーン0: 危険
  { type: 'safe',   color: '#94a3b8', label: '△', score: 20 }, // レーン1: 安全
  { type: 'target', color: '#4ade80', label: '★', score: 150 }, // レーン2: 大当たり
  { type: 'safe',   color: '#94a3b8', label: '△', score: 20 }, // レーン3: 安全
  { type: 'danger', color: '#f87171', label: '✕', score: 0 },  // レーン4: 危険
];

const MAX_LIVES = 3;

let lineIdCounter = 0; // 横線の一意ID

// ===== ユーティリティ =====

/** レーンインデックスからX中央座標を返す */
function laneX(index) {
  return index * LANE_W + LANE_W / 2;
}

// ===== Particle クラス =====
class Particle {
  constructor(x, y, color, options = {}) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * (options.spread || 8);
    this.vy = (Math.random() - 0.5) * (options.spread || 8) - (options.upward || 0);
    this.life = 1.0;
    this.decay = 0.02 + Math.random() * 0.03;
    this.color = color;
    this.size = Math.random() * (options.maxSize || 4) + 2;
    this.gravity = options.gravity || 0.1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= 0.98;
    this.life -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ===== HorizontalLine クラス =====
class HorizontalLine {
  constructor(leftLaneIndex, y) {
    this.id = lineIdCounter++;
    this.leftLaneIndex = leftLaneIndex;
    this.y = y;
    this.alpha = 0; // フェードイン用
  }

  update() {
    // フェードイン
    if (this.alpha < 1) {
      this.alpha = Math.min(1, this.alpha + 0.1);
    }
  }

  draw(ctx) {
    const startX = laneX(this.leftLaneIndex);
    const endX = laneX(this.leftLaneIndex + 1);

    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.moveTo(startX, this.y);
    ctx.lineTo(endX, this.y);
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 12;
    ctx.shadowColor = 'rgba(34, 211, 238, 0.9)';
    ctx.stroke();
    ctx.restore();
  }
}

// ===== Item クラス =====
class Item {
  constructor(laneIndex, speed) {
    this.currentLane = laneIndex;
    this.x = laneX(laneIndex);
    this.y = -20;
    this.speed = speed;
    this.radius = 13;
    this.state = 'falling'; // 'falling' | 'crossing'
    this.targetLane = null;
    this.targetX = null;
    this.crossedLineIds = new Set(); // 往復バグ防止
    this.pulse = 0; // 光るアニメ
    this.trailPoints = []; // 軌跡
  }

  update() {
    this.pulse += 0.1;
    // 軌跡を記録
    this.trailPoints.push({ x: this.x, y: this.y });
    if (this.trailPoints.length > 6) {
      this.trailPoints.shift();
    }

    if (this.state === 'falling') {
      const nextY = this.y + this.speed;

      // 横線との衝突判定
      let crossedLine = null;
      for (const line of this._lines) {
        if (this.crossedLineIds.has(line.id)) continue;
        const isRelevant =
          line.leftLaneIndex === this.currentLane ||
          line.leftLaneIndex === this.currentLane - 1;

        if (isRelevant && this.y <= line.y && nextY >= line.y) {
          crossedLine = line;
          break;
        }
      }

      if (crossedLine) {
        this.y = crossedLine.y;
        this.state = 'crossing';
        this.crossedLineIds.add(crossedLine.id);
        if (crossedLine.leftLaneIndex === this.currentLane) {
          this.targetLane = this.currentLane + 1; // 右へ
        } else {
          this.targetLane = this.currentLane - 1; // 左へ
        }
        this.targetX = laneX(this.targetLane);
      } else {
        this.y = nextY;
      }
    } else if (this.state === 'crossing') {
      const crossSpeed = this.speed * 2.5;
      const dir = this.targetLane > this.currentLane ? 1 : -1;
      this.x += crossSpeed * dir;

      if ((dir === 1 && this.x >= this.targetX) || (dir === -1 && this.x <= this.targetX)) {
        this.x = this.targetX;
        this.currentLane = this.targetLane;
        this.state = 'falling';
      }
    }
  }

  /** 横線への参照を設定（ゲームループから注入する） */
  setLines(lines) {
    this._lines = lines;
  }

  draw(ctx) {
    // 軌跡の描画
    for (let i = 0; i < this.trailPoints.length; i++) {
      const pt = this.trailPoints[i];
      const alpha = (i / this.trailPoints.length) * 0.3;
      const r = this.radius * (i / this.trailPoints.length) * 0.7;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
      ctx.fillStyle = '#facc15';
      ctx.fill();
      ctx.restore();
    }

    // 外枠グロー
    const glowSize = 3 + Math.sin(this.pulse) * 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + glowSize, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(250, 204, 21, 0.15)';
    ctx.fill();
    ctx.restore();

    // ボール本体
    const grad = ctx.createRadialGradient(
      this.x - 3, this.y - 3, 1,
      this.x, this.y, this.radius
    );
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(1, '#ca8a04');

    ctx.save();
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#facc15';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

    // ハイライト
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x - 4, this.y - 4, this.radius * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fill();
    ctx.restore();
  }
}

// ===== GameState =====
export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // コールバック（外部から設定）
    this.onScoreChange = null;
    this.onLivesChange = null;
    this.onComboChange = null;
    this.onGameOver = null;

    this._boundHandleInput = this._handleInput.bind(this);
    this._bindEvents();
    this._initState();
  }

  // ===== 初期化 =====
  _initState() {
    this.score = 0;
    this.lives = MAX_LIVES;
    this.combo = 0;
    this.maxCombo = 0;
    this.isOver = false;
    this.timeElapsed = 0;
    this.speedMult = 1.0;
    this.spawnInterval = 2800;
    this.lastSpawnTime = Date.now();

    this.lines = [];
    this.items = [];
    this.particles = [];

    this._rafId = null;
    this._lastTime = null;
  }

  start() {
    this._initState();
    this.lastSpawnTime = Date.now();
    this._lastTime = performance.now();
    this._tick(this._lastTime);
  }

  restart() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this.start();
  }

  // ===== イベント =====
  _bindEvents() {
    this.canvas.addEventListener('mousedown', this._boundHandleInput);
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this._handleInput(e);
    }, { passive: false });
  }

  _handleInput(event) {
    if (this.isOver) return;

    const rect = this.canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;

    let clientX, clientY;
    if (event.type === 'touchstart') {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    // 有効範囲チェック（上部・ゴールエリアは除外）
    if (y < 50 || y > PLAY_H - 20) return;

    const leftLaneIndex = Math.floor(x / LANE_W);
    if (leftLaneIndex < 0 || leftLaneIndex >= LANE_COUNT - 1) return;

    // 既存の線をトグル削除
    const existIdx = this.lines.findIndex(
      (l) => l.leftLaneIndex === leftLaneIndex && Math.abs(l.y - y) < LINE_HIT_TOL
    );

    if (existIdx !== -1) {
      this.lines.splice(existIdx, 1);
      this._burst(x, y, '#94a3b8', 8);
      return;
    }

    // あみだくじ破綻防止：近くに線があれば引けない
    const canDraw = this.lines.every((l) => {
      const nearLane = Math.abs(l.leftLaneIndex - leftLaneIndex) <= 1;
      const nearY = Math.abs(l.y - y) < MIN_LINE_Y_GAP;
      return !(nearLane && nearY);
    });

    if (canDraw) {
      this.lines.push(new HorizontalLine(leftLaneIndex, y));
      this._burst(x, y, '#22d3ee', 5);
    }
  }

  // ===== ゲームループ =====
  _tick(currentTime) {
    if (this.isOver) return;

    const delta = this._lastTime ? currentTime - this._lastTime : 16;
    this._lastTime = currentTime;

    this._update(delta);
    this._draw();

    this._rafId = requestAnimationFrame(this._tick.bind(this));
  }

  _update(delta) {
    const now = Date.now();
    this.timeElapsed += delta;

    // 難易度スケーリング（15秒ごと）
    const level = Math.floor(this.timeElapsed / 15000);
    this.speedMult = 1 + level * 0.18;
    this.spawnInterval = Math.max(900, 2800 - level * 200);

    // アイテム生成
    if (now - this.lastSpawnTime > this.spawnInterval) {
      const lane = Math.floor(Math.random() * LANE_COUNT);
      const speed = 1.3 * this.speedMult;
      const item = new Item(lane, speed);
      item.setLines(this.lines);
      this.items.push(item);
      this.lastSpawnTime = now;
    }

    // 横線更新（フェードイン）
    this.lines.forEach((l) => l.update());

    // アイテム更新・ゴール判定
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.setLines(this.lines); // 最新の線配列を注入
      item.update();

      if (item.y > PLAY_H) {
        const goal = GOALS[item.currentLane];
        this._judgeGoal(item, goal);
        this.items.splice(i, 1);
      }
    }

    // パーティクル更新
    this.particles.forEach((p) => p.update());
    this.particles = this.particles.filter((p) => p.life > 0);
  }

  _judgeGoal(item, goal) {
    if (goal.type === 'target') {
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      const comboBonus = Math.floor(this.combo * 0.5);
      this.score += goal.score + comboBonus;
      this._burst(item.x, item.y, goal.color, 25, { spread: 10, upward: 3, maxSize: 6 });
      this.onScoreChange?.(this.score);
      this.onComboChange?.(this.combo);
    } else if (goal.type === 'danger') {
      this.combo = 0;
      this._loseLife(item.x, item.y);
      this.onComboChange?.(0);
    } else {
      // safe
      this.combo = Math.max(0, this.combo - 1);
      this.score += goal.score;
      this._burst(item.x, item.y, '#ffffff', 10);
      this.onScoreChange?.(this.score);
      this.onComboChange?.(this.combo);
    }
  }

  _loseLife(x, y) {
    this.lives--;
    this._burst(x, y, '#f87171', 20, { spread: 12 });
    this.onLivesChange?.(this.lives);

    // 画面シェイク
    this.canvas.classList.add('shake');
    setTimeout(() => this.canvas.classList.remove('shake'), 400);

    if (this.lives <= 0) {
      this._endGame();
    }
  }

  _endGame() {
    this.isOver = true;
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this.onGameOver?.(this.score, this.maxCombo);
  }

  // ===== 描画 =====
  _draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    this._drawBackground(ctx);
    this._drawLanes(ctx);
    this._drawGoals(ctx);
    this.lines.forEach((l) => l.draw(ctx));
    this.items.forEach((it) => it.draw(ctx));
    this.particles.forEach((p) => p.draw(ctx));
  }

  _drawBackground(ctx) {
    // グリッド風背景
    ctx.save();
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
    ctx.lineWidth = 0.5;
    const step = 40;
    for (let y = 0; y < PLAY_H; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_W, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  _drawLanes(ctx) {
    ctx.save();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    for (let i = 0; i < LANE_COUNT; i++) {
      const x = laneX(i);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, PLAY_H);
      ctx.stroke();
    }
    ctx.restore();
  }

  _drawGoals(ctx) {
    for (let i = 0; i < LANE_COUNT; i++) {
      const gx = i * LANE_W;
      const gy = PLAY_H;
      const goal = GOALS[i];

      // 背景
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(gx, gy, LANE_W, GOAL_H);

      // 上部カラーバー
      const barGrad = ctx.createLinearGradient(gx, gy, gx + LANE_W, gy);
      barGrad.addColorStop(0, goal.color);
      barGrad.addColorStop(1, goal.color + '88');
      ctx.fillStyle = barGrad;
      ctx.fillRect(gx, gy, LANE_W, 5);

      // ゴール内側グロー
      if (goal.type !== 'safe') {
        const glowGrad = ctx.createLinearGradient(gx, gy, gx, gy + GOAL_H);
        glowGrad.addColorStop(0, goal.color + '20');
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(gx, gy, LANE_W, GOAL_H);
      }

      // ラベル
      ctx.save();
      ctx.fillStyle = goal.color;
      ctx.font = `bold 22px 'Inter', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = goal.type !== 'safe' ? 10 : 0;
      ctx.shadowColor = goal.color;
      ctx.fillText(goal.label, gx + LANE_W / 2, gy + GOAL_H / 2);
      ctx.restore();

      // スコア表示
      if (goal.score > 0) {
        ctx.save();
        ctx.fillStyle = goal.color + 'aa';
        ctx.font = `600 10px 'Inter', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`+${goal.score}`, gx + LANE_W / 2, gy + GOAL_H - 4);
        ctx.restore();
      }

      // セパレータ
      ctx.save();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx, gy + GOAL_H);
      ctx.stroke();
      ctx.restore();
    }
  }

  // ===== パーティクルヘルパー =====
  _burst(x, y, color, count = 15, options = {}) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color, options));
    }
  }
}

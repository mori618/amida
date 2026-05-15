/**
 * game.js - Amida Drop ゲームロジック（拡張版）
 * 新機能（ゲージシステム含む）:
 *  - Lv1を易しく（低速・長間隔）
 *  - ★ゴール位置が一定時間でランダム移動
 *  - レベルアップでシステム自動横線（紫色）が増える
 *  - スコア加算線（金）・スコア減算線（赤紫）がランダム出現
 *  - スマホ前提デザイン
 */

// ===== 定数 =====
const CANVAS_W = 360;
const CANVAS_H = 640;
const LANE_COUNT = 5;
const LANE_W = CANVAS_W / LANE_COUNT;
const GOAL_H = 75;
const PLAY_H = CANVAS_H - GOAL_H;

const MIN_LINE_Y_GAP = 45;
const LINE_HIT_TOL = 36; // スマホ用に広め

// ゴール種別（動的に変わるためGoalsは配列で管理）
const GOAL_DEFS = {
  target:  { color: '#4ade80', label: '★', score: 150, glow: true },
  safe:    { color: '#94a3b8', label: '△', score: 20,  glow: false },
  danger:  { color: '#f87171', label: '✕', score: 0,   glow: true },
};

// 特殊横線の種別
const SPECIAL_LINE = {
  bonus:   { color: '#fbbf24', glowColor: 'rgba(251,191,36,0.9)',  label: '+50',  scoreDelta: +50 },
  penalty: { color: '#c084fc', glowColor: 'rgba(192,132,252,0.9)', label: '-30',  scoreDelta: -30 },
};

// ===== カラーボール設定（Lv3以降）=====
const BALL_COLORS = [
  { id: 'red',    ball: '#f87171', ballDark: '#991b1b', glow: '#f87171' },
  { id: 'blue',   ball: '#60a5fa', ballDark: '#1e3a8a', glow: '#60a5fa' },
  { id: 'green',  ball: '#4ade80', ballDark: '#166534', glow: '#4ade80' },
  { id: 'purple', ball: '#c084fc', ballDark: '#581c87', glow: '#c084fc' },
];
// Lv3以降に登場するカラーゴールの定義（2色同時に出現）
const COLOR_GOAL_COUNT = 2; // 最大2つのカラーゴール

// ライフ機能は廃止。ゲームオーバーはゲージ0のみ。
let lineIdCounter = 0;

function laneX(i) { return i * LANE_W + LANE_W / 2; }
function rand(a, b) { return a + Math.random() * (b - a); }
function randInt(a, b) { return Math.floor(rand(a, b + 1)); }

// ===== Particle =====
class Particle {
  constructor(x, y, color, opts = {}) {
    this.x = x; this.y = y;
    this.vx = (Math.random() - 0.5) * (opts.spread || 8);
    this.vy = (Math.random() - 0.5) * (opts.spread || 8) - (opts.upward || 0);
    this.life = 1.0;
    this.decay = 0.022 + Math.random() * 0.03;
    this.color = color;
    this.size = Math.random() * (opts.maxSize || 4) + 2;
    this.gravity = opts.gravity || 0.12;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.vy += this.gravity; this.vx *= 0.97;
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

// ===== FloatingText（スコア表示） =====
class FloatingText {
  constructor(x, y, text, color) {
    this.x = x; this.y = y;
    this.text = text; this.color = color;
    this.life = 1.0; this.vy = -1.8;
  }
  update() { this.y += this.vy; this.life -= 0.025; }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 8; ctx.shadowColor = this.color;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

// ===== HorizontalLine（ユーザー線） =====
class HorizontalLine {
  constructor(leftLaneIndex, y) {
    this.id = lineIdCounter++;
    this.leftLaneIndex = leftLaneIndex;
    this.y = y;
    this.alpha = 0;
    this.kind = 'user'; // 'user' | 'system' | 'bonus' | 'penalty'
    this.scoreDelta = 0;
    this.pulse = 0;
  }
  setKind(kind) {
    this.kind = kind;
    if (kind === 'bonus')   this.scoreDelta = SPECIAL_LINE.bonus.scoreDelta;
    if (kind === 'penalty') this.scoreDelta = SPECIAL_LINE.penalty.scoreDelta;
  }
  update() {
    if (this.alpha < 1) this.alpha = Math.min(1, this.alpha + 0.08);
    this.pulse += 0.12;
  }
  get _style() {
    switch (this.kind) {
      case 'system':  return { color: '#a78bfa', glow: 'rgba(167,139,250,0.8)', w: 4 };
      case 'bonus':   return { color: '#fbbf24', glow: 'rgba(251,191,36,0.9)',  w: 5 };
      case 'penalty': return { color: '#c084fc', glow: 'rgba(192,132,252,0.9)', w: 5 };
      default:        return { color: '#22d3ee', glow: 'rgba(34,211,238,0.9)',  w: 5 };
    }
  }
  draw(ctx) {
    const sx = laneX(this.leftLaneIndex);
    const ex = laneX(this.leftLaneIndex + 1);
    const st = this._style;
    const glow = (this.kind === 'bonus' || this.kind === 'penalty')
      ? 10 + Math.sin(this.pulse) * 4 : 10;

    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.moveTo(sx, this.y); ctx.lineTo(ex, this.y);
    ctx.strokeStyle = st.color;
    ctx.lineWidth = st.w;
    ctx.lineCap = 'round';
    ctx.shadowBlur = glow; ctx.shadowColor = st.glow;
    ctx.stroke();

    // 特殊線にラベル表示
    if (this.kind === 'bonus' || this.kind === 'penalty') {
      const def = this.kind === 'bonus' ? SPECIAL_LINE.bonus : SPECIAL_LINE.penalty;
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillStyle = st.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.shadowBlur = 6; ctx.shadowColor = st.color;
      ctx.fillText(def.label, (sx + ex) / 2, this.y - 3);
    }
    ctx.restore();
  }
}

// ===== Item（落下ボール） =====
class Item {
  constructor(laneIndex, speed) {
    this.currentLane = laneIndex;
    this.x = laneX(laneIndex);
    this.y = -20;
    this.speed = speed;
    this.radius = 14;
    this.state = 'falling';
    this.targetLane = null; this.targetX = null;
    this.crossedLineIds = new Set();
    this.pulse = Math.random() * Math.PI * 2;
    this.trail = [];
    this._lines = [];
  }
  setLines(lines) { this._lines = lines; }
  update() {
    this.pulse += 0.1;
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 7) this.trail.shift();

    if (this.state === 'falling') {
      const ny = this.y + this.speed;
      let hit = null;
      for (const l of this._lines) {
        if (this.crossedLineIds.has(l.id)) continue;
        const rel = l.leftLaneIndex === this.currentLane || l.leftLaneIndex === this.currentLane - 1;
        if (rel && this.y <= l.y && ny >= l.y) { hit = l; break; }
      }
      if (hit) {
        this.y = hit.y;
        this.state = 'crossing';
        this.crossedLineIds.add(hit.id);
        this.targetLane = hit.leftLaneIndex === this.currentLane
          ? this.currentLane + 1 : this.currentLane - 1;
        this.targetX = laneX(this.targetLane);
        // 特殊線の効果を返す
        this.lastHitLine = hit;
      } else {
        this.y = ny;
      }
    } else {
      const cs = this.speed * 2.5;
      const d = this.targetLane > this.currentLane ? 1 : -1;
      this.x += cs * d;
      if ((d === 1 && this.x >= this.targetX) || (d === -1 && this.x <= this.targetX)) {
        this.x = this.targetX;
        this.currentLane = this.targetLane;
        this.state = 'falling';
      }
    }
  }
  draw(ctx) {
    let bc = null;
    if (this.ballColorId) {
      bc = BALL_COLORS.find(c => c.id === this.ballColorId);
    }
    
    const baseColor = bc ? bc.ball : '#facc15';
    const darkColor = bc ? bc.ballDark : '#b45309';
    const glowColor = bc ? bc.glow : '#facc15';
    const trailColor = bc ? bc.ball : '#facc15';
    const auraColor = bc ? bc.glow : 'rgba(250,204,21,0.12)';

    // 軌跡
    for (let i = 0; i < this.trail.length; i++) {
      const p = this.trail[i];
      const a = (i / this.trail.length) * 0.25;
      const r = this.radius * (i / this.trail.length) * 0.6;
      ctx.save(); ctx.globalAlpha = a;
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = trailColor; ctx.fill(); ctx.restore();
    }
    // グロー
    const gs = 4 + Math.sin(this.pulse) * 2;
    ctx.save();
    ctx.beginPath(); ctx.arc(this.x, this.y, this.radius + gs, 0, Math.PI * 2);
    ctx.fillStyle = auraColor; 
    // Alpha調整
    ctx.globalAlpha = 0.15;
    ctx.fill(); ctx.restore();
    
    // 本体
    const g = ctx.createRadialGradient(this.x - 3, this.y - 3, 1, this.x, this.y, this.radius);
    g.addColorStop(0, '#fef08a'); // ハイライトは共通で白っぽく
    g.addColorStop(0.3, baseColor);
    g.addColorStop(1, darkColor);
    
    ctx.save();
    ctx.shadowBlur = 20; ctx.shadowColor = glowColor;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill(); ctx.restore();
    
    // ハイライト
    ctx.save();
    ctx.beginPath(); ctx.arc(this.x - 4, this.y - 4, this.radius * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill(); ctx.restore();
  }
}

// ===== Game クラス =====
export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onScoreChange = null;
    this.onComboChange = null;
    this.onLevelChange = null;
    this.onGaugeChange = null;
    this.onGameOver = null;
    this._bound = this._handleInput.bind(this);
    this._bindEvents();
    this._initState();
  }

  _initState() {
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.isOver = false;
    this.timeElapsed = 0;
    this.level = 0;
    this.speedMult = 1.0;
    this.spawnInterval = 3500;
    this.lastSpawnTime = Date.now();
    this.lastGoalRotateTime = Date.now();
    this.goalRotateInterval = 12000;
    this.lastSpecialLineTime = Date.now();
    this.specialLineInterval = 8000;

    // ===== ゲージ =====
    this.gauge = 100;          // 0〜100
    this.gaugeMax = 100;
    // 1秒ごとに減る量（レベルで加速）
    this.gaugeDrainPerSec = 2.5;

    // ゴール配置（動的）: 各レーンの種別
    this.goalTypes = ['danger', 'safe', 'target', 'safe', 'danger'];
    // カラーゴール: { laneIndex, colorId } の配列（Lv3以降）
    this.colorGoals = [];          // 例: [{laneIndex:1, colorId:'red'}, {laneIndex:3, colorId:'blue'}]
    this.lastColorGoalRotate = Date.now();
    this.colorGoalRotateInterval = 10000; // 10秒で色変更

    this.lines = [];      // 全横線（ユーザー＋システム）
    this.items = [];
    this.particles = [];
    this.floatingTexts = [];

    this._rafId = null;
    this._lastTime = null;
  }

  _bindEvents() {
    this.canvas.addEventListener('mousedown', this._bound);
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault(); this._handleInput(e);
    }, { passive: false });
  }

  // ===== ゴールローテーション =====
  _rotateGoal() {
    // 現在のtarget位置を探す
    const cur = this.goalTypes.indexOf('target');
    // 新しい位置（現在と異なるランダム）
    let next;
    do { next = randInt(0, LANE_COUNT - 1); } while (next === cur);
    this.goalTypes[cur] = this.goalTypes[next] === 'danger' ? 'danger' : 'safe';
    this.goalTypes[next] = 'target';
    // アニメ用パーティクル
    this._burst(laneX(next), PLAY_H - 10, '#4ade80', 20, { spread: 8, upward: 2 });
  }

  // ===== システム横線の追加 =====
  _addSystemLine() {
    // レベルに応じて最大本数制限
    const systemLines = this.lines.filter(l => l.kind === 'system');
    const maxSystem = Math.min(this.level, 4);
    if (systemLines.length >= maxSystem) {
      // 古い1本を消す
      const idx = this.lines.findIndex(l => l.kind === 'system');
      if (idx !== -1) this.lines.splice(idx, 1);
    }
    this._placeRandomLine('system');
  }

  // ===== 特殊横線（bonus/penalty）の追加 =====
  _addSpecialLine() {
    // 既存の特殊線を1本消す
    const sp = this.lines.findIndex(l => l.kind === 'bonus' || l.kind === 'penalty');
    if (sp !== -1) this.lines.splice(sp, 1);
    const kind = Math.random() < 0.5 ? 'bonus' : 'penalty';
    this._placeRandomLine(kind);
  }

  _placeRandomLine(kind) {
    // 重ならない位置を探す
    let attempts = 0;
    while (attempts < 20) {
      const li = randInt(0, LANE_COUNT - 2);
      const y = rand(80, PLAY_H - 60);
      const ok = this.lines.every(l => {
        const nearLane = Math.abs(l.leftLaneIndex - li) <= 1;
        const nearY = Math.abs(l.y - y) < MIN_LINE_Y_GAP;
        return !(nearLane && nearY);
      });
      if (ok) {
        const line = new HorizontalLine(li, y);
        line.setKind(kind);
        this.lines.push(line);
        return;
      }
      attempts++;
    }
  }

  // ===== 入力処理 =====
  _handleInput(event) {
    if (this.isOver) return;
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    let cx, cy;
    if (event.type === 'touchstart') {
      cx = event.touches[0].clientX; cy = event.touches[0].clientY;
    } else {
      cx = event.clientX; cy = event.clientY;
    }
    const x = (cx - rect.left) * scaleX;
    const y = (cy - rect.top) * scaleY;
    if (y < 50 || y > PLAY_H - 20) return;
    const li = Math.floor(x / LANE_W);
    if (li < 0 || li >= LANE_COUNT - 1) return;

    // ユーザー線のみ削除可能
    const existIdx = this.lines.findIndex(
      l => l.kind === 'user' && l.leftLaneIndex === li && Math.abs(l.y - y) < LINE_HIT_TOL
    );
    if (existIdx !== -1) {
      this.lines.splice(existIdx, 1);
      this._burst(x, y, '#94a3b8', 8);
      return;
    }
    // 近くに線がないかチェック
    const ok = this.lines.every(l => {
      const nearLane = Math.abs(l.leftLaneIndex - li) <= 1;
      const nearY = Math.abs(l.y - y) < MIN_LINE_Y_GAP;
      return !(nearLane && nearY);
    });
    if (ok) {
      const line = new HorizontalLine(li, y);
      // kindはデフォルト'user'
      this.lines.push(line);
      this._burst(x, y, '#22d3ee', 5);
    }
  }

  // ===== ゲームループ =====
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

  _tick(t) {
    if (this.isOver) return;
    const delta = this._lastTime ? t - this._lastTime : 16;
    this._lastTime = t;
    this._update(delta);
    this._draw();
    this._rafId = requestAnimationFrame(this._tick.bind(this));
  }

  _update(delta) {
    const now = Date.now();
    this.timeElapsed += delta;

    // レベル計算（20秒ごと）
    const newLevel = Math.floor(this.timeElapsed / 20000);
    if (newLevel !== this.level) {
      this.level = newLevel;
      this.onLevelChange?.(this.level);
      // レベル1以上でシステム線追加
      if (this.level >= 1) this._addSystemLine();
      // Lv3でカラーゴール初期化
      if (this.level === 3) this._initColorGoals();
    }

    // 難易度パラメータ
    this.speedMult = 0.7 + this.level * 0.25;
    this.spawnInterval = Math.max(1000, 3500 - this.level * 300);
    // ゲージ：時間経過で減少（レベルが上がるほど速く減る）
    this.gaugeDrainPerSec = 2.5 + this.level * 0.5;
    this.gauge -= (this.gaugeDrainPerSec / 1000) * delta;
    this.gauge = Math.max(0, Math.min(this.gaugeMax, this.gauge));
    this.onGaugeChange?.(this.gauge / this.gaugeMax);
    if (this.gauge <= 0 && !this.isOver) {
      this.isOver = true;
      if (this._rafId) cancelAnimationFrame(this._rafId);
      this.onGameOver?.(this.score, this.maxCombo);
      return;
    }

    // ゴール位置のローテーション
    if (now - this.lastGoalRotateTime > this.goalRotateInterval) {
      this._rotateGoal();
      this.lastGoalRotateTime = now;
    }

    // 特殊横線の追加（Lv0から発生、ただし少なめ）
    const spInterval = Math.max(5000, this.specialLineInterval - this.level * 1000);
    if (now - this.lastSpecialLineTime > spInterval) {
      this._addSpecialLine();
      this.lastSpecialLineTime = now;
    }

    // カラーゴール更新（Lv3以降）
    if (this.level >= 3 && now - this.lastColorGoalRotate > this.colorGoalRotateInterval) {
      this._rotateColorGoals();
      this.lastColorGoalRotate = now;
    }

    // アイテム生成
    if (now - this.lastSpawnTime > this.spawnInterval) {
      const lane = randInt(0, LANE_COUNT - 1);
      const item = new Item(lane, this.speedMult);
      // Lv3以降: 一定確率でカラーボール生成
      if (this.level >= 3 && this.colorGoals.length > 0 && Math.random() < 0.45) {
        // colorGoalsの中からランダムに選んで対応ボールを生成
        const cg = this.colorGoals[randInt(0, this.colorGoals.length - 1)];
        item.ballColorId = cg.colorId;
      }
      item.setLines(this.lines);
      this.items.push(item);
      this.lastSpawnTime = now;
    }

    // 横線更新
    this.lines.forEach(l => l.update());

    // アイテム更新
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.setLines(this.lines);
      item.update();

      // 特殊線を通過したとき
      if (item.lastHitLine) {
        const hl = item.lastHitLine;
        item.lastHitLine = null;
        if (hl.kind === 'bonus') {
          this.score = Math.max(0, this.score + hl.scoreDelta);
          this.gauge = Math.min(this.gaugeMax, this.gauge + 8); // ゲージ回復
          this.floatingTexts.push(new FloatingText(item.x, item.y - 20, `+${hl.scoreDelta}`, '#fbbf24'));
          this.onScoreChange?.(this.score);
        } else if (hl.kind === 'penalty') {
          this.score = Math.max(0, this.score + hl.scoreDelta);
          this.gauge = Math.max(0, this.gauge - 10); // ゲージ減少
          this.floatingTexts.push(new FloatingText(item.x, item.y - 20, `${hl.scoreDelta}`, '#c084fc'));
          this.onScoreChange?.(this.score);
        }
      }

      if (item.y > PLAY_H) {
        this._judgeGoal(item);
        this.items.splice(i, 1);
      }
    }

    // パーティクル・テキスト更新
    this.particles.forEach(p => p.update());
    this.particles = this.particles.filter(p => p.life > 0);
    this.floatingTexts.forEach(t => t.update());
    this.floatingTexts = this.floatingTexts.filter(t => t.life > 0);
  }

  _judgeGoal(item) {
    const type = this.goalTypes[item.currentLane];
    const def = GOAL_DEFS[type];

    // ===== カラーボール判定 =====
    if (item.ballColorId) {
      const matchGoal = this.colorGoals.find(
        cg => cg.laneIndex === item.currentLane && cg.colorId === item.ballColorId
      );
      const bc = BALL_COLORS.find(c => c.id === item.ballColorId);
      if (matchGoal) {
        // 正解！大量スコア＋ゲージ回復
        this.combo++;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;
        const gained = 300 + Math.floor(this.combo * 15);
        this.score += gained;
        this.gauge = Math.min(this.gaugeMax, this.gauge + 25);
        this._burst(item.x, item.y, bc.glow, 35, { spread: 12, upward: 4, maxSize: 8 });
        this.floatingTexts.push(new FloatingText(item.x, item.y - 30, `PERFECT! +${gained}`, bc.ball));
        this.onScoreChange?.(this.score);
        this.onComboChange?.(this.combo);
        return;
      } else {
        // 不正解：ゲージ大幅減
        this.combo = 0;
        this.gauge = Math.max(0, this.gauge - 25);
        this._burst(item.x, item.y, '#f87171', 20, { spread: 12 });
        this.floatingTexts.push(new FloatingText(item.x, item.y - 30, 'WRONG!', '#f87171'));
        this.canvas.classList.add('shake');
        setTimeout(() => this.canvas.classList.remove('shake'), 400);
        this.onComboChange?.(0);
        return;
      }
    }

    if (type === 'target') {
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      const bonus = Math.floor(this.combo * 10);
      const gained = def.score + bonus;
      this.score += gained;
      // ゲージ回復（コンボが多いほど多く回復）
      this.gauge = Math.min(this.gaugeMax, this.gauge + 15 + this.combo * 2);
      this._burst(item.x, item.y, def.color, 28, { spread: 10, upward: 3, maxSize: 7 });
      this.floatingTexts.push(new FloatingText(item.x, item.y - 30, `+${gained}`, def.color));
      this.onScoreChange?.(this.score);
      this.onComboChange?.(this.combo);
    } else if (type === 'danger') {
      this.combo = 0;
      // ライフなし: ゲージを大幅削る
      this.gauge = Math.max(0, this.gauge - 30);
      this._burst(item.x, item.y, '#f87171', 22, { spread: 12 });
      this.floatingTexts.push(new FloatingText(item.x, item.y - 30, 'MISS!', '#f87171'));
      this.canvas.classList.add('shake');
      setTimeout(() => this.canvas.classList.remove('shake'), 400);
      this.onComboChange?.(0);
    } else {
      this.combo = Math.max(0, this.combo - 1);
      this.score += def.score;
      this.gauge = Math.min(this.gaugeMax, this.gauge + 3); // safe: 少し回復
      this._burst(item.x, item.y, '#ffffff', 10);
      this.floatingTexts.push(new FloatingText(item.x, item.y - 30, `+${def.score}`, '#94a3b8'));
      this.onScoreChange?.(this.score);
      this.onComboChange?.(this.combo);
    }
  }

  // ===== カラーゴール管理 =====
  _initColorGoals() {
    // safeゴールのレーンからCOLOR_GOAL_COUNT個選んでカラーゴールに
    const safeLanes = this.goalTypes
      .map((t, i) => t === 'safe' ? i : -1).filter(i => i !== -1);
    const chosen = safeLanes.sort(() => Math.random() - 0.5).slice(0, COLOR_GOAL_COUNT);
    const shuffledColors = [...BALL_COLORS].sort(() => Math.random() - 0.5);
    this.colorGoals = chosen.map((li, idx) => ({
      laneIndex: li,
      colorId: shuffledColors[idx % shuffledColors.length].id,
    }));
  }

  _rotateColorGoals() {
    // 各カラーゴールの色をランダムに変える
    const shuffledColors = [...BALL_COLORS].sort(() => Math.random() - 0.5);
    this.colorGoals.forEach((cg, i) => {
      cg.colorId = shuffledColors[i % shuffledColors.length].id;
    });
  }

  // _loseLife は廃止（ゲージで管理）

  // ===== 描画 =====
  _draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    this._drawBg(ctx);
    this._drawGauge(ctx);
    this._drawLanes(ctx);
    this._drawGoals(ctx);
    this.lines.forEach(l => l.draw(ctx));
    this.items.forEach(it => it.draw(ctx));
    this.particles.forEach(p => p.draw(ctx));
    this.floatingTexts.forEach(t => t.draw(ctx));
  }

  // ===== ゲージ描画（Canvasの最上部） =====
  _drawGauge(ctx) {
    const ratio = Math.max(0, this.gauge / this.gaugeMax);
    const BAR_H = 10;
    const PAD = 8;
    const barW = CANVAS_W - PAD * 2;

    // 背景
    ctx.save();
    ctx.fillStyle = 'rgba(15,23,42,0.7)';
    ctx.beginPath();
    ctx.roundRect(PAD, 4, barW, BAR_H, 5);
    ctx.fill();

    // ゲージ色：残量に応じて変化
    let color;
    if (ratio > 0.5)       color = '#4ade80'; // 緑
    else if (ratio > 0.25) color = '#fbbf24'; // 黄
    else                   color = '#f87171'; // 赤（危険）

    if (ratio > 0) {
      // グロー
      ctx.shadowBlur = ratio < 0.25 ? 12 : 6;
      ctx.shadowColor = color;
      // バー本体
      const grad = ctx.createLinearGradient(PAD, 0, PAD + barW * ratio, 0);
      grad.addColorStop(0, color);
      grad.addColorStop(1, color + 'aa');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(PAD, 4, barW * ratio, BAR_H, 5);
      ctx.fill();
    }

    // ラベル
    ctx.shadowBlur = 0;
    ctx.fillStyle = ratio < 0.25 ? '#f87171' : 'rgba(255,255,255,0.5)';
    ctx.font = 'bold 8px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('ENERGY', PAD + 2, 4 + BAR_H / 2);
    ctx.restore();
  }

  _drawBg(ctx) {
    ctx.save();
    ctx.strokeStyle = 'rgba(51,65,85,0.25)';
    ctx.lineWidth = 0.5;
    for (let y = 0; y < PLAY_H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke();
    }
    ctx.restore();
  }

  _drawLanes(ctx) {
    ctx.save();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    for (let i = 0; i < LANE_COUNT; i++) {
      const x = laneX(i);
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, PLAY_H); ctx.stroke();
    }
    ctx.restore();
  }

  _drawGoals(ctx) {
    for (let i = 0; i < LANE_COUNT; i++) {
      const gx = i * LANE_W;
      const gy = PLAY_H;
      const type = this.goalTypes[i];
      // カラーゴールを確認
      const colorGoal = this.colorGoals.find(cg => cg.laneIndex === i);
      const bc = colorGoal ? BALL_COLORS.find(c => c.id === colorGoal.colorId) : null;
      const def = bc
        ? { color: bc.ball, label: '●', score: 300, glow: true }
        : GOAL_DEFS[type];

      ctx.fillStyle = '#0a1628';
      ctx.fillRect(gx, gy, LANE_W, GOAL_H);

      // カラーバー
      ctx.fillStyle = def.color;
      ctx.fillRect(gx, gy, LANE_W, 5);

      // グロー
      if (def.glow) {
        const gg = ctx.createLinearGradient(gx, gy, gx, gy + GOAL_H);
        gg.addColorStop(0, def.color + '30');
        gg.addColorStop(1, 'transparent');
        ctx.fillStyle = gg;
        ctx.fillRect(gx, gy, LANE_W, GOAL_H);
      }

      // ラベル（カラーゴールは色付き円）
      ctx.save();
      if (bc) {
        ctx.shadowBlur = 14; ctx.shadowColor = bc.glow;
        ctx.fillStyle = bc.ball;
        ctx.beginPath();
        ctx.arc(gx + LANE_W / 2, gy + GOAL_H * 0.44, 14, 0, Math.PI * 2);
        ctx.fill();
        // 中の丸
        ctx.fillStyle = bc.ballDark;
        ctx.beginPath();
        ctx.arc(gx + LANE_W / 2, gy + GOAL_H * 0.44, 7, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = def.color;
        ctx.font = `bold 24px Inter, sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        if (def.glow) { ctx.shadowBlur = 12; ctx.shadowColor = def.color; }
        ctx.fillText(def.label, gx + LANE_W / 2, gy + GOAL_H * 0.45);
      }
      ctx.restore();

      // スコア表示
      ctx.save();
      ctx.fillStyle = def.color + 'bb';
      ctx.font = `600 10px Inter, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      ctx.fillText(`+${def.score}`, gx + LANE_W / 2, gy + GOAL_H - 4);
      ctx.restore();

      // 区切り線
      ctx.save();
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx, gy + GOAL_H); ctx.stroke();
      ctx.restore();
    }
  }

  _burst(x, y, color, count = 15, opts = {}) {
    for (let i = 0; i < count; i++) this.particles.push(new Particle(x, y, color, opts));
  }
}

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

const MIN_LINE_Y_GAP = 45; // システム線の配置間隔
const LINE_HIT_TOL = 44; // スマホ用に広め（タップ削除しやすく）

// ===== グリッドスナップ設定 =====
export const SNAP_START_Y = 80;
export const SNAP_INTERVAL = 30;
export const SNAP_END_Y = 530;

// ゴール種別（動的に変わるためGoalsは配列で管理）
const GOAL_DEFS = {
  target:  { color: '#4ade80', label: '★', score: 150, glow: true },
  safe:    { color: '#94a3b8', label: '△', score: 20,  glow: false },
  danger:  { color: '#ef4444', label: '✕', score: 0,   glow: true },
};

// 特殊横線の種別
const SPECIAL_LINE = {
  bonus: { color: '#4ade80', glowColor: 'rgba(74,222,128,0.9)',  label: 'ENERGY' }, // 緑に変更
  spike: { color: '#c084fc', glowColor: 'rgba(192,132,252,0.9)', label: 'SPIKE' },
};

// ギミック線の色定義
const GIMMICK_COLORS = [
  '#f472b6','#fb923c','#34d399','#a78bfa','#38bdf8','#facc15',
];

// ===== カラーボール設定（Lv3以降）=====
const BALL_COLORS = [
  // 互換性(ステージデータ等)のためIDは 'red' のまま、表示色を鮮やかなピンク(#f472b6)に変更します
  { id: 'red',    ball: '#f472b6', ballDark: '#9d174d', glow: '#f472b6' },
  { id: 'blue',   ball: '#60a5fa', ballDark: '#1e3a8a', glow: '#60a5fa' },
  { id: 'yellow', ball: '#fbbf24', ballDark: '#78350f', glow: '#fbbf24' }, // 追加：黄色
  { id: 'purple', ball: '#a78bfa', ballDark: '#5b21b6', glow: '#a78bfa' }, // 追加：紫
  { id: 'green',  ball: '#34d399', ballDark: '#065f46', glow: '#34d399' }, // 追加：緑
  { id: 'orange', ball: '#fb923c', ballDark: '#7c2d12', glow: '#fb923c' }, // 追加：オレンジ
];
// Lv3以降に登場するカラーゴールの定義
const COLOR_GOAL_COUNT = 2;

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

// ===== GoalWave（ゴール波紋エフェクト） =====
export class GoalWave {
  constructor(x, y, color, maxRadius = 100, thickness = 4) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 0;
    this.maxRadius = maxRadius;
    this.thickness = thickness;
    this.life = 1.0;
    this.decay = 0.025;
  }
  update() {
    this.radius += (this.maxRadius - this.radius) * 0.15;
    this.life -= this.decay;
  }
  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.thickness * this.life;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    // 内側のやわらかなグラデーション塗りつぶし
    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.max(0, this.life * 0.15);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ===== HorizontalLine（ユーザー線・ギミック線） =====
class HorizontalLine {
  constructor(leftLaneIndex, y) {
    this.id = lineIdCounter++;
    this.leftLaneIndex = leftLaneIndex;
    this.y = y;
    this.alpha = 0;
    this.kind = 'user';
    this.scoreDelta = 0;
    this.pulse = 0;
    // warpギミック
    this.warpToLane = null;
    // colorChangeギミック
    this.colorChangeTarget = null;
    // blinkギミック
    this.isActive = true;
    this.blinkTimer = 0;
    this.blinkInterval = 50;
    // movingギミック
    this.baseY = y;
    this.moveAmplitude = 0;
    this.movePhase = Math.random() * Math.PI * 2;
    this.moveSpeed = 0.025;
    // speedUpギミック
    this.speedBoostMult = 2.0;
    // アニメーション用
    this.scale = 1.0;
    this.rotation = 0;
  }
  getYAtX(x) {
    const sx = laneX(this.leftLaneIndex);
    const ex = laneX(this.leftLaneIndex + 1);
    const clampedX = Math.max(sx, Math.min(ex, x));
    const progress = (clampedX - sx) / (ex - sx); // 線の始点から終点までの進捗 (0.0〜1.0)
    const baseY = this.y;

    if (this.kind === 'slow') {
      // 減速線：波線（サイン波）
      const waves = 2.0; // 2周期の波
      const amp = 9.0;   // 振幅9px
      return baseY + Math.sin(progress * Math.PI * 2 * waves) * amp;
    }

    if (this.kind === 'speedUp') {
      // 加速線：ギザギザ線（三角波）
      const waves = 3.0; // 3回の山と谷
      const amp = 8.0;   // 振幅8px
      const triangleVal = Math.abs((progress * waves % 1) - 0.5) * 4 - 1; // -1.0〜1.0の往復
      return baseY + triangleVal * amp;
    }

    if (this.kind === 'spike' || this.kind === 'penalty') {
      // スパイク線：トゲトゲ（鋭利なギザギザ）
      const waves = 5.0; // 5つの鋭い山
      const amp = 7.0;   // 振幅7px
      const spikeVal = Math.abs((progress * waves % 1) - 0.5) * 4 - 1;
      // より鋭くするため、3乗してトゲっぽく変形
      return baseY + Math.pow(spikeVal, 3) * amp;
    }

    return baseY; // 通常の線は直線（そのままのY座標）
  }
  setKind(kind) {
    this.kind = kind;
  }
  triggerPassEffect() {
    this.scale = 1.6; // 通過時にプクッと拡大する
    if (this.kind === 'warp' || this.kind === 'reverse' || this.kind === 'split') {
      this.rotation = Math.PI * 0.5; // 90度回転
    } else {
      this.rotation = (Math.random() - 0.5) * 0.4; // わずかにランダムに傾く
    }
  }
  update() {
    this.prevY = this.y;
    if (this.alpha < 1) this.alpha = Math.min(1, this.alpha + 0.08);
    this.pulse += 0.12;
    // blink: 一定間隔でON/OFF
    if (this.kind === 'blink') {
      this.blinkTimer++;
      if (this.blinkTimer >= this.blinkInterval) {
        this.isActive = !this.isActive;
        this.blinkTimer = 0;
      }
    }
    // moving: 上下振動
    if (this.kind === 'moving') {
      this.movePhase += this.moveSpeed;
      this.y = this.baseY + Math.sin(this.movePhase) * this.moveAmplitude;
    }

    // アニメーション減衰 (スプリング/イージング効果)
    if (this.scale > 1.0) {
      this.scale -= 0.04;
      if (this.scale < 1.0) this.scale = 1.0;
    }
    if (this.rotation !== 0) {
      this.rotation *= 0.88;
      if (Math.abs(this.rotation) < 0.01) this.rotation = 0;
    }
  }
  get _style() {
    switch (this.kind) {
      case 'system':      return { color: '#f59e0b', glow: 'rgba(245,158,11,0.8)', w: 5 }; // 輝くネオン真鍮ゴールドのシステム線
      case 'bonus':       return { color: '#4ade80', glow: 'rgba(74,222,128,0.9)',  w: 5 }; // 緑
      case 'penalty':     // stages.js用のペナルティ/スパイクエイリアス
      case 'spike':       return { color: '#c084fc', glow: 'rgba(192,132,252,0.9)', w: 5 };
      case 'warp':        return { color: '#f472b6', glow: 'rgba(244,114,182,0.9)', w: 5 };
      case 'colorChange': return { color: '#34d399', glow: 'rgba(52,211,153,0.9)',  w: 5 };
      case 'blink':       return { color: '#94a3b8', glow: 'rgba(148,163,184,0.9)', w: 4 }; // 灰色
      case 'moving':      return { color: '#38bdf8', glow: 'rgba(56,189,248,0.9)',  w: 5 };
      case 'speedUp':     return { color: '#f97316', glow: 'rgba(249,115,22,0.9)',  w: 5 };
      case 'slow':        return { color: '#a3e635', glow: 'rgba(163,230,53,0.9)',  w: 5 }; // 黄緑色
      case 'split':       return { color: '#06b6d4', glow: 'rgba(6,182,212,0.9)',  w: 5 }; // シアン
      case 'reverse':     return { color: '#d946ef', glow: 'rgba(217,70,239,0.9)',  w: 5 }; // マゼンタ
      case 'paintRed':    return { color: '#f472b6', glow: 'rgba(244,114,182,0.9)', w: 5 }; // 追加：赤インク
      case 'paintBlue':   return { color: '#60a5fa', glow: 'rgba(96,165,250,0.9)',  w: 5 }; // 追加：青インク
      case 'paintYellow': return { color: '#fbbf24', glow: 'rgba(251,191,36,0.9)',  w: 5 }; // 追加：黄インク
      case 'blackhole':   return { color: '#475569', glow: 'rgba(71,85,105,0.9)',   w: 5 }; // 追加：ブラックホール
      case 'colorFilter': {
        const bc = BALL_COLORS.find(c => c.id === this.filterColorId);
        return { color: bc ? bc.ball : '#fff', glow: bc ? bc.glow : '#fff', w: 5 };
      }
      default:            return { color: '#c49a3c', glow: 'rgba(196,154,60,0.9)',  w: 5 }; // 木のユーザー線（琥珀色）
    }
  }
  _drawIcon(ctx, cx, cy, color, glowColor, glowSize) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(this.scale, this.scale);
    ctx.rotate(this.rotation);

    // アイコンの背景（うっすら半透明の円形のバッジプレート）
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(20, 10, 5, 0.82)'; // 濃い木目色の背景
    ctx.shadowBlur = glowSize;
    ctx.shadowColor = glowColor;
    ctx.fill();

    // アイコンの輪郭線
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (this.kind) {
      case 'slow': {
        // slow: 減速。時計の砂時計のシルエット or 波 〰️ or 戻る左三角
        // ネオン風の「左向き三角（◀）」と「ブレーキ縦棒」
        ctx.beginPath();
        // 三角
        ctx.moveTo(1, -4);
        ctx.lineTo(-4, 0);
        ctx.lineTo(1, 4);
        ctx.closePath();
        // 縦棒 (ブレーキ)
        ctx.moveTo(-4, -4);
        ctx.lineTo(-4, 4);
        ctx.stroke();
        break;
      }
      case 'speedUp': {
        // speedUp: ファストフォワード。右向きの二重三角 ▶▶
        ctx.beginPath();
        // 1つ目の三角
        ctx.moveTo(-4, -4);
        ctx.lineTo(1, 0);
        ctx.lineTo(-4, 4);
        ctx.closePath();
        // 2つ目の三角
        ctx.moveTo(1, -4);
        ctx.lineTo(6, 0);
        ctx.lineTo(1, 4);
        ctx.closePath();
        ctx.fillStyle = color; // 塗りつぶしで力強さを出す
        ctx.fill();
        ctx.stroke();
        break;
      }
      case 'penalty':
      case 'spike': {
        // spike / penalty: トゲトゲ星マーク。8つの尖ったトゲ
        ctx.beginPath();
        const spikes = 8;
        const outerRadius = 7;
        const innerRadius = 3;
        let rot = Math.PI / 2 * 3;
        let x = 0;
        let y = 0;
        const step = Math.PI / spikes;

        ctx.moveTo(0, -outerRadius);
        for (let i = 0; i < spikes; i++) {
          x = Math.cos(rot) * outerRadius;
          y = Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += step;

          x = Math.cos(rot) * innerRadius;
          y = Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += step;
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
        break;
      }
      case 'warp': {
        // warp: ポータル。渦巻き、あるいは二重のネオン同心円とクロス
        // 円の中に小さな内円と、ポータルを意味する十字
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        // 周囲にワープのノイズドットを描画
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
          const r = 7 + Math.sin(this.pulse + a) * 1.5;
          ctx.rect(Math.cos(a) * r - 0.75, Math.sin(a) * r - 0.75, 1.5, 1.5);
        }
        ctx.fillStyle = color;
        ctx.fill();
        break;
      }
      case 'colorChange': {
        // colorChange: 水滴 💧 マーク（美しくネオンで発光）
        ctx.beginPath();
        // 水滴のパスを描画
        ctx.moveTo(0, -6);
        ctx.bezierCurveTo(4, -2, 5, 1, 5, 3);
        ctx.arc(0, 3, 5, 0, Math.PI, false);
        ctx.bezierCurveTo(-5, 1, -4, -2, 0, -6);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
        break;
      }
      case 'split': {
        // split: 1本から2本に分裂する矢印 ➔ ↗️↘️
        ctx.beginPath();
        // 左側の主幹
        ctx.moveTo(-6, 0);
        ctx.lineTo(-2, 0);
        // 上の分岐
        ctx.lineTo(3, -3);
        ctx.lineTo(1, -5);
        ctx.moveTo(3, -3);
        ctx.lineTo(3, -1);
        // 下の分岐
        ctx.moveTo(-2, 0);
        ctx.lineTo(3, 3);
        ctx.lineTo(1, 5);
        ctx.moveTo(3, 3);
        ctx.lineTo(3, 1);
        ctx.stroke();
        break;
      }
      case 'reverse': {
        // reverse: 重力反転。反時計回りのループ状の反転矢印
        ctx.beginPath();
        ctx.arc(0, 0, 5, -Math.PI * 0.4, Math.PI * 1.2, false);
        ctx.stroke();
        // 矢印の先端
        ctx.beginPath();
        ctx.moveTo(2, -6);
        ctx.lineTo(5, -4);
        ctx.lineTo(5, -7);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
        break;
      }
      case 'moving': {
        // moving: 上下移動。上下を指す両方向矢印 ↕
        ctx.beginPath();
        // 縦の主線
        ctx.moveTo(0, -6);
        ctx.lineTo(0, 6);
        // 上の矢印頭
        ctx.moveTo(-3, -3);
        ctx.lineTo(0, -6);
        ctx.lineTo(3, -3);
        // 下の矢印頭
        ctx.moveTo(-3, 3);
        ctx.lineTo(0, 6);
        ctx.lineTo(3, 3);
        ctx.stroke();
        break;
      }
      case 'blink': {
        // blink: 点滅。点滅ランプ 👁 または電球 / 円
        // アクティブなら明るい目、非アクティブなら細めた目
        ctx.beginPath();
        if (this.isActive) {
          // 開いた目のシルエット
          ctx.moveTo(-6, 0);
          ctx.quadraticCurveTo(0, -5, 6, 0);
          ctx.quadraticCurveTo(0, 5, -6, 0);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, 2, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        } else {
          // 閉じた（細めた）目のシルエット
          ctx.moveTo(-6, 0);
          ctx.quadraticCurveTo(0, 2, 6, 0);
          ctx.stroke();
        }
        break;
      }
      case 'colorFilter': {
        // colorFilter: 漏斗（フィルター）▽ の形
        ctx.beginPath();
        ctx.moveTo(-5, -5);
        ctx.lineTo(5, -5);
        ctx.lineTo(2, 0);
        ctx.lineTo(2, 5);
        ctx.lineTo(-2, 5);
        ctx.lineTo(-2, 0);
        ctx.closePath();
        ctx.stroke();
        break;
      }
      case 'paintRed':
      case 'paintBlue':
      case 'paintYellow': {
        // paintRed/Blue/Yellow: インク水滴マーク。水滴を描き、中央に R, B, Y の文字を描画
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.bezierCurveTo(4, -2, 5, 1, 5, 3);
        ctx.arc(0, 3, 5, 0, Math.PI, false);
        ctx.bezierCurveTo(-5, 1, -4, -2, 0, -6);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();

        // 中央に白文字
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 9px "Noto Sans JP", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const letter = this.kind === 'paintRed' ? 'R' : (this.kind === 'paintBlue' ? 'B' : 'Y');
        ctx.fillText(letter, 0, 2.5);
        break;
      }
      case 'blackhole': {
        // blackhole: ブラックホール。中心に向けて渦巻く円
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        for (let a = 0; a < Math.PI * 4; a += 0.2) {
          const r = 6 - (a / (Math.PI * 4)) * 5;
          const px = Math.cos(a + this.pulse * 2.5) * r;
          const py = Math.sin(a + this.pulse * 2.5) * r;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        break;
      }
      default: {
        // user / system などの通常の線はアイコンなし
        break;
      }
    }

    ctx.restore();
  }
  draw(ctx) {
    const sx = laneX(this.leftLaneIndex);
    const ex = laneX(this.leftLaneIndex + 1);
    const st = this._style;

    // blink非アクティブは半透明で表示
    const baseAlpha = (this.kind === 'blink' && !this.isActive) ? 0.25 : 1.0;
    const glow = (['bonus','spike','warp','speedUp','moving','slow','split','reverse'].includes(this.kind))
      ? 10 + Math.sin(this.pulse) * 4 : 10;

    ctx.save();
    ctx.globalAlpha = this.alpha * baseAlpha;

    // 線の基本的な描画 (形は直線)
    if (this.kind === 'warp') {
      ctx.beginPath(); ctx.moveTo(sx, this.y - 3); ctx.lineTo(ex, this.y - 3);
      ctx.strokeStyle = st.color; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.shadowBlur = glow; ctx.shadowColor = st.glow; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sx, this.y + 3); ctx.lineTo(ex, this.y + 3);
      ctx.stroke();
    } else if (this.kind === 'colorChange') {
      const bc = BALL_COLORS.find(c => c.id === this.colorChangeTarget);
      const col = bc ? bc.ball : '#fff';
      const gl = bc ? bc.glow : '#fff';
      ctx.beginPath(); ctx.moveTo(sx, this.y); ctx.lineTo(ex, this.y);
      ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.lineCap = 'round';
      ctx.shadowBlur = 12; ctx.shadowColor = gl; ctx.stroke();
    } else if (this.kind === 'colorFilter') {
      ctx.beginPath();
      ctx.setLineDash([6, 6]); // 破線で特別感を出す
      ctx.moveTo(sx, this.y); ctx.lineTo(ex, this.y);
      ctx.strokeStyle = st.color; ctx.lineWidth = st.w; ctx.lineCap = 'round';
      ctx.shadowBlur = glow; ctx.shadowColor = st.glow; ctx.stroke();
      ctx.setLineDash([]);
    } else {
      ctx.beginPath();
      ctx.moveTo(sx, this.y); ctx.lineTo(ex, this.y);
      ctx.strokeStyle = st.color; ctx.lineWidth = st.w; ctx.lineCap = 'round';
      ctx.shadowBlur = glow; ctx.shadowColor = st.glow; ctx.stroke();
    }

    // アイコンの描画 (ギミック付きの線のみ)
    if (this.kind !== 'user' && this.kind !== 'system') {
      const cx = (sx + ex) / 2;
      const cy = this.y;

      // colorChange の場合はターゲット色で描画
      let iconColor = st.color;
      let iconGlow = st.glow;
      if (this.kind === 'colorChange') {
        const bc = BALL_COLORS.find(c => c.id === this.colorChangeTarget);
        iconColor = bc ? bc.ball : '#fff';
        iconGlow = bc ? bc.glow : '#fff';
      }

      this._drawIcon(ctx, cx, cy, iconColor, iconGlow, glow);
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
    // スピードアップ
    this.speedBoostTimer = 0;
    this.speedBoostMult = 1.0;
    this.isBoosted = false;
    this.isSpike = false;
    // 新ギミック用の状態
    this.isSlow = false;
    this.reverseTimer = 0;
    this.hasHitCeiling = false;
    this.isDestroyed = false; // 追加：ブラックホール等で破壊されたかどうかのフラグ
    this.activeReverseLineId = null;
    this.hasReversed = false; // 重力反転を一生に一度だけにするためのフラグ
  }
  setLines(lines) { this._lines = lines; }
  update() {
    this.pulse += 0.1;
    // スピードブースト処理
    if (this.speedBoostTimer > 0) {
      this.speedBoostTimer--;
      this.isBoosted = true;
      this.isSlow = false; // 加速時はスロー解除
    } else {
      this.isBoosted = false;
      this.speedBoostMult = 1.0;
    }
    
    // スロー考慮の実効速度
    const speedMult = this.isSlow ? 0.5 : 1.0;
    const effectiveSpeed = this.speed * this.speedBoostMult * speedMult;

    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 7) this.trail.shift();

    if (this.state === 'falling') {
      const isReversing = this.reverseTimer > 0;
      if (isReversing) {
        this.reverseTimer--;
        // 反転が終了して落下に戻る瞬間に、通過済みリストから反転線のみを除外する
        if (this.reverseTimer === 0) {
          if (this.activeReverseLineId !== null) {
            this.crossedLineIds.delete(this.activeReverseLineId);
            this.activeReverseLineId = null;
          }
        }
      }
      
      const speedY = isReversing ? -effectiveSpeed : effectiveSpeed;
      const ny = this.y + speedY;

      // 天井（最上部）到達時の安全復帰バウンド処理
      if (isReversing && ny <= 0) {
        this.y = 2; // 天井付近
        this.reverseTimer = 0; // 反転解除
        this.state = 'falling';
        this.hasHitCeiling = true; // Game側でエフェクトを鳴らす用
        if (this.activeReverseLineId !== null) {
          this.crossedLineIds.delete(this.activeReverseLineId);
          this.activeReverseLineId = null;
        }
        return;
      }

      let hit = null;
      for (const l of this._lines) {
        if (this.crossedLineIds.has(l.id)) continue;
        const lpy = l.prevY !== undefined ? l.prevY : l.y;
        // blink非アクティブはすり抜け
        if (l.kind === 'blink' && !l.isActive) {
          const rel2 = l.leftLaneIndex === this.currentLane || l.leftLaneIndex === this.currentLane - 1;
          if (rel2) {
            if (isReversing) {
              if (this.y >= lpy && ny <= l.y) this.crossedLineIds.add(l.id);
            } else {
              if (this.y <= lpy && ny >= l.y) this.crossedLineIds.add(l.id);
            }
          }
          continue;
        }
        // colorFilter: 一致しない色のボールはすり抜け
        if (l.kind === 'colorFilter' && this.ballColorId !== l.filterColorId) {
          const rel2 = l.leftLaneIndex === this.currentLane || l.leftLaneIndex === this.currentLane - 1;
          if (rel2) {
            if (isReversing) {
              if (this.y >= lpy && ny <= l.y) this.crossedLineIds.add(l.id);
            } else {
              if (this.y <= lpy && ny >= l.y) this.crossedLineIds.add(l.id);
            }
          }
          continue;
        }
        const rel = l.leftLaneIndex === this.currentLane || l.leftLaneIndex === this.currentLane - 1;
        if (rel) {
          if (isReversing) {
            // 上昇時の衝突判定：下から上に線を越えたか
            if (this.y >= lpy && ny <= l.y) { hit = l; break; }
          } else {
            // 落下時の衝突判定：上から下に線を越えたか
            if (this.y <= lpy && ny >= l.y) { hit = l; break; }
          }
        }
      }
      if (hit) {
        this.crossedLineIds.add(hit.id);
        this.lastHitLine = hit;
        
        // 衝突した線のアニメーションをトリガー
        hit.triggerPassEffect();

        if (hit.kind === 'warp') {
          const spawnSpeedY = isReversing ? -effectiveSpeed : effectiveSpeed;
          if (hit.warpPairId !== undefined) {
            const pair = this._lines.find(l => l.id === hit.warpPairId);
            if (pair) {
              // ワープ: ペアのワープ線へ瞬间移動
              this.y = pair.y + spawnSpeedY;
              if (this.currentLane === hit.leftLaneIndex) {
                this.currentLane = pair.leftLaneIndex + 1;
              } else {
                this.currentLane = pair.leftLaneIndex;
              }
              this.x = laneX(this.currentLane);
              this.state = 'falling';
              this.crossedLineIds.add(pair.id); // 無限ループ防止

              // ワープ先の線のアニメーションもトリガー
              pair.triggerPassEffect();
            }
          } else if (hit.warpToLane !== null) {
            // 互換性フォールバック
            this.y = hit.y + spawnSpeedY;
            this.currentLane = hit.warpToLane;
            this.x = laneX(hit.warpToLane);
            this.state = 'falling';
          }
        } else {
          // 通常の横移動
          this.y = hit.y;
          this.state = 'crossing';
          this.targetLane = hit.leftLaneIndex === this.currentLane
            ? this.currentLane + 1 : this.currentLane - 1;
          this.targetX = laneX(this.targetLane);
        }
      } else {
        this.y = ny;
      }
    } else {
      // 横移動中
      const cs = effectiveSpeed * 2.5;
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
    
    let baseColor = bc ? bc.ball : '#facc15';
    let darkColor = bc ? bc.ballDark : '#b45309';
    let glowColor = bc ? bc.glow : '#facc15';
    let trailColor = bc ? bc.ball : '#facc15';
    let auraColor = bc ? bc.glow : 'rgba(250,204,21,0.12)';

    // トゲトゲ描画
    if (this.isSpike) {
      baseColor = '#c084fc';
      darkColor = '#581c87';
      glowColor = '#c084fc';
      trailColor = '#c084fc';
      ctx.save();
      ctx.fillStyle = '#1e293b';
      ctx.translate(this.x, this.y);
      ctx.rotate(this.pulse * 2);
      ctx.beginPath();
      for (let j = 0; j < 8; j++) {
        ctx.lineTo(0, -this.radius - 6);
        ctx.rotate(Math.PI / 8);
        ctx.lineTo(0, -this.radius);
        ctx.rotate(Math.PI / 8);
      }
      ctx.fill();
      ctx.restore();
    }

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
    this.onGoalEffect = null;
    this.onGameOver = null;
    this.isDragging = false;
    this.dragMode = null;
    this._bindEvents();
    this._initState();
  }

  _initState() {
    this.isOver = false;
    this.timeElapsed = 0;
    this.level = 1;
    this.ballsReachedBottom = 0;
    this.speedMult = 1.0;
    this.lastSpawnTime = 0;
    this.lastGoalRotateTime = Date.now();
    this.goalRotateInterval = 12000;
    this.lastSpecialLineTime = Date.now();
    this.specialLineInterval = 8000;
    this.nextSpawnLane = randInt(0, LANE_COUNT - 1);

    // ===== ゲージ =====
    this.gauge = 0;          // 0からスタート
    this.gaugeMax = 100;
    this.dangerDamage = 0;   // バツゴールに入った回数（ダメージ）
    // 1秒ごとに減る量
    this.gaugeDrainPerSec = 0;

    // ゴール配置（動的）: 各レーンの種別
    this.goalTypes = ['danger', 'safe', 'target', 'safe', 'danger'];
    // カラーゴール: { laneIndex, colorId } の配列（Lv3以降 -> 今回からLv5以降）
    this.colorGoals = [];
    this.lastColorGoalRotate = Date.now();
    this.colorGoalRotateInterval = 10000; // 10秒で色変更

    this.lines = [];      // 全横線（ユーザー＋システム）
    this.items = [];
    this.particles = [];
    this.floatingTexts = [];
    this.waves = [];

    this._rafId = null;
    this._lastTime = null;
    this.isPaused = false;

    // ===== 早送り（長押し） =====
    this.isFastForward = false;
    this.longPressTimeout = null;
    this.touchStartX = 0;
    this.touchStartY = 0;
  }

  _bindEvents() {
    this._handleInputBound = (e) => this._handleInput(e, false);
    this._handleMoveBound = (e) => {
      if (this.isDragging) {
        // ドラッグ移動距離の判定
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = CANVAS_W / rect.width;
        const scaleY = CANVAS_H / rect.height;
        let cx, cy;
        if (e.type.includes('touch')) {
          cx = e.touches[0].clientX; cy = e.touches[0].clientY;
        } else {
          cx = e.clientX; cy = e.clientY;
        }
        const x = (cx - rect.left) * scaleX;
        const y = (cy - rect.top) * scaleY;
        
        const dist = Math.hypot(x - this.touchStartX, y - this.touchStartY);
        if (dist > 15) {
          if (this.longPressTimeout) {
            clearTimeout(this.longPressTimeout);
            this.longPressTimeout = null;
          }
          this.isFastForward = false;
        }
        
        this._handleInput(e, true);
      }
    };
    
    this._handleUpBound = () => {
      this.isDragging = false;
      this.dragMode = null;
      if (this.longPressTimeout) {
        clearTimeout(this.longPressTimeout);
        this.longPressTimeout = null;
      }
      this.isFastForward = false;
    };

    const startPress = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = CANVAS_W / rect.width;
      const scaleY = CANVAS_H / rect.height;
      let cx, cy;
      if (e.type.includes('touch')) {
        cx = e.touches[0].clientX; cy = e.touches[0].clientY;
      } else {
        cx = e.clientX; cy = e.clientY;
      }
      this.touchStartX = (cx - rect.left) * scaleX;
      this.touchStartY = (cy - rect.top) * scaleY;

      if (this.longPressTimeout) {
        clearTimeout(this.longPressTimeout);
      }
      this.isFastForward = false;
      // 300ms 押し続けたら早送りモード（2倍速）にする
      this.longPressTimeout = setTimeout(() => {
        if (this.isDragging && !this.isOver && !this.isPaused) {
          this.isFastForward = true;
        }
      }, 300);
    };

    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.dragMode = null;
      startPress(e);
      this._handleInputBound(e);
    });
    this.canvas.addEventListener('mousemove', this._handleMoveBound);
    this.canvas.addEventListener('mouseup', this._handleUpBound);
    this.canvas.addEventListener('mouseleave', this._handleUpBound);

    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.isDragging = true;
      this.dragMode = null;
      startPress(e);
      this._handleInputBound(e);
    }, { passive: false });
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this._handleMoveBound(e);
    }, { passive: false });
    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this._handleUpBound();
    }, { passive: false });
    this.canvas.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      this._handleUpBound();
    }, { passive: false });
  }

  _spawnBallDirectly() {
    const logicLevel = Math.min(this.level, 8);
    const lane = this.nextSpawnLane;
    this.nextSpawnLane = randInt(0, LANE_COUNT - 1);
    
    // 初期のボールの速さを1.2倍に引き上げ、少し早くした上でランダムな揺らぎを加えます
    const randomSpeed = this.speedMult * 1.2 * (0.85 + Math.random() * 0.3);
    const item = new Item(lane, randomSpeed);
    
    let spawnColor = false;
    if (logicLevel >= 5 && this.colorGoals.length > 0) {
      const hasNormalGoal = [0,1,2,3,4].some(i => !this.colorGoals.some(cg => cg.laneIndex === i) && this.goalTypes[i] !== 'danger');
      if (!hasNormalGoal || Math.random() < 0.6) {
        spawnColor = true;
      }
    }
    if (spawnColor) {
      const cg = this.colorGoals[randInt(0, this.colorGoals.length - 1)];
      item.ballColorId = cg.colorId;
    }
    
    item.setLines(this.lines);
    this.items.push(item);
    this.lastSpawnTime = Date.now();
  }

  // ===== ゴールローテーション =====
  _rotateGoal() {
    // 現在のtarget位置を探す
    const cur = this.goalTypes.indexOf('target');
    // 新しい位置（現在と異なるランダム）
    let next;
    do { next = randInt(0, LANE_COUNT - 1); } while (next === cur);
    
    // 中盤（レベル3以降）では三角ゴール（safe）をバツゴール（danger）にする
    const nextGoalType = (this.level >= 3) ? 'danger' : 'safe';
    this.goalTypes[cur] = this.goalTypes[next] === 'danger' ? 'danger' : nextGoalType;
    
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

  // ===== 特殊横線（bonus/spike/ギミック）の追加 =====
  _addSpecialLine() {
    const removable = ['bonus','spike','warp','colorChange','blink','moving','speedUp','colorFilter','slow','split','reverse'];
    const sp = this.lines.findIndex(l => removable.includes(l.kind));
    if (sp !== -1) this.lines.splice(sp, 1);
    const logicLevel = Math.min(this.level, 8);
    let pool;
    if (logicLevel <= 2) pool = ['bonus','spike'];
    else if (logicLevel <= 4) pool = ['bonus','spike','blink','moving','slow','reverse'];
    else if (logicLevel <= 6) pool = ['bonus','spike','blink','moving','slow','reverse','speedUp','warp','split'];
    else pool = ['bonus','spike','blink','moving','slow','reverse','speedUp','warp','split','colorChange','colorFilter'];
    this._placeRandomLine(pool[Math.floor(Math.random() * pool.length)]);
  }

  // ランダムな位置に横線を配置（ギミック対応版）
  _placeRandomLine(kind, opts = {}) {
    let attempts = 0;
    
    // スナップ座標の候補リストを作成
    const snappedYCandidates = [];
    for (let sy = SNAP_START_Y; sy <= SNAP_END_Y; sy += SNAP_INTERVAL) {
      snappedYCandidates.push(sy);
    }

    while (attempts < 20) {
      const li = randInt(0, LANE_COUNT - 2);
      // スナップ座標候補からランダムに選択
      const y = snappedYCandidates[Math.floor(Math.random() * snappedYCandidates.length)];
      const ok = this.lines.every(l => {
        const nearLane = Math.abs(l.leftLaneIndex - li) <= 1;
        const nearY = Math.abs(l.y - y) < MIN_LINE_Y_GAP;
        return !(nearLane && nearY);
      });
      if (ok) {
        const line = new HorizontalLine(li, y);
        line.setKind(kind);
        // ギミック固有プロパティ設定
        if (kind === 'warp') {
          // ワープ先：今のレーンから遠いレーン
          const candidates = [0,1,2,3].filter(x => Math.abs(x - li) >= 2);
          if (candidates.length > 0) {
            const li2 = candidates[Math.floor(Math.random() * candidates.length)];
            const line2 = new HorizontalLine(li2, y);
            line2.setKind('warp');
            line.warpPairId = line2.id;
            line2.warpPairId = line.id;
            this.lines.push(line);
            this.lines.push(line2);
            return line;
          } else {
            attempts++;
            continue;
          }
        } else if (kind === 'colorChange') {
          const colorIds = BALL_COLORS.map(c => c.id);
          line.colorChangeTarget = opts.colorId || colorIds[Math.floor(Math.random() * colorIds.length)];
        } else if (kind === 'colorFilter') {
          const colorIds = BALL_COLORS.map(c => c.id);
          line.filterColorId = opts.colorId || colorIds[Math.floor(Math.random() * colorIds.length)];
        } else if (kind === 'moving') {
          line.moveAmplitude = opts.amplitude || rand(30, 70);
          line.moveSpeed = opts.speed || rand(0.02, 0.04);
        } else if (kind === 'blink') {
          line.blinkInterval = opts.blinkInterval || randInt(30, 70);
        }
        this.lines.push(line);
        return line;
      }
      attempts++;
    }
    return null;
  }

  // ===== 入力処理 =====
  _handleInput(event, isMove = false) {
    if (this.isOver) return;
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    let cx, cy;
    if (event.type.includes('touch')) {
      cx = event.touches[0].clientX; cy = event.touches[0].clientY;
    } else {
      cx = event.clientX; cy = event.clientY;
    }
    const x = (cx - rect.left) * scaleX;
    const y = (cy - rect.top) * scaleY;
    
    // 最も近いスナップY座標を計算
    const snappedY = Math.round((y - SNAP_START_Y) / SNAP_INTERVAL) * SNAP_INTERVAL + SNAP_START_Y;
    
    // スナップされた座標がプレイ領域外の場合は処理しない
    if (snappedY < SNAP_START_Y || snappedY > SNAP_END_Y) return;

    // タップされた位置がどの縦線（レーン）の間にあるかを正しく計算するため、
    // アミダの縦線座標(laneX)を考慮した式
    const li = Math.floor((x - LANE_W / 2) / LANE_W);
    if (li < 0 || li >= LANE_COUNT - 1) return;

    // スナップされたY座標と完全に一致するユーザー線を探す
    let closestIdx = -1;
    for (let i = 0; i < this.lines.length; i++) {
      const l = this.lines[i];
      if (l.kind === 'user' && l.leftLaneIndex === li && l.y === snappedY) {
        closestIdx = i;
        break;
      }
    }

    if (!isMove) {
      // 最初のタップ時：追加モードか削除モードかを決定
      if (closestIdx !== -1) {
        this.dragMode = 'remove';
        const removed = this.lines.splice(closestIdx, 1)[0];
        this._burst(x, snappedY, '#94a3b8', 8);
        return;
      } else {
        this.dragMode = 'add';
      }
    }

    if (this.dragMode === 'remove') {
      // 削除モード中は、スナップされた同一位置にある線を消す
      if (closestIdx !== -1) {
        const removed = this.lines.splice(closestIdx, 1)[0];
        this._burst(x, snappedY, '#94a3b8', 8);
      }
      return;
    }

    if (this.dragMode === 'add') {
      // 追加モード：同一スナップ座標に線が既に存在しないか確認
      const tooClose = this.lines.some(l => l.leftLaneIndex === li && Math.abs(l.y - snappedY) < 5);
      if (!tooClose) {
        const line = new HorizontalLine(li, snappedY);
        this.lines.push(line);
        this._burst(x, snappedY, '#22d3ee', 5);
      } else {
        if (!isMove) {
          // タップ時のみ、線が引けなかったことを視覚的に知らせるエフェクト
          this.floatingTexts.push(new FloatingText(x, snappedY, '✕', '#ef4444'));
        }
      }
    }
  }

  stop() {
    this.isOver = true;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this.isPaused = false;
  }

  // ===== ゲームループ =====
  start() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this._initState();
    this.lastSpawnTime = Date.now();
    this._lastTime = performance.now();
    this.onGaugeChange?.(this.gauge / this.gaugeMax);
    this._tick(this._lastTime);
  }

  restart() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this.start();
  }

  _tick(t) {
    if (this.isOver || this.isPaused) return;
    const delta = this._lastTime ? t - this._lastTime : 16;
    this._lastTime = t;

    // 早送り中（2倍速）の場合は1フレーム内で2回アップデートする
    const steps = this.isFastForward ? 2 : 1;
    for (let i = 0; i < steps; i++) {
      this._update(delta / steps);
    }

    this._draw();
    this._rafId = requestAnimationFrame(this._tick.bind(this));
  }

  setPause(p) {
    if (this.isOver) return;
    this.isPaused = p;
    if (!p) {
      this._lastTime = performance.now();
      this._rafId = requestAnimationFrame(this._tick.bind(this));
    } else {
      if (this._rafId) cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  _update(delta) {
    const now = Date.now();
    this.timeElapsed += delta;

    // レベル計算（ボール到達数で計算。5個クリアごとにレベルアップ）
    let newLevel = Math.floor(this.ballsReachedBottom / 5) + 1;
    
    if (newLevel !== this.level) {
      this.level = newLevel;
      this.onLevelChange?.(this.level);
      
      const logicLevel = Math.min(this.level, 8);
      
      // 中盤（レベル3以降）は、既存の三角ゴール（safe）をすべてバツゴール（danger）に変更
      if (this.level >= 3) {
        this.goalTypes = this.goalTypes.map(t => t === 'safe' ? 'danger' : t);
      }

      // レベル開始時のシステム線追加
      if (logicLevel === 3 || logicLevel === 7) {
        this._addSystemLine();
        this._addSystemLine();
      }
      // Lv5でカラーゴール初期化
      if (logicLevel === 5 && this.colorGoals.length === 0) {
        this._initColorGoals();
      }
    }

    const logicLevel = Math.min(this.level, 8);

    // 難易度パラメータ (速度をマイルドに緩和)
    this.speedMult = (logicLevel >= 6) ? 1.3 : (logicLevel >= 2 ? 1.1 : 0.85);
    this.gaugeDrainPerSec = (logicLevel === 1) ? 0 : 2.0 + (logicLevel * 0.5);

    this.gauge -= (this.gaugeDrainPerSec / 1000) * delta;
    this.gauge = Math.max(0, Math.min(this.gaugeMax, this.gauge));
    this.onGaugeChange?.(this.gauge / this.gaugeMax);
    if (this.gauge <= 0 && !this.isOver) {
      this.isOver = true;
      if (this._rafId) cancelAnimationFrame(this._rafId);
      this.onGameOver?.(this.score, this.maxCombo);
      return;
    }

    // ゴール位置のローテーション (定期)
    if (now - this.lastGoalRotateTime > this.goalRotateInterval) {
      this._rotateGoal();
      this.lastGoalRotateTime = now;
    }

    // 特殊横線の追加
    const spInterval = Math.max(5000, this.specialLineInterval - logicLevel * 1000);
    if (now - this.lastSpecialLineTime > spInterval) {
      this._addSpecialLine();
      this.lastSpecialLineTime = now;
    }

    // カラーゴール更新（Lv5以降）
    if (logicLevel >= 5 && now - this.lastColorGoalRotate > this.colorGoalRotateInterval) {
      this._rotateColorGoals();
      this.lastColorGoalRotate = now;
    }

    // アイテム生成 (時間間隔ではなく、画面のボール状態に基づく)
    // 個数もレベルごとに異なるようにバリエーションを持たせる
    const maxBalls = (logicLevel >= 5) ? (2 + Math.floor(Math.random() * 2)) : (1 + Math.floor(Math.random() * 2));
    let canSpawn = false;

    if (this.items.length === 0) {
      canSpawn = true;
    } else if (this.items.length < maxBalls) {
      // 難易度(logicLevel)に応じて、次のボールを出すための間隔（Y座標のしきい値）を変える
      // 難易度が低いときは半分(0.5)、高いときはどんどん間隔が詰まって同時に近くなる
      let spawnThresholdRatio = 0.5; // 基本は半分
      if (logicLevel >= 4) spawnThresholdRatio = 0.35;
      if (logicLevel >= 7) spawnThresholdRatio = 0.15; // ほぼ同時

      const lastItem = this.items[this.items.length - 1];
      if (lastItem && lastItem.y > PLAY_H * spawnThresholdRatio) {
        canSpawn = true;
      }
    }

    // 前回のスポーンから少し(400ms)待ってからスポーンする
    if (canSpawn && (now - this.lastSpawnTime > 400)) {
      this._spawnBallDirectly();
    }

    // 横線更新
    this.lines.forEach(l => l.update());

    // アイテム更新
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.setLines(this.lines);
      item.update();

      // 天井衝突バウンド
      if (item.hasHitCeiling) {
        item.hasHitCeiling = false;
        this._burst(item.x, 2, '#d946ef', 12, { spread: 6, upward: -2 });
        this.floatingTexts.push(new FloatingText(item.x, 30, 'BOUNCE!', '#d946ef'));
      }

      // 線を通過したとき
      if (item.lastHitLine) {
        const hl = item.lastHitLine;
        item.lastHitLine = null;
        if (hl.kind === 'bonus') {
          this.gauge = Math.min(this.gaugeMax, this.gauge + 8);
          this.floatingTexts.push(new FloatingText(item.x, item.y - 20, 'ENERGY!', '#fbbf24'));
        } else if (hl.kind === 'spike' || hl.kind === 'penalty') {
          item.isSpike = true;
          this.floatingTexts.push(new FloatingText(item.x, item.y - 20, 'SPIKE!', '#c084fc'));
        } else if (hl.kind === 'colorChange' && hl.colorChangeTarget) {
          // 色変え
          item.ballColorId = hl.colorChangeTarget;
          this.floatingTexts.push(new FloatingText(item.x, item.y - 20, 'COLOR!', '#34d399'));
          this._burst(item.x, item.y, '#34d399', 12, { spread: 8 });
        } else if (hl.kind === 'speedUp') {
          // スピードアップ
          item.isSlow = false; // スロー解除
          item.speedBoostTimer = 180;
          item.speedBoostMult = hl.speedBoostMult || 2.0;
          this.floatingTexts.push(new FloatingText(item.x, item.y - 20, 'FAST!', '#f97316'));
          this._burst(item.x, item.y, '#f97316', 10, { spread: 6 });
        } else if (hl.kind === 'warp') {
          // ワープエフェクト
          this._burst(item.x, item.y, '#f472b6', 20, { spread: 12, upward: 2 });
          this.floatingTexts.push(new FloatingText(item.x, item.y - 20, 'WARP!', '#f472b6'));
        } else if (hl.kind === 'slow') {
          // スロー線通過
          item.isSlow = true;
          item.speedBoostTimer = 0; // 加速解除
          this.floatingTexts.push(new FloatingText(item.x, item.y - 20, 'SLOW!', '#a3e635'));
          this._burst(item.x, item.y, '#a3e635', 10, { spread: 6 });
          // 即時に次のボールを降らせる
          this._spawnBallDirectly();
        } else if (hl.kind === 'reverse') {
          // 重力反転線通過
          if (item.hasReversed) return; // 既に反転したことがある場合は、これ以上反転させない
          item.reverseTimer = 180; // 3秒間上昇
          item.hasReversed = true; // 反転フラグを立てる
          item.crossedLineIds.clear(); // 反転開始時に通過済みリストをクリアして他の横線に触れるようにする
          hl.setKind('system'); // 一度ボールに触れたらシステム線に変更
          this.floatingTexts.push(new FloatingText(item.x, item.y - 20, 'REVERSE!', '#d946ef'));
          this._burst(item.x, item.y, '#d946ef', 12, { spread: 6 });
        } else if (hl.kind === 'split') {
          // 分裂線通過
          this.floatingTexts.push(new FloatingText(item.x, item.y - 20, 'SPLIT!', '#06b6d4'));
          this._burst(item.x, item.y, '#06b6d4', 15, { spread: 8 });

          // 無限分裂を防ぐため、元のボールの通過済みにこの分裂線IDを追加
          item.crossedLineIds.add(hl.id);

          // 元のレーンに直進落下する新しいItemを複製
          const nextLane = item.currentLane;
          const newItem = new Item(nextLane, item.speed);

          // 新しいボールの位置を線の少し下に設定
          const speedMult = item.isSlow ? 0.5 : 1.0;
          const effectiveSpeed = item.speed * item.speedBoostMult * speedMult;
          newItem.y = hl.y + effectiveSpeed + 2;
          newItem.x = laneX(nextLane);

          // 各種プロパティの引継ぎ
          newItem.ballColorId = item.ballColorId;
          newItem.isSlow = item.isSlow;
          newItem.speedBoostTimer = item.speedBoostTimer;
          newItem.speedBoostMult = item.speedBoostMult;
          newItem.reverseTimer = item.reverseTimer;
          newItem.hasReversed = item.hasReversed; // 反転フラグを引き継ぐ
          newItem.isSpike = item.isSpike;

          // 通過済み線IDを完全複製
          newItem.crossedLineIds = new Set(item.crossedLineIds);
          newItem.setLines(this.lines);
          this.items.push(newItem);
        }
      }

      // レベル4, 8のギミック: 中間通過でゴール変動
      if ((logicLevel === 4 || logicLevel === 8) && item.y > PLAY_H / 2 && !item.hasTriggeredGoalChange) {
        this._rotateGoal();
        item.hasTriggeredGoalChange = true;
      }

      if (item.y > PLAY_H) {
        this._judgeGoal(item);
        this.ballsReachedBottom++;
        this.items.splice(i, 1);
      }
    }

    // パーティクル・テキスト・波紋更新
    this.particles.forEach(p => p.update());
    this.particles = this.particles.filter(p => p.life > 0);
    this.floatingTexts.forEach(t => t.update());
    this.floatingTexts = this.floatingTexts.filter(t => t.life > 0);
    this.waves.forEach(w => w.update());
    this.waves = this.waves.filter(w => w.life > 0);
  }

  _applyDamage(item) {
    let dmg = item.isSpike ? 2 : 1;
    this.dangerDamage += dmg;
    this.onGaugeChange?.(this.gauge / this.gaugeMax);
    if (this.dangerDamage >= 3) {
      this.isOver = true;
      if (this._rafId) cancelAnimationFrame(this._rafId);
      this.onGameOver?.();
    } else {
      this.canvas.classList.add('shake');
      setTimeout(() => this.canvas.classList.remove('shake'), 400);
    }
  }

  _judgeGoal(item) {
    const type = this.goalTypes[item.currentLane];
    const def = GOAL_DEFS[type];

    // ===== カラー判定（厳密） =====
    const colorGoal = this.colorGoals.find(cg => cg.laneIndex === item.currentLane);

    if (colorGoal) {
      if (item.ballColorId === colorGoal.colorId) {
        // PERFECT! 正解 of カラーゴール
        const bc = BALL_COLORS.find(c => c.id === item.ballColorId);
        this.gauge = Math.min(this.gaugeMax, this.gauge + 25);
        this.waves.push(new GoalWave(item.x, PLAY_H, bc.glow, 120, 5));
        this._burst(item.x, item.y, bc.glow, 45, { spread: 14, upward: 6, maxSize: 8, gravity: 0.1 });
        this.floatingTexts.push(new FloatingText(item.x, item.y - 30, 'PERFECT!', bc.ball));
        this.onGoalEffect?.('target');
      } else {
        // WRONG! (カラーミス -> ダメージ適用)
        this._applyDamage(item);
        this.waves.push(new GoalWave(item.x, PLAY_H, '#ef4444', 140, 6));
        this._burst(item.x, item.y, '#ef4444', 35, { spread: 18, upward: 2, maxSize: 6, gravity: 0.2 });
        this.floatingTexts.push(new FloatingText(item.x, item.y - 30, 'WRONG!', '#ef4444'));
        this.onGoalEffect?.('danger');
      }
      return;
    }

    if (item.ballColorId) {
      // カラーボールがノーマルゴールに入った (誤色進入 -> ダメージ適用)
      this._applyDamage(item);
      this.waves.push(new GoalWave(item.x, PLAY_H, '#ef4444', 140, 6));
      this._burst(item.x, item.y, '#ef4444', 35, { spread: 18, upward: 2, maxSize: 6, gravity: 0.2 });
      this.floatingTexts.push(new FloatingText(item.x, item.y - 30, 'WRONG!', '#ef4444'));
      this.onGoalEffect?.('danger');
      return;
    }

    if (type === 'target') {
      // ゲージ回復
      this.gauge = Math.min(this.gaugeMax, this.gauge + 15);
      this.waves.push(new GoalWave(item.x, PLAY_H, def.color, 120, 5));
      this._burst(item.x, item.y, def.color, 45, { spread: 14, upward: 6, maxSize: 8, gravity: 0.1 });
      this.floatingTexts.push(new FloatingText(item.x, item.y - 30, 'GOOD!', def.color));
      this.onGoalEffect?.('target');
    } else if (type === 'danger') {
      this._applyDamage(item);
      this.waves.push(new GoalWave(item.x, PLAY_H, '#ef4444', 140, 6));
      this._burst(item.x, item.y, '#ef4444', 35, { spread: 18, upward: 2, maxSize: 6, gravity: 0.2 });
      this.floatingTexts.push(new FloatingText(item.x, item.y - 30, 'DAMAGE!', '#ef4444'));
      this.onGoalEffect?.('danger');
    } else {
      // safe (三角) - ゲージ増減なし、ダメージなし
      this._burst(item.x, item.y, '#ffffff', 10);
      this.floatingTexts.push(new FloatingText(item.x, item.y - 30, 'SAFE', '#94a3b8'));
    }
  }

  // ===== カラーゴール管理 =====
  _initColorGoals() {
    // レーンをランダムに2〜4個選んでカラーゴールにする
    const numColors = randInt(2, 4);
    // targetはなるべく残すように、target以外のレーンを優先
    let candidates = [0,1,2,3,4].filter(i => this.goalTypes[i] !== 'target');
    candidates.sort(() => Math.random() - 0.5);
    if (candidates.length < numColors) {
      const targetLanes = [0,1,2,3,4].filter(i => this.goalTypes[i] === 'target');
      candidates = candidates.concat(targetLanes.sort(() => Math.random() - 0.5));
    }
    const chosen = candidates.slice(0, numColors);
    
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
    this._drawLanes(ctx);
    this._drawGoals(ctx);
    this.lines.forEach(l => l.draw(ctx));
    this.items.forEach(it => it.draw(ctx));
    this.particles.forEach(p => p.draw(ctx));
    this.waves.forEach(w => w.draw(ctx)); // 波紋描画
    this.floatingTexts.forEach(t => t.draw(ctx));
    this._drawGauge(ctx);
    this._drawNextSpawnIndicator(ctx);
    this._drawFastForwardIndicator(ctx);
  }

  // 早送り中インジケータを描画（日本語化対応）
  _drawFastForwardIndicator(ctx) {
    if (!this.isFastForward) return;

    // 時間経過による点滅パルスエフェクト
    const alpha = 0.5 + Math.sin(Date.now() * 0.007) * 0.25;

    ctx.save();
    // 半透明ガラスバッジの描画（画面上部中央）
    const rectW = 120;
    const rectH = 30;
    const rectX = (CANVAS_W - rectW) / 2;
    const rectY = 45;
    const radius = 6;

    // 背景（半透明のダークネイビー）
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(rectX, rectY, rectW, rectH, radius);
    } else {
      ctx.rect(rectX, rectY, rectW, rectH);
    }
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(249, 115, 22, 0.3)';
    ctx.fill();

    // ボーダー（オレンジで点滅）
    ctx.strokeStyle = `rgba(249, 115, 22, ${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // テキスト「早送り中 ▶▶」
    ctx.fillStyle = '#f97316'; // オレンジ
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('早送り中 ▶▶', CANVAS_W / 2, rectY + rectH / 2);
    ctx.restore();
  }

  // ===== 次のボール落下位置の予告 =====
  _drawNextSpawnIndicator(ctx) {
    if (this.nextSpawnLane === undefined) return;
    const x = laneX(this.nextSpawnLane);
    
    // timeElapsedを使って上下にフワフワさせる
    const offset = Math.sin(this.timeElapsed * 0.005) * 4;
    const y = 20 + offset; // 画面上部
    
    ctx.save();
    ctx.fillStyle = '#facc15'; // 予告矢印は黄色で目立たせる
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#facc15';
    
    // 下向きの矢印（三角形）を描画
    ctx.beginPath();
    ctx.moveTo(x - 8, y);
    ctx.lineTo(x + 8, y);
    ctx.lineTo(x, y + 10);
    ctx.closePath();
    ctx.fill();
    
    // 矢印の上部の棒を描画
    ctx.fillRect(x - 3, y - 10, 6, 10);
    
    ctx.restore();
  }

  // ===== ゲージ描画（Canvasの最上部） =====
  _drawGauge(ctx) {
    // ゲージはHTML/CSS側で表示されるため、Canvas内での描画は不要。赤文字のENERGY表記もここに含まれていたため、完全に無効化します。
  }

  _drawBg(ctx) {
    ctx.save();

    // ===== 木目の縦ストライプ（板の木目を表現）=====
    for (let i = 0; i < LANE_COUNT; i++) {
      const x = i * LANE_W;
      // 各レーンを微妙に異なる木材色でフィル
      const shade = (i % 2 === 0) ? 'rgba(255,180,90,0.022)' : 'rgba(200,130,60,0.018)';
      ctx.fillStyle = shade;
      ctx.fillRect(x, 0, LANE_W, PLAY_H);
    }

    // 木目の横筋（年輪っぽい薄い線）
    ctx.strokeStyle = 'rgba(180,120,60,0.06)';
    ctx.lineWidth = 0.5;
    for (let y = 0; y < PLAY_H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke();
    }
    // 細かい木目の筋
    ctx.strokeStyle = 'rgba(255,200,120,0.025)';
    ctx.lineWidth = 0.5;
    for (let y = 0; y < PLAY_H; y += 8) {
      // わずかにランダムに波打たせる
      const wave = Math.sin(y * 0.04) * 2;
      ctx.beginPath(); ctx.moveTo(wave, y); ctx.lineTo(CANVAS_W + wave, y); ctx.stroke();
    }

    // 線が引けるガイドライン（スナップ候補ライン）
    ctx.strokeStyle = 'rgba(200, 150, 70, 0.14)'; // 琥珀色の薄いガイド
    ctx.lineWidth = 1.0;
    ctx.setLineDash([4, 6]);
    for (let y = SNAP_START_Y; y <= SNAP_END_Y; y += SNAP_INTERVAL) {
      ctx.beginPath();
      ctx.moveTo(15, y);
      ctx.lineTo(CANVAS_W - 15, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();
  }

  _drawLanes(ctx) {
    ctx.save();
    for (let i = 0; i < LANE_COUNT; i++) {
      const x = laneX(i);
      // 木の柱（縦線）を木目色グラデーションで描画
      const grad = ctx.createLinearGradient(x - 2, 0, x + 2, 0);
      grad.addColorStop(0,   'rgba(100, 65, 25, 0.0)');
      grad.addColorStop(0.3, 'rgba(140, 90, 35, 0.7)');
      grad.addColorStop(0.5, 'rgba(170,115, 45, 0.9)');
      grad.addColorStop(0.7, 'rgba(140, 90, 35, 0.7)');
      grad.addColorStop(1,   'rgba(100, 65, 25, 0.0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(180,120,50,0.3)';
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, PLAY_H); ctx.stroke();
    }
    ctx.shadowBlur = 0;
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
      
      let def = bc
        ? { color: bc.ball, label: '●', glow: true }
        : { ...GOAL_DEFS[type] };

      // ===== ゴール背景：木製の台座風 =====
      // ベース（濃い木目色）
      const bgGrad = ctx.createLinearGradient(gx, gy, gx + LANE_W, gy + GOAL_H);
      bgGrad.addColorStop(0,   '#2c1a0a');
      bgGrad.addColorStop(0.3, '#3a2210');
      bgGrad.addColorStop(0.7, '#2e1b0b');
      bgGrad.addColorStop(1,   '#1e1006');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(gx, gy, LANE_W, GOAL_H);

      // 木目の縦筋
      ctx.save();
      ctx.globalAlpha = 0.06;
      for (let wx = gx + 4; wx < gx + LANE_W; wx += 8) {
        ctx.strokeStyle = 'rgba(255,200,120,1)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(wx, gy);
        ctx.lineTo(wx + 1, gy + GOAL_H);
        ctx.stroke();
      }
      ctx.restore();

      // 上端の横桟（木の枠組み）
      ctx.fillStyle = 'rgba(200,150,70,0.25)';
      ctx.fillRect(gx, gy, LANE_W, 3);

      // カラーバー（ゴール種別の色帯）
      ctx.fillStyle = def.color;
      ctx.fillRect(gx, gy, LANE_W, 4);

      // グロー
      if (def.glow) {
        const gg = ctx.createLinearGradient(gx, gy, gx, gy + GOAL_H);
        gg.addColorStop(0, def.color + '28');
        gg.addColorStop(1, 'transparent');
        ctx.fillStyle = gg;
        ctx.fillRect(gx, gy, LANE_W, GOAL_H);
      }

      // ラベル（カラーゴールは色付き円）
      ctx.save();
      if (bc) {
        ctx.shadowBlur = 16; ctx.shadowColor = bc.glow;
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
        ctx.font = `bold 24px 'Noto Serif JP', serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        if (def.glow) { ctx.shadowBlur = 14; ctx.shadowColor = def.color; }
        ctx.fillText(def.label, gx + LANE_W / 2, gy + GOAL_H * 0.45);
      }
      ctx.restore();

      // 区切り線（木の柱の境界）
      ctx.save();
      ctx.strokeStyle = 'rgba(100,65,25,0.8)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx, gy + GOAL_H); ctx.stroke();
      ctx.restore();
    }
  }

  _burst(x, y, color, count = 15, opts = {}) {
    for (let i = 0; i < count; i++) this.particles.push(new Particle(x, y, color, opts));
  }
}

// ===== エクスポート =====
export { HorizontalLine, Item, FloatingText, LANE_COUNT, CANVAS_W, CANVAS_H, PLAY_H, BALL_COLORS, laneX, rand, randInt };

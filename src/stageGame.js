/**
 * stageGame.js - ステージクリアモード用 Game 拡張クラス
 */
import { Game, HorizontalLine, Item, FloatingText, laneX, rand, randInt, LANE_COUNT, PLAY_H, BALL_COLORS, GoalWave, SNAP_START_Y, SNAP_INTERVAL } from './game.js';

const MIN_LINE_Y_GAP = 45;

export class StageGame extends Game {
  constructor(canvas) {
    super(canvas);
    this.stageData = null;
    this.onStageClear   = null; // (stars) => void
    this.onStageOver    = null; // () => void
    this.onGoalCount    = null; // (clearCount, needed) => void
    this.onMissCount    = null; // (miss, maxMiss) => void
    this.onTimeTick     = null; // (remaining) => void
    this._stageOver     = false;
    this._stageCleared  = false;
  }

  // ===== ステージ開始 =====
  startStage(stageData) {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this.stageData = stageData;

    // ステージクリア・ゲームオーバーのフラグを初期化
    this._stageOver     = false;
    this._stageCleared  = false;

    // 親クラスの_initStateをベースにリセット
    this._initState();

    // ステージ固有パラメータ上書き
    this.goalTypes  = [...stageData.goalTypes];
    // ステージIDが20以上（中盤以降）の場合、三角ゴール（safe）をすべてバツゴール（danger）に変更
    if (stageData.id >= 20) {
      this.goalTypes = this.goalTypes.map(t => t === 'safe' ? 'danger' : t);
    }
    this.colorGoals = [];
    this.ballsLeft  = Infinity; // ボール数は無制限に設定
    this.timeRemaining = null; // 時間制限を完全に無効化

    // ゲージ初期化
    this.gaugeDrainPerSec = 0;
    this.gauge = 0;
    this.gaugeMax = 100;
    this.dangerDamage = 0;
    this.nextSpawnLane = randInt(0, LANE_COUNT - 1);
    this.onGaugeChange?.(this.gauge / this.gaugeMax);

    // 固定線を配置
    this.lines = [];
    this._placeFixedLines(stageData.fixedLines || []);

    // カラーゴール（ballColorsが有効なら初期化）
    if (stageData.ballColors) {
      this._initColorGoals();
    }

    this.lastSpawnTime = Date.now();
    this._lastTime = performance.now();
    this._tick(this._lastTime);
  }

  // ===== 固定線の配置 =====
  _placeFixedLines(defs) {
    for (const def of defs) {
      // Y座標を決まったスナップ位置に丸め込む
      const snappedY = Math.round((def.y - SNAP_START_Y) / SNAP_INTERVAL) * SNAP_INTERVAL + SNAP_START_Y;

      const line = new HorizontalLine(def.leftLaneIndex, snappedY);
      line.alpha = 1; // 最初から見える
      line.setKind(def.kind);
      // ギミック固有プロパティ
      if (def.kind === 'warp' && def.warpToLane !== null) {
        let pairLi = def.warpToLane;
        if (pairLi >= LANE_COUNT - 1) pairLi = LANE_COUNT - 2;
        
        if (!this.lines.some(l => l.kind === 'warp' && l.y === snappedY && l.leftLaneIndex === pairLi)) {
          const pairLine = new HorizontalLine(pairLi, snappedY);
          pairLine.alpha = 1;
          pairLine.setKind('warp');
          line.warpPairId = pairLine.id;
          pairLine.warpPairId = line.id;
          this.lines.push(pairLine);
        }
      }
      if (def.kind === 'colorChange' && def.colorChangeTarget) {
        line.colorChangeTarget = def.colorChangeTarget;
      }
      if (def.kind === 'colorFilter' && def.filterColorId) {
        line.filterColorId = def.filterColorId;
      }
      if (def.kind === 'moving') {
        line.baseY = def.y;
        line.moveAmplitude = def.amplitude || 40;
        line.moveSpeed = def.speed || 0.025;
        line.movePhase = 0;
      }
      if (def.kind === 'blink') {
        line.blinkInterval = def.blinkInterval || 50;
        line.isActive = true;
        line.blinkTimer = 0;
      }
      this.lines.push(line);
    }
  }

  // ===== ゲームループ上書き =====
  _update(delta) {
    if (this._stageOver || this._stageCleared) return;
    const now = Date.now();
    this.timeElapsed += delta;

    // タイムリミット
    if (this.timeRemaining !== null) {
      this.timeRemaining -= delta;
      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.onTimeTick?.(0);
        this._endStage(false, '時間切れ！');
        return;
      }
      this.onTimeTick?.(Math.ceil(this.timeRemaining / 1000));
    }

    // 横線更新
    this.lines.forEach(l => l.update());

    // ボール生成（残りボール数でスポーン）
    // ステージごとのmaxBalls設定を使用、なければデフォルト
    const maxBalls = this.stageData.maxBalls || (this.stageData.ballColors ? 2 : 1);
    let canSpawn = false;
    
    // 難易度(stageId)に応じて、次のボールを出すための間隔を変える
    let spawnThresholdRatio = 0.5; // 基本は半分
    const stageId = this.stageData.id || 1;
    if (stageId >= 60) spawnThresholdRatio = 0.35; // Tier4以上で少し早く
    if (stageId >= 120) spawnThresholdRatio = 0.15; // Tier5後半以降はほぼ同時

    if (this.ballsLeft > 0 && this.items.length === 0) {
      canSpawn = true;
    } else if (this.ballsLeft > 0 && this.items.length < maxBalls) {
      const lastItem = this.items[this.items.length - 1];
      if (lastItem && lastItem.y > PLAY_H * spawnThresholdRatio) {
        canSpawn = true;
      }
    }

    if (canSpawn && (now - this.lastSpawnTime > 300)) {
      this._spawnStageBallDirectly();
    }

    // ボール更新
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.setLines(this.lines);
      item.update();

      // 天井衝突バウンド
      if (item.hasHitCeiling) {
        item.hasHitCeiling = false;
        this._burst(item.x, 2, '#d946ef', 12, { spread: 6, upward: -2 });
        this.floatingTexts.push(this._makeText(item.x, 30, 'BOUNCE!', '#d946ef'));
      }

      // 線通過エフェクト処理
      if (item.lastHitLine) {
        const hl = item.lastHitLine;
        item.lastHitLine = null;
        this._handleLineHit(item, hl);
      }

      // ゴール到達判定
      if (item.y > PLAY_H) {
        this._judgeStageGoal(item);
        this.items.splice(i, 1);
      }
    }

    // ゴール移動（stageData.goalRotating）
    if (this.stageData.goalRotating && now - this.lastGoalRotateTime > 8000) {
      this._rotateGoal();
      this.lastGoalRotateTime = now;
    }

    // パーティクル・テキスト更新
    this.particles.forEach(p => p.update());
    this.particles = this.particles.filter(p => p.life > 0);
    this.floatingTexts.forEach(t => t.update());
    this.floatingTexts = this.floatingTexts.filter(t => t.life > 0);


  }

  // ボールスポーン（game.jsのItemを参照）
  _spawnBall(lane) {
    // ステージ後半は速度をマイルドにするため、引き上げ倍率を段階的に抑えます
    let mult = 1.2;
    if (this.stageData.id >= 70) {
      mult = 0.95; // 終盤ステージはかなりマイルドに
    } else if (this.stageData.id >= 40) {
      mult = 1.05; // 中後半ステージ
    }
    const baseSpeed = this.stageData.ballSpeed * mult;
    const speed = baseSpeed * (0.85 + Math.random() * 0.3);
    return new Item(lane, speed);
  }

  // ステージ専用ボール直接スポーン（即時追加用）
  _spawnStageBallDirectly() {
    if (this.ballsLeft <= 0) return;
    const lane = this.nextSpawnLane;
    this.nextSpawnLane = randInt(0, LANE_COUNT - 1);
    const item = this._spawnBall(lane);
    
    let spawnColor = false;
    if (this.stageData.ballColors && this.colorGoals.length > 0) {
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
    this.ballsLeft--;
    this.lastSpawnTime = Date.now();
  }

  // ===== 線通過エフェクト（ステージモード） =====
  _handleLineHit(item, hl) {
    if (hl.kind === 'bonus') {
      this.gauge = Math.min(this.gaugeMax, this.gauge + 8);
      this.floatingTexts.push(this._makeText(item.x, item.y, 'ENERGY!', '#fbbf24'));
      this.onGaugeChange?.(this.gauge / this.gaugeMax);
    } else if (hl.kind === 'spike' || hl.kind === 'penalty') {
      item.isSpike = true;
      this.floatingTexts.push(this._makeText(item.x, item.y, 'SPIKE!', '#c084fc'));
    } else if (hl.kind === 'colorChange' && hl.colorChangeTarget) {
      item.ballColorId = hl.colorChangeTarget;
      this.floatingTexts.push(this._makeText(item.x, item.y, 'COLOR!', '#34d399'));
      this._burst(item.x, item.y, '#34d399', 12, { spread: 8 });
    } else if (hl.kind === 'speedUp') {
      item.isSlow = false; // 加速時はスロー解除
      item.speedBoostTimer = 180;
      item.speedBoostMult = 2.0;
      this.floatingTexts.push(this._makeText(item.x, item.y, 'FAST!', '#f97316'));
      this._burst(item.x, item.y, '#f97316', 10, { spread: 6 });
    } else if (hl.kind === 'warp') {
      this._burst(item.x, item.y, '#f472b6', 20, { spread: 12 });
      this.floatingTexts.push(this._makeText(item.x, item.y, 'WARP!', '#f472b6'));
    } else if (hl.kind === 'slow') {
      item.isSlow = true;
      item.speedBoostTimer = 0; // 加速解除
      this.floatingTexts.push(this._makeText(item.x, item.y, 'SLOW!', '#a3e635'));
      this._burst(item.x, item.y, '#a3e635', 10, { spread: 6 });
      // 即時に次のボールを降らせる
      this._spawnStageBallDirectly();
    } else if (hl.kind === 'reverse') {
      if (item.hasReversed) return; // 既に反転したことがある場合は、これ以上反転させない
      item.reverseTimer = 180; // 3秒間上昇
      item.hasReversed = true; // 反転フラグを立てる
      item.crossedLineIds.clear(); // 反転開始時に通過済みリストをクリアして他の横線に触れるようにする
      hl.setKind('system'); // 一度ボールに触れたらシステム線に変更
      this.floatingTexts.push(this._makeText(item.x, item.y, 'REVERSE!', '#d946ef'));
      this._burst(item.x, item.y, '#d946ef', 12, { spread: 6 });
    } else if (hl.kind === 'split') {
      this.floatingTexts.push(this._makeText(item.x, item.y, 'SPLIT!', '#06b6d4'));
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
      newItem.isSpike = item.isSpike;
      newItem.hasReversed = item.hasReversed; // 反転フラグを引き継ぐ

      // 通過済み線IDを完全複製
      newItem.crossedLineIds = new Set(item.crossedLineIds);
      newItem.setLines(this.lines);
      this.items.push(newItem);
    }
  }

  _makeText(x, y, text, color) {
    return new FloatingText(x, y, text, color);
  }

  // ===== ゴール判定（ステージモード） =====
  _judgeStageGoal(item) {
    const type = this.goalTypes[item.currentLane];
    const colorGoal = this.colorGoals.find(cg => cg.laneIndex === item.currentLane);

    if (colorGoal) {
      if (item.ballColorId === colorGoal.colorId) {
        // PERFECT
        const bc = BALL_COLORS.find(c => c.id === item.ballColorId);
        let gain = 100 / (this.stageData.clearCount || 5);
        this.gauge = Math.min(this.gaugeMax, this.gauge + gain * 1.5);
        this.waves.push(new GoalWave(item.x, PLAY_H, bc.glow, 120, 5));
        this._burst(item.x, item.y, bc.glow, 45, { spread: 14, upward: 6, maxSize: 8, gravity: 0.1 });
        this.floatingTexts.push(this._makeText(item.x, item.y - 30, 'PERFECT!', bc.ball));
        this.onGaugeChange?.(this.gauge / this.gaugeMax);
        this._checkClear();
        this.onGoalEffect?.('target');
      } else {
        // WRONG（カラーミス → ダメージ加算）
        let dmg = item.isSpike ? 2 : 1;
        this.dangerDamage += dmg;
        this.waves.push(new GoalWave(item.x, PLAY_H, '#ef4444', 140, 6));
        this._burst(item.x, item.y, '#ef4444', 35, { spread: 18, upward: 2, maxSize: 6, gravity: 0.2 });
        this.floatingTexts.push(this._makeText(item.x, item.y - 30, 'WRONG!', '#ef4444'));
        this.onGaugeChange?.(this.gauge / this.gaugeMax); // ゲージバーの色を更新
        if (this.dangerDamage >= 3) {
          this._endStage(false, 'ダメージオーバー！');
        } else {
          this.canvas.classList.add('shake');
          setTimeout(() => this.canvas.classList.remove('shake'), 400);
        }
        this.onGoalEffect?.('danger');
      }
      return;
    }

    if (item.ballColorId) {
      // カラーボールがカラーゴール以外に入った（誤進入 → ダメージ加算）
      let dmg = item.isSpike ? 2 : 1;
      this.dangerDamage += dmg;
      this.waves.push(new GoalWave(item.x, PLAY_H, '#ef4444', 140, 6));
      this._burst(item.x, item.y, '#ef4444', 35, { spread: 18, upward: 2, maxSize: 6, gravity: 0.2 });
      this.floatingTexts.push(this._makeText(item.x, item.y - 30, 'WRONG!', '#ef4444'));
      this.onGaugeChange?.(this.gauge / this.gaugeMax); // ゲージバーの色を更新
      if (this.dangerDamage >= 3) {
        this._endStage(false, 'ダメージオーバー！');
      } else {
        this.canvas.classList.add('shake');
        setTimeout(() => this.canvas.classList.remove('shake'), 400);
      }
      this.onGoalEffect?.('danger');
      return;
    }

    if (type === 'target') {
      let gain = 100 / (this.stageData.clearCount || 5);
      this.gauge = Math.min(this.gaugeMax, this.gauge + gain);
      this.waves.push(new GoalWave(item.x, PLAY_H, '#4ade80', 120, 5));
      this._burst(item.x, item.y, '#4ade80', 45, { spread: 14, upward: 6, maxSize: 8, gravity: 0.1 });
      this.floatingTexts.push(this._makeText(item.x, item.y - 30, 'GOOD!', '#4ade80'));
      this.onGaugeChange?.(this.gauge / this.gaugeMax);
      this._checkClear();
      this.onGoalEffect?.('target');
    } else if (type === 'danger') {
      let dmg = item.isSpike ? 2 : 1;
      this.dangerDamage += dmg;
      this.onGaugeChange?.(this.gauge / this.gaugeMax);
      this.waves.push(new GoalWave(item.x, PLAY_H, '#ef4444', 140, 6));
      this._burst(item.x, item.y, '#ef4444', 35, { spread: 18, upward: 2, maxSize: 6, gravity: 0.2 });
      if (this.dangerDamage >= 3) {
        this._endStage(false, 'ダメージオーバー！');
      } else {
        this.canvas.classList.add('shake');
        setTimeout(() => this.canvas.classList.remove('shake'), 400);
      }
      this.floatingTexts.push(this._makeText(item.x, item.y - 30, 'DAMAGE!', '#ef4444'));
      this.onGoalEffect?.('danger');
    } else {
      this._burst(item.x, item.y, '#ffffff', 8);
      this.floatingTexts.push(this._makeText(item.x, item.y - 30, 'SAFE', '#94a3b8'));
    }
  }

  _checkClear() {
    if (this.gauge >= this.gaugeMax && !this._stageCleared) {
      this._endStage(true, 'STAGE CLEAR!');
    }
  }

  _endStage(success, reason) {
    if (this._stageOver || this._stageCleared) return;
    if (success) {
      this._stageCleared = true;
      if (this._rafId) cancelAnimationFrame(this._rafId);
      // ★評価
      const stars = this._calcStars();
      setTimeout(() => this.onStageClear?.(stars), 600);
    } else {
      this._stageOver = true;
      if (this._rafId) cancelAnimationFrame(this._rafId);
      setTimeout(() => this.onStageOver?.(), 600);
    }
  }

  _calcStars() {
    const m = this.dangerDamage;
    if (m === 0) return 3;
    if (m === 1) return 2;
    return 1;
  }

  // ゲームオーバーをオーバーライド（ステージモードはゲージ切れなし）
  _update_gauge() { /* ステージモードはゲージ不使用 */ }
}

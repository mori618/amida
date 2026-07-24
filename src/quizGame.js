/**
 * quizGame.js - クイズモード専用のゲームエンジンクラス（Gameクラスを継承）
 */
import { Game, HorizontalLine, Item, FloatingText, laneX, PLAY_H, BALL_COLORS, GoalWave, SNAP_START_Y, SNAP_INTERVAL, LANE_COUNT } from './game.js';

// クイズ用の定数
const ARROW_Y = 50;

export class QuizGame extends Game {
  constructor(canvas) {
    super(canvas);
    this.stageData = null;
    this.selectedChoice = null; // 'A' | 'B' | 'C' | null
    this.onComplete = null;     // (success) => void
    this.isRunning = false;     // ボールが走っている最中かどうか
    this.hasFinished = false;   // ボールがゴールし、クイズが完了したか
    this.reachedGoals = [];     // 複数ボールのゴール記録用
    this.isFastForwardToggled = false; // 右上のトグルスイッチ（永続早送り）
    this.longPressTimeout = null;      // 画面長押し検出用のタイマー
  }

  // タップ操作を完全に無効化（クイズはUIボタンで操作するため）、かつ長押し早送りイベントを追加
  _bindEvents() {
    this._handleInputBound = () => {};
    this._handleMoveBound = () => {};
    this._handleUpBound = () => {};

    // 画面長押しによる早送り制御
    const startPress = (e) => {
      if (this.longPressTimeout) {
        clearTimeout(this.longPressTimeout);
      }
      this.longPressTimeout = setTimeout(() => {
        this.isFastForward = true;
        this._draw(); // 静止状態でもインジケータを即時描画
      }, 300);
    };

    const endPress = () => {
      if (this.longPressTimeout) {
        clearTimeout(this.longPressTimeout);
        this.longPressTimeout = null;
      }
      // もし永続トグルがONでなければ、早送りをOFFに戻す
      if (!this.isFastForwardToggled) {
        this.isFastForward = false;
        this._draw(); // 静止状態でもインジケータを即時消去
      }
    };

    this.canvas.addEventListener('mousedown', startPress);
    this.canvas.addEventListener('mouseup', endPress);
    this.canvas.addEventListener('mouseleave', endPress);

    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startPress(e);
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      endPress();
    }, { passive: false });

    this.canvas.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      endPress();
    }, { passive: false });
  }

  _handleInput(event, isMove = false) {
    // 何もしない
  }

  // ===== クイズの読み込みと初期化 =====
  loadQuiz(stageData) {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this.stageData = stageData;
    this.selectedChoice = null;
    this.isRunning = false;
    this.hasFinished = false;
    this.isFastForward = this.isFastForwardToggled; // 早送り状態をトグル設定と同期

    // 親クラスの _initState をベースに状態をリセット
    this._initState();
    
    // クイズ固有の初期化
    this.lines = [];
    this.items = [];
    this.particles = [];
    this.floatingTexts = [];
    this.waves = [];

    // 線を初期状態で配置（選択肢はまだ選ばれていない）
    this._placeQuizLines();
    this._draw();
  }

  // ===== クイズタイプに応じた線の配置 =====
  _placeQuizLines() {
    this.lines = [];
    let defs = [];

    if (!this.stageData) return;

    if (this.stageData.type === 'REMOVE_LINE') {
      // クイズB: 選択された線（A, B, C）を除外して配置
      const fixedLines = this.stageData.fixedLines || [];
      defs = fixedLines.filter(line => line.label !== this.selectedChoice);
    } else if (this.stageData.type === 'ADD_LINE') {
      // クイズC: 選択された候補線（A, B, C）のみを追加して配置
      const fixedLines = this.stageData.fixedLines || [];
      defs = [...fixedLines];
      if (this.selectedChoice) {
        const candidate = this.stageData.candidateLines.find(c => c.label === this.selectedChoice);
        if (candidate) {
          defs.push(candidate);
        }
      }
    } else {
      // クイズA, D: 通常の固定線を配置
      defs = this.stageData.fixedLines || [];
    }

    // 線を生成して追加
    for (const def of defs) {
      const snappedY = Math.round((def.y - SNAP_START_Y) / SNAP_INTERVAL) * SNAP_INTERVAL + SNAP_START_Y;
      const line = new HorizontalLine(def.leftLaneIndex, snappedY);
      line.alpha = 1;
      line.setKind(def.kind || 'system');
      line.label = def.label || null; // 描画用ラベルを転記
      if (def.filterColorId) {
        line.filterColorId = def.filterColorId;
      }

      // ワープギミックの初期化（stageGame.js と同様）
      if (def.kind === 'warp' && def.warpToLane !== null && def.warpToLane !== undefined) {
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

      this.lines.push(line);
    }
  }

  // ===== ユーザーの選択選択肢反映 =====
  selectChoice(choice) {
    if (this.isRunning) return; // アニメーション実行中は選択不可
    this.selectedChoice = choice;
    this._placeQuizLines();
    this._draw();
  }

  // ===== ボール発射（決定ボタン押下時） =====
  runBall(onComplete) {
    if (this.isRunning || !this.selectedChoice) return;
    this.isFastForward = this.isFastForwardToggled; // ボール発射時にも早送り状態をトグル設定と同期
    this.onComplete = onComplete;
    this.isRunning = true;
    this.hasFinished = false;
    this.reachedGoals = []; // ゴール記録用配列を初期化

    this.items = [];

    if (this.stageData.type === 'FASTEST_BALL' || this.stageData.type === 'SPIKE_BALL' || this.stageData.type === 'COUNT_BALLS') {
      // 3箇所から同時にボールを落とす
      const arrows = this.stageData.arrows || {};
      for (const laneStr in arrows) {
        const startLabel = arrows[laneStr];
        const lane = parseInt(laneStr);
        let speed = 1.0;
        if (this.stageData.startSpeeds && this.stageData.startSpeeds[startLabel]) {
          speed = this.stageData.startSpeeds[startLabel];
        }
        
        const item = new Item(lane, speed);
        item.y = ARROW_Y;
        item.startLabel = startLabel; // どの矢印から落ちたボールかを記録
        item.setLines(this.lines);

        if (this.stageData.startSlows && this.stageData.startSlows[startLabel]) {
          item.isSlow = true;
        }

        this.items.push(item);
      }
    } else {
      // 通常の単一ボール発射
      let startLane = this.stageData.startLane;
      if (this.stageData.type === 'WHICH_ARROW') {
        const matchedLaneStr = Object.keys(this.stageData.arrows).find(
          lane => this.stageData.arrows[lane] === this.selectedChoice
        );
        if (matchedLaneStr !== undefined) {
          startLane = parseInt(matchedLaneStr);
        }
      }

      const item = new Item(startLane, 1.0);
      item.y = ARROW_Y;
      if (this.stageData.startBallColor) {
        item.ballColorId = this.stageData.startBallColor;
      }
      item.setLines(this.lines);
      this.items = [item];
    }

    this._lastTime = performance.now();
    this._tick(this._lastTime);
  }

  // ===== クイズゲームループ =====
  _update(delta) {
    if (!this.isRunning || this.hasFinished) return;

    // 横線の更新
    this.lines.forEach(l => l.update());

    // すべてのボールを更新
    const activeItems = [...this.items];
    for (let i = 0; i < activeItems.length; i++) {
      const item = activeItems[i];
      item.setLines(this.lines);
      item.update();

      // 線通過エフェクト処理
      if (item.lastHitLine) {
        const hl = item.lastHitLine;
        item.lastHitLine = null;
        this._handleLineHit(item, hl);
      }

      // もしブラックホール等で破壊されたら、ゴールせずに消去
      if (item.isDestroyed) {
        const idx = this.items.indexOf(item);
        if (idx !== -1) {
          this.items.splice(idx, 1);
        }
        continue;
      }

      // ゴール到達判定
      if (item.y > PLAY_H) {
        this._judgeQuizGoal(item);
        const idx = this.items.indexOf(item);
        if (idx !== -1) {
          this.items.splice(idx, 1);
        }
      }
    }

    // すべてのボールがゴールし終わったら最終判定をトリガー
    if (this.items.length === 0 && !this.hasFinished) {
      this._completeQuizSimulation();
    }

    // パーティクル・エフェクト更新
    this.particles.forEach(p => p.update());
    this.particles = this.particles.filter(p => p.life > 0);
    this.floatingTexts.forEach(t => t.update());
    this.floatingTexts = this.floatingTexts.filter(t => t.life > 0);
    this.waves.forEach(w => w.update());
    this.waves = this.waves.filter(w => w.life > 0);
  }

  // 線通過時の演出およびギミック処理（新規ギミック対応）
  _handleLineHit(item, hl) {
    if (hl.kind === 'warp') {
      this._burst(item.x, item.y, '#f472b6', 20, { spread: 12 });
      this.floatingTexts.push(this._makeText(item.x, item.y, 'WARP!', '#f472b6'));
    } else if (hl.kind === 'speedUp') {
      item.speedBoostTimer = 180;
      item.speedBoostMult = 2.0;
      item.isSlow = false;
      this.floatingTexts.push(this._makeText(item.x, item.y, 'FAST!', '#f97316'));
      this._burst(item.x, item.y, '#f97316', 10, { spread: 6 });
    } else if (hl.kind === 'reverse') {
      if (item.hasReversed) return; // 既に反転したことがある場合は、これ以上反転させない
      item.reverseTimer = 180;
      item.activeReverseLineId = hl.id; // 反転線のIDを記録
      item.hasReversed = true; // 反転フラグを立てる
      // 重力反転衝突時の即時クリアは廃止し、天井バウンド時またはタイマー終了時に委ねます
      this.floatingTexts.push(this._makeText(item.x, item.y, 'REVERSE!', '#d946ef'));
      this._burst(item.x, item.y, '#d946ef', 12, { spread: 6 });
    } else if (hl.kind === 'split') {
      this.floatingTexts.push(this._makeText(item.x, item.y, 'SPLIT!', '#06b6d4'));
      this._burst(item.x, item.y, '#06b6d4', 15, { spread: 8 });
      item.crossedLineIds.add(hl.id);

      // 直進落下する新しいItemを複製
      const nextLane = item.currentLane;
      const newItem = new Item(nextLane, item.speed);
      const speedMult = item.isSlow ? 0.5 : 1.0;
      const effectiveSpeed = item.speed * item.speedBoostMult * speedMult;
      newItem.y = hl.y + effectiveSpeed + 2;
      newItem.x = laneX(nextLane);

      // プロパティ引継ぎ
      newItem.ballColorId = item.ballColorId;
      newItem.isSlow = item.isSlow;
      newItem.speedBoostTimer = item.speedBoostTimer;
      newItem.speedBoostMult = item.speedBoostMult;
      newItem.reverseTimer = item.reverseTimer;
      newItem.hasReversed = item.hasReversed; // 反転フラグを引き継ぐ
      newItem.isSpike = item.isSpike;
      newItem.startLabel = item.startLabel;

      newItem.crossedLineIds = new Set(item.crossedLineIds);
      newItem.setLines(this.lines);
      this.items.push(newItem);
    } else if (hl.kind === 'slow') {
      item.isSlow = true;
      item.speedBoostTimer = 0;
      this.floatingTexts.push(this._makeText(item.x, item.y, 'SLOW!', '#a3e635'));
      this._burst(item.x, item.y, '#a3e635', 10, { spread: 6 });
    } else if (hl.kind === 'spike') {
      item.isSpike = true;
      this.floatingTexts.push(this._makeText(item.x, item.y, 'SPIKE!', '#c084fc'));
      this._burst(item.x, item.y, '#c084fc', 8, { spread: 4 });
    } else if (hl.kind === 'paintRed') {
      let oldColor = item.ballColorId || 'none';
      let newColor = 'red';
      if (oldColor === 'blue') newColor = 'purple';
      else if (oldColor === 'yellow') newColor = 'orange';
      
      item.ballColorId = newColor;
      this.floatingTexts.push(this._makeText(item.x, item.y, 'RED INK!', '#f472b6'));
      this._burst(item.x, item.y, '#f472b6', 15, { spread: 6 });
    } else if (hl.kind === 'paintBlue') {
      let oldColor = item.ballColorId || 'none';
      let newColor = 'blue';
      if (oldColor === 'red') newColor = 'purple';
      else if (oldColor === 'yellow') newColor = 'green';
      
      item.ballColorId = newColor;
      this.floatingTexts.push(this._makeText(item.x, item.y, 'BLUE INK!', '#60a5fa'));
      this._burst(item.x, item.y, '#60a5fa', 15, { spread: 6 });
    } else if (hl.kind === 'paintYellow') {
      let oldColor = item.ballColorId || 'none';
      let newColor = 'yellow';
      if (oldColor === 'red') newColor = 'orange';
      else if (oldColor === 'blue') newColor = 'green';
      
      item.ballColorId = newColor;
      this.floatingTexts.push(this._makeText(item.x, item.y, 'YELLOW INK!', '#fbbf24'));
      this._burst(item.x, item.y, '#fbbf24', 15, { spread: 6 });
    } else if (hl.kind === 'blackhole') {
      item.isDestroyed = true;
      this.floatingTexts.push(this._makeText(item.x, item.y, 'ABSORBED!', '#94a3b8'));
      this._burst(item.x, item.y, '#475569', 25, { spread: 10, maxSize: 6 });
    }
  }

  _makeText(x, y, text, color) {
    return new FloatingText(x, y, text, color);
  }

  // ===== 個別のボールがゴールに到達した際の判定 =====
  _judgeQuizGoal(item) {
    const goalLabel = this.stageData.goals ? this.stageData.goals[item.currentLane] : null;
    this.reachedGoals.push({
      lane: item.currentLane,
      label: goalLabel,
      startLabel: item.startLabel || null,
      isSpike: item.isSpike,
      ballColorId: item.ballColorId || 'none', // これを追加！
      time: performance.now()
    });

    const isSuccessGoal = this._checkSingleGoalSuccess(item);

    // 演出をトリガー
    if (isSuccessGoal) {
      this.waves.push(new GoalWave(item.x, PLAY_H, '#4ade80', 140, 6));
      this._burst(item.x, item.y, '#4ade80', 45, { spread: 14, upward: 6, maxSize: 8, gravity: 0.1 });
    } else {
      this.waves.push(new GoalWave(item.x, PLAY_H, '#ef4444', 140, 6));
      this._burst(item.x, item.y, '#ef4444', 35, { spread: 18, upward: 2, maxSize: 6, gravity: 0.2 });
      this.canvas.classList.add('shake');
      setTimeout(() => this.canvas.classList.remove('shake'), 400);
    }
  }

  // 単一のボールが成功したかどうかの補助判定
  _checkSingleGoalSuccess(item) {
    if (!this.stageData) return false;
    
    if (this.stageData.type === 'WHICH_GOAL') {
      const reachedGoalLabel = this.stageData.goals[item.currentLane];
      return reachedGoalLabel === this.stageData.correctAnswer;
    } else if (this.stageData.type === 'NOT_GOAL') {
      const reachedGoalLabel = this.stageData.goals[item.currentLane];
      return reachedGoalLabel !== this.stageData.correctAnswer;
    } else if (this.stageData.type === 'FASTEST_BALL' || this.stageData.type === 'SPIKE_BALL') {
      return item.currentLane === this.stageData.targetGoalLane;
    } else {
      return item.currentLane === this.stageData.targetGoalLane;
    }
  }

  // ===== すべてのボールがゴールした際の最終完了判定 =====
  _completeQuizSimulation() {
    this.hasFinished = true;
    this.isRunning = false;

    let isSuccess = false;

    if (this.stageData.type === 'WHICH_GOAL') {
      isSuccess = this.reachedGoals.some(g => g.label === this.selectedChoice);
    } else if (this.stageData.type === 'NOT_GOAL') {
      const reachedLabels = this.reachedGoals.map(g => g.label).filter(Boolean);
      isSuccess = !reachedLabels.includes(this.selectedChoice);
    } else if (this.stageData.type === 'FASTEST_BALL') {
      const targetGoals = this.reachedGoals
        .filter(g => g.lane === this.stageData.targetGoalLane)
        .sort((a, b) => a.time - b.time);
      
      if (targetGoals.length > 0) {
        isSuccess = (targetGoals[0].startLabel === this.selectedChoice);
      }
    } else if (this.stageData.type === 'SPIKE_BALL') {
      const spikeGoal = this.reachedGoals.find(g => g.isSpike);
      if (spikeGoal) {
        isSuccess = (spikeGoal.startLabel === this.selectedChoice);
      }
    } else if (this.stageData.type === 'COLOR_MIX') {
      // 実際にゴールしたボール（1つ目のボール）の色が、期待する色と一致するか
      if (this.reachedGoals.length > 0) {
        const finalColor = this.reachedGoals[0].ballColorId;
        const jpColor = this.stageData.choices[this.selectedChoice];
        const colorMap = {
          '赤': 'red',
          '青': 'blue',
          '黄': 'yellow',
          '紫': 'purple',
          '緑': 'green',
          'オレンジ': 'orange',
          'none': 'none'
        };
        const expectedColor = colorMap[jpColor] || jpColor;
        isSuccess = (finalColor === expectedColor);
      }
    } else if (this.stageData.type === 'COUNT_BALLS') {
      // 実際にゴールしたボールの個数が、正解の選択肢に紐づく期待数と一致するか
      const finalCount = this.reachedGoals.length;
      const expectedText = this.stageData.choices[this.selectedChoice];
      const expectedCount = parseInt(expectedText); // "2個" -> 2
      isSuccess = (finalCount === expectedCount);
    } else {
      isSuccess = this.reachedGoals.some(g => g.lane === this.stageData.targetGoalLane);
    }

    setTimeout(() => {
      if (this._rafId) cancelAnimationFrame(this._rafId);
      this.onComplete?.(isSuccess);
    }, 1000);
  }

  // ===== 描画オーバーライド =====
  _draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._drawBg(this.ctx);
    this._drawLanes(this.ctx);

    // 点線の候補線を描画（クイズC: ADD_LINE の選択肢以外の候補線）
    if (this.stageData && this.stageData.type === 'ADD_LINE') {
      this._drawCandidateLines();
    }

    // 通常の線を描画
    this.lines.forEach(l => l.draw(this.ctx));

    // 線のラベルバッジを描画（クイズB、C）
    if (this.stageData && (this.stageData.type === 'REMOVE_LINE' || this.stageData.type === 'ADD_LINE')) {
      this._drawQuizLineBadges();
    }

    // ゴールの描画（クイズ特有）
    this._drawQuizGoals();

    // スタート矢印の描画（クイズ特有）
    this._drawQuizStartArrows();

    // ボールとエフェクトの描画
    this.items.forEach(item => item.draw(this.ctx));
    this.particles.forEach(p => p.draw(this.ctx));
    this.floatingTexts.forEach(t => t.draw(this.ctx));
    this.waves.forEach(w => w.draw(this.ctx));

    // 早送り中インジケータを描画（親クラス Game のメソッド）
    this._drawFastForwardIndicator(this.ctx);
  }

  // ===== クイズC用: 選択されていない候補線を半透明の点線で描画 =====
  _drawCandidateLines() {
    const candidates = this.stageData.candidateLines || [];
    this.ctx.save();
    this.ctx.globalAlpha = 0.4;
    this.ctx.strokeStyle = '#c49a3c'; // 木のユーザー線の基本色
    this.ctx.lineWidth = 3;
    this.ctx.setLineDash([4, 4]); // 点線

    for (const c of candidates) {
      // 現在選ばれている候補線は実線で描かれるため、ここでは描画スキップ
      if (c.label === this.selectedChoice) continue;

      const snappedY = Math.round((c.y - SNAP_START_Y) / SNAP_INTERVAL) * SNAP_INTERVAL + SNAP_START_Y;
      const sx = laneX(c.leftLaneIndex);
      const ex = laneX(c.leftLaneIndex + 1);

      this.ctx.beginPath();
      this.ctx.moveTo(sx, snappedY);
      this.ctx.lineTo(ex, snappedY);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  // ===== 線の上のラベルバッジ（A, B, C）の描画 =====
  _drawQuizLineBadges() {
    this.ctx.save();
    this.ctx.shadowBlur = 4;
    this.ctx.shadowColor = 'rgba(0,0,0,0.5)';

    // 実線バッジの描画
    for (const line of this.lines) {
      if (line.label) {
        const sx = laneX(line.leftLaneIndex);
        const ex = laneX(line.leftLaneIndex + 1);
        const cx = (sx + ex) / 2;
        this._drawBadge(cx, line.y, line.label, false);
      }
    }

    // クイズCで、まだ選択されていない候補線のバッジ描画（半透明）
    if (this.stageData.type === 'ADD_LINE') {
      const candidates = this.stageData.candidateLines || [];
      for (const c of candidates) {
        if (c.label === this.selectedChoice) continue;
        const snappedY = Math.round((c.y - SNAP_START_Y) / SNAP_INTERVAL) * SNAP_INTERVAL + SNAP_START_Y;
        const sx = laneX(c.leftLaneIndex);
        const ex = laneX(c.leftLaneIndex + 1);
        const cx = (sx + ex) / 2;
        this._drawBadge(cx, snappedY, c.label, true);
      }
    }
    this.ctx.restore();
  }

  // 単一のバッジの描画ヘルパー
  _drawBadge(x, y, label, isSemiTransparent) {
    this.ctx.save();
    if (isSemiTransparent) this.ctx.globalAlpha = 0.5;

    // バッジの外枠（円形）
    this.ctx.beginPath();
    this.ctx.arc(x, y, 11, 0, Math.PI * 2);
    this.ctx.fillStyle = '#1e293b'; // 濃い目のダーク色
    this.ctx.strokeStyle = '#fbbf24'; // ゴールド枠
    this.ctx.lineWidth = 2;
    this.ctx.fill();
    this.ctx.stroke();

    // 文字
    this.ctx.font = 'bold 11px "Noto Sans JP", sans-serif';
    this.ctx.fillStyle = '#fbbf24'; // ゴールド文字
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(label, x, y);
    
    this.ctx.restore();
  }

  // ===== クイズゴールの描画（A, B, C または丸ゴール） =====
  _drawQuizGoals() {
    const GOAL_H = 75;
    const gy = PLAY_H;
    const LANE_W = 360 / LANE_COUNT;

    for (let i = 0; i < LANE_COUNT; i++) {
      const gx = i * LANE_W;
      
      this.ctx.save();
      
      // 基本のゴールフレーム描画（木の仕切り）
      this.ctx.strokeStyle = 'rgba(100,70,40,0.3)';
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.moveTo(gx, gy);
      this.ctx.lineTo(gx, gy + GOAL_H);
      this.ctx.stroke();

      if (this.stageData.type === 'WHICH_GOAL' || this.stageData.type === 'NOT_GOAL') {
        // クイズA/E: 各ゴールに A, B, C のラベルを表示
        const label = this.stageData.goals[i];
        if (label) {
          // ゴールのバックライト発光効果
          const isSelected = (this.selectedChoice === label);
          const bgGrad = this.ctx.createLinearGradient(gx, gy, gx + LANE_W, gy + GOAL_H);
          if (isSelected) {
            bgGrad.addColorStop(0, 'rgba(251, 191, 36, 0.25)'); // ゴールド発光
            bgGrad.addColorStop(1, 'rgba(251, 191, 36, 0.05)');
          } else {
            bgGrad.addColorStop(0, 'rgba(20, 15, 10, 0.6)');
            bgGrad.addColorStop(1, 'rgba(10, 5, 2, 0.8)');
          }
          this.ctx.fillStyle = bgGrad;
          this.ctx.fillRect(gx + 2, gy, LANE_W - 4, GOAL_H);

          // ラベルプレートの描画
          this.ctx.beginPath();
          this.ctx.arc(gx + LANE_W / 2, gy + GOAL_H * 0.44, 16, 0, Math.PI * 2);
          this.ctx.fillStyle = isSelected ? '#fbbf24' : '#334155';
          this.ctx.strokeStyle = '#fbbf24';
          this.ctx.lineWidth = 2;
          this.ctx.fill();
          this.ctx.stroke();

          // テキスト
          this.ctx.font = 'bold 15px "Noto Sans JP", sans-serif';
          this.ctx.fillStyle = isSelected ? '#1e293b' : '#fbbf24';
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText(label, gx + LANE_W / 2, gy + GOAL_H * 0.45);
        } else {
          // ラベルのないゴールは暗い背景
          this.ctx.fillStyle = 'rgba(10, 5, 2, 0.85)';
          this.ctx.fillRect(gx + 2, gy, LANE_W - 4, GOAL_H);
        }
      } else {
        // クイズB, C, D: 丸ゴール「◎」を特定のレーンに描画、他はダミー「✕」
        const isTarget = (i === this.stageData.targetGoalLane);
        const bgGrad = this.ctx.createLinearGradient(gx, gy, gx + LANE_W, gy + GOAL_H);
        
        if (isTarget) {
          bgGrad.addColorStop(0, 'rgba(74, 222, 128, 0.2)'); // 緑がかったゴールド発光
          bgGrad.addColorStop(1, 'rgba(74, 222, 128, 0.02)');
          this.ctx.fillStyle = bgGrad;
          this.ctx.fillRect(gx + 2, gy, LANE_W - 4, GOAL_H);

          // ◎（丸ゴール）ネオン風描画
          const cx = gx + LANE_W / 2;
          const cy = gy + GOAL_H * 0.44;
          
          this.ctx.shadowBlur = 10;
          this.ctx.shadowColor = '#4ade80';

          // 外側の円
          this.ctx.beginPath();
          this.ctx.arc(cx, cy, 15, 0, Math.PI * 2);
          this.ctx.strokeStyle = '#4ade80';
          this.ctx.lineWidth = 3;
          this.ctx.stroke();

          // 内側の円
          this.ctx.beginPath();
          this.ctx.arc(cx, cy, 7, 0, Math.PI * 2);
          this.ctx.strokeStyle = '#4ade80';
          this.ctx.lineWidth = 2.5;
          this.ctx.stroke();
        } else {
          bgGrad.addColorStop(0, 'rgba(10, 5, 2, 0.85)');
          bgGrad.addColorStop(1, 'rgba(5, 2, 1, 0.95)');
          this.ctx.fillStyle = bgGrad;
          this.ctx.fillRect(gx + 2, gy, LANE_W - 4, GOAL_H);

          // ダミーゴール「✕」
          const cx = gx + LANE_W / 2;
          const cy = gy + GOAL_H * 0.44;
          this.ctx.font = 'bold 16px "Noto Sans JP", sans-serif';
          this.ctx.fillStyle = 'rgba(148, 163, 184, 0.3)'; // 薄いグレーの✕
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText('✕', cx, cy);
        }
      }
      this.ctx.restore();
    }
  }

  // ===== スタート矢印の描画 =====
  _drawQuizStartArrows() {
    if (this.stageData.type === 'WHICH_ARROW' || this.stageData.type === 'FASTEST_BALL' || this.stageData.type === 'SPIKE_BALL') {
      // クイズD/E: スタート矢印が A, B, C の3種類
      const arrows = this.stageData.arrows || {};
      for (const lane in arrows) {
        const label = arrows[lane];
        const isSelected = (this.selectedChoice === label);
        const x = laneX(parseInt(lane));
        this._drawLabeledArrow(x, ARROW_Y, label, isSelected);
      }
    } else {
      // クイズA, B, C: 通常のスタート矢印が1つ
      const x = laneX(this.stageData.startLane);
      this._drawSingleArrow(x, ARROW_Y);
    }
  }

  // 通常の単一スタート矢印の描画
  _drawSingleArrow(x, y) {
    this.ctx.save();
    this.ctx.shadowBlur = 12;
    this.ctx.shadowColor = '#fbbf24';

    // 縦に弾むマイクロアニメーション
    const bounceOffset = Math.sin(performance.now() * 0.007) * 4;

    this.ctx.beginPath();
    this.ctx.moveTo(x, y - 10 + bounceOffset);
    this.ctx.lineTo(x - 12, y - 25 + bounceOffset);
    this.ctx.lineTo(x + 12, y - 25 + bounceOffset);
    this.ctx.closePath();
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.fill();

    // 軸
    this.ctx.fillRect(x - 4, y - 37 + bounceOffset, 8, 13);
    this.ctx.restore();
  }

  // ラベル（A, B, C）付きスタート矢印の描画
  _drawLabeledArrow(x, y, label, isSelected) {
    this.ctx.save();
    
    // 弾むアニメーション
    const bounceOffset = Math.sin(performance.now() * 0.007 + (label.charCodeAt(0) * 0.5)) * 3;
    const ay = y + bounceOffset;

    if (isSelected) {
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = '#fbbf24';
    }

    // 矢印（下向き三角）
    this.ctx.beginPath();
    this.ctx.moveTo(x, ay - 2);
    this.ctx.lineTo(x - 11, ay - 14);
    this.ctx.lineTo(x + 11, ay - 14);
    this.ctx.closePath();
    this.ctx.fillStyle = isSelected ? '#fbbf24' : '#64748b';
    this.ctx.fill();

    // ラベル用サークル背景（矢印の上）
    this.ctx.beginPath();
    this.ctx.arc(x, ay - 28, 12, 0, Math.PI * 2);
    this.ctx.fillStyle = isSelected ? '#fbbf24' : '#334155';
    this.ctx.strokeStyle = isSelected ? '#fbbf24' : '#64748b';
    this.ctx.lineWidth = 1.5;
    this.ctx.fill();
    this.ctx.stroke();

    // ラベル文字
    this.ctx.font = 'bold 11px "Noto Sans JP", sans-serif';
    this.ctx.fillStyle = isSelected ? '#1e293b' : '#fbbf24';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(label, x, ay - 27);

    this.ctx.restore();
  }
}

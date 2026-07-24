import { QUIZ_STAGES } from '../src/quizStages.js';
import { HorizontalLine, Item, PLAY_H, LANE_COUNT, laneX } from '../src/game.js';

// グローバルなIDカウンタ（game.jsのグローバルカウンタと被らないように適当に大きくしておく）
let lineIdCounter = 10000;

// クイズ用の定数
const ARROW_Y = 50;

// 色の日本語と英語の対応マップ
const COLOR_MAP = {
  '赤': 'red',
  '青': 'blue',
  '黄': 'yellow',
  '紫': 'purple',
  '緑': 'green',
  'オレンジ': 'orange',
  'none': 'none'
};

// 線の配置ロジック（quizGame.jsから移植）
function getLinesForStage(stageData, selectedChoice) {
  const lines = [];
  let defs = [];

  if (stageData.type === 'REMOVE_LINE') {
    const fixedLines = stageData.fixedLines || [];
    defs = fixedLines.filter(line => line.label !== selectedChoice);
  } else if (stageData.type === 'ADD_LINE') {
    const fixedLines = stageData.fixedLines || [];
    defs = [...fixedLines];
    if (selectedChoice) {
      const candidate = stageData.candidateLines.find(c => c.label === selectedChoice);
      if (candidate) {
        defs.push(candidate);
      }
    }
  } else {
    defs = stageData.fixedLines || [];
  }

  // スナップ用の定数をハードコード
  const SNAP_START_Y = 80;
  const SNAP_INTERVAL = 30;

  for (const def of defs) {
    const snappedY = Math.round((def.y - SNAP_START_Y) / SNAP_INTERVAL) * SNAP_INTERVAL + SNAP_START_Y;
    const line = new HorizontalLine(def.leftLaneIndex, snappedY);
    line.id = lineIdCounter++;
    line.setKind(def.kind || 'system');
    line.label = def.label || null;
    if (def.filterColorId) {
      line.filterColorId = def.filterColorId;
    }

    // ワープギミックのペア処理
    if (def.kind === 'warp' && def.warpToLane !== null && def.warpToLane !== undefined) {
      let pairLi = def.warpToLane;
      if (pairLi >= LANE_COUNT - 1) pairLi = LANE_COUNT - 2;

      if (!lines.some(l => l.kind === 'warp' && l.y === snappedY && l.leftLaneIndex === pairLi)) {
        const pairLine = new HorizontalLine(pairLi, snappedY);
        pairLine.id = lineIdCounter++;
        pairLine.setKind('warp');
        line.warpPairId = pairLine.id;
        pairLine.warpPairId = line.id;
        lines.push(pairLine);
      }
    }

    lines.push(line);
  }

  return lines;
}

// ギミック通過処理（quizGame.jsから移植）
function handleLineHit(item, hl, items, lines) {
  if (hl.kind === 'warp') {
    // warp処理はItem.update内で自動実行されるため、ここでは何もしません
  } else if (hl.kind === 'speedUp') {
    item.speedBoostTimer = 180;
    item.speedBoostMult = 2.0;
    item.isSlow = false;
  } else if (hl.kind === 'reverse') {
    item.reverseTimer = 180;
    item.activeReverseLineId = hl.id; // 反転線のIDを記録
    // 即時クリアを廃止し、game.js側（タイマー終了または天井バウンド）でクリアされるようにします
  } else if (hl.kind === 'split') {
    item.crossedLineIds.add(hl.id);

    // 分裂ボールの作成
    const nextLane = item.currentLane;
    const newItem = new Item(nextLane, item.speed);
    const speedMult = item.isSlow ? 0.5 : 1.0;
    const effectiveSpeed = item.speed * item.speedBoostMult * speedMult;
    newItem.y = hl.y + effectiveSpeed + 2;
    newItem.x = laneX(nextLane);

    newItem.ballColorId = item.ballColorId;
    newItem.isSlow = item.isSlow;
    newItem.speedBoostTimer = item.speedBoostTimer;
    newItem.speedBoostMult = item.speedBoostMult;
    newItem.reverseTimer = item.reverseTimer;
    newItem.isSpike = item.isSpike;
    newItem.startLabel = item.startLabel;

    newItem.crossedLineIds = new Set(item.crossedLineIds);
    newItem.setLines(lines);
    items.push(newItem);
  } else if (hl.kind === 'slow') {
    item.isSlow = true;
    item.speedBoostTimer = 0;
  } else if (hl.kind === 'spike') {
    item.isSpike = true;
  } else if (hl.kind === 'paintRed') {
    let oldColor = item.ballColorId || 'none';
    let newColor = 'red';
    if (oldColor === 'blue') newColor = 'purple';
    else if (oldColor === 'yellow') newColor = 'orange';
    item.ballColorId = newColor;
  } else if (hl.kind === 'paintBlue') {
    let oldColor = item.ballColorId || 'none';
    let newColor = 'blue';
    if (oldColor === 'red') newColor = 'purple';
    else if (oldColor === 'yellow') newColor = 'green';
    item.ballColorId = newColor;
  } else if (hl.kind === 'paintYellow') {
    let oldColor = item.ballColorId || 'none';
    let newColor = 'yellow';
    if (oldColor === 'red') newColor = 'orange';
    else if (oldColor === 'blue') newColor = 'green';
    item.ballColorId = newColor;
  } else if (hl.kind === 'blackhole') {
    item.isDestroyed = true;
  }
}

// 単一シミュレーション実行関数
function runSimulation(stageData, selectedChoice) {
  const lines = getLinesForStage(stageData, selectedChoice);

  const items = [];
  const reachedGoals = [];

  // ボールの初期化
  if (stageData.type === 'FASTEST_BALL' || stageData.type === 'SPIKE_BALL' || (stageData.type === 'COUNT_BALLS' && stageData.arrows)) {
    const arrows = stageData.arrows || {};
    for (const laneStr in arrows) {
      const startLabel = arrows[laneStr];
      const lane = parseInt(laneStr);
      let speed = 1.0;
      if (stageData.startSpeeds && stageData.startSpeeds[startLabel]) {
        speed = stageData.startSpeeds[startLabel];
      }
      
      const item = new Item(lane, speed);
      item.y = ARROW_Y;
      item.startLabel = startLabel;
      item.setLines(lines);

      if (stageData.startSlows && stageData.startSlows[startLabel]) {
        item.isSlow = true;
      }
      items.push(item);
    }
  } else {
    let startLane = stageData.startLane;
    if (stageData.type === 'WHICH_ARROW') {
      const matchedLaneStr = Object.keys(stageData.arrows).find(
        lane => stageData.arrows[lane] === selectedChoice
      );
      if (matchedLaneStr !== undefined) {
        startLane = parseInt(matchedLaneStr);
      }
    }

    const item = new Item(startLane, 1.0);
    item.y = ARROW_Y;
    if (stageData.startBallColor) {
      item.ballColorId = stageData.startBallColor;
    }
    item.setLines(lines);
    items.push(item);
  }

  // シミュレーションループ (最大10000ステップで無限ループ防止)
  let steps = 0;
  let timeSimulated = 0; // FASTEST_BALLの判定用仮想時間
  
  while (items.length > 0 && steps < 10000) {
    steps++;
    timeSimulated += 1.0; // 仮想ステップ時間

    const activeItems = [...items];
    for (let i = 0; i < activeItems.length; i++) {
      const item = activeItems[i];
      item.setLines(lines);
      item.update();


      // 線衝突時のフック
      if (item.lastHitLine) {
        const hl = item.lastHitLine;
        item.lastHitLine = null;
        handleLineHit(item, hl, items, lines);
      }

      if (item.isDestroyed) {
        const idx = items.indexOf(item);
        if (idx !== -1) items.splice(idx, 1);
        continue;
      }

      if (item.y > PLAY_H) {
        // ゴール到達
        const goalLabel = stageData.goals ? stageData.goals[item.currentLane] : null;
        reachedGoals.push({
          lane: item.currentLane,
          label: goalLabel,
          startLabel: item.startLabel || null,
          isSpike: item.isSpike,
          ballColorId: item.ballColorId || 'none',
          time: timeSimulated
        });

        const idx = items.indexOf(item);
        if (idx !== -1) items.splice(idx, 1);
      }
    }
  }

  return reachedGoals;
}

// 判定ロジック
function verifyStage(stageData) {
  const result = {
    id: stageData.id,
    name: stageData.name,
    type: stageData.type,
    success: false,
    correctAnswer: stageData.correctAnswer,
    errorMsg: '',
    simDetails: {}
  };

  try {
    if (stageData.type === 'WHICH_GOAL') {
      // 正解の選択肢でシミュレーションを実行
      const reached = runSimulation(stageData, null);
      if (reached.length === 0) {
        result.errorMsg = 'どのボールもゴールに到達しませんでした';
        return result;
      }
      const actualGoalLabel = reached[0].label;
      const expectedGoalLabel = stageData.correctAnswer;
      result.simDetails = { actualGoalLabel, expectedGoalLabel, lane: reached[0].lane };

      if (actualGoalLabel === expectedGoalLabel) {
        result.success = true;
      } else {
        result.errorMsg = `到達したゴール: ${actualGoalLabel || 'なし(レーン ' + reached[0].lane + ')'}, 期待された正解: ${expectedGoalLabel}`;
      }
    } else if (stageData.type === 'REMOVE_LINE') {
      // 各選択肢を取り除いた場合の検証
      const choices = ['A', 'B', 'C'];
      const details = {};
      let correctChoiceValid = false;

      for (const choice of choices) {
        const reached = runSimulation(stageData, choice);
        const hitTarget = reached.some(g => g.lane === stageData.targetGoalLane);
        details[choice] = { hitTarget, lane: reached.map(g => g.lane) };
        
        if (choice === stageData.correctAnswer) {
          if (hitTarget) {
            correctChoiceValid = true;
          } else {
            result.errorMsg = `正解の選択肢 ${choice} を除外しても◎（レーン ${stageData.targetGoalLane}）に入りませんでした（到達レーン: ${reached.map(g => g.lane).join(', ')}）`;
          }
        }
      }

      result.simDetails = details;
      if (correctChoiceValid) {
        result.success = true;
      }
    } else if (stageData.type === 'ADD_LINE') {
      // 各選択肢を追加した場合の検証
      const choices = ['A', 'B', 'C'];
      const details = {};
      let correctChoiceValid = false;

      for (const choice of choices) {
        const reached = runSimulation(stageData, choice);
        const hitTarget = reached.some(g => g.lane === stageData.targetGoalLane);
        details[choice] = { hitTarget, lane: reached.map(g => g.lane) };

        if (choice === stageData.correctAnswer) {
          if (hitTarget) {
            correctChoiceValid = true;
          } else {
            result.errorMsg = `正解の選択肢 ${choice} を追加しても◎（レーン ${stageData.targetGoalLane}）に入りませんでした（到達レーン: ${reached.map(g => g.lane).join(', ')}）`;
          }
        }
      }

      result.simDetails = details;
      if (correctChoiceValid) {
        result.success = true;
      }
    } else if (stageData.type === 'WHICH_ARROW') {
      // 正解の矢印から落としたときの検証
      const choices = ['A', 'B', 'C'];
      const details = {};
      let correctChoiceValid = false;

      for (const choice of choices) {
        const reached = runSimulation(stageData, choice);
        const hitTarget = reached.some(g => g.lane === stageData.targetGoalLane);
        details[choice] = { hitTarget, lane: reached.map(g => g.lane) };

        if (choice === stageData.correctAnswer) {
          if (hitTarget) {
            correctChoiceValid = true;
          } else {
            result.errorMsg = `正解の矢印 ${choice} から落としても◎（レーン ${stageData.targetGoalLane}）に入りませんでした（到達レーン: ${reached.map(g => g.lane).join(', ')}）`;
          }
        }
      }

      result.simDetails = details;
      if (correctChoiceValid) {
        result.success = true;
      }
    } else if (stageData.type === 'NOT_GOAL') {
      // 指定されたゴールにボールが入らないか検証
      const reached = runSimulation(stageData, null);
      const reachedLabels = reached.map(g => g.label).filter(Boolean);
      result.simDetails = { reachedLabels };

      if (!reachedLabels.includes(stageData.correctAnswer)) {
        result.success = true;
      } else {
        result.errorMsg = `正解（入らないはず）のゴール ${stageData.correctAnswer} にボールが入ってしまいました（到達したゴール: ${reachedLabels.join(', ')}）`;
      }
    } else if (stageData.type === 'FASTEST_BALL') {
      // 最速で targetGoalLane に到達するボールの検証
      const reached = runSimulation(stageData, null);
      const targetGoals = reached
        .filter(g => g.lane === stageData.targetGoalLane)
        .sort((a, b) => a.time - b.time);
      
      result.simDetails = { reached: reached.map(g => `${g.startLabel}(t=${g.time}, lane=${g.lane})`) };

      if (targetGoals.length > 0) {
        const fastestLabel = targetGoals[0].startLabel;
        if (fastestLabel === stageData.correctAnswer) {
          result.success = true;
        } else {
          result.errorMsg = `最速で◎に到達したのは ${fastestLabel} でしたが、正解は ${stageData.correctAnswer} と設定されています`;
        }
      } else {
        result.errorMsg = `どのボールも targetGoalLane（レーン ${stageData.targetGoalLane}）に到達しませんでした`;
      }
    } else if (stageData.type === 'SPIKE_BALL') {
      // トゲトゲに変身して targetGoalLane に到達するボールの検証
      const reached = runSimulation(stageData, null);
      const spikeGoal = reached.find(g => g.isSpike && g.lane === stageData.targetGoalLane);
      result.simDetails = { reached: reached.map(g => `${g.startLabel}(spike=${g.isSpike}, lane=${g.lane})`) };

      if (spikeGoal) {
        const actualLabel = spikeGoal.startLabel;
        if (actualLabel === stageData.correctAnswer) {
          result.success = true;
        } else {
          result.errorMsg = `トゲトゲで◎にゴールしたのは ${actualLabel} でしたが、正解は ${stageData.correctAnswer} と設定されています`;
        }
      } else {
        result.errorMsg = `トゲトゲに変身して targetGoalLane（レーン ${stageData.targetGoalLane}）に到達したボールはありませんでした`;
      }
    } else if (stageData.type === 'COLOR_MIX') {
      // カラーミックスの色の検証
      const reached = runSimulation(stageData, null);
      if (reached.length === 0) {
        result.errorMsg = 'どのボールもゴールに到達しませんでした';
        return result;
      }
      
      const finalColor = reached[0].ballColorId;
      const jpColor = stageData.choices[stageData.correctAnswer];
      const expectedColor = COLOR_MAP[jpColor] || jpColor;
      
      result.simDetails = { finalColor, expectedColor, jpColor };

      if (finalColor === expectedColor) {
        result.success = true;
      } else {
        result.errorMsg = `最終的な色: ${finalColor}, 期待された正解: ${expectedColor} (${jpColor})`;
      }
    } else if (stageData.type === 'COUNT_BALLS') {
      // ボール個数の検証
      const reached = runSimulation(stageData, null);
      const finalCount = reached.length;
      const expectedText = stageData.choices[stageData.correctAnswer];
      const expectedCount = parseInt(expectedText); // "2個" -> 2

      result.simDetails = { finalCount, expectedCount, expectedText };

      if (finalCount === expectedCount) {
        result.success = true;
      } else {
        result.errorMsg = `最終ゴール個数: ${finalCount}個, 期待された正解: ${expectedCount}個 (${expectedText})`;
      }
    } else {
      result.errorMsg = `未対応のクイズタイプ: ${stageData.type}`;
    }
  } catch (err) {
    result.errorMsg = `実行エラー: ${err.message}\n${err.stack}`;
  }

  return result;
}

// 全ステージの検証
console.log('--- クイズステージの整合性検証開始 ---');
let successCount = 0;
const failures = [];

for (const stage of QUIZ_STAGES) {
  const res = verifyStage(stage);
  if (res.success) {
    successCount++;
    console.log(`[OK] ステージ ${res.id.toString().padStart(2)}: ${res.name}`);
  } else {
    failures.push(res);
    console.log(`[NG] ステージ ${res.id.toString().padStart(2)}: ${res.name}`);
    console.log(`     理由: ${res.errorMsg}`);
    console.log(`     詳細:`, JSON.stringify(res.simDetails));
  }
}

console.log('\n--- 検証結果サマリー ---');
console.log(`合計: ${QUIZ_STAGES.length} ステージ`);
console.log(`成功: ${successCount} ステージ`);
console.log(`失敗: ${failures.length} ステージ`);

if (failures.length > 0) {
  console.log('\n--- 失敗したステージ一覧 ---');
  for (const f of failures) {
    console.log(`ステージ ${f.id}: ${f.name} (${f.type})`);
    console.log(`  正解: ${f.correctAnswer}`);
    console.log(`  理由: ${f.errorMsg}`);
  }
  process.exit(1);
} else {
  console.log('\nすべてのステージで答えの整合性が確認できました！');
  process.exit(0);
}

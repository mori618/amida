// scratch/test_real_classes.js
// 実際の game.js のクラスを使用したクイズステージ1の軌道シミュレーション

import { Item, HorizontalLine, PLAY_H } from '../src/game.js';

const stage1 = {
  startLane: 1,
  fixedLines: [
    { leftLaneIndex: 1, y: 200, kind: 'system' }
  ]
};

const lines = stage1.fixedLines.map((def, idx) => {
  const line = new HorizontalLine(def.leftLaneIndex, def.y);
  line.alpha = 1;
  line.setKind(def.kind || 'system');
  return line;
});

const item = new Item(stage1.startLane, 1.0);
item.y = 50; // QuizGame の runBall での設定と同様
item.setLines(lines);

console.log(`リアルクラスシミュレーション開始: startLane = ${item.currentLane}, x = ${item.x}, y = ${item.y}`);

let steps = 0;
while (item.y <= PLAY_H && steps < 1000) {
  // 毎フレーム lines の update と item.update を呼ぶ
  lines.forEach(l => l.update());
  item.update();
  steps++;
}

console.log(`リアルクラスシミュレーション終了: 最終到達レーン = ${item.currentLane}, x = ${item.x}, y = ${item.y}, ステップ数 = ${steps}`);

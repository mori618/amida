// scratch/test_stage1.js
// クイズステージ1の軌道シミュレーションテスト

const LANE_COUNT = 5;
const CANVAS_W = 360;
const LANE_W = CANVAS_W / LANE_COUNT;
const PLAY_H = 640 - 75; // 565
const ARROW_Y = 50;

function laneX(i) { return i * LANE_W + LANE_W / 2; }

class HorizontalLine {
  constructor(leftLaneIndex, y) {
    this.id = 0;
    this.leftLaneIndex = leftLaneIndex;
    this.y = y;
    this.kind = 'system';
  }
}

class Item {
  constructor(laneIndex, speed) {
    this.currentLane = laneIndex;
    this.x = laneX(laneIndex);
    this.y = ARROW_Y;
    this.speed = speed;
    this.state = 'falling';
    this.targetLane = null;
    this.targetX = null;
    this.crossedLineIds = new Set();
  }

  update(lines) {
    const effectiveSpeed = this.speed;

    if (this.state === 'falling') {
      const ny = this.y + effectiveSpeed;
      let hit = null;

      for (const l of lines) {
        if (this.crossedLineIds.has(l.id)) continue;
        const lpy = l.y; // 簡易化

        const rel = l.leftLaneIndex === this.currentLane || l.leftLaneIndex === this.currentLane - 1;
        if (rel) {
          if (this.y <= lpy && ny >= l.y) {
            hit = l;
            break;
          }
        }
      }

      if (hit) {
        this.crossedLineIds.add(hit.id);
        this.y = hit.y;
        this.state = 'crossing';
        this.targetLane = hit.leftLaneIndex === this.currentLane
          ? this.currentLane + 1 : this.currentLane - 1;
        this.targetX = laneX(this.targetLane);
        console.log(`[Hit] 横線(id:${hit.id}, y:${hit.y})に衝突！横移動開始: lane ${this.currentLane} -> ${this.targetLane}`);
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
        console.log(`[Falling] 横移動完了: lane ${this.currentLane} で落下再開, x:${this.x}, y:${this.y}`);
      }
    }
  }
}

// テスト実行
const stage1 = {
  startLane: 1,
  fixedLines: [
    { leftLaneIndex: 1, y: 200, kind: 'system' }
  ]
};

const lines = stage1.fixedLines.map((def, idx) => {
  const line = new HorizontalLine(def.leftLaneIndex, def.y);
  line.id = idx;
  return line;
});

const item = new Item(stage1.startLane, 1.0);

console.log(`シミュレーション開始: スタートレーン = ${item.currentLane}, x = ${item.x}, y = ${item.y}`);

let steps = 0;
while (item.y <= PLAY_H && steps < 1000) {
  item.update(lines);
  steps++;
}

console.log(`シミュレーション終了: 最終到達レーン = ${item.currentLane}, x = ${item.x}, y = ${item.y}, ステップ数 = ${steps}`);
